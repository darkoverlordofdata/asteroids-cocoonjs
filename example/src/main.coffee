#+--------------------------------------------------------------------+
#| main.coffee
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2015
#+--------------------------------------------------------------------+
#|
#| This file is a part of ash.coffee
#|
#| ash.coffee is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
#
# box2d map
#
'use strict'
asteroids = require('../../example')


class asteroids.Main

  constructor: ->
    canvas = @canvas()
    asteroids = new asteroids.Asteroids(canvas.getContext('2d'), canvas.width, canvas.height)
    asteroids.start()
    return

  canvas: ->
    canvas = document.createElement(if navigator.isCocoonJS then 'screencanvas' else 'canvas')
    canvas.width  = window.innerWidth*window.devicePixelRatio
    canvas.height = window.innerHeight*window.devicePixelRatio
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.backgroundColor = '#000000'
    document.body.appendChild canvas
    return canvas

