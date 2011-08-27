lectio = require './lectio'
nko = require('nko')('DFw7dX4Eim56nfD9')

port = parseInt(process.env.PORT) || 7777
require('zappa') port, {lectio}, ->
  requiring 'util'
  def lectio: lectio

  get '/': 'hi'
  get '/api/items/engadget': ->
    #lectio.Item.find { source: { name: 'Engadget' } }, (err, items) =>
    lectio.Item.find {}, (err, items) =>
      send JSON.stringify items

