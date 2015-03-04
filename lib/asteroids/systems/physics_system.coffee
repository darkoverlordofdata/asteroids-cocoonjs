'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

PhysicsNode           = asteroids.nodes.PhysicsNode
b2Body                = Box2D.Dynamics.b2Body
b2Vec2                = Box2D.Common.Math.b2Vec2

class asteroids.systems.PhysicsSystem extends ash.core.System

  config  : null  # GameConfig
  world   : null  # Box2D World
  nodes   : null  # PhysicsNode

  constructor: (@config, @world) ->


  addToEngine: (engine) ->
    @nodes = engine.getNodeList(PhysicsNode)
    return # Void

  removeFromEngine: (engine) ->
    @nodes = null
    return # Void

  update: (time) =>
    @world.Step(time, 10, 10)
    @world.ClearForces()
    node = @nodes.head
    while node
      @updateNode node, time
      node = node.next

    return # Void


  updateNode: (node, time) =>

    position = node.position
    body = node.physics.body

    return if body is null
    ###
     Wraparound space coordinates
    ###
    {x, y} = body.GetPosition()
    wrap = false
    if x > @config.width
      x = 0
      wrap = true
    if x < 0
      x = @config.width
      wrap = true
    if y > @config.height
      y = 0
      wrap = true
    if y < 0
      y = @config.height
      wrap = true
    if wrap then body.SetPosition(new b2Vec2(x,y))

    position.position.x = x
    position.position.y = y
    return # Void

