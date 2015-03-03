'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.MovementNode extends ash.core.Node

  @components:
    position : asteroids.components.Position
    motion : asteroids.components.Motion


  position : null
  motion : null
