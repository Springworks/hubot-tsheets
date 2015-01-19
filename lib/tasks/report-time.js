'use strict';

var tsheets = require('tsheets-client'),
    moment = require('moment');

var users = require('../users.js'),
    jobcodes = require('../jobcodes.js');

var internals = {
  DATE_FORMAT: 'YYYY-MM-DD',
  TSHEETS_API_TOKEN: process.env.HUBOT_TSHEETS_API_CLIENT_TOKEN
};


/**
 * Executes the report time task.
 * @param {Object} msg Parsed input message.
 * @param {Function} callback Invoked with [err, api_result]
 */
exports.execute = function(msg, callback) {
  var msg_params,
      report_params;

  try {
    msg_params = internals.convertMsgToParams(msg);
    report_params = internals.createParamsForTimeReport(msg_params);
  }
  catch (e) {
    setImmediate(callback, e);
    return;
  }

  internals.reportTimeToAPI(report_params, function(err, result) {
    var message;
    if (err) {
      callback(err, null);
      return;
    }
    message = 'Time card updated. :pencil:';
    callback(null, message);
  });
};


internals.convertMsgToParams = function(msg) {
  var username = msg.message.user.name.toLowerCase(),
      input = msg.match[1],
      input_params,
      jobcode,
      hours,
      date;

  if (!input || !input.length) {
    throw new Error('Invalid input params');
  }

  input_params = input.split(' ');
  jobcode = input_params[0];
  hours = input_params[1];
  date = input_params[2];

  if (!date) {
    date = new Date();
  }

  return {
    username: username,
    jobcode: jobcode,
    date: date,
    hours: hours
  };
};


internals.createParamsForTimeReport = function(params) {
  var user_id = users.getTsheetsUserId(params.username),
      jobcode_id = jobcodes.getJobCodeIdFromShortName(params.jobcode),
      date_str = internals.convertDateToString(params.date),
      seconds = internals.convertHoursToSeconds(params.hours);
  return {
    api_token: internals.TSHEETS_API_TOKEN,
    user_id: user_id,
    jobcode_id: jobcode_id,
    date: date_str,
    duration_seconds: seconds
  };
};



internals.reportTimeToAPI = function(params, callback) {
  tsheets.reportTime(params, function(err, result) {
    callback(err, result);
  });
};


internals.convertDateToString = function(date) {
  return moment(date).format(internals.DATE_FORMAT);
};


internals.convertHoursToSeconds = function(hours_str) {
  var comma_converted = hours_str.replace(',', '.');
  return parseFloat(comma_converted) * 60 * 60;
};


/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') {
  /** @type Object */
  exports.internals = internals;
}
