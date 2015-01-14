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

exports.playItem = function(player, item, cb) {  // {{{2
  var scored = {};
  var list = [];
  var counter = Ose.counter();

  player.data.dvbs && player.data.dvbs.forEach(function(dvb) {
    // Connect to all available streamers of `player`

    counter.inc();

    console.log('CLIENT BEFORE', dvb);

    new Client(player, dvb, item, onOpen);

    console.log('CLIENT AFTER');

  });

  counter.done(0, done);

  function onOpen(client) {  // {{{3

    console.log('CLIENT OPEN');

    counter.dec();

    if (client.score > 9) return;

    list.push(client);

    for (var i = 0; i <= pledge.score; i++) {
      if (scored[i]) return;
    }
    scored[pledge.score] = client;
  };

  function done() {  // {{{3
    // Invoked after all streamers respond
    // TODO: Shorten lags when some link hangs

    if (player.dvb) {
      if (player.dvb.link) {
        player.dvb.link.stop();
      }
      delete player.dvb;
    }

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

    // No streamer available
    if (! player.dvb) {
      cb(Ose.error(player, 'NO_FREE_STREAMER', 'There is no DVB streamer available!'));
      return;  // TODO retry or what?
    }

    // Stream
    player.dvb.link.stream();

    // Playback
    player.postTo(
      player.playback,
      'playUri',
      player.dvb.address
    );

    cb();
    return;
  };

  // }}}3






/*
  var best;
  var can;
  var counter;
  var ch = {
    space: item.data.space,
    shard: item.data.shard,
    entry: item.data.id,
  };

  if (player.dvb && player.dvb.link) {
    player.dvb.link.canSwitch(
      {
        channel: ch,
        mcast: player.dvb.mcast,
        ucast: player.dvb.ucast,
      },
      canSwitch
    );
  } else {
    each();
  }

  function canSwitch(resp) {  // {{{3
    if (resp.best) {
      best = resp.best;
      finish();
    } else {
      each()
    }
  }

  function each() {  // {{{
    counter = Ose.counter();

    player.dvbs.forEach(function(dvb) {
      if (dvb === player.dvb) return;
      if (! dvb.link) return;
    });

    counter.finish(finish);
  }

  function canStream(dvb) {  // {{{3
    if (! dvb.link) return;

    counter.inc();

    dvb.link.canStream(item.data, canStream(err, resp) {
      if (best || ! resp.can) return;

      if (resp.now) {
        best = resp;
        counter.dec();
        return;
      }
    };
  });

  function finish() {  // {{{3
    if (best) {
      player.post('playUri', best);
      return;
    }

    console.log('CAN\'T PLAY DVB');
  });

  // }}}3

*/
};

// }}}1
