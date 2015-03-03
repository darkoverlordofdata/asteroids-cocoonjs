'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

class asteroids.nodes.MotionControlNode extends ash.core.Node

  @components:
    control   : asteroids.components.MotionControls
    position  : asteroids.components.Position
    motion    : asteroids.components.Motion


  control   : null
  position  : null
  motion    : null
