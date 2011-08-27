mongoose = require 'mongoose'

Item = mongoose.model 'Item', new mongoose.Schema
  title: String
  published: Date
  source:
    url: String
    name: String
  images: [String]
  body: String

module.exports = Item
