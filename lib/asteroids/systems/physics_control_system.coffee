'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

PhysicsControlNode    = asteroids.nodes.PhysicsControlNode
b2Vec2                = Box2D.Common.Math.b2Vec2

class asteroids.systems.PhysicsControlSystem extends ash.tools.ListIteratingSystem

  keyPoll: null # KeyPoll

  constructor: (@keyPoll) ->
    super(PhysicsControlNode, @updateNode)

  updateNode: (node, time) =>

    control = node.control
    body = node.physics.body

    rotation = body.GetAngularVelocity()

    if @keyPoll.isDown(control.left)
      body.ApplyTorque(rotation/1000 - control.rotationRate / Math.PI * time)

    if @keyPoll.isDown(control.right)
      body.ApplyTorque(rotation/1000 + control.rotationRate / Math.PI * time)

    if @keyPoll.isDown(control.accelerate)
      {x, y} = body.GetLinearVelocity()
      x += Math.cos(rotation) * control.accelerationRate * time
      y += Math.sin(rotation) * control.accelerationRate * time
      body.ApplyForce(new b2Vec2(x, y), body.GetWorldCenter())

    return # Void
