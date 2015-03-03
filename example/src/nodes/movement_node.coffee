'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

class asteroids.nodes.MovementNode extends ash.core.Node

  @components:
    position : asteroids.components.Position
    motion : asteroids.components.Motion


  position : null
  motion : null
