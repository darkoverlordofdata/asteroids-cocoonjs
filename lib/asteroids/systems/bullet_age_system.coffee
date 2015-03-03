'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

BulletAgeNode = asteroids.nodes.BulletAgeNode

class asteroids.systems.BulletAgeSystem extends ash.tools.ListIteratingSystem

  creator: null

  constructor: (@creator) ->

    super(BulletAgeNode, @updateNode)

  updateNode: (node, time) =>

    bullet = node.bullet
    bullet.lifeRemaining -= time
    if bullet.lifeRemaining <= 0
      @creator.destroyEntity node.entity
    return # Void

