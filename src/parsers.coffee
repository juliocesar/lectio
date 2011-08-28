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


nytimes = (post, cb) ->
  console.log post
  attributes =
    title: post.title
    published: new Date(post.pubDate)
    source: "New York Times"
    url: post.link
    images: []
    body: post.body
  getContent attributes, (error, item) ->
    cb error, item

  #retrieve post.link, (error, $) ->
  #  return cb error if error
  #  $ -> cb null,
  #    title: $('h1').text()
  #    published: new Date()
  #    source: "New York Times"
  #    url: $('link[rel=canonical]').attr('href')
  #    #byline: $('.byline').text()
  #    #author: $('a[rel=author]').attr('href')
  #    images: []
  #    body: $(el).html() for el in $('.articleBody')

#engadget = (post, cb) ->
#  cb null,
#    title: post.title
#    published: new Date()
#    source: "Engadget"
#    url: post.link
#    images: []
#    body: post.description

hn = (post, cb) ->
  cb null,
    title: post.title
    published: new Date(post.pubDate)
    source: "Hacker News"
    url: post.link
    images: []
    body: post.description

functionsource = (post, cb) ->
  cb null,
    title: post.title
    published: new Date(post.pubDate)
    source: "Function Source"
    url: post.link
    images: []
    body: post.body

tc = (post, cb) ->
  cb null,
    title: post.title
    published: new Date(post.pubDate)
    source: "ConversationEDU"
    url: post.link
    body: post.body

usesthis = (post, cb) ->
  cb null,
    title: post.title
    published: new Date(post.pubDate)
    source: "The Setup"
    url: post.link
    body: ''

flickr = (post, cb) ->
  cb null,
    title: post.title
    published: new Date() # TODO photo's date is not in the feed!
    source: "Flickr Explore Interestingess"
    url: post.link
    body: post.body

kalina = (post, cb) ->
  cb null,
    title: post.title
    published: new Date(post.pubDate)
    source: "Pictures That Look Like This"

gimmeColor = (post, cb) ->
  cb null,
    title: post.title
    published: new Date(post.pubDate)
    source: "Gimme Bar Collection: Color"
    url: post.link
    body: post.body

freakonomics = (post, cb) ->
  cb null,
    title: post.title
    published: new Date(post.pubDate)
    source: "Freakonomics"
    url: post.link
    images: []
    body: post.description

gimmeWanderlust = (post, cb) ->
  cb null,
    title: post.title
    published: new Date(post.pubDate)
    source: "Gimme Bar Collection: Illustration"
    url: post.link
    body: post.body

gimmeIllustration = (post, cb) ->
  cb null,
    title: post.title
    published: new Date(post.pubDate)
    source: "Gimme Bar Collection: Illustration"
    url: post.link
    body: post.body

exports.nytimes = nytimes
#exports.engadget = engadget
exports.hn = hn
exports.functionsource = functionsource
exports.tc = tc
exports.usesthis = usesthis
exports.flickr = flickr
exports.kalina = kalina
exports.gimmeColor = gimmeColor
exports.freakonomics = freakonomics
exports.gimmeWanderlust = gimmeWanderlust
exports.gimmeIllustration = gimmeIllustration

