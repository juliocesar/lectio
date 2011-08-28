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
      if error and response.statusCode != 200
        cb error
      else
        jsdom.env { html: body, scripts: [jquery] }, (err, window) ->
          cb err, window?.jQuery

nytimes = (post, cb) ->
  cb null,
    title: post.title
    published: new Date(post.pubDate)
    source: "New York Times"
    url: post.link
    images: []
    body: post.body

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
    published: new Date()
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
    published: post.published
    source: "Flickr Explore Interestingess"
    url: post.link
    body: post.description

exports.nytimes = nytimes
#exports.engadget = engadget
exports.hn = hn
exports.functionsource = functionsource
exports.tc = tc
exports.usesthis = usesthis
exports.flickr = flickr
