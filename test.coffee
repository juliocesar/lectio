#parsers    = require './src/parsers'
#sources    = require './src/sources'
crawler    = require './src/crawler'
util       = require 'util'

crawler.crawl()

#itemparser.retrieve 'http://www.nytimes.com/', (error, $) ->
#  if error
#    util.debug error
#  else
#    util.log $('h1').text()

#sources.nytimes (uris) ->
#  uri = uris[0]
#  parsers.retrieve uri, parsers.nytimes (item) ->
#    util.log util.inspect(item)

#sources.hn (posts) ->
#  for post in posts
#    parsers.hn post, (error, item) ->
#      if error
#        util.debug util.inspect(error)
#        util.debug error.stack
#      else
#        util.log(util.inspect(item))

#sources.tc (posts) ->
#  for post in posts
#    parsers.tc post, (error, item) ->
#      if error
#        util.debug util.inspect(error)
#        util.debug error.stack
#      else
#        util.log(util.inspect(item))

#sources.engadget (posts) ->
#  for post in posts
#    parsers.engadget post, (error, item) ->
#      if error
#        util.debug util.inspect(error)
#        util.debug error.stack
#      else
#        util.log(util.inspect(item))
