'use strict'
asteroids = require('../../../example')

class asteroids.graphics.HudView

  x: 0
  y: 0
  width: 4
  height: 4
  rotation: 0
  graphic: null
  score: 0
  lives: 3
  drawScore: null
  drawLives: null

  constructor: (@graphic) ->
    @drawScore = @createScore
    @drawLives = @createLives

  draw: =>
    @drawScore()
    @drawLives()
    return


  setLives: (lives) =>
    @lives = lives

  setScore: (score) =>
    @score = score

  createLives: () ->
    @graphic.save()
    @graphic.beginPath()
    @graphic.font = 'bold 18px Helvetica'
    @graphic.fillStyle = '#FFFFFF'
    @graphic.textAlign = 'center'
    s = "LIVES: #{@lives}"
    l = @graphic.measureText(s)
    x = l.width
    y = 20
    @graphic.fillText(s, x, y)
    @graphic.fill()
    @graphic.restore()
    return

  createScore: () ->
    @graphic.save()
    @graphic.beginPath()
    @graphic.font = 'bold 18px Helvetica'
    @graphic.fillStyle = '#FFFFFF'
    @graphic.textAlign = 'center'
    s = "SCORE: #{@score}"
    l = @graphic.measureText(s)
    x = (window.window.innerWidth*window.devicePixelRatio)-l.width
    y = 20
    @graphic.fillText(s, x, y)
    @graphic.fill()
    @graphic.restore()
    return
