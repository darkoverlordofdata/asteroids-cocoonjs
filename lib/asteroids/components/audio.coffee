'use strict'
asteroids = require('../../index')

class asteroids.components.Audio

  toPlay: null

  constructor: () ->
    @toPlay = []

  play: (sound) ->
    @toPlay.push(sound)