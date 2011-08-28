lectio = require './lectio'
nko = require('nko')('DFw7dX4Eim56nfD9')

lectio.crawler.crawlAll()

app = require('zappa').app {lectio}, ->
  requiring 'util'
  def lectio: lectio

  use 'static'

  get '/api/items': ->
    query = lectio.Item.find({})
    query.sort 'published', -1
    query.limit 30
    query.exec (err, items) =>
      json = (item.clientJSON() for item in items)
      send json

  get '/api/items/:id': ->
    lectio.Item.findOne { _id: @id }, (err, item) =>
      if err
        # TODO send a 404
      else
        send item.clientJSON()

port = if process.env.NODE_ENV == 'production' then 80 else 8000
app.app.listen port, ->
  console.log 'Ready'

  # if run as root, downgrade to the owner of this file
  if process.getuid() == 0
    require('fs').stat __filename, (err, stats) ->
      return console.log err if err
      process.setuid stats.uid
