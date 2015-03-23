'use strict';

var O = require('ose').object(module, 'ose/lib/kind');
exports = O.append('browser').exports;

var Player = require('ose-media/lib/player');
var Pledge = O.class('./pledge');

//var Ucast = require('./ucast');

/** Docs {{{1
 * @module dvb
 */

/**
 * @caption DVB channel kind
 *
 * @readme
 * [Entry kind] describing DVB channels.
 *
 * @class dvb.lib.channel
 * @extend ose.lib.kind
 * @type singleton
 */

// Public {{{1
exports.getCaption = function(entry) {  // {{{2
  return entry.data && entry.data.title;
};

exports.getMediaKeys = function(entry) {  // {{{2
  return {
    title: entry.data.title,
  };
};

exports.inView = function(entry, params) {  // {{{2
  if (! params.filter) return true;

  if (params.filter.mplex) {
    return params.filter.mplex === entry.data.mplex;
  }

  return true;
};

exports.playItem = function(player, item, cb) {  // {{{2
  var best;
  var list = [];
  var counter = O.counter();

  // Connect to all available streamers of `player`
  for (var i = 0; i < player.dvb.length; i++) {
    var l = player.dvb[i];              // Link to DVB streamer entry
    var e = l._link && l._link.entry;   // DVB streamer entry
    if (! e || ! e.isHome()) continue;  // Streamer is not connected

    counter.inc();
    new Pledge(player, e, item, onOpen);
  }

  counter.done(function() {  // {{{3
    // Invoked after all streamers respond
    // TODO: Shorten lags when some link hangs

    // Find best scored streamer
    for (var i = 0; i < list.length; i++) {
      var l = list[i];

      if (! O.link.canSend(l)) {
        list[i] = null;
        continue;
      }

      if (! best || l.score > best.score) {
        best = l;
        if (best.score === 0) break;
        continue;
      }
    }

    // Close unused streamers socket
    for (var i = 0; i < list.length; i++) {
      var l = list[i];
      if (l && l !== best) O.link.close(l, null, true);
    };

    if (best) {
      // Stream
      O.link.send(best, 'stream', {ip: player.playback.data.ucast}, onStream);
      return;
    }

    // No streamer available
    cb(O.error(player, 'There is no DVB streamer available!'));  // TODO retry or what?
    return;
  });
  return;

  function onOpen(client) {  // {{{3
    counter.dec();

    if (client.score > 9) return;

    list.push(client);
  };

  function onStream(err, resp) {  // {{{3
    if (err) {
      cb(err);
      return;
    }

    Player.setPledge(best);

    // Playback
    player.playback.post(
      'playUri',
      'rtp://' + resp,
      cb
    );
    return;
  };

  // }}}3
};

// }}}1
