'use strict'
asteroids = require('../../../lib')

class asteroids.components.MotionControls

  left: 0
  right: 0
  accelerate: 0
  accelerationRate: 0
  rotationRate: 0

  constructor: (@left, @right, @accelerate, @accelerationRate, @rotationRate) ->