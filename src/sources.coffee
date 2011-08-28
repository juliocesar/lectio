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

readableRssSource = (feed) ->
  rssSource "http://andrewtrusty.appspot.com/readability/feed?url=#{encodeURIComponent(feed)}"

exports.nytimes = readableRssSource 'http://feeds.nytimes.com/nyt/rss/HomePage'
exports.engadget = rssSource 'http://www.engadget.com/rss.xml'
exports.hn = rssSource 'http://andrewtrusty.appspot.com/readability/feed?url=http%3A//news.ycombinator.com/rss'
exports.functionsource = rssSource 'http://functionsource.com/feeds/entries'
exports.tc = rssSource 'http://theconversation.edu.au/articles'
exports.usesthis = readableRssSource 'http://usesthis.com/feed/'
exports.flickr = rssSource 'http://feeds.feedburner.com/flickr_interestingness'
exports.kalina = rssSource 'http://picturesthatlooklikethis.com/rss'
exports.gimmeColor =rssSource 'https://gimmebar.com/public/feed/user/rose22/collection/color'
exports.freakonomics = readableRssSource 'http://freakonomics.blogs.nytimes.com/feed/'
exports.gimmeColor = rssSource 'https://gimmebar.com/public/feed/user/rose22/collection/color'
exports.gimmeWanderlust = rssSource 'https://gimmebar.com/public/feed/user/meagan/collection/wanderlust'
exports.gimmeIllustration = rssSource 'https://gimmebar.com/public/feed/user/squaredeye/collection/illustration'
exports.gimmeMusicArt = rssSource 'https://gimmebar.com/public/feed/user/jonnygotham/collection/music-art'
exports.wired = readableRssSource 'http://feeds.wired.com/wired/index'
exports.commentisfree = rssSource 'http://feeds.guardian.co.uk/theguardian/commentisfree/rss'
exports.iwdrm = rssSource 'http://iwdrm.tumblr.com/rss'
exports.anildash = rssSource 'http://feeds.dashes.com/AnilDash'
exports.atlantictech = rssSource 'http://feeds.feedburner.com/AtlanticScienceAndTechnology'
