'use strict'
asteroids = require('../../index')
Point = asteroids.ui.Point

class asteroids.components.Position

  position: null
  rotation: 0

  constructor: (x, y, @rotation) ->

    @position = new Point(x, y)
