'use strict';

var Ose = require('ose');
var M = Ose.package(module);
exports = M.init();

/** Docs {{{1
 * @caption DVB
 *
 * @readme
 * This package contains the general definition of DVB-related logic.
 * Currently it contains only the ch [entry kind] and registers
 * DVB as a source to the [Media player].
 *
 * DVB channels are configured in .js files.
 *
 * Example:
 *
 * TODO
 *
 * @planned
 * - automatic scanning for channels
 *
 * @module dvb
 * @main dvb
 */

/**
 * @caption DVB core
 *
 * @readme
 * Core singleton of [ose-dvb] npm package. Registers [entry kinds]
 * defined by this package to the `"media"` [scope].
 *
 * @class dvb.lib
 * @type singleton
 */

// Public {{{1
exports.browserConfig = true;

M.content();

M.scope = 'media';
M.kind('./mplex', 'dvbMplex');
M.kind('./channel', 'dvbChannel');

exports.config = function() {  // {{{2
  if (Ose.media && Ose.media.sources) {
    Ose.media.sources.add('dvb', 'media', 'dvbChannel');
  }
};

exports.parseChannels = function(shard, lines, cb) {  // {{{2
  var i = 0;  // Current line index
  var ch;  // Channel line splitted by ":"
  var mplex;  // Multiplex entry

  lines = lines.split('\n');
  parse();

  function parse() {  // {{{3
    if (i >= lines.length) {
      cb();
      return;
    }

    ch = lines[i].split(':');
    i++;

    switch (ch.length) {
    case 1:
      parse();
      return;
    case 13:
      shard.get('mplex_' + ch[1], onMplex);
      return;
    }

    M.log.notice('Invalid channels line', ch);

    parse();
    return;
  }

  function onMplex(err, entry) {  // {{{3
    if (err) {
      if (err.code !== 'ENTRY_NOT_FOUND') {
        cb(err);
        return;
      }

      var data = {
        freq: parseInt(ch[1]),
        modulation: ch[6].toLowerCase(),
      };
      var m = ch[3].match(/BANDWIDTH_(\d+)_MHZ/);
      if (m) {
        data.bandwidth = m[1];
      }
     
      console.log('ADDING MULTIPLEX', data);

      mplex = shard.entry('mplex_' + ch[1], 'dvbMplex', data);
    } else {
      mplex = entry;
    }

    shard.get(mplex.id + '_' + ch[12], onChannel);
    return;
  }

  function onChannel(err, entry) {  // {{{3
    if (entry) {
      parse();
      return;
    }

    if (err.code !== 'ENTRY_NOT_FOUND') {
      cb(err);
      return;
    }

    console.log('ADDING CHANNEL', mplex.id + '_' + ch[12]);

    shard.entry(mplex.id + '_' + ch[12], 'dvbChannel', {
      title: ch[0],
      number: ch[12],
      mplex: mplex.id,
    });

    parse();
    return;
  }

  // }}}3
};

exports.readPledge = function(entry, req, socket, cb) {  // {{{2
  var target, mcast, mplex, channel;

  entry.find(req.target, function(err, resp) {  // {{{3
    if (err) {
      Ose.link.error(socket, err);
      return;
    }

    target = resp;

    if (target.data.mcast) {
      target.find(target.data.mcast, onMcast);
      return;
    }

    onMcast();
    return;
  });

  function onMcast(err, resp) {  // {{{3
    if (err) {
      // Do not close the socket, it's possible to fallback to ucast
      M.log.error(err);
    }

    mcast = resp;
    target.find(req.channel, onChannel);
  }

  function onChannel(err, resp) {  // {{{3
    if (err) {
      Ose.link.error(socket, err);
      return;
    }

    channel = resp;
    channel.find(channel.data.mplex, onMplex);
    return;
  }

  function onMplex(err, resp) {  // {{{3
    if (err) {
      Ose.link.error(socket, err);
      return;
    }

    mplex = resp;
    cb(target, mcast, mplex, channel);
    return;
  }

  // }}}3
};

// }}}1
