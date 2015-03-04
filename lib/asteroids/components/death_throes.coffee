'use strict'
asteroids = require('../../index')

class asteroids.components.DeathThroes

  countdown: 0
  body: null

  constructor: (duration) ->
    @countdown = duration
