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
        cb null, window.jQuery

nytimes = (post, cb) ->
  uri = post.link
  retrieve uri, (error, $) ->
    if error
      cb error
    else
      util.log $('.articleBody').text()
      cb null,
        title: $('h1').text()
        published: new Date()
        source:
          url: $('link[rel=canonical]').attr('href')
          name: "New York Times"
        #byline: $('.byline').text()
        #author: $('a[rel=author]').attr('href')
        images: []
        body: $(el).html() for el in $('.articleBody')

engadget = (post, cb) ->
  cb null
    title: post.title
    published: new Date()
    source:
      url: post.link
      name: "Engadget"
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
          source:
            url: uri #post.link
            name: "Hacker News"
          images: []
          #alt: uri # TODO decide whether we want the HN uri as the 'link'
      catch error
        cb error

tc = (post, cb) ->
  cb null,
    title: post.title
    published: new Date()
    source:
      url: post.link
      name: "TheConversationEDU"
    body: post.content

exports.retrieve = retrieve
exports.nytimes = nytimes
exports.engadget = engadget
exports.hn = hn
exports.tc = tc
