'use strict';

var patterns = require('../lib/patterns.js');

describe(__filename, function() {

  describe('REPORT_TIME pattern', function() {

    it('should match "tsheets report <jobcode name> <hours> [<date>]"', function() {
      patterns.REPORT_TIME.should.eql(/tsheets report (.*)/i);
    });

  });

  describe('LIST_JOBCODES pattern', function() {

    it('should match "tsheets list jobcodes"', function() {
      patterns.LIST_JOBCODES.should.eql(/tsheets list jobcodes/i);
    });

  });

  describe('REMEMBER_USER pattern', function() {

    it('should be "tsheets i am <tsheets user id>"', function() {
      patterns.REMEMBER_USER.should.eql(/tsheets I am (.*)/i);
    });

  });

  describe('SHOW_SUMMARY pattern', function() {

    it('should be "tsheets summary <from date> <to date>"', function() {
      patterns.SHOW_SUMMARY.should.eql(/tsheets summary(.*)/i);
    });

    it('should match without args', function() {
      patterns.SHOW_SUMMARY.test('tsheets summary').should.eql(true);
    });

  });

});
