'use strict'
asteroids = require('../../index')

class asteroids.ui.KeyPoll

  states: null
  displayObj: null
  x: -1
  y: -1
  mouse: false
  gun: null

  constructor:(@displayObj) ->
    @states = {}
    window.addEventListener 'keydown', @keyDownListener
    window.addEventListener 'keyup', @keyUpListener
    @displayObj.canvas.addEventListener 'mouseup', @mouseUpListener, false
    @displayObj.canvas.addEventListener 'mousedown', @mouseDownListener, false
    @displayObj.canvas.addEventListener 'touchend', @touchEndListener
    @displayObj.canvas.addEventListener 'touchstart', @touchStartListener

  setGun: (gun) =>
    @gun = gun
    return

  touchStartListener: (event) =>
    @gun.trigger = true
    @x = event.touches[0].pageX
    @y = event.touches[0].pageY
    @mouse = true
    return


  touchEndListener: (event) =>
    @gun.trigger = false
    @mouse = false
    return


  mouseUpListener: (event) =>
    @gun.trigger = false
    @mouse = false
    return


  mouseDownListener: (event) =>
    @gun.trigger = true
    @x = event.x
    @y = event.y
    @mouse = true
    return

  keyDownListener: (event) =>
    console.log "keyDownListener #{event.keyCode}"
    @states[event.keyCode] = true
    return

  keyUpListener: (event) =>
    @states[event.keyCode] = false  if @states[event.keyCode]
    return

  isDown: (keyCode, x, y) =>
    if @x isnt -1
      if @x < x
        @states[37] = true
      else if @x > x
        @states[39] = true
    if @y isnt -1
      if @y > y
        @states[38] = true

    if @mouse is false
      @states[37] = false
      @states[38] = false
      @states[39] = false
      @x = -1
      @y = -1
    return @states[keyCode]

  isUp: (keyCode, x, y) =>
    if @mouse is false
      @states[37] = false
      @states[38] = false
      @states[39] = false
      @x = -1
      @y = -1
    return not @states[keyCode]
