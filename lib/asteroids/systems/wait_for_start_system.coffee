class WaitForStartSystem extends ash.core.System

  engine      : null  # Engine
  entities     : null  # EntityCreator
  gameNodes   : null  # NodeList
  waitNodes   : null  # NodeList
  asteroids   : null  # NodeList

  constructor: (parent) ->
    @entities = parent.entities

  addToEngine: (engine) ->
    @ash = engine
    @waitNodes = engine.getNodeList(Nodes.WaitForStartNode)
    @gameNodes = engine.getNodeList(Nodes.GameNode)
    @asteroids = engine.getNodeList(Nodes.AsteroidCollisionNode)
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
        @entities.destroyEntity(asteroid.entity)
        graphic.dispose()
        asteroid = asteroid.next

      game.state.setForStart()
      node.wait.startGame = false
      @ash.removeEntity(node.entity)
    return # Void
