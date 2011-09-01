require './db'
parsers    = require './parsers'
sources    = require './sources'
throttler  = require './throttler'
Item       = require './item'
util       = require 'util'

saveItem = (error, attrs, cb) ->
  if error
    util.debug util.inspect error
    util.debug error.stack
  else
    Item.find { url: attrs.url }, (err, items) ->
      if err
        console.log err
      else
        if items.length == 0
          item = new Item(attrs)
          item.save()
          Item.emit 'new', item
        else
          attrs.published = items[0].get 'published'
          for item in items
            item.set(attrs)
            item.save()

# TODO set a timeout just in case the crawl just fails completely
crawl = (source, parser, cb) ->
  try
    parser = source unless parser?
    throttler.add "Grabbing source #{source}", (next) ->
      sources[source] (posts) ->
        next()
        parsers[parser](post, saveItem) for post in posts
        cb() if cb?
  catch error
    util.log "Error parsing #{source}"
    util.log error
    cb error

crawlIntermittently = (source, parser) ->
  done = false
  crawl source, parser, (error) ->
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
