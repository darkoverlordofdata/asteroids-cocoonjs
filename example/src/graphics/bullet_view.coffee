'use strict'
asteroids = require('../../../example')

class asteroids.graphics.BulletView

  x: 0
  y: 0
  width: 4
  height: 4
  rotation: 0
  graphic: null
  
  constructor: (@graphic) ->

  draw: ->
    graphic = @graphic
    graphic.save()
    graphic.beginPath()
    graphic.rotate @rotation
    graphic.fillStyle = "#FFFFFF"
    graphic.arc @x, @y, 2, 0, Math.PI * 2, false
    graphic.fill()
    graphic.restore()
    return

