'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

class asteroids.nodes.SpaceshipNode extends ash.core.Node

  @components:
    spaceship : asteroids.components.Spaceship
    position  : asteroids.components.Position

  spaceship : 0
  position  : 0

