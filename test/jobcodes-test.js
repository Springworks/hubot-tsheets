'use strict';

require('chai').should();

var jobcodes = require('../lib/jobcodes.js');

describe(__filename, function() {

  describe('getAllJobcodes', function() {

    it('should return an array of strings', function() {
      var all_jobcodes = jobcodes.getAllJobcodes();
      all_jobcodes.should.be.instanceOf(Array);
      all_jobcodes.forEach(function(jobcode) {
        jobcode.should.be.a('string');
      });
    });

  });

});
