'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

class asteroids.nodes.AnimationNode extends ash.core.Node

  @components:
    animation : asteroids.components.Animation

  animation : null
