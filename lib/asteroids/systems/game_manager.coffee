class GameManager extends ash.core.System

  parent        : null
  config        : null  # GameConfig
  entities      : null  # EntityCreator
  rnd           : null
  gameNodes     : null  # NodeList of GameNode
  spaceships    : null  # NodeList of SpaceshipNode
  asteroids     : null  # NodeList of AsteroidCollisionNode
  bullets       : null  # NodeList of BulletCollisionNode
  width         : 0
  height        : 0

  constructor: (@parent) ->
    @entities = @parent.entities
    @rnd = @parent.rnd
    @width = @parent.width
    @height = @parent.height
    @nodes = @parent.ash.nodes

  addToEngine: (engine) ->
    @gameNodes  = engine.getNodeList(@nodes.GameNode)
    @spaceships = engine.getNodeList(@nodes.SpaceshipNode)
    @asteroids  = engine.getNodeList(@nodes.AsteroidCollisionNode)
    @bullets    = engine.getNodeList(@nodes.BulletCollisionNode)
    return # Void

  update: (time) =>
    node = @gameNodes.head
    if node and node.state.playing
      if @spaceships.empty
        if node.state.lives > 0
          newSpaceshipPosition = new Point(@width * 0.5, @height * 0.5)
          clearToAddSpaceship = true
          asteroid = @asteroids.head
          while asteroid
            if Point.distance(asteroid.position.position, newSpaceshipPosition) <= asteroid.collision.radius + 50
              clearToAddSpaceship = false
              break
            asteroid = asteroid.next
          if clearToAddSpaceship
            @entities.createSpaceship()
        else
          node.state.playing = false
          @parent.score(node.state.hits)

          ###
           * Start a new game?
          ###
          @entities.createWaitForClick()
  
      # game over
      if @asteroids.empty and @bullets.empty and not @spaceships.empty
        # next level
        spaceship = @spaceships.head
        node.state.level++
        asteroidCount = 2 + node.state.level
        i = 0
  
        while i < asteroidCount
  
          # check not on top of spaceship
          loop
            position = new Point(@rnd.nextDouble() * @width, @rnd.nextDouble() * @height)
            break unless Point.distance(position, spaceship.position.position) <= 80

          @entities.createAsteroid 30, position.x, position.y
          ++i

    return # Void

  removeFromEngine: (engine) ->
    @gameNodes  = null
    @spaceships = null
    @asteroids  = null
    @bullets    = null
    return # Void

