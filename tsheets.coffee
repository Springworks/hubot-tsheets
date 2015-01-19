# Description:
#   Simple TSheets reporting.
#
# Configuration:
#   HUBOT_TSHEETS_API_CLIENT_TOKEN = <tsheets api token>
#
# Commands:
#   tsheets report <jobcode name> <hours> [<date>] - Reports time for a specific job code
#   tsheets list jobcodes - Lists all job codes
#   tsheets I am <tsheets user id> - Connects a TSheets user to the current Hubot user
#
# Notes:
#   Requires a TSheets account with API access:
#   Planned to be implemented:
#     hubot tsheets show reports <since time> - Shows reports by user since the specified time
#     hubot tsheets show mine <since time> - Shows reports for the current user
#
# Author:
#   sommestad

tsheets_service = require './lib/tsheets-service.js'
patterns = require './lib/patterns.js'

module.exports = (robot) ->
  generateAckMessage = ->
    '10-4'


  robot.hear patterns.REPORT_TIME, (msg) ->
    msg.send generateAckMessage()

    tsheets_service.reportTime msg, robot.brain, (err, response_message) ->
      if err
        msg.send 'Computer says no. ' + err
      else
        msg.send response_message


  robot.hear patterns.LIST_JOBCODES, (msg) ->
    tsheets_service.getAllJobcodes msg, (err, jobcodes) ->
      msg.send jobcodes.join('\n')


  robot.hear patterns.REMEMBER_USER, (msg) ->
    msg.send generateAckMessage()

    tsheets_service.rememberUser msg, robot.brain, (err, response_message) ->
      if err
        msg.send 'Computer says no. ' + err
      else
        msg.send response_message
