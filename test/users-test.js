'use strict';

require('chai').should();

var users = require('../lib/users.js');

var internals = {
  TEST_USERNAME: 'hoff',
  TEST_TSHEETS_USER_ID: 1
};

describe(__filename, function() {

  before(function() {
    internals.mockTsheetsUserId(internals.TEST_USERNAME, internals.TEST_TSHEETS_USER_ID);
  });

  describe('getTsheetsUserId', function() {

    describe('with a username already mapped to user_id', function() {
      var username = internals.TEST_USERNAME,
          expected_user_id = internals.TEST_TSHEETS_USER_ID;

      it('should return TSheets username', function() {
        var tsheets_user_id = users.getTsheetsUserId(username);
        tsheets_user_id.should.eql(expected_user_id);
      });

    });

    describe('with a username not mapped to user_id', function() {

      it('should throw error', function() {
        (function() {
          users.getTsheetsUserId('mr-foo-bar-baz');
        }).should.throw();
      });

    });

  });

});


internals.mockTsheetsUserId = function(username, user_id) {
  users.internals.tsheetsUserIdsByUsername[username] = parseInt(user_id, 10);
};
