'use strict';

var O = require('ose').module(module);
O.package = 'ose-dvb';
O.scope = 'media';

/** Docs {{{1
 * @caption DVB
 *
 * @readme

 * This package contains the general definition of DVB-related logic.
 * It is able to parse `channels.conf` files (output of
 * [`w_scan`](http://www.linuxtv.org/wiki/index.php/W_scan)) and
 * register them as sources used by the [Media player].
 *
 * See [DVB streamer example]
 *
 * @planned
 * - automatic scanning for channels
 *
 * @scope media
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
 * Create multiplex (mplex) and channel entries by parsing output from
 * `w_scan`. For each channel, assign a multicast group ip address
 * from `pool`.
 *
 * @param shard {Object} Shard of "media" scope for channel entries
 * @param lines {String} Output from `w_scan`
 * @param [pool] {Object} IP multicast pool identification
 * @param cb {Function} Callback to be called when finished parsing
 *
 * @method parseChannels
 * @async
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
