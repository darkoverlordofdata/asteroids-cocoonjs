'use strict'
#ash = require('../../../lib')
asteroids = require('../../../lib')

class asteroids.nodes.BulletAgeNode extends ash.core.Node

  @components:
    bullet : asteroids.components.Bullet

  bullet : null
