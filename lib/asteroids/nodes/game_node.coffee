'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.GameNode extends ash.core.Node

  @components:
    state : asteroids.components.GameState

  state : null
