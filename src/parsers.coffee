request = require 'request'
jsdom   = require 'jsdom'
util    = require 'util'
fs      = require 'fs'

#jquery = fs.readFileSync("../jquery.min.js").toString();
jquery = "../jquery.min.js"

jsdom.defaultDocumentFeatures = {
  FetchExternalResources   : ['script']
  ProcessExternalResources : ['script']
  MutationEvents           : '2.0'
  QuerySelector            : false
}

retrieve = (uri, cb) ->
  request uri: uri, (error, response, body) ->
    if error and response.statusCode != 200
      cb error
    else
      jsdom.env { html: body, scripts: [jquery] }, (err, window) ->
        cb err, window?.jQuery

nytimes = (post, cb) ->
  retrieve post.uri, (error, $) ->
    return cb error if error
    $ -> cb null,
      title: $('h1').text()
      published: new Date()
      source: "New York Times"
      url: $('link[rel=canonical]').attr('href')
      #byline: $('.byline').text()
      #author: $('a[rel=author]').attr('href')
      images: []
      body: $(el).html() for el in $('.articleBody')

engadget = (post, cb) ->
  cb null,
    title: post.title
    published: new Date()
    source: "Engadget"
    url: post.link
    images: []
    body: post.description

hn = (post, cb) ->
  uri = post.description.match(/https?:\/\/[^\"]+/)[0]
  retrieve uri, (error, $) ->
    return cb error if error
    try
      cb null,
        title: post.title
        published: new Date()
        source: "Hacker News"
        url: uri #post.link
        images: []
        body: post.description
    catch error
      cb error

functionsource = (post, cb) ->
  cb null,
    title: post.title
    published: new Date(post.pubDate)
    source: "Function Source"
    url: post.link
    images: []
    body: post.content

tc = (post, cb) ->
  cb null,
    title: post.title
    published: new Date()
    source: "ConversationEDU"
    url: post.link
    body: post.content

usesthis = (post, cb) ->
  #console.log post
  cb null,
    title: post.title
    published: post.published
    source: "The Setup"
    url: post.link
    body: ''

exports.nytimes = nytimes
exports.engadget = engadget
exports.hn = hn
exports.functionsource = functionsource
exports.tc = tc
exports.usesthis = usesthis
