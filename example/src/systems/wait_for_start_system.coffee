'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

WaitForStartNode        = asteroids.nodes.WaitForStartNode
AsteroidCollisionNode   = asteroids.nodes.AsteroidCollisionNode
GameNode                = asteroids.nodes.GameNode

class asteroids.systems.WaitForStartSystem extends ash.core.System

  engine      : null  # Engine
  creator     : null  # EntityCreator
  gameNodes   : null  # NodeList
  waitNodes   : null  # NodeList
  asteroids   : null  # NodeList

  constructor: (@creator) ->

  addToEngine: (engine) ->
    @engine = engine
    @waitNodes = engine.getNodeList(WaitForStartNode)
    @gameNodes = engine.getNodeList(GameNode)
    @asteroids = engine.getNodeList(AsteroidCollisionNode)
    return # Void

  removeFromEngine: (engine) ->
    @waitNodes = null
    @gameNodes = null
    return # Void

  update: (time) =>
    node = @waitNodes.head
    game = @gameNodes.head

    if (node and node.wait.startGame and game)
      asteroid = @asteroids.head
      while asteroid
        @creator.destroyEntity(asteroid.entity)
        asteroid = asteroid.next

      game.state.setForStart()
      node.wait.startGame = false
      @engine.removeEntity(node.entity)
    return # Void
