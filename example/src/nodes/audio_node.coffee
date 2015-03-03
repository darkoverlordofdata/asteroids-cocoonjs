'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

class asteroids.nodes.AudioNode extends ash.core.Node

  @components:
    audio : asteroids.components.Audio

  audio : null
