'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

PhysicsNode           = asteroids.nodes.PhysicsNode
b2Body                = Box2D.Dynamics.b2Body
b2Vec2                = Box2D.Common.Math.b2Vec2

class asteroids.systems.PhysicsSystem extends ash.core.System

  config      : null  # GameConfig
  world       : null  # Box2D World
  nodes       : null  # PhysicsNode
  @deadPool   : []    # dead bodies waiting to recycle

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

    ###
     * Clean up the dead bodies
    ###
    while (body = PhysicsSystem.deadPool.pop())
      @world.DestroyBody(body)
#      ud = body.GetUserData()
#      console.log "DeadPool: #{ud.type}"

    return # Void

  ###
   * Process the physics for this node
  ###
  updateNode: (node, time) =>

    position = node.position
    physics = node.physics
    body = physics.body

    ###
     * Update the position component from Box2D model
     * Asteroids uses wraparound space coordinates
    ###
    {x, y} = body.GetPosition()

    x1 = if x > @config.width then 0 else if x < 0 then @config.width else x
    y1 = if y > @config.height then 0 else if y < 0 then @config.height else y
    body.SetPosition(new b2Vec2(x1,y1)) if x1 isnt x or y1 isnt y
    position.position.x = x1
    position.position.y = y1
    position.rotation = body.GetAngularVelocity()
    return # Void

