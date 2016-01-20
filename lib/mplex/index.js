'use strict';

const O = require('ose')(module)
  .singleton('ose/lib/kind')
;

exports = O.init('media', 'dvbMplex');

/** Docs
 * @module dvb
 */

/**
 * @caption DVB multiplex kind
 *
 * @readme
 * [Entry kind] describing DVB multiplex.
 *
 * @kind dvbMplex
 * @class dvb.lib.mplex
 * @extend ose.lib.kind
 * @type singleton
 */
