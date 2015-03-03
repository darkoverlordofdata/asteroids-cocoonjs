'use strict'
asteroids = require('../../index')
ash = require('ash.coffee')

Signal0 = ash.signals.Signal0

class asteroids.sprites.WaitForStartView

  x: 0
  y: 0
  rotation: 0
  first: true

  click: null
  
  constructor: () ->
    @click = new Signal0()

  draw: (ctx) =>

    if @first
      @first = false
      ctx.canvas.addEventListener 'click', (event) =>
        @click.dispatch()

    ctx.save()
    ctx.beginPath()
    ctx.font = 'bold 40px opendyslexic'
    ctx.fillStyle = '#FFFFFF'
    #    ctx.textAlign = 'center'

    s = 'ASTEROIDS'
    l = ctx.measureText(s)
    x = Math.floor(((window.innerWidth*window.devicePixelRatio)-l.width)/2)
    y = 175
    ctx.fillText(s, x, y)
    ctx.fill()
    ctx.restore()

    ctx.save()
    ctx.beginPath()
    ctx.font = 'bold 18px opendyslexic'
    ctx.fillStyle = '#FFFFFF'
    #    ctx.textAlign = 'center'

    s = 'CLICK TO START'
    l = ctx.measureText(s)
    x = Math.floor(((window.innerWidth*window.devicePixelRatio)-l.width)/2)
    y = 225
    ctx.fillText(s, x, y)
    ctx.fill()
    ctx.restore()

    ctx.save()
    ctx.beginPath()
    ctx.font = 'bold 14px opendyslexic'
    ctx.fillStyle = '#FFFFFF'
    #    ctx.textAlign = 'center'

    s = 'Z to Fire  ~  Arrow Keys to Move'
    l = ctx.measureText(s)
    x = 10
    y = window.innerHeight*window.devicePixelRatio-20
    ctx.fillText(s, x, y)
    ctx.fill()
    ctx.restore()

    return

