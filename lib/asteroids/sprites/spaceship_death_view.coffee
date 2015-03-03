'use strict'
asteroids = require('../../index')

Point = asteroids.ui.Point

class asteroids.sprites.SpaceshipDeathView

  x: 0
  y: 0
  rotation: 0

  vel1: null
  vel2: null
  rot1: null
  rot2: null
  x1: 0
  y2: 0
  y1: 0
  y2: 0
  first: true


  animate: (time) ->

    if @first
      @first = false
      @vel1 = new Point(Math.random() * 10 - 5, Math.random() * 10 + 10)
      @vel2 = new Point(Math.random() * 10 - 5, - ( Math.random() * 10 + 10 ))
      @rot1 = Math.random() * 300 - 150
      @rot2 = Math.random() * 300 - 150
      @x1 = @x2 = @x
      @y1 = @y2 = @y
      @r1 = @r2 = @rotation

    @x1 += @vel1.x * time
    @y1 += @vel1.y * time
    @r1 += @rot1 * time

    @x2 += @vel2.x * time
    @y2 += @vel2.y * time
    @r2 += @rot2 * time

    return


  draw: (ctx) =>

    # shape1
    ctx.save()
    ctx.beginPath()
    ctx.translate @x+@x1, @y+@y1
    ctx.rotate @r1
    ctx.fillStyle = "#FFFFFF"
    ctx.moveTo 10, 0
    ctx.lineTo -7, 7
    ctx.lineTo -4, 0
    ctx.lineTo 10, 0
    ctx.fill()
    ctx.restore()

    # shape2
    ctx.save()
    ctx.beginPath()
    ctx.translate @x+@x2, @y+@y2
    ctx.rotate @r2
    ctx.fillStyle = "#FFFFFF"
    ctx.moveTo 10, 0
    ctx.lineTo -7, 7
    ctx.lineTo -4, 0
    ctx.lineTo 10, 0
    ctx.fill()
    ctx.restore()

    return

