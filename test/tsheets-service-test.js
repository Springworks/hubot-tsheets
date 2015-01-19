'use strict';

var should = require('chai').should();

var service = require('../lib/tsheets-service.js'),
    test_util = require('../test-util/common-test-util.js');

var internals = {
  TEST_TIMEOUT: 10 * 1000,
  REPORT_PATTERN: /tsheets report (.*)/i,
  VALID_REPORT_STRING: 'tsheets report cruising 0.01',
  TEST_API_TOKEN: process.env.HUBOT_TSHEETS_API_CLIENT_TOKEN || 'abc123',
  TEST_HUBOT_INPUT_USERNAME: 'david-hasselhoff',
  TEST_HUBOT_INPUT_JOBCODE: 'cruising',
  TEST_TSHEETS_USER_ID: process.env.TEST_HUBOT_TSHEETS_USER_ID || 1855621,
  TEST_TSHEETS_JOBCODE_ID: process.env.TEST_HUBOT_TSHEETS_JOBCODE_ID || 9812392
};

describe(__filename, function() {

  this.timeout(internals.TEST_TIMEOUT);

  before(function() {
    internals.mockApiToken();

    test_util.mockTsheetsUserId(internals.TEST_HUBOT_INPUT_USERNAME,
        internals.TEST_TSHEETS_USER_ID);

    test_util.mockTsheetsJobcodeId(internals.TEST_HUBOT_INPUT_JOBCODE,
        internals.TEST_TSHEETS_JOBCODE_ID);
  });

  describe('reportTime', function() {

    describe('with valid params', function() {
      var msg,
          username = internals.TEST_HUBOT_INPUT_USERNAME;

      beforeEach(function() {
        msg = internals.mockInputMessage(internals.VALID_REPORT_STRING, username);
      });

      it('should update time report for the specified user', function(done) {
        service.reportTime(msg, function(err, response_message) {
          should.not.exist(err);
          should.exist(response_message);
          response_message.should.not.have.length(0);
          done();
        });
      });

    });

  });

  describe('listJobcodes', function() {
    var msg;

    beforeEach(function() {
      msg = internals.mockInputMessage(internals.VALID_REPORT_STRING,
          internals.TEST_HUBOT_INPUT_USERNAME);
    });

    it('should list all available job codes', function(done) {
      service.getAllJobcodes(msg, function(err, all_jobcodes) {
        all_jobcodes.should.not.have.length(0);
        done(err);
      });
    });

  });

});


internals.mockApiToken = function() {
  service.internals.TSHEETS_API_TOKEN = internals.TEST_API_TOKEN;
};


internals.mockInputMessage = function(test_string, username) {
  var msg = {};
  msg.match = test_string.match(internals.REPORT_PATTERN);
  msg.message = {
    user: { name: username }
  };
  return msg;
};
