'use strict'
asteroids = require('../../../example')

class asteroids.graphics.SpaceshipView

  x: 0
  y: 0
  width: 20
  height: 20
  rotation: 0
  graphic: null

  constructor: (@graphic) ->

  draw: ->
    graphic = @graphic
    graphic.save()
    graphic.beginPath()
    graphic.translate @x, @y
    graphic.rotate @rotation
    graphic.fillStyle = "#FFFFFF"
    graphic.moveTo 10, 0
    graphic.lineTo -7, 7
    graphic.lineTo -4, 0
    graphic.lineTo -7, -7
    graphic.lineTo 10, 0
    graphic.fill()
    graphic.restore()
    return

