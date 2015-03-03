'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.BulletAgeNode extends ash.core.Node

  @components:
    bullet : asteroids.components.Bullet

  bullet : null
