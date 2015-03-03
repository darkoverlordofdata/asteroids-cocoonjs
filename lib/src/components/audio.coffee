'use strict'
asteroids = require('../../../lib')

class asteroids.components.Audio

  toPlay: null

  constructor: () ->
    @toPlay = []

  play: (sound) ->
    @toPlay.push(sound)