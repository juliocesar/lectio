request = require 'request'
jsdom   = require 'jsdom'
util    = require 'util'
fs      = require 'fs'

jquery = fs.readFileSync("./jquery.min.js").toString();

jsdom.defaultDocumentFeatures = {
  FetchExternalResources   : ['script']
  ProcessExternalResources : ['script']
  MutationEvents           : '2.0'
  QuerySelector            : false
}

retrieve = (uri, cb) ->
  request uri: uri, (error, response, body) ->
    util.log response.statusCode
    if error and response.statusCode != 200
      cb error
    else
      jsdom.env { html: body, scripts: [jquery] }, (err, window) ->
        cb null, window.jQuery

nytimes = (cb) ->
  (error, $) ->
    if error
      cb error
    else
      cb
        title: $('h1').text()
        link: $('link[rel=canonical]').attr('href')
        byline: $('.byline').text()
        author: $('a[rel=author]').attr('href')
        summary: $('.articleBody p').first().html()
        body: $(el).html() for el in $('.articleBody')

hn = (post, cb) ->
  uri = post.description.match(/https?:\/\/[^\"]+/)[0]
  retrieve uri, (error, $) ->
    if error
      cb error
    else
      try
        cb null,
          title: post.title
          link: post.link
          alt: uri # TODO decide whether we want the HN uri as the 'link'
          author: 'todo' # TODO grab the poster's nick
          summary: ''
      catch error
        cb error

tc = (post, cb) ->
  cb null,
    title: post.title
    link: post.link
    body: post.content

exports.retrieve = retrieve
exports.nytimes = nytimes
exports.hn = hn
exports.tc = tc
