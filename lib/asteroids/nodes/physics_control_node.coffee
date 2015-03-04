'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.PhysicsControlNode extends ash.core.Node

  @components:
    control   : asteroids.components.MotionControls
    physics   : asteroids.components.Physics


  control   : null
  physics   : null
