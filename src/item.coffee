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

#events = new events.EventEmitter()
#
#Item.pre 'update', (next) ->
#  console.log "Emitting!"
#  events.emit 'save', this
#
#Item.statics.events = events

#mongoose.model 'Item', Item
module.exports = mongoose.model 'Item', Item

