'use strict';

var Ose = require('ose');
var M = Ose.package(module);
exports = M.init();

/** Docs {{{1
 * @caption Open Smart Environment DVB package
 *
 * @readme
 * This package contains the general definition of DVB-related logic.
 * Currently it contains only the channel [entry kind] and registers
 * DVB as a source to the [OSE Media player].
 *
 * DVB channels are configured in .js files.
 *
 * Example:
 *
 * TODO
 *
 * @planned
 * - automatic scanning for channels
 *
 * @module dvb
 * @main dvb
 */

/**
 * @caption OSE DVB core
 *
 * @readme
 * Core singleton of ose-dvb npm package. Registers [entry kinds]
 * defined by this package to the `"media"` [scope].
 *
 * @class dvb.lib
 * @type singleton
 */

// Public {{{1
exports.browserConfig = true;

M.content();

M.scope = 'media';
M.kind('./channel', 'dvb');

var Sources = require('ose-media/lib/sources');
Sources.add('dvb', 'media', 'dvb');
