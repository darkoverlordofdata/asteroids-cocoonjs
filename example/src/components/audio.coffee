'use strict'
asteroids = require('../../../example')

class asteroids.components.Audio

  toPlay: null

  constructor: () ->
    @toPlay = []

  play: (sound) ->
    @toPlay.push(sound)