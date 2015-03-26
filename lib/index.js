'use strict';

var O = require('ose').module(module);
O.package = 'ose-dvb';
O.scope = 'media';

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

exports.config = function(name, data, deps) {  // {{{2
  O.kind('./mplex', 'dvbMplex', deps);
  O.kind('./channel', 'dvbChannel', deps);

  O.content('../content');
};

exports.parseChannels = function(shard, lines, pool, cb) {  // {{{2
/**
 * TODO
 *
 * @param shard {Object}
 * @param lines {String}
 * @param [pool] {Object} IP multicast pool identification
 * @param cb {Function}
 */

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

    O.log.notice('Invalid channels line', ch);

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
     
//      console.log('ADDING MULTIPLEX', data);

      mplex = shard.entry('mplex_' + ch[1], 'dvbMplex', data);
    } else {
      mplex = entry;
    }

    shard.get(mplex.id + '_' + ch[12], onChannel);
    return;
  }

  function onChannel(err, entry) {  // {{{3
    if (! err) {
      parse();
      return;
    }

    if (err.code !== 'ENTRY_NOT_FOUND') {
      cb(err);
      return;
    }

    if (pool) {
      pool.post('getIp', null, onIp);
      return;
    }

    onIp();
    return;

    function onIp(err, ip) {
//      console.log('ADDING CHANNEL', mplex.id + '_' + ch[12]);

      shard.entry(mplex.id + '_' + ch[12], 'dvbChannel', {
        title: ch[0],
        number: ch[12],
        mplex: mplex.id,
        ip: ip,
      });

      parse();
      return;
    }
  }

  // }}}3
};

// }}}1
