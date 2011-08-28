mongoose = require 'mongoose'
events = require 'events'

Item = new mongoose.Schema
  title: String
  published: Date
  source: String
  url: String
  images: [String]
  body: String

Item.methods.clientJSON = ->
  _id:       @_id
  title:     @title
  published: @published
  source:
    url:     @url
    name:    @source
  images:    @images
  body:      @body

module.exports = mongoose.model 'Item', Item

