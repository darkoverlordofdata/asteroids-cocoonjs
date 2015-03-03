'use strict'
asteroids = require('../../../lib')

class asteroids.sprites.HudView

  x: 0
  y: 0
  rotation: 0
  score: 0
  lives: 3


  setLives: (lives) =>
    @lives = lives
    return

  setScore: (score) =>
    @score = score
    return

  draw: (ctx) =>

    ctx.save()
    ctx.beginPath()
    ctx.font = 'bold 18px opendyslexic'
    ctx.fillStyle = '#00FFFF'
    ctx.textAlign = 'center'
    s = "LIVES: #{@lives}"
    l = ctx.measureText(s)
    x = l.width
    y = 20
    ctx.fillText(s, x, y)
    ctx.fill()
    ctx.restore()


    ctx.save()
    ctx.beginPath()
    ctx.font = 'bold 18px opendyslexic'
    ctx.fillStyle = '#00FFFF'
    ctx.textAlign = 'center'
    s = "SCORE: #{@score}"
    l = ctx.measureText(s)
    x = (window.window.innerWidth*window.devicePixelRatio)-l.width
    y = 20
    ctx.fillText(s, x, y)
    ctx.fill()
    ctx.restore()
    return
