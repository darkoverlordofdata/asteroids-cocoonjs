'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

SpaceshipCollisionNode    = asteroids.nodes.SpaceshipCollisionNode
AsteroidCollisionNode     = asteroids.nodes.AsteroidCollisionNode
BulletCollisionNode       = asteroids.nodes.BulletCollisionNode
GameNode                  = asteroids.nodes.GameNode

class asteroids.systems.CollisionSystem extends ash.core.System

  creator         : null #  EntityCreator
  games           : null #  NodeList
  spaceships      : null #  NodeList
  asteroids       : null #  NodeList
  bullets         : null #  NodeList

  constructor: (@creator) ->

  addToEngine: (engine) ->
    @games        = engine.getNodeList(GameNode)
    @spaceships   = engine.getNodeList(SpaceshipCollisionNode)
    @asteroids    = engine.getNodeList(AsteroidCollisionNode)
    @bullets      = engine.getNodeList(BulletCollisionNode)
    return # Void

  removeFromEngine: (engine) ->
    @games        = null
    @spaceships   = null
    @asteroids    = null
    @bullets      = null
    return # Void

  update: (time) =>

    bullet = @bullets.head
    while bullet
      asteroid = @asteroids.head
      while asteroid
        if asteroid.position.position.distanceTo(bullet.position.position) <= asteroid.collision.radius
          ###
           You hit an asteroid
          ###
          @creator.destroyEntity bullet.entity
          if (asteroid.collision.radius > 10)
            @creator.createAsteroid(asteroid.collision.radius - 10, asteroid.position.position.x + Math.random() * 10 - 5, asteroid.position.position.y + Math.random() * 10 - 5)
            @creator.createAsteroid(asteroid.collision.radius - 10, asteroid.position.position.x + Math.random() * 10 - 5, asteroid.position.position.y + Math.random() * 10 - 5)
          asteroid.asteroid.fsm.changeState('destroyed')
          #asteroid.audio.play(ExplodeAsteroid)
          if (@games.head)
            @games.head.state.hits++
          break

        asteroid = asteroid.next
      bullet = bullet.next

    spaceship = @spaceships.head
    while spaceship
      asteroid = @asteroids.head
      while asteroid
        if asteroid.position.position.distanceTo(spaceship.position.position) <= asteroid.collision.radius + spaceship.collision.radius
          ###
           You were hit
          ###
          spaceship.spaceship.fsm.changeState('destroyed')
          #asteroid.audio.play(ExplodeShip)
          if (@games.head)
            @games.head.state.lives--
          break

        asteroid = asteroid.next
      spaceship = spaceship.next

    return # Void
