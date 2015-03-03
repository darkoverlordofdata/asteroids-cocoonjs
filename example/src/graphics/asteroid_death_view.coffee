'use strict'
asteroids = require('../../../example')

Point = asteroids.ui.Point

class asteroids.graphics.AsteroidDeathView

  numDots = 8

  dots: null
  x: 0
  y: 0
  width: 0
  height: 0
  rotation: 0
  graphic: null
  radius: 0
  points: null
  count: 0
  first: true

  constructor: (@graphic, @radius) ->
    @dots = []

  animate: (time) ->
    if @first
      @first = false
      for i in [0...numDots]
        dot = new Dot(@graphic, @radius)
        @dots.push(dot)

    for dot in @dots
      dot.x += dot.velocity.x * time
      dot.y += dot.velocity.y * time
    @draw()

  draw: ->
    for dot in @dots
      dot.draw(@x, @y)


class Dot
  velocity: null
  graphic: null
  x1: 0
  y1: 0
  x: 0
  y: 0

  constructor: (@graphic, maxDistance) ->

    angle = Math.random() * 2 * Math.PI
    distance = Math.random() * maxDistance
    @x = Math.cos( angle ) * distance
    @y = Math.sin( angle ) * distance
    speed = Math.random() * 10 + 10
    @velocity = new Point(Math.cos(angle)*speed, Math.sin(angle)*speed)

  draw:(x, y) ->

    graphic = @graphic
    graphic.save()
    graphic.beginPath()
    graphic.translate x, y
    graphic.rotate @rotation
    graphic.fillStyle = "#FFFFFF"
    graphic.arc @x, @y, 2, 0, Math.PI * 2, false
    graphic.fill()
    graphic.restore()
    return
