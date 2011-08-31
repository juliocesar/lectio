require './src/db'
fs = require 'fs'

lectio = module.exports
lectio.Item    = require './src/item'
lectio.crawler = require './src/crawler'
lectio.manifest =
  content: fs.readFileSync './.git/ORIG_HEAD', 'utf8'
  lastModified: fs.statSync('./.git/ORIG_HEAD').mtime

