'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.BulletCollisionNode extends ash.core.Node

  @components:
    bullet    : asteroids.components.Bullet
    position  : asteroids.components.Position
    collision : asteroids.components.Collision
    physics   : asteroids.components.Physics

  bullet    : null
  position  : null
  collision : null
  physics   : null
