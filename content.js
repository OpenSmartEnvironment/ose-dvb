'use strict';

exports = require('ose')
  .singleton(module, 'ose/lib/http/content')
  .exports
;

/** Docs  {{{1
 * @module dvb
 */

/**
 * @caption OSE DVB content
 *
 * @readme
 * Provides files of OSE DVB package to the browser.
 *
 * @class dvb.content
 * @type singleton
 * @extends ose.lib.http.content
 */

// Public {{{1
exports.addFiles = function() {
  this.addModule('lib/channel/browser');
  this.addModule('lib/channel/index');
  this.addModule('lib/index');
};
