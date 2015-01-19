'use strict';

var should = require('chai').should();

var task = require('../../lib/tasks/remember-user.js'),
    patterns = require('../../lib/patterns.js'),
    test_util = require('../../test-util/common-test-util.js');

var internals = {
  INPUT_PATTERN: patterns.REMEMBER_USER,
  INPUT_STRING: 'tsheets i am 1'
};

describe(__filename, function() {
  var msg,
      username = 'hoff',
      expected_user_id = 1;

  beforeEach(function() {
    msg = test_util.mockInputMessage(internals.INPUT_PATTERN,
        internals.INPUT_STRING,
        username);
  });

  describe('execute', function() {
    var robot_brain = test_util.mockRobotBrain();

    describe('with valid params', function() {

      it('should invoke callback without error', function(done) {
        task.execute(msg, robot_brain, function(err, message) {
          should.not.exist(err);
          done();
        });
      });

    });

    describe('with invalid params', function() {
      var message_missing_user = 'tsheets i am';

      beforeEach(function() {
        msg = test_util.mockInputMessage(internals.INPUT_PATTERN,
            message_missing_user,
            username);
      });

      it('should invoke callback with error', function(done) {
        task.execute(msg, robot_brain, function(err, message) {
          should.exist(err);
          done();
        });
      });

    });

  });

  describe('internals.convertInputMessageToParams', function() {

    describe('with valid input', function() {

      it('should return params with username, tsheets_user_id', function() {
        var params = task.internals.convertInputMessageToParams(msg);
        params.should.eql({
          username: username,
          tsheets_user_id: expected_user_id
        });
      });

    });

  });

});
