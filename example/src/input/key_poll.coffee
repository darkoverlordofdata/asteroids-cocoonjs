'use strict'
asteroids = require('../../../example')

class asteroids.input.KeyPoll

  states = null
  displayObj = null

  constructor:(@displayObj) ->
    @states = {}
    @displayObj.addEventListener "keydown", @keyDownListener
    @displayObj.addEventListener "keyup", @keyUpListener

  keyDownListener: (event) =>
    @states[event.keyCode] = true
    return

  keyUpListener: (event) =>
    @states[event.keyCode] = false  if @states[event.keyCode]
    return

  isDown: (keyCode) =>
    return @states[keyCode]

  isUp: (keyCode) =>
    return not @states[keyCode]
