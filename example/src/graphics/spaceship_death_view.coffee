'use strict'
asteroids = require('../../../example')

Point = asteroids.ui.Point

class asteroids.graphics.SpaceshipDeathView

  x: 0
  y: 0
  width: 20
  height: 20
  rotation: 0
  graphic: null

  vel1: null
  vel2: null
  rot1: null
  rot2: null
  x1: 0
  y2: 0
  y1: 0
  y2: 0
  first: true


  constructor: (@graphic) ->


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
    @draw()


  draw: ->
    graphic = @graphic

    # shape1
    graphic.save()
    graphic.beginPath()
    graphic.translate @x+@x1, @y+@y1
    graphic.rotate @r1
    graphic.fillStyle = "#FFFFFF"
    graphic.moveTo 10, 0
    graphic.lineTo -7, 7
    graphic.lineTo -4, 0
    graphic.lineTo 10, 0
    graphic.fill()
    graphic.restore()

    # shape2
    graphic.save()
    graphic.beginPath()
    graphic.translate @x+@x2, @y+@y2
    graphic.rotate @r2
    graphic.fillStyle = "#FFFFFF"
    graphic.moveTo 10, 0
    graphic.lineTo -7, 7
    graphic.lineTo -4, 0
    graphic.lineTo 10, 0
    graphic.fill()
    graphic.restore()

    return

