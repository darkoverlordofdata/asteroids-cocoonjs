'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

GunControlNode = asteroids.nodes.GunControlNode

class asteroids.systems.GunControlSystem extends ash.tools.ListIteratingSystem

  keyPoll     : null  # KeyPoll
  creator     : null  # EntityCreator

  constructor: (@keyPoll, @creator) ->
    super(GunControlNode, @updateNode)

  updateNode: (node, time) =>
    control = node.control
    position = node.position
    gun = node.gun
    gun.shooting = @keyPoll.isDown(control.trigger)
    gun.timeSinceLastShot += time
    if gun.shooting and gun.timeSinceLastShot >= gun.minimumShotInterval
      @creator.createUserBullet gun, position
      gun.timeSinceLastShot = 0
    return # Void

