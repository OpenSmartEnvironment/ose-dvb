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

    if (! player.dvb) {
      // No streamer available
      cb(Ose.error(player, 'NO_FREE_STREAMER', 'There is no DVB streamer available!'));  // TODO retry or what?
    } else {
      // Stream
      player.dvb.link.stream({url: player.data.inUrl}, onStream);
    }
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
      'rtp://' + player.data.inUrl
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
