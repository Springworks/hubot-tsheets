'use strict';

var users = require('../lib/users.js'),
    jobcodes = require('../lib/jobcodes.js');


exports.mockTsheetsUserId = function(username, user_id) {
  users.internals.tsheetsUserIdsByUsername[username] = parseInt(user_id, 10);
};


exports.mockTsheetsJobcodeId = function(jobcode, jobcode_id) {
  jobcodes.internals.tsheetsJobcodeIdsByShortName[jobcode] = parseInt(jobcode_id, 10);
};
