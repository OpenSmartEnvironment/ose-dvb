'use strict';

var Ose = require('ose');
var M = Ose.class(module, C);

// Public {{{1
function C(player, dvb, item, cb) {  // {{{2
/**
 * Socket constructor
 *
 * @method init
 * @constructor
 */

  this.player = player;
  this.dvb = dvb;
  this.item = item;
  this.cb = cb;
  this.score = 10;

  Ose.link.prepare(this);

  console.log('CLIENT POST TO');

  player.postTo(
    dvb,
    'pledge',
    {
      item: {
        space: item.data.space,
        shard: item.data.shard,
        entry: item.data.id,
      },
      ucast: player.data.inUrl,
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
  if (! this.cb) return;

  this.cb(this);
  delete this.cb;
  delete this.player;
  delete this.dvb;
  delete this.item;

  return;
};

exports.error = function(err) {  // {{{2
  M.log.error(err);

  this.close();
};

// }}}1
