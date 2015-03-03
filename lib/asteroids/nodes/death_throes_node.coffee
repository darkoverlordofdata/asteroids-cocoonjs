'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.DeathThroesNode extends ash.core.Node

  @components:
    death : asteroids.components.DeathThroes

  death : null
