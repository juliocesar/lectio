parsers    = require './src/item_parser'
sources    = require './src/sources'
util       = require 'util'

#itemparser.retrieve 'http://www.nytimes.com/', (error, $) ->
#  if error
#    util.debug error
#  else
#    util.log $('h1').text()

sources.nytimes (uris) ->
  uri = uris[0]
  parsers.retrieve uri, parsers.nytimes (item) ->
    util.log util.inspect(item)

#sources.hn (posts) ->
#  util.log(util.inspect(posts))
