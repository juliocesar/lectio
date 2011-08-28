#rss = require 'easyrss'
nodepie = require 'nodepie'
request = require 'request'
util = require 'util'

jsonify = (item) ->
  title: item.getTitle()
  link: item.getPermalink()
  description: item.getDescription()
  body: item.getContents()
  pubDate: item.getDate()
  updateDate: item.getUpdateDate()

rssSource = (feed) ->
  (cb) ->
    request uri: feed, (error, response, body) ->
      return cb error if error and response?.statusCode != 200
      rss = new nodepie(body)
      rss.init()
      cb(jsonify item for item in rss.getItems(0))

exports.nytimes = rssSource 'http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml'
#exports.engadget = rssSource 'http://www.engadget.com/rss.xml'
#exports.hn = rssSource 'http://news.ycombinator.com/rss'
exports.functionsource = rssSource 'http://functionsource.com/feeds/entries'
exports.tc = rssSource 'http://theconversation.edu.au/articles'
# exports.usesthis = rssSource 'http://usesthis.com/feed/'
# exports.flickr = rssSource 'http://feeds.feedburner.com/flickr_interestingness'
exports.kalina = rssSource 'http://picturesthatlooklikethis.com/rss'

