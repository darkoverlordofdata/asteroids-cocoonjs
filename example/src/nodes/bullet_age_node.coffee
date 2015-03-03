'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

class asteroids.nodes.BulletAgeNode extends ash.core.Node

  @components:
    bullet : asteroids.components.Bullet

  bullet : null
