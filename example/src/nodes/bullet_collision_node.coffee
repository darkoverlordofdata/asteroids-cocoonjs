'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

class asteroids.nodes.BulletCollisionNode extends ash.core.Node

  @components:
    bullet    : asteroids.components.Bullet
    position  : asteroids.components.Position
    collision : asteroids.components.Collision

  bullet    : null
  position  : null
  collision : null
