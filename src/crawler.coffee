require './db'
parsers    = require './parsers'
sources    = require './sources'
throttler  = require './throttler'
Item       = require './item'
util       = require 'util'

exports.crawl = (source, parser) ->
  throttler.add "Grabbing source #{source}", (next) ->
    sources[source] (posts) ->
      next()
      for post in posts
        parsers[parser] post, (error, item) ->
          if error
            util.debug util.inspect error
            util.debug error.stack
          else
            #util.log "Updating #{item.url}"
            Item.update { url: item.url }, item, upsert: true, (err) ->
              util.log util.inspect err if err
