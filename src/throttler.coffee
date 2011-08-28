class Throttler
  constructor: ->
    @callbacks = []
    @running = false
    next = @next.bind(this)
    @next = -> next()

  add: (description, callback) ->
    @callbacks.push { callback: callback, description: description }
    @run() unless @running

  next: ->
    if @callbacks.length > 0
      { callback, description } = @callbacks.shift()
      console.log description
      callback @next
    else
      @running = false

  run: ->
    @running = true
    @next()

module.exports = new Throttler()
