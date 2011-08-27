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
  uri = post.link
  retrieve uri, (error, $) ->
    if error
      cb error
    else
      $ ->
        cb null,
          title: $('h1').text()
          published: new Date()
          source: "New York Times"
          url: $('link[rel=canonical]').attr('href')
          #byline: $('.byline').text()
          #author: $('a[rel=author]').attr('href')
          images: []
          body: $(el).html() for el in $('.articleBody')

engadget = (post, cb) ->
  cb null
    title: post.title
    published: new Date()
    source: "Engadget"
    url: post.link
    images: []
    body: post.description

hn = (post, cb) ->
  uri = post.description.match(/https?:\/\/[^\"]+/)[0]
  retrieve uri, (error, $) ->
    if error
      cb error
    else
      try
        cb null,
          title: post.title
          published: new Date()
          source: "Hacker News"
          url: uri #post.link
          images: []
          body: post.description
          #alt: uri # TODO decide whether we want the HN uri as the 'link'
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
  #console.log post

tc = (post, cb) ->
  cb null,
    title: post.title
    published: new Date()
    source: "ConversationEDU"
    url: post.link
    body: post.content

exports.retrieve = retrieve
exports.nytimes = nytimes
exports.engadget = engadget
exports.hn = hn
exports.functionsource = functionsource
exports.tc = tc
