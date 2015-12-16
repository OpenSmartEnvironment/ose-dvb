'use strict';

var O = require('ose').object(module, 'ose/lib/kind');
exports = O.init('media', 'dvbChannel');

var Boon = O.class('./boon');
var Player = require('ose-media/lib/player');

/** Docs {{{1
 * @module dvb
 */

/**
 * @caption DVB channel kind
 *
 * @readme
 * [Entry kind] describing DVB channels.
 *
 * @kind dvbChannel
 * @class dvb.lib.channel
 * @extend ose.lib.kind
 * @type singleton
 */

// Public {{{1
exports.getCaption = function(entry) {  // {{{2
  return entry.dval && entry.dval.title;
};

exports.getMediaKeys = function(entry) {  // {{{2
  return {
    title: entry.dval.title,
  };
};

exports.matchQuery = function(entry, params) {  // {{{2
  if (! params.filter) return true;

  if (params.filter.mplex) {
    return params.filter.mplex === entry.dval.mplex;
  }

  return true;
};

exports.playItem = function(player, item, cb) {  // {{{2
  if (! player.dvb) {
    cb(O.error(player, 'There is no DVB streamer available!'));
    return;
  }

  var best;  // Best scored boon
  var list = [];  // List of all boons
  var counter = O.counter();

  var req = {  // Request for boon
    channel: item.dval.ident,
    mplex: item.dval.media.mplex,
    mcast: player.mcast && player.mcast.identify(),
    ucast: player.playback.dval.ucast,
    playback: player.playback.identify(),
  };

  // Connect to all available streamers of `player`
  for (var i = 0; i < player.dvb.length; i++) {
    var l = player.dvb[i];              // Link to DVB streamer entry
    var e = l._link && l._link.entry;   // DVB streamer entry
    if (! e || ! e.canReachHome()) continue;  // Streamer is not connected

    counter.inc();
    new Boon(player, e, req, onOpen);
  }

  counter.done(function() {  // {{{3
    // Invoked after all streamers responded

    // Find best scored streamer
    list.sort(function(a, b) {
      if (! a && ! b) return 0;
      if (! a) return -1;
      if (! b) return 1;

      if (a.ucast && ! b.ucast) return -1;
      if (b.ucast && ! a.ucast) return 1;

      return a.count - b.count;
    });

    for (var i = 0; i < list.length; i++) {
      var l = list[i];

      if (! O.link.canSend(l)) {
        list[i] = null;
        continue;
      }

      best = l;
      break;
    }

    // Close unused streamers socket
    for (var i = 0; i < list.length; i++) {
      var l = list[i];
      if (l && l !== best) O.link.close(l, null, true);
    };

    if (best) {
      // Stream
      O.link.send(best, 'stream', null, onStream);
      return;
    }

    // No streamer available
    cb(O.error(player, 'There is no DVB streamer available!'));  // TODO retry or what?
    return;
  });
  return;

  function onOpen(client) {  // {{{3
    counter.dec();

    list.push(client);
  };

  function onStream(err, resp) {  // {{{3
    if (err) {
      cb(err);
      return;
    }

    Player.setBoon(best);

    // Playback
    player.playback.post(
      'playUri',
      'rtp://' + resp.ip + ':' + resp.port,
      cb
    );
    return;
  };

  // }}}3
};

exports.printMediaHistory = function(li, entry) {  // {{{2
  li.append('div').add([
    '<h3>DVB:</h3>',
    li.new('p').text(this.getCaption({dval: entry.dval.media})),
  ]);

  return li;
};

// }}}1
