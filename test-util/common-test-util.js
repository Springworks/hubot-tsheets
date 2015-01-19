'use strict';

var users = require('../lib/users.js'),
    jobcodes = require('../lib/jobcodes.js');


exports.mockTsheetsUserId = function(robot_brain, username, user_id) {
  users.rememberUser(robot_brain, username, user_id);
};


exports.mockTsheetsJobcodeId = function(jobcode, jobcode_id) {
  jobcodes.internals.tsheetsJobcodeIdsByShortName[jobcode] = parseInt(jobcode_id, 10);
};


exports.mockRobotBrain = function() {
  return {};
};


exports.mockInputMessage = function(pattern, test_string, username) {
  var msg = {};
  msg.match = test_string.match(pattern);
  msg.message = {
    user: { name: username }
  };
  return msg;
};
