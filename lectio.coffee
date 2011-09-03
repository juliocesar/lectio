require './src/db'
fs = require 'fs'

lectio = module.exports
lectio.Item    = require './src/item'
lectio.crawler = require './src/crawler'
lectio.manifest =
  content: fs.readFileSync './.git/ORIG_HEAD', 'utf8'
  lastModified: fs.statSync('./.git/ORIG_HEAD').mtime
lectio.googleAPIKey =
  development: "ABQIAAAAgbjshYSlVs-Ub3GvlTdruxT2yXp_ZAY8_ufC3CFXhHIE1NvwkxQcj4feoOQnSD907vFR7Wa2kN_L-A"