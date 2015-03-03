'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

MotionControlNode     = asteroids.nodes.MotionControlNode
b2Vec2                = Box2D.Common.Math.b2Vec2

class asteroids.systems.MotionControlSystem extends ash.tools.ListIteratingSystem

  keyPoll: null # KeyPoll

  constructor: (@keyPoll) ->
    super(MotionControlNode, @updateNode)

  updateNode: (node, time) =>

    control = node.control
    position = node.position
    motion = node.motion

    left = @keyPoll.isDown(control.left)
    right = @keyPoll.isDown(control.right)

    position.rotation -= control.rotationRate * time  if left
    position.rotation += control.rotationRate * time  if right
    if @keyPoll.isDown(control.accelerate)
      motion.velocity.x += Math.cos(position.rotation) * control.accelerationRate * time
      motion.velocity.y += Math.sin(position.rotation) * control.accelerationRate * time

    return # Void

