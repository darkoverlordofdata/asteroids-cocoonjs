'use strict'
ash = require('ash.coffee')
asteroids = require('../../index')

GameNode                  = asteroids.nodes.GameNode
PhysicsSystem             = asteroids.systems.PhysicsSystem
Asteroid                  = asteroids.components.Asteroid
Spaceship                 = asteroids.components.Spaceship
DeathThroes               = asteroids.components.DeathThroes
Physics                   = asteroids.components.Physics
Collision                 = asteroids.components.Collision
Position                  = asteroids.components.Position
Point                     = asteroids.ui.Point
System                    = ash.core.System
b2ContactListener         = Box2D.Dynamics.b2ContactListener

class asteroids.systems.CollisionSystem extends System #implements b2ContactListener

  BulletHitAsteroid = 1
  AsteroidHitShip = 2


  world           : null #  b2World
  creator         : null #  EntityCreator
  games           : null #  NodeList
  collisions      : null #  collision que

  constructor: (@world, @creator) ->
    @collisions = []
    @world.SetContactListener(this)

  update:(time) =>
    while @collisions.length
      {type, a, b} = @collisions.pop()

      if (type is BulletHitAsteroid)

        if (a.get(Physics)?) # already been killed?
          @creator.destroyEntity a
          PhysicsSystem.deadPool.push(a.get(Physics).body)

        if (b.get(Physics)?) # already been killed?
          radius = b.get(Collision).radius
          position = b.get(Position).position
          if (radius > 10)
            @creator.createAsteroid(radius - 10, position.x + Math.random() * 10 - 5, position.y + Math.random() * 10 - 5)
            @creator.createAsteroid(radius - 10, position.x + Math.random() * 10 - 5, position.y + Math.random() * 10 - 5)
          body = b.get(Physics).body
          b.get(Asteroid).fsm.changeState('destroyed')
          b.get(DeathThroes).body = body
          if (@games.head)
            @games.head.state.hits++

      else if (type is AsteroidHitShip)

        if (b.get(Physics)?) # already been killed?
          body = b.get(Physics).body
          b.get(Spaceship).fsm.changeState('destroyed')
          b.get(DeathThroes).body = body
          if (@games.head)
            @games.head.state.lives--

    return

  addToEngine: (engine) ->
    @games = engine.getNodeList(GameNode)
    return # Void

  removeFromEngine: (engine) ->
    @games = null
    return # Void

  ###
   * b2ContactListener Interface
   *
   * filter/reduce the events and que them up
  ###
  BeginContact: (contact) =>

    a = contact.GetFixtureA().GetBody().GetUserData()
    b = contact.GetFixtureB().GetBody().GetUserData()

    switch (a.type)
      when 'asteroid'
        switch(b.type)
          when 'bullet'
            @collisions.push(type: BulletHitAsteroid, a: b.entity, b: a.entity)
          when 'spaceship'
            @collisions.push(type: AsteroidHitShip, a: a.entity, b: b.entity)
      when 'bullet'
        if (b.type is 'asteroid')
          @collisions.push(type: BulletHitAsteroid, a: a.entity, b: b.entity)

      when 'spaceship'
        if (b.type is 'asteroid')
          @collisions.push(type: AsteroidHitShip, a: b.entity, b: a.entity)
    return
    ###
     * type:
     * 1 - bullet hits asteroid
     * 2 - asteroid hits spaceship
    ###

  EndContact: (contact) =>
    return

  PreSolve: (contact, oldManifold) =>
    return

  PostSolve: (contact, impulse) =>
    return

