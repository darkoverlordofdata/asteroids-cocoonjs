'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

class asteroids.nodes.HudNode extends ash.core.Node

  @components:
    state : asteroids.components.GameState
    hud   : asteroids.components.Hud

  state : null
  hud   : null
