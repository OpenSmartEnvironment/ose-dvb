'use strict';

var Ose = require('ose');
var M = Ose.class(module, C);

var Player = require('ose-media/lib/player');

// Public {{{1
function C(player, dvb, item, cb) {  // {{{2
/**
 * Socket constructor
 *
 * @method constructor
 */

  this.player = player;
  this.dvb = dvb;
  this.item = item;
  this.cb = cb;
  this.score = 10;

  Ose.link.prepare(this);

  player.postTo(
    dvb,
    'pledge',
    {
      target: player.identify(),
      channel: {
        space: item.data.space,
        shard: item.data.shard,
        entry: item.data.id,
      },
//      ucast: player.data.inUrl,
//      mcast: player.data.mcast,
    },
    this
  );
};

exports.open = function(req) {  // {{{2
  if (! this.cb) return;

  this.address = req.address;
  this.score = req.score;
  this.cb(this, req);
  delete this.cb;

  return;
};

exports.close = function(req) {  // {{{2
  this.score = 10;

  if (this.cb) {
    this.cb(this);
    delete this.cb;
  }

  Player.closePledge(this);
};

exports.error = function(err) {  // {{{2
  if (err.code !== 'DISCONNECTED') {
    M.log.error(err);
  }

  this.close();
};

// }}}1
