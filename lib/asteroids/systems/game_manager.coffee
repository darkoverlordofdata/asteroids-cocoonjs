class GameManager extends ash.core.System

  config        : null  # GameConfig
  creator       : null  # EntityCreator

  gameNodes     : null  # NodeList of GameNode
  spaceships    : null  # NodeList of SpaceshipNode
  asteroids     : null  # NodeList of AsteroidCollisionNode
  bullets       : null  # NodeList of BulletCollisionNode
  width         : 0
  height        : 0

  constructor: (parent) ->
    @creator = parent.creator
    @width = parent.width
    @height = parent.height

  addToEngine: (engine) ->
    @gameNodes  = engine.getNodeList(GameNode)
    @spaceships = engine.getNodeList(SpaceshipNode)
    @asteroids  = engine.getNodeList(AsteroidCollisionNode)
    @bullets    = engine.getNodeList(BulletCollisionNode)
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
            @creator.createSpaceship()
        else
          node.state.playing = false

          ###
           * Save the highest score for today
          ###
          today = new Date()
          mm = (today.getMonth()+1).toString()
          if mm.length is 1 then mm = '0'+mm
          dd = today.getDate().toString()
          if dd.length is 1 then dd = '0'+dd
          yyyy = today.getFullYear().toString()
          yyyymmdd = yyyy+mm+dd

          if 0 is Db.queryAll('leaderboard', query: date: yyyymmdd).length
            Db.insert 'leaderboard', date: yyyymmdd, score: node.state.hits
          else
            Db.update 'leaderboard', date: yyyymmdd, (row) ->
              if node.state.hits > row.score
                row.score = node.state.hits
              return row

          Db.commit()
          @creator.createWaitForClick()
  
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
            position = new Point(rnd.nextDouble() * @width, rnd.nextDouble() * @height)
            break unless Point.distance(position, spaceship.position.position) <= 80

          @creator.createAsteroid 30, position.x, position.y
          ++i

    return # Void

  removeFromEngine: (engine) ->
    @gameNodes  = null
    @spaceships = null
    @asteroids  = null
    @bullets    = null
    return # Void

