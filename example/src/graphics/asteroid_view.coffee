'use strict'
asteroids = require('../../../example')

class asteroids.graphics.AsteroidView

  x: 0
  y: 0
  width: 0
  height: 0
  rotation: 0
  graphic: null
  radius: 0
  points: null
  count: 0


  constructor: (@graphic, @radius) ->
    @width = @radius
    @height = @radius
    @points = []
    angle = 0
    while angle < Math.PI * 2
      length = (0.75 + Math.random() * 0.25) * @radius
      posX = Math.cos(angle) * length
      posY = Math.sin(angle) * length
      @points.push
        x: posX
        y: posY

      angle += Math.random() * 0.5

  draw: ->
    graphic = @graphic
    graphic.save()
    graphic.beginPath()
    graphic.translate @x, @y
    graphic.rotate @rotation
    graphic.fillStyle = "#FFFFFF"
    graphic.moveTo @radius, 0
    i = 0

    while i < @points.length
      graphic.lineTo @points[i].x, @points[i].y
      ++i
    graphic.lineTo @radius, 0
    graphic.fill()
    graphic.restore()
    return


