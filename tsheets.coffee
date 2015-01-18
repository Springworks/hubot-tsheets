# Description:
#   Simple TSheets reporting.
#
# Dependencies:
#   "node-tsheets-client": "1.0.0"
#
# Configuration:
#   NODE_TSHEETS_API_CLIENT_TOKEN
#
# Commands:
#   kitt tsheets report <jobcode name> <hours> [<date>] - Reports time for a specific job code
#   kitt tsheets show jobcodes - Lists all available job codes
#   kitt tsheets show reports <since time> - Shows reports by user since the specified time
#   kitt tsheets show mine <since time> - Shows reports for the current user
#   kitt tsheets I am <tsheets username> - Connects a TSheets user to the current Hubot user
#
# Notes:
#   <optional notes required for the script>
#
# Author:
#   sommestad

module.exports = (robot) ->
  robot.respond /tsheets report (.*) (.*)/i, (msg) ->
    job_code = msg.match[1]
    hours = msg.match[2]


#robot.respond /tsheets show jobcodes/i, (msg) ->

