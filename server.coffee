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
    files: [ "prototypes.js", "jquery-1.6.2.min.js", "underscore-min.js", "backbone.js", "localstorage.js", "scrollability.js", "models.js", "views.js", "router.js", "app.js" ]
    route: /\/js\/lectio.js/
  css:
    dataType: "css"
    path: __dirname + "/public/css/"
    files: [ "reset.css", "main.css", "media-queries.css" ]
    route: /\/css\/lectio.css/
assetsManagerMiddleware = assetManager(assetManagerGroups)

lectio.crawler.crawlAll()

app = require('zappa').app {lectio, assetsManagerMiddleware, gzip, ejs}, ->
  requiring 'util'
  def lectio: lectio

  use gzip.gzip(), assetsManagerMiddleware, 'static'

  get '/': ->
    render 'index.ejs', layout: false

  get '/api/items': ->
    lectio.Item.find {}, (err, items) =>
      json = (item.clientJSON() for item in items)
      send json
  
  get '/api/items/:id': ->
    lectio.Item.findOne { _id: @id }, (err, item) =>
      json = (item.clientJSON())
      send json

port = if process.env.NODE_ENV == 'production' then 80 else 8000
app.app.listen port, ->
  console.log 'Ready'

  # if run as root, downgrade to the owner of this file
  if process.getuid() == 0
    require('fs').stat __filename, (err, stats) ->
      return console.log err if err
      process.setuid stats.uid
