require './src/db'

lectio = module.exports
lectio.Item  = require './src/item'
lectio.crawl = require('./src/crawler').crawl

