'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

class asteroids.nodes.GameNode extends ash.core.Node

  @components:
    state : asteroids.components.GameState

  state : null
