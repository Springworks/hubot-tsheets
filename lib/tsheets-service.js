'use strict';

var report_time_task = require('./tasks/report-time.js'),
    jobcodes = require('./jobcodes.js');

var internals = {};


/**
 * Reports time for the current Hubot user.
 *
 * @param {Object} msg Parsed input message.
 * @param {Function} callback Invoked with [err, api_result]
 */
exports.reportTime = function(msg, callback) {
  report_time_task.execute(msg, callback);
};


/**
 *
 * @param {Object} msg Message.
 * @param {Function} callback Invoked with [err, jobcodes];
 */
exports.getAllJobcodes = function(msg, callback) {
  callback(null, jobcodes.getAllJobcodes());
};


/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') {
  /** @type Object */
  exports.internals = internals;
}
