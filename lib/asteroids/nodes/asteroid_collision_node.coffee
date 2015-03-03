'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

class asteroids.nodes.AsteroidCollisionNode extends ash.core.Node

  @components:
    asteroid  : asteroids.components.Asteroid
    position  : asteroids.components.Position
    collision : asteroids.components.Collision
    audio     : asteroids.components.Audio

  asteroid  : null
  position  : null
  collision : null
  audio     : null
