
class PhysicsSystem extends ash.core.System

  b2Body                = Box2D.Dynamics.b2Body
  b2Vec2                = Box2D.Common.Math.b2Vec2

  stepValue = 1/60

  handle      : 0     # handle for setInterval
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
    @handle = setInterval( =>
      return if @game.paused
      return unless @enabled
      @world.Step(stepValue, 10, 10)
      @world.ClearForces()
    , stepValue)
    return # Void

  removeFromEngine: (engine) ->
    clearInterval(@handle) if @handle isnt 0
    @handle = 0
    @nodes = null
    return # Void

  update: (time) =>
    return if @game.paused
    return unless @enabled

    node = @nodes.head
    while node
      @updateNode node, time
      node = node.next

    ###
     * Clean up the dead bodies
    ###
    while (body = PhysicsSystem.deadPool.pop())
      ud = body.GetUserData()
      delete ud.entity if ud.entity?
      body.SetUserData(ud)
      @world.DestroyBody(body)

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

