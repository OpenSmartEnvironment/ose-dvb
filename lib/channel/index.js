'use strict';

var Ose = require('ose');
var M = Ose.singleton(module, 'ose/lib/kind');
exports = M.append('browser').exports;

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

exports.playItem = function(player, item) {  // {{{2
  player.post('playDvb', item.data.media);
};

// }}}1
