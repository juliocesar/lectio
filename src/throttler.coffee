poolModule = require 'generic-pool'

pool = poolModule.Pool
  name: 'http',
  create: (callback) ->
    # TODO maybe...
    callback null, {}
  destroy: ->
  max: 5
  idleTimeoutMillis: 30000
  log: false

exports.add = (description, callback) ->
  pool.acquire (err, _) ->
    console.log description
    callback pool.release

exports.run = ->

