# Description:
#   Simple TSheets reporting.
#
# Configuration:
#   HUBOT_TSHEETS_API_CLIENT_TOKEN = <tsheets api token>
#
# Commands:
#   tsheets report <jobcode name> <hours> [<date>] - Reports time for a specific job code
#   tsheets list jobcodes - Lists all job codes
#
# Notes:
#   Requires a TSheets account with API access:
#   Planned to be implemented:
#     hubot tsheets show jobcodes - Lists all available job codes
#     hubot tsheets show reports <since time> - Shows reports by user since the specified time
#     hubot tsheets show mine <since time> - Shows reports for the current user
#     hubot tsheets I am <tsheets username> - Connects a TSheets user to the current Hubot user
#
# Author:
#   sommestad

tsheets_service = require './lib/tsheets-service.js'

module.exports = (robot) ->

  generateAckMessage = ->
    '10-4'

  robot.hear /tsheets report (.*)/i, (msg) ->
    msg.reply generateAckMessage()

    tsheets_service.reportTime msg, (err, response_message) ->
      if err
        msg.send 'Computer says no. ' + err
      else
        msg.send response_message

  robot.hear /tsheets list jobcodes/i, (msg) ->
    tsheets_service.getAllJobcodes msg, (err, jobcodes) ->
      msg.send jobcodes.join('\n')
