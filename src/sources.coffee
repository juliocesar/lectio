rss = require 'easyrss'
util = require 'util'

nytimes = (cb) ->
  feed = 'http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml'
  rss.parseURL feed, (posts) ->
    cb posts

engadget = (cb) ->
  feed = 'http://www.engadget.com/rss.xml'
  rss.parseURL feed, (posts) ->
    cb posts

hn = (cb) ->
  feed = 'http://news.ycombinator.com/rss'
  rss.parseURL feed, (posts) ->
    cb posts

functionsource = (cb) ->
  feed = 'http://functionsource.com/feeds/entries'
  rss.parseURL feed, (posts) ->
    cb posts

tc = (cb) ->
  feed = 'http://theconversation.edu.au/articles'
  rss.parseURL feed, (posts) ->
    cb posts

exports.nytimes = nytimes
exports.engadget = engadget
exports.hn = hn
exports.functionsource = functionsource
exports.tc = tc
