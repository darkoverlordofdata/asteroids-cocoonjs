'use strict'
asteroids = require('../../../lib')

Point = asteroids.ui.Point

class asteroids.sprites.AsteroidDeathView

  x           : 0
  y           : 0
  rotation    : 0
  radius      : 0
  points      : null
  first       : true
  dots        : null

  constructor: (@radius) ->
    @dots = []

  draw: (ctx) =>
    for dot in @dots
      dot.draw(ctx, @x, @y)

  animate: (time) ->
    if @first
      @first = false
      for i in [0...8]
        dot = new Dot(@radius)
        @dots.push(dot)

    for dot in @dots
      dot.x += dot.velocity.x * time
      dot.y += dot.velocity.y * time


class Dot
  velocity  : null
  x         : 0
  y         : 0

  constructor: (maxDistance) ->

    angle = Math.random() * 2 * Math.PI
    distance = Math.random() * maxDistance
    @x = Math.cos( angle ) * distance
    @y = Math.sin( angle ) * distance
    speed = Math.random() * 10 + 10
    @velocity = new Point(Math.cos(angle)*speed, Math.sin(angle)*speed)

  draw:(ctx, x, y) ->

    ctx.save()
    ctx.beginPath()
    ctx.translate x, y
    ctx.rotate @rotation
    ctx.fillStyle = "#FFFFFF"
    ctx.arc @x, @y, 2, 0, Math.PI * 2, false
    ctx.fill()
    ctx.restore()
    return
