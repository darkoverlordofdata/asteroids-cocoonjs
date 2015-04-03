###
 * Smooth Step Physics System
 *
 * Smooth the physics and align step
 * with frame rate
 *
 * @see http://blog.allanbishop.com/box-2d-2-1a-tutorial-part-10-fixed-time-step/
 *
###
class SmoothPhysicsSystem extends ash.core.System

  b2Body                = Box2D.Dynamics.b2Body
  b2Vec2                = Box2D.Common.Math.b2Vec2

  FIXED_TIMESTEP        = 1/60
  MAX_STEPS             = 5
  velocityIterations    = 8
  positionIterations    = 1

  fixedTimestepAccumulator: 0
  fixedTimestepAccumulatorRatio: 0


  config      : null  # GameConfig
  world       : null  # Box2D World
  creator     : null  # EntityCreator
  nodes       : null  # PhysicsNode
  enabled     : true
  game        : null

  @deadPool   : []    # dead bodies waiting to recycle

  constructor: (@config, @world, @game) ->

  addToEngine: (engine) ->
    @nodes = engine.getNodeList(PhysicsNode)
    return # Void

  removeFromEngine: (engine) ->
    @nodes = null
    return # Void

  update: (dt) =>
    return if @game.paused
    return unless @enabled

    @fixedTimestepAccumulator += dt
    nSteps = Math.floor(@fixedTimestepAccumulator / FIXED_TIMESTEP)

    if nSteps > 0
      @fixedTimestepAccumulator -= nSteps * FIXED_TIMESTEP

    @fixedTimestepAccumulatorRatio = @fixedTimestepAccumulator / FIXED_TIMESTEP
    nStepsClamped = Math.min(nSteps, MAX_STEPS)

    i = 0
    while i < nStepsClamped
      @resetSmoothStates()
      @world.Step(dt, velocityIterations, positionIterations)
      i++

    @world.ClearForces()
    @smoothStates()

    ###
     * Clean up the dead bodies
    ###
    while (body = SmoothPhysicsSystem.deadPool.pop())
      ud = body.GetUserData()
      delete ud.entity if ud.entity?
      body.SetUserData(ud)
      @world.DestroyBody(body)

    return # Void

  resetSmoothStates: =>
    node = @nodes.head
    while node
      position = node.position
      physics = node.physics
      body = physics.body

      ###
       * Update the position component from Box2D model
       * Asteroids uses wraparound space coordinates
      ###
      {x, y} = body.GetPosition()

      # Reset previous
      position.position.x = physics.previousX = x
      position.position.y = physics.previousY  = y
      position.rotation = physics.previousAngle  = body.GetAngularVelocity()

      x1 = if x > @config.width then 0 else if x < 0 then @config.width else x
      y1 = if y > @config.height then 0 else if y < 0 then @config.height else y
      body.SetPosition(new b2Vec2(x1,y1)) if x1 isnt x or y1 isnt y

      node = node.next

    return # Void

  smoothStates: =>

    oneMinusRatio = 1.0 - @fixedTimestepAccumulatorRatio

    node = @nodes.head
    while node
      position = node.position
      physics = node.physics
      body = physics.body

      ###
       * Update the position component from Box2D model
       * Asteroids uses wraparound space coordinates
      ###
      {x, y} = body.GetPosition()
      # Correction
      position.position.x = @fixedTimestepAccumulatorRatio * x + (oneMinusRatio * physics.previousX)
      position.position.y = @fixedTimestepAccumulatorRatio * y + (oneMinusRatio * physics.previousY)
      position.rotation = body.GetAngularVelocity() * @fixedTimestepAccumulatorRatio + oneMinusRatio * physics.previousAngle

      x1 = if x > @config.width then 0 else if x < 0 then @config.width else x
      y1 = if y > @config.height then 0 else if y < 0 then @config.height else y
      body.SetPosition(new b2Vec2(x1,y1)) if x1 isnt x or y1 isnt y

      node = node.next

    return # Void
