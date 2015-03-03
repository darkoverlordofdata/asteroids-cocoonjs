'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

class asteroids.nodes.SpaceshipCollisionNode extends ash.core.Node

  @components:
    spaceship   : asteroids.components.Spaceship
    position    : asteroids.components.Position
    collision   : asteroids.components.Collision
    audio       : asteroids.components.Audio

  spaceship   : 0
  position    : 0
  collision   : null
  audio       : null

