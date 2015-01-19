'use strict';

var internals = {
  tsheetsUserIdsByUsername: require('../config/users.json')
};


exports.getTsheetsUserId = function(username) {
  var user_id = internals.tsheetsUserIdsByUsername[username];

  // TODO: figure out user from persistence
  // (https://github.com/github/hubot/blob/master/docs/scripting.md#persistence)

  if (!user_id) {
    throw new Error('No TSheets user mapped to username=' + username);
  }

  return user_id;
};


/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') {
  /** @type Object */
  exports.internals = internals;
}
