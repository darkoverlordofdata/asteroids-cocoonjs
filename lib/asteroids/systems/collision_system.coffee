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
      contact = @collisions.pop()
      switch (contact.type)
        when BulletHitAsteroid
          do (bullet=contact.a, asteroid=contact.b) =>
            if (bullet.get(Physics)?) # already been killed?
              @creator.destroyEntity bullet
              PhysicsSystem.deadPool.push(bullet.get(Physics).body)

            if (asteroid.get(Physics)?) # already been killed?
              radius = asteroid.get(Collision).radius
              position = asteroid.get(Position).position
              if (radius > 10)
                @creator.createAsteroid(radius - 10, position.x + Math.random() * 10 - 5, position.y + Math.random() * 10 - 5)
                @creator.createAsteroid(radius - 10, position.x + Math.random() * 10 - 5, position.y + Math.random() * 10 - 5)
              body = asteroid.get(Physics).body
              asteroid.get(Asteroid).fsm.changeState('destroyed')
              asteroid.get(DeathThroes).body = body
              #asteroid.get(Audio).play(ExplodeAsteroid)
              if (@games.head)
                @games.head.state.hits++
            return

        when AsteroidHitShip
          do (asteroid=contact.a, spaceship=contact.b) =>
            if (spaceship.get(Physics)?) # already been killed?
              body = spaceship.get(Physics).body
              spaceship.get(Spaceship).fsm.changeState('destroyed')
              spaceship.get(DeathThroes).body = body
              #asteroid.get(Audio).play(ExplodeShip)
              if (@games.head)
                @games.head.state.lives--

            return
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
   * filter the event and collisions up valid combinations
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

