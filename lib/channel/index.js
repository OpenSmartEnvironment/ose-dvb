'use strict';

var O = require('ose').object(module, 'ose/lib/kind');
exports = O.append('browser').exports;

var Player = require('ose-media/lib/player');
var Pledge = O.class('./pledge');

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
  var scored = {};
  var list = [];
  var counter = O.counter();

  // Connect to all available streamers of `player`
  player.data.dvbs && player.data.dvbs.forEach(function(dvb) {
    counter.inc();

    new Pledge(player, dvb, item, onOpen);
  });

  counter.done(0, done);

  function onOpen(client) {  // {{{3
    counter.dec();

    if (client.score > 9) return;

    list.push(client);

    for (var i = 0; i <= client.score; i++) {
      if (scored[i]) return;
    }
    scored[client.score] = client;
  };

  function done() {  // {{{3
    // Invoked after all streamers respond
    // TODO: Shorten lags when some link hangs

    // TODO close streaming pledge when playing new media item
    // When to close the pledge?
    // - after new pledge is streaming


    // Find best scored streamer
    for (var i = 0; i < 10; i++) {
      best = scored[i];
      if (best) {
        if (best.link) break;  // Connected best one found
        best = undefined;
      }
    }

    // Close unused streamers socket
    list.forEach(function(client) {
      if (client !== best) O.link.close(client);
    });

    if (! best) {
      // No streamer available
      cb(O.error(player, 'NO_FREE_STREAMER', 'There is no DVB streamer available!'));  // TODO retry or what?
      return;
    }

    // Stream
    best.link.stream({url: player.data.inUrl}, onStream);
    return;
  }

  function onStream(err, resp) {  // {{{3
    if (err) {
      cb(err);
      return;
    }

    Player.setPledge(best);

    // Playback
    player.playback.post(
      'playUri',
      'rtp://' + resp, //player.data.inUrl
      cb
    );
    return;
  };

  // }}}3
};

// }}}1
