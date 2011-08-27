require './db'
parsers    = require './parsers'
sources    = require './sources'
Item       = require './item'
util       = require 'util'

exports.crawl = (source, parser) ->
  sources[source] (posts) ->
    for post in posts
      parsers[parser] post, (error, item) ->
        if error
          util.debug util.inspect error
          util.debug error.stack
        else
          util.log "Updating #{item.source.url}"
          Item.update { url: item.url }, item, upsert: true, (err) ->
            util.log util.inspect err if err
