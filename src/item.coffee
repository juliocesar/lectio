mongoose = require 'mongoose'

Item = mongoose.model 'Item', new mongoose.Schema
  title: String
  published: Date
  source: String
  url: String
  images: [String]
  body: String

Item.prototype.clientJSON = ->
  _id:       @_id
  title:     @title
  published: @published
  source:
    url:     @url
    name:    @source
  images:    @images
  body:      @body


module.exports = Item
