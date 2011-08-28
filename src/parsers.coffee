readability = require 'readability'
request = require 'request'
jsdom   = require 'jsdom'
util    = require 'util'
fs      = require 'fs'
throttler = require './throttler'

#jquery = fs.readFileSync("../jquery.min.js").toString();
jquery = "../jquery.min.js"

jsdom.defaultDocumentFeatures = {
  FetchExternalResources   : ['script']
  ProcessExternalResources : ['script']
  MutationEvents           : '2.0'
  QuerySelector            : false
}

retrieve = (uri, cb) ->
  throttler.add "  requestiong #{uri}", (next) ->
    request uri: uri, (error, response, body) ->
      next()
      if error and response?.statusCode != 200
        cb error
      else
        jsdom.env { html: body, scripts: [jquery] }, (err, window) ->
          cb err, window?.jQuery

getContent = (item, cb) ->
  return cb "no link" unless item.url
  throttler.add "  requesting for readability #{item.url}", (next) ->
    request uri: item.url, (error, response, body) ->
      if error and response?.statusCode != 200
        cb error
      else
        readability.parse body, item.url, (result) ->
          #console.log result
          next()
          item.body = result.content
          cb null, item

easyParser = (feedName) ->
  (post, cb) ->
    cb null,
      title: post.title
      published: post.pubDate or new Date()
      source: feedName
      url: post.link or ''
      images: []
      body: post.body or ''

readabilityParser = (feedName) ->
  parser = easyParser(feedName)
  (post, cb) ->
    parser post, ->
      getContent post, cb

flickrParser = (feedName) ->
  parser = easyParser(feedName)
  (post, cb) ->
    parser post, (error, post) ->
      console.log post
      image = post.body.match(/"([^"]+_m\.(jpg|gif|png))/)[1]
      post.images = [
        image,
        image.replace(/_m\.(jpg|gif|png)/, ".$1")
        image.replace(/_m\.(jpg|gif|png)/, "_z.$1")
        image.replace(/_m\.(jpg|gif|png)/, "_b.$1")
        image.replace(/_m\.(jpg|gif|png)/, "_o.$1")
      ]
      post.body = post.body.replace(/_m\.(jpg|gif|png)/, "_z.$1")
      post.body = post.body.replace(/<br \/>/, "<p>")
      post.body = post.body + "</p>"
      cb null, post

exports.nytimes  = easyParser "New York Times"
exports.engadget = readabilityParser "Engadget"
exports.hn       = easyParser "Hacker News"
exports.functionsource = easyParser "Function Source"
exports.tc       = easyParser "ConversationEDU"
exports.usesthis = easyParser "The Setup"
exports.flickr   = flickrParser "Flickr Explore Interestingess"
exports.kalina   = easyParser "Pictures That Look Like This"
exports.gimmeColor = easyParser "Gimme Bar Collection: Color"
exports.freakonomics = easyParser "Freakonomics"
exports.gimmeWanderlust = easyParser "Gimme Bar Collection: Illustration"
exports.gimmeIllustration = easyParser "Gimme Bar Collection: Illustration"
exports.gimmeMusicArt = easyParser "Gimme Bar Collection: Music Art"
exports.wired = easyParser "Wired"
exports.commentisfree = easyParser "Comment is free"
exports.iwdrm = easyParser "If we don&rsquo;t, remember me"
