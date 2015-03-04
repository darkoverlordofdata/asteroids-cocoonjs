'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.SpaceshipCollisionNode extends ash.core.Node

  @components:
    spaceship   : asteroids.components.Spaceship
    position    : asteroids.components.Position
    collision   : asteroids.components.Collision
    audio       : asteroids.components.Audio
    physics     : asteroids.components.Physics

  spaceship   : null
  position    : null
  collision   : null
  audio       : null
  physics     : null
