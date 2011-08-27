rss = require 'easyrss'
util = require 'util'

nytimes = (cb) ->
  feed = 'http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml'
  rss.parseURL feed, (posts) ->
    cb(post.link for post in posts)

hn = (cb) ->
  feed = 'http://news.ycombinator.com/rss'
  rss.parseURL feed, (posts) ->
    cb posts

exports.nytimes = nytimes
exports.hn = hn
