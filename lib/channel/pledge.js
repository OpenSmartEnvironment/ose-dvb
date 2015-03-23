'use strict';

var O = require('ose').class(module, C);

var Player = require('ose-media/lib/player');

// Public {{{1
function C(player, dvb, item, cb) {  // {{{2
/**
 * Socket constructor
 *
 * @method constructor
 */

  var that = this;

  this.player = player;
  this.cb = cb;
  this.score = 10;

  dvb.post(
    'pledge',
    {
      target: player.identify(),
      channel: item.data.ident,
    },
    this
  );

  setTimeout(function() {
    if (that.cb) {
      that.cb(that);
      delete that.cb;
    }
  }, 2000);
};

exports.open = function(req) {  // {{{2
  if (! this.cb) {
    O.link.close(this);
    return;
  }

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

exports.split = function(err) {  // {{{2
  this.close();
};

exports.error = function(err) {  // {{{2
  O.log.error(err);

  this.close();
};

// }}}1
