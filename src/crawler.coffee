require './db'
parsers    = require './parsers'
sources    = require './sources'
Item       = require './item'
util       = require 'util'

exports.crawl = ->
  sources.engadget (posts) ->
    for post in posts
      parsers.engadget post, (error, item) ->
        if error
          util.debug util.inspect error
          util.debug error.stack
        else
          Item.find { source: { link: item.source.link } }, (err, docs) ->
            if docs.length == 0
              i = new Item(item)
              i.save()


