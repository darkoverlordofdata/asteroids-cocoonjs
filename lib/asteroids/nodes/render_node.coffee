'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.RenderNode extends ash.core.Node

  @components:
    position  : asteroids.components.Position
    display   : asteroids.components.Display

  position  : null
  display   : null
