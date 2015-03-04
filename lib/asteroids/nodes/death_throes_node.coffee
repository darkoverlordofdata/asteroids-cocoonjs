'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.DeathThroesNode extends ash.core.Node

  @components:
    dead     : asteroids.components.DeathThroes

  dead     : null
