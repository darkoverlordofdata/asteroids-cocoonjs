'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.WaitForStartNode extends ash.core.Node

  @components:
    wait : asteroids.components.WaitForStart

  wait : null
