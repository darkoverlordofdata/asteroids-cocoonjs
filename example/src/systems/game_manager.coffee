'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

GameNode                  = asteroids.nodes.GameNode
SpaceshipNode             = asteroids.nodes.SpaceshipNode
AsteroidCollisionNode     = asteroids.nodes.AsteroidCollisionNode
BulletCollisionNode       = asteroids.nodes.BulletCollisionNode
Point                     = asteroids.ui.Point

class asteroids.systems.GameManager extends ash.core.System

  config        : null  # GameConfig
  creator       : null  # EntityCreator

  gameNodes     : null  # NodeList of GameNode
  spaceships    : null  # NodeList of SpaceshipNode
  asteroids     : null  # NodeList of AsteroidCollisionNode
  bullets       : null  # NodeList of BulletCollisionNode

  constructor: (@creator, @config) ->

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
          newSpaceshipPosition = new Point(@config.width * 0.5, @config.height * 0.5)
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
            position = new Point(Math.random() * @config.width, Math.random() * @config.height)
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

