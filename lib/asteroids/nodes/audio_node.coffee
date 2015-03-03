'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.AudioNode extends ash.core.Node

  @components:
    audio : asteroids.components.Audio

  audio : null
