'use strict'
#ash = require('../../../lib')
asteroids = require('../../../lib')

class asteroids.nodes.WaitForStartNode extends ash.core.Node

  @components:
    wait : asteroids.components.WaitForStart

  wait : null
