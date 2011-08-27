lectio = require './lectio'

require('zappa') {lectio}, ->
  requiring 'util'
  def lectio: lectio

  get '/': 'hi'
  get '/api/items/engadget': ->
    #lectio.Item.find { source: { name: 'Engadget' } }, (err, items) =>
    lectio.Item.find {}, (err, items) =>
      send JSON.stringify items

