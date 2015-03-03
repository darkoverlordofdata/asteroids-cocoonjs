'use strict'
#ash = require('../../../lib')
asteroids = require('../../../lib')

class asteroids.nodes.GameNode extends ash.core.Node

  @components:
    state : asteroids.components.GameState

  state : null
