'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.PhysicsNode extends ash.core.Node

  @components:
    position : asteroids.components.Position
    physics : asteroids.components.Physics


  position : null
  physics : null
