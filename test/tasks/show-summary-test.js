'use strict';

var moment = require('moment');
var should = require('chai').should();

var task = require('../../lib/tasks/show-summary.js'),
    test_util = require('../../test-util/common-test-util.js'),
    patterns = require('../../lib/patterns.js');

var internals = {
  TEST_API_TOKEN: process.env.HUBOT_TSHEETS_API_CLIENT_TOKEN || 'abc123',
  TEST_TIMEOUT: 20 * 1000
};

describe(__filename, function() {

  this.timeout(internals.TEST_TIMEOUT);

  describe('execute', function() {

    describe('with valid params, "tsheets summary 2015-01-26 2015-01-27"', function() {
      var input_string = 'tsheets summary 2015-01-26 2015-01-27',
          brain,
          msg;

      beforeEach(function() {
        msg = test_util.mockInputMessage(patterns.SHOW_SUMMARY,
            input_string,
            'user');
      });

      beforeEach(function() {
        brain = test_util.mockRobotBrain();
      });

      it('should execute task properly', function(done) {
        task.execute(msg, brain, function(err, message) {
          should.not.exist(err);
          should.exist(message);
          done();
        });
      });

    });

  });

  describe('internals.convertMsgToParams', function() {

    describe('with "tsheets summary" (omitting date)', function() {
      var input_string = 'tsheets summary',
          msg,
          monday,
          sunday;

      beforeEach(function() {
        msg = test_util.mockInputMessage(patterns.SHOW_SUMMARY,
            input_string,
            'user');

        monday = moment().startOf('week');
        sunday = moment().endOf('week');
      });

      it('should set start_date to monday of the current week', function() {
        var params = task.internals.convertMsgToParams(msg);
        params.start_date.format().should.eql(monday.format());
      });

      it('should set end_date to sunday of the current week', function() {
        var params = task.internals.convertMsgToParams(msg);
        params.end_date.format().should.eql(sunday.format());
      });

    });

    describe('with "tsheets summary 2015-01-26" (omitting end date)', function() {
      var input_string = 'tsheets summary 2015-01-26',
          msg,
          monday,
          sunday;

      beforeEach(function() {
        msg = test_util.mockInputMessage(patterns.SHOW_SUMMARY,
            input_string,
            'user');

        monday = moment('2015-01-26');
        sunday = moment('2015-01-26').add(6, 'day');
      });

      it('should set start_date to 2015-01-26', function() {
        var params = task.internals.convertMsgToParams(msg);
        params.start_date.format().should.eql(monday.format());
      });

      it('should set end_date to start date + 6 days', function() {
        var params = task.internals.convertMsgToParams(msg);
        params.end_date.format().should.eql(sunday.format());
      });

    });

  });

  describe('internals.createParamsForGetTimesheets', function() {

    describe('with valid params', function() {
      var params = {
        start_date: moment('2015-01-22T21:37:00.000Z'),
        end_date: moment('2015-01-29T21:37:00.000Z'),
        api_token: 'abc123'
      };

      it('should return params required by API', function() {
        var req_params = task.internals.createParamsForGetTimesheets(params);
        req_params.should.have.keys([
          'start_date',
          'end_date',
          'api_token'
        ]);
      });

      it('should format dates to YYYY-MM-DD', function() {
        var req_params = task.internals.createParamsForGetTimesheets(params);
        req_params.start_date.should.eql('2015-01-22');
        req_params.end_date.should.eql('2015-01-29');
      });

    });

  });

  describe('internals.getTimesheetsSummary', function() {

    describe('with valid params', function() {
      var req_params = {
        start_date: '2015-01-19',
        end_date: '2015-01-21',
        api_token: internals.TEST_API_TOKEN
      };

      it('should return a summary of timesheets for the period', function(done) {
        task.internals.getTimesheetsSummary(req_params, function(err, summary) {
          should.not.exist(err);
          summary.should.eql({
            'adams': 24,
            'britzl': 24,
            'danfelt': 24,
            'dbrockman': 24,
            'eramberg': 27,
            'hubot': 24.06,
            'jjepson': 26,
            'kdoherty': 24,
            'ksommestad': 25,
            'mfernstrom': 26,
            'mmalmberg': 25,
            'mprintz': 24.5,
            'nbergman': 24,
            'nfernstrom': 24,
            'ngawell': 24,
            'plarsson': 24,
            'pskoog': 24,
            'skotlinski': 25,
            'tericson': 31
          });
          done();
        });
      });

    });

  });

  describe('internals.getAllTimesheetsFromApi', function() {

    describe('with valid params', function() {
      var req_params = {
        start_date: '2015-01-19',
        end_date: '2015-01-20',
        api_token: internals.TEST_API_TOKEN
      };

      it('should fetch multiple pages of timesheets and merge to a single result', function(done) {
        task.internals.getAllTimesheetsFromApi(req_params, function(err, json) {
          should.not.exist(err);
          should.exist(json);
          json.should.have.property('supplemental_data');
          json.should.have.property('results');
          json.results.should.have.property('timesheets');
          done();
        });
      });

    });

  });

  describe('internals.getTimesheetsFromApi', function() {

    describe('with valid params', function() {
      var req_params = {
        start_date: '2015-01-19',
        end_date: '2015-01-25',
        api_token: internals.TEST_API_TOKEN
      };

      it('should return response from the TSheets API', function(done) {
        task.internals.getTimesheetsFromApi(req_params, function(err, json) {
          should.not.exist(err);
          should.exist(json);
          done();
        });
      });

    });

  });

  describe('internals.transformApiResponseToSummary', function() {

    describe('with response from API', function() {
      var json;

      before(function() {
        json = require('../fixtures/tasks/get-timesheets.json');
      });

      it('should return an object with user ids mapped to hours', function() {
        var transformed = task.internals.transformApiResponseToSummary(json);
        transformed.should.be.an('object');

        Object.keys(transformed).forEach(function(username) {
          var total_duration_hrs = transformed[username];
          total_duration_hrs.should.be.a('number');
        });

        transformed.ksommestad.should.eql(1);
        transformed.dbrockman.should.eql(8);
        transformed.hubot.should.eql(0.37);
      });

    });

  });

  describe('internals.convertSummaryToSortedUsers', function() {

    describe('with valid summary', function() {
      var summary_json;

      before(function() {
        var json = require('../fixtures/tasks/get-timesheets.json');
        summary_json = task.internals.transformApiResponseToSummary(json);
      });

      it('should sort list by duration, ascendng', function() {
        var users = task.internals.convertSummaryToSortedUsers(summary_json),
            previous;

        users.forEach(function(user) {
          var duration = user.duration;
          if (previous) {
            duration.should.not.be.below(previous);
          }
          previous = duration;
        });
      });

    });

  });

  describe('internals.convertSummaryToMessage', function() {
    var json,
        start_date = moment('2015-01-26'),
        end_date = moment('2015-01-27');

    before(function() {
      json = require('../fixtures/tasks/get-timesheets.json');
    });

    it('should return string with username = hours', function() {
      var summary = task.internals.transformApiResponseToSummary(json),
          message,
          rows_including_header;

      message = task.internals.convertSummaryToMessage(start_date, end_date, summary);
      rows_including_header = message.split('\n');
      rows_including_header.length.should.eql(Object.keys(summary).length + 1);
    });

    it('should begin message with date and user count summary', function() {
      var summary = task.internals.transformApiResponseToSummary(json),
          message = task.internals.convertSummaryToMessage(start_date, end_date, summary);
      message.split('\n')[0].should.eql('10 users reported between 26 Jan to 27 Jan:');
    });

  });

});
