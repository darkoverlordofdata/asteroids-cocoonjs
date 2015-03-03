'use strict'
asteroids = require('../../index')
Point = asteroids.ui.Point

class asteroids.components.Motion

  velocity: null
  angularVelocity: 0
  damping: 0

  constructor: (velocityX, velocityY, @angularVelocity, @damping) ->

    @velocity = new Point(velocityX, velocityY)
