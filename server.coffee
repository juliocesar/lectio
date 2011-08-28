lectio = require './lectio'
nko = require('nko')('DFw7dX4Eim56nfD9')
assetManager = require 'connect-assetmanager'
gzip = require 'connect-gzip'
ejs = require "ejs"

# tell EJS to man up
ejs.open = "{{"
ejs.close = "}}"

# minify and concatenate assets
assetManagerGroups =
  js:
    dataType: "javascript"
    path: __dirname + "/public/js/"
    files: [ "prototypes.js", "jquery-1.6.2.min.js", "underscore-min.js", "backbone.js", "localstorage.js", "scrollability.js", "pretty-date.js", "jquery.tipsy.js", "models.js", "views.js", "router.js", "focusmanager.js", "app.js" ]
    route: /\/js\/lectio.js/
  css:
    debug: true
    dataType: "css"
    path: __dirname + "/public/css/"
    files: [ "reset.css", "images.css", "main.css", "media-queries.css", "tipsy.css" ]
    route: /\/css\/lectio.css/
assetsManagerMiddleware = assetManager(assetManagerGroups)

setTimeout lectio.crawler.crawlAll, 10000

app = require('zappa').app {lectio, assetsManagerMiddleware, gzip, ejs}, ->
  requiring 'util'
  def lectio: lectio

  use gzip.gzip(), assetsManagerMiddleware, 'static'

  io.configure 'production', ->
    io.enable 'browser client minification'
    io.enable 'browser client etag'
    io.set 'log level', 1
    io.set 'transports', [
      'websocket'
      'flashsocket'
      'htmlfile'
      'xhr-polling'
      'jsonp-polling'
    ]

  get '/': ->
    response.render 'index.ejs', locals: {env: process.env.NODE_ENV}, layout: false

  get '/api/items': ->
    query = lectio.Item.find({})
    query.sort 'published', -1
    query.limit 30
    query.exec (err, items) =>
      json = (item.clientJSON() for item in items)
      send json

  get '/api/items/:id': ->
    lectio.Item.findOne { _id: @id }, (err, item) =>
      if err or !item?
        # TODO send a 404
      else
        send item.clientJSON()

  at connection: ->
    console.log "Server time, bitches"
    setTimeout (=> broadcast 'test'), 1000

  client '/realtime.js': ->
    at 'item': ->
      if item = Lectio.Items.get @item._id
        item.set @item
      else
        item = new Item @item
        Lectio.Items.add item unless item.isNew()

    connect document.location.origin

lectio.Item.on 'new', (item) ->
  console.log "Broadcasting!"
  try
    app.io.sockets.emit 'item', item: item.clientJSON()
  catch error
    console.log error.stack

port = if process.env.NODE_ENV == 'production' then 80 else 8000
app.app.listen port, ->
  console.log 'Ready'

  # if run as root, downgrade to the owner of this file
  if process.getuid() == 0
    require('fs').stat __filename, (err, stats) ->
      return console.log err if err
      process.setuid stats.uid
