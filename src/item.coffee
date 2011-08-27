mongoose = require 'mongoose'

Item = mongoose.model 'Item', new mongoose.Schema
  title: String
  source:
    link: String
    name: String
  images: [String]
  body: String

module.exports = Item
