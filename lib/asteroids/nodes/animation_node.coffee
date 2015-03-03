'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.AnimationNode extends ash.core.Node

  @components:
    animation : asteroids.components.Animation

  animation : null
