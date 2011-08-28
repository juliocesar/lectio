require './db'
parsers    = require './parsers'
sources    = require './sources'
throttler  = require './throttler'
Item       = require './item'
util       = require 'util'

# TODO set a timeout just in case the crawl just fails completely
crawl = (source, parser, cb) ->
  parser = source unless parser?
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
      cb() if cb?

crawlIntermittently = (source, parser) ->
  done = false
  crawl source, parser, ->
    unless done
      done = true
      setTimeout (-> crawlIntermittently(source, parser)), 600000

crawlAll = (options = {}) ->
  if options?.onlyOnce
    crawl source for source, _ of sources
  else
    crawlIntermittently source for source, _ of sources

exports.crawl = crawl
exports.crawlAll = crawlAll
