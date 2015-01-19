'use strict';

require('chai').should();

var users = require('../lib/users.js'),
    test_util = require('../test-util/common-test-util.js');

var internals = {
  TEST_USERNAME: 'hoff',
  TEST_TSHEETS_USER_ID: 1
};

describe(__filename, function() {
  var robot_brain;

  before(function() {
    robot_brain = test_util.mockRobotBrain();
  });

  before(function() {
    internals.mockTsheetsUserId(robot_brain,
        internals.TEST_USERNAME,
        internals.TEST_TSHEETS_USER_ID);
  });

  describe('getTsheetsUserId', function() {

    describe('with a username already mapped to user_id', function() {
      var username = internals.TEST_USERNAME,
          expected_user_id = internals.TEST_TSHEETS_USER_ID;

      it('should return TSheets username', function() {
        var tsheets_user_id = users.getTsheetsUserId(username, robot_brain);
        tsheets_user_id.should.eql(expected_user_id);
      });

    });

    describe('with a username not mapped to user_id', function() {

      it('should throw error', function() {
        (function() {
          users.getTsheetsUserId('mr-foo-bar-baz', robot_brain);
        }).should.throw();
      });

    });

  });

  describe('rememberUser', function() {

    describe('with valid params', function() {
      it('should persist user in "robot.brain"', function() {
        var hubot_username = 'hubot_user',
            tsheets_user_id = 123456;

        users.rememberUser(robot_brain, hubot_username, tsheets_user_id);

        robot_brain.should.have.property('tsheetsUserIdsByHubotUsername');
        robot_brain.tsheetsUserIdsByHubotUsername.
            should.have.property(hubot_username, tsheets_user_id);
      });

    });

  });

});


internals.mockTsheetsUserId = function(robot_brain, username, user_id) {
  users.rememberUser(robot_brain, username, user_id);
};
