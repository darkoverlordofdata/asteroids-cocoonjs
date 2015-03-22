
class CollisionSystem extends ash.core.System #implements b2ContactListener

  b2ContactListener         = Box2D.Dynamics.b2ContactListener

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
          a.get(Display).graphic.dispose()
          PhysicsSystem.deadPool.push(a.get(Physics).body)

        if (b.get(Physics)?) # already been killed?
          radius = b.get(Collision).radius
          position = b.get(Position).position
          if (radius > 10)
            @creator.createAsteroid(radius - 10, position.x + rnd.nextDouble() * 10 - 5, position.y + rnd.nextDouble() * 10 - 5)
            @creator.createAsteroid(radius - 10, position.x + rnd.nextDouble() * 10 - 5, position.y + rnd.nextDouble() * 10 - 5)
          body = b.get(Physics).body
          b.get(Display).graphic.dispose()
          b.get(Asteroid).fsm.changeState('destroyed')
          b.get(DeathThroes).body = body
          b.get(Audio).play(ExplodeAsteroid)
          if (@games.head)
            @games.head.state.hits++

      else if (type is AsteroidHitShip)

        if (b.get(Physics)?) # already been killed?
          body = b.get(Physics).body
          b.get(Display).graphic.dispose()
          b.get(Spaceship).fsm.changeState('destroyed')
          b.get(DeathThroes).body = body
          # todo: ExplodeShip
          b.get(Audio).play(ExplodeShip)
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

