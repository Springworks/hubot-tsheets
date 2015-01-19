'use strict';

var should = require('chai').should();

var task = require('../../lib/tasks/report-time.js'),
    test_util = require('../../test-util/common-test-util.js'),
    patterns = require('../../lib/patterns.js');

var internals = {
  TEST_TIMEOUT: 10 * 1000,
  REPORT_PATTERN: patterns.REPORT_TIME,
  VALID_REPORT_STRING: 'tsheets report cruising 0.01',
  TEST_API_TOKEN: process.env.HUBOT_TSHEETS_API_CLIENT_TOKEN || 'abc123',
  TEST_HUBOT_INPUT_USERNAME: 'david-hasselhoff',
  TEST_HUBOT_INPUT_JOBCODE: 'cruising',
  TEST_TSHEETS_USER_ID: process.env.TEST_HUBOT_TSHEETS_USER_ID || 1855621,
  TEST_TSHEETS_JOBCODE_ID: process.env.TEST_HUBOT_TSHEETS_JOBCODE_ID || 9812392
};

describe(__filename, function() {
  var robot_brain;

  this.timeout(internals.TEST_TIMEOUT);

  before(function() {
    robot_brain = test_util.mockRobotBrain();
  });

  before(function() {
    internals.mockApiToken();

    test_util.mockTsheetsUserId(robot_brain,
        internals.TEST_HUBOT_INPUT_USERNAME,
        internals.TEST_TSHEETS_USER_ID);

    test_util.mockTsheetsJobcodeId(internals.TEST_HUBOT_INPUT_JOBCODE,
        internals.TEST_TSHEETS_JOBCODE_ID);
  });

  describe('execute', function() {

    describe('with valid params', function() {
      var msg,
          username = internals.TEST_HUBOT_INPUT_USERNAME;

      beforeEach(function() {
        msg = test_util.mockInputMessage(internals.REPORT_PATTERN,
            internals.VALID_REPORT_STRING,
            username);
      });

      it('should update time report for the specified user', function(done) {
        task.execute(msg, robot_brain, function(err, response_message) {
          should.not.exist(err);
          response_message.should.eql('Time card updated. :pencil:');
          done(err);
        });
      });

    });

  });

  describe('internals.convertMsgToParams', function() {

    describe('with message "' + internals.VALID_REPORT_STRING + '"', function() {
      var msg,
          username = internals.TEST_HUBOT_INPUT_USERNAME;

      beforeEach(function() {
        msg = test_util.mockInputMessage(internals.REPORT_PATTERN,
            internals.VALID_REPORT_STRING,
            username);
      });

      it('should convert to proper params', function() {
        var params = task.internals.convertMsgToParams(msg);
        params.should.have.property('username', username.toLowerCase());
        params.should.have.property('jobcode', internals.TEST_HUBOT_INPUT_JOBCODE);
        params.should.have.property('hours', '0.01');
        params.should.have.property('date');
      });

    });

  });

  describe('internals.convertHoursToSeconds', function() {

    describe('with 2.5 hours', function() {

      it('should convert to 9000 seconds', function() {
        task.internals.convertHoursToSeconds('2.5').should.eql(9000);
      });

    });

    describe('with 2,5 hours', function() {

      it('should convert to 9000 seconds', function() {
        task.internals.convertHoursToSeconds('2,5').should.eql(9000);
      });

    });

  });

  describe('internals.createParamsForTimeReport', function() {

    describe('with valid params', function() {
      var jobcode = internals.TEST_HUBOT_INPUT_JOBCODE,
          date = '2015-01-18',
          hours = '1.0',
          user_id = parseInt(internals.TEST_TSHEETS_USER_ID, 10),
          jobcode_id = parseInt(internals.TEST_TSHEETS_JOBCODE_ID, 10);

      it('should return an object with all required params', function() {
        var params = task.internals.createParamsForTimeReport({
              username: internals.TEST_HUBOT_INPUT_USERNAME,
              jobcode: jobcode,
              date: date,
              hours: hours
            },
            robot_brain);

        params.should.eql({
          api_token: internals.TEST_API_TOKEN,
          user_id: user_id,
          jobcode_id: jobcode_id,
          date: date,
          duration_seconds: 3600
        });
      });

    });

    describe('with invalid hours', function() {

      it('should throw error');

    });

    describe('with missing user', function() {

      it('should throw error');

    });

    describe('with invalid jobcode', function() {

      it('should throw error');

    });

  });

});


internals.mockApiToken = function() {
  task.internals.TSHEETS_API_TOKEN = internals.TEST_API_TOKEN;
};
