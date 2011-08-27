rss = require 'easyrss'
util = require 'util'

rssSource = (feed) ->
  (cb) -> rss.parseURL feed, (posts) -> cb posts

exports.nytimes = rssSource 'http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml'
exports.engadget = rssSource 'http://www.engadget.com/rss.xml'
exports.hn = rssSource 'http://news.ycombinator.com/rss'
exports.functionsource = rssSource 'http://functionsource.com/feeds/entries'
exports.tc = rssSource 'http://theconversation.edu.au/articles'
exports.usesthis = rssSource 'http://usesthis.com/feed/'

