'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.GunControlNode extends ash.core.Node

  @components:
    audio     : asteroids.components.Audio
    control   : asteroids.components.GunControls
    gun       : asteroids.components.Gun
    position  : asteroids.components.Position

  control   : null
  gun       : null
  position  : null
  audio     : null
