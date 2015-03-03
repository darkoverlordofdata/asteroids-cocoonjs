'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.HudNode extends ash.core.Node

  @components:
    state : asteroids.components.GameState
    hud   : asteroids.components.Hud

  state : null
  hud   : null
