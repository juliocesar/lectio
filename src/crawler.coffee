parsers    = require './parsers'
sources    = require './sources'
util       = require 'util'
mongoose   = require 'mongoose'

mongoose.connect 'mongodb://localhost/lectio'

Item = mongoose.model 'Item', new mongoose.Schema
  title: String
  source:
    link: String
    name: String
  images: [String]
  body: String

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


