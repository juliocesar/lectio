require './src/db'
Item = require './src/item'

require('zappa') {Item}, ->
  requiring 'util'
  def Item: Item

  get '/': 'hi'
  get '/api/items/engadget': ->
    #Item.find { source: { name: 'Engadget' } }, (err, items) =>
    Item.find {}, (err, items) =>
      send JSON.stringify items

