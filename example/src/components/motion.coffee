'use strict'
asteroids = require('../../../example')
Point = asteroids.ui.Point

class asteroids.components.Motion

  velocity: null
  angularVelocity: 0
  damping: 0

  constructor: (velocityX, velocityY, @angularVelocity, @damping) ->

    @velocity = new Point(velocityX, velocityY)
