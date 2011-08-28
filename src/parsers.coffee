readability = require 'readability'
$ = require 'jquery'
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

easyParser = (feedName, filters) ->
  (post, cb) ->
    post =
      title: post.title
      published: post.pubDate or new Date()
      source: feedName
      url: post.link or ''
      images: []
      body: post.body or ''
    if filters then filters(post, cb) else cb(null, post)

readabilityParser = (feedName) ->
  parser = easyParser(feedName)
  (post, cb) ->
    parser post, ->
      getContent post, cb

flickrParser = (feedName) ->
  parser = easyParser(feedName)
  (post, cb) ->
    parser post, (error, post) ->
      body = $("<div>" + post.body + "</div>")
      $('img[src*="_m."]', body).each ->
        if $(this).attr('src').match(/_m\.(jpg|gif|png)/)
          image = $(this).attr('src')
          console.log image
          post.images = [
            image,
            image.replace(/_m\.(jpg|gif|png)/, ".$1")
            image.replace(/_m\.(jpg|gif|png)/, "_z.$1")
            image.replace(/_m\.(jpg|gif|png)/, "_b.$1")
            image.replace(/_m\.(jpg|gif|png)/, "_o.$1")
          ]
          $(this).attr('src', post.images[3])
      post.body = body.html()
      cb null, post

scriptStripper = (next) ->
  (post, cb) ->
    try
      body = $("<div>" + post.body + "</div>")
      console.log "w00t"
      $("script", body).remove()
      post.body = body.html()
      if next then next(post, cb) else cb(null, post)
    catch error
      cb error, post

iwdrmParser = (feedName) ->
  parser = easyParser(feedName)
  (post, cb) ->
    parser post, (error, post) ->
      post.title = post.title.replace(/(“.+”).+/, "$1" )
      post.body = post.body.replace(/“.+”(.+)/, "$1")
      cb null, post

bigpictureParser = (feedName) ->
  parser = easyParser(feedName)
  (post, cb) ->
    parser post, (error, post) ->
      post.body = post.body.replace(/<div class="bpBody">(.+)<\/div>.+/, "<p>$1<\/p>")
      post.body = post.body.replace(/<div class="bpCaption">(.+)<\/div>.+/, "<p>$1<\/p>")
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
exports.iwdrm = iwdrmParser "If we don&rsquo;t, remember me"
exports.anildash = easyParser "Anil Dash"
exports.atlantictech = easyParser "The Atlantic: Technology", scriptStripper()
exports.bigpicture = bigpictureParser "The Big Picture"
