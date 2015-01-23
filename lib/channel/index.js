'use strict';

var Ose = require('ose');
var M = Ose.singleton(module, 'ose/lib/kind');
exports = M.append('browser').exports;

var Client = M.class('./client');

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
  var scored = {};
  var list = [];
  var counter = Ose.counter();

  // Connect to all available streamers of `player`
  player.data.dvbs && player.data.dvbs.forEach(function(dvb) {
    counter.inc();

    new Client(player, dvb, item, onOpen);
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

    /*
    if (player.dvb) {
      if (player.dvb.link) {
        player.dvb.link.stop();
      }
      delete player.dvb;
    }
    */

    // TODO close streaming pledge when playing new media item
    // When to close the pledge?
    // - after new pledge is streaming


    // Find best scored streamer
    for (var i = 0; i < 10; i++) {
      player.dvb = scored[i];
      if (player.dvb) {
        if (player.dvb.link) break;  // Connected best one found
        delete player.dvb;
      }
    }

    // Close unused streamers socket
    list.forEach(function(client) {
      if (client !== player.dvb) Ose.link.close(client);
    });

    if (! player.dvb) {
      // No streamer available
      cb(Ose.error(player, 'NO_FREE_STREAMER', 'There is no DVB streamer available!'));  // TODO retry or what?
      return;
    }

    // Stream
    player.dvb.link.stream({url: player.data.inUrl}, onStream);
    return;
  }

  function onStream(err, resp) {  // {{{3
    if (err) {
      cb(err);
      return;
    }

    console.log('DVB CHANNEL PLAY ITEM ON STREAM', resp);

    // Playback
    player.postTo(
      player.playback,
      'playUri',
      'rtp://' + resp //player.data.inUrl
    );

    cb();
    return;
  };

  // }}}3
};

// }}}1
