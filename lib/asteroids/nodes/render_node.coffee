'use strict'
#ash = require('../../../lib')
asteroids = require('../../../lib')

class asteroids.nodes.RenderNode extends ash.core.Node

  @components:
    position  : asteroids.components.Position
    display   : asteroids.components.Display

  position  : null
  display   : null
