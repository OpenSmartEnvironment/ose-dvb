'use strict';

var O = require('ose').object(module, Init, 'ose/lib/http/content');
exports = O.init();

/** Docs  {{{1
 * @module dvb
 */

/**
 * @caption DVB content
 *
 * @readme
 * Provides files of [ose-dvb] package to the browser.
 *
 * @class dvb.content
 * @type singleton
 * @extends ose.lib.http.content
 */

// Public {{{1
function Init() {
  O.super.call(this);

  this.addModule('lib/channel/gaia/list');
  this.addModule('lib/channel/index');
  this.addModule('lib/channel/boon');
  this.addModule('lib/index');
  this.addModule('lib/mplex/index');
};
