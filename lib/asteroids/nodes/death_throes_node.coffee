'use strict'
#ash = require('../../../lib')
asteroids = require('../../../lib')

class asteroids.nodes.DeathThroesNode extends ash.core.Node

  @components:
    death : asteroids.components.DeathThroes

  death : null
