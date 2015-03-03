'use strict'
asteroids = require('../../index')

class asteroids.sprites.BulletView

  x: 0
  y: 0
  rotation: 0

  draw: (ctx) =>
    ctx.save()
    ctx.beginPath()
    ctx.rotate @rotation
    ctx.fillStyle = "#FFFFFF"
    ctx.arc @x, @y, 2, 0, Math.PI * 2, false
    ctx.fill()
    ctx.restore()
    return

