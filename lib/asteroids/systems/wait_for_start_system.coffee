class WaitForStartSystem extends ash.core.System

  engine      : null  # Engine
  creator     : null  # EntityCreator
  gameNodes   : null  # NodeList
  waitNodes   : null  # NodeList
  asteroids   : null  # NodeList

  constructor: (parent) ->
    @creator = parent.creator

  addToEngine: (engine) ->
    @engine = engine
    @waitNodes = engine.getNodeList(WaitForStartNode)
    @gameNodes = engine.getNodeList(GameNode)
    @asteroids = engine.getNodeList(AsteroidCollisionNode)
    return # Void

  removeFromEngine: (engine) ->
    @waitNodes = null
    @gameNodes = null
    @asteroids = null
    return # Void

  update: (time) =>
    node = @waitNodes.head
    game = @gameNodes.head

    if (node and node.wait.startGame and game)

      asteroid = @asteroids.head
      while asteroid
        ###
         * Clean up asteroids left from prior game
        ###
        graphic = asteroid.entity.get(Display).graphic
        @creator.destroyEntity(asteroid.entity)
        graphic.dispose()
        asteroid = asteroid.next

      game.state.setForStart()
      node.wait.startGame = false
      @engine.removeEntity(node.entity)
    return # Void
