'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

DeathThroesNode = asteroids.nodes.DeathThroesNode

class asteroids.systems.DeathThroesSystem extends ash.tools.ListIteratingSystem

  creator: null

  constructor: (@creator) ->

    super(DeathThroesNode, @updateNode)

  updateNode: (node, time) =>

    node.death.countdown -= time
    if (node.death.countdown <= 0)
      @creator.destroyEntity(node.entity)
    return # Void
