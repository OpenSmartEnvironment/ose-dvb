'use strict';

const O = require('ose')(module)
  .singleton('ose/lib/http/content')
;

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

exports.addModule('lib/channel/index');
exports.addModule('lib/channel/boon');
exports.addModule('lib/index');
exports.addModule('lib/mplex/index');

