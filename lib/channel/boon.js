'use strict';

const O = require('ose')(module)
  .class(init)
;

var Player = require('ose-media/lib/player');

/** Doc {{{1
 * @module dvb
 */

/**
 * @caption DVB streaming boon client socket
 *
 * @readme
 * [Client socket] responsible for for maintaining media stream
 *
 * @class dvb.lib.channel.boon
 * @type class
 */


// Public {{{1
function init(player, dvb, req, cb) {  // {{{2
/**
 * Socket constructor
 *
 * @method constructor
 */

  var that = this;

  this.player = player;
  this.cb = cb;

  dvb.post('boon', req, this);

  setTimeout(function() {
    if (that.cb) {
      that.cb(that);
      delete that.cb;
    }
  }, 2000);
};

exports.open = function(req) {  // {{{2
/**
 * Boon socket open handler
 *
 * @param req {Object} Request for boon
 * @param req.count {Number} Number of current boons for given channel
 * @param [req.ucast] {String} Unicast destination address
 *
 * @method open
 * @handler
 */

  if (! this.cb) {
    O.link.close(this);
    return;
  }

  this.count = req.count;
  this.ucast = req.ucast;

  this.cb(this);
  delete this.cb;

  return;
};

exports.close = function(req) {  // {{{2
  if (this.cb) {
    this.cb(this);
    delete this.cb;
  }

  Player.closeBoon(this);
};

exports.split = function(err) {  // {{{2
  this.close();
};

exports.error = function(err) {  // {{{2
  O.log.error(err);

  this.close();
};

// }}}1
