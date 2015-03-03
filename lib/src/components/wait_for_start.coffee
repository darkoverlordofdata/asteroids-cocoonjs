'use strict'
asteroids = require('../../../lib')

class asteroids.components.WaitForStart

  waitForStart: null
  startGame: false

  constructor: (@waitForStart) ->
    @waitForStart.click.add(@setStartGame)

  setStartGame: () =>
    @startGame = true
    return