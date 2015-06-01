
class CollisionSystem extends ash.core.System #implements b2ContactListener

  ###
   * Imports
  ###
  Asteroid            = Components.Asteroid
  Audio               = Components.Audio
  Collision           = Components.Collision
  DeathThroes         = Components.DeathThroes
  Display             = Components.Display
  Physics             = Components.Physics
  Position            = Components.Position
  Spaceship           = Components.Spaceship
  b2ContactListener   = Box2D.Dynamics.b2ContactListener

  BulletHitAsteroid   = 1
  AsteroidHitShip     = 2


  world               : null #  b2World
  entities             : null #  Entities
  games               : null #  NodeList
  rnd                 : null
  collisions          : null #  collision que
  PhysicsSystem       : null

  constructor: (parent, @PhysicsSystem) ->
    @world = parent.world
    @entities = parent.entities
    @rnd = parent.rnd
    @components = parent.ash.components
    @collisions = []
    @world.SetContactListener(this)

  update:(time) =>

    while @collisions.length
      {type, a, b} = @collisions.pop()

      if (type is BulletHitAsteroid)

        if (a.get(Physics)?) # already been killed?
          @entities.destroyEntity a
          a.get(Display).graphic.dispose()
          @PhysicsSystem.deadPool.push(a.get(Physics).body)

        if (b.get(Physics)?) # already been killed?
          radius = b.get(Collision).radius
          position = b.get(Position).position
          points = switch radius
            when 30 then 20   # large
            when 20 then 50   # medium
            when 10 then 100  # small
            else 0

          if (radius > 10)
            @entities.createAsteroid(radius - 10, position.x + @rnd.nextDouble() * 10 - 5, position.y + @rnd.nextDouble() * 10 - 5)
            @entities.createAsteroid(radius - 10, position.x + @rnd.nextDouble() * 10 - 5, position.y + @rnd.nextDouble() * 10 - 5)
          body = b.get(Physics).body
          b.get(Display).graphic.dispose()
          b.get(Asteroid).fsm.changeState('destroyed')
          b.get(DeathThroes).body = body
          b.get(Audio).play(ExplodeAsteroid)
          if (@games.head)
            @games.head.state.hits += points
            @games.head.state.bonus += points
            while (@games.head.state.bonus > 5000)
              @games.head.state.lives++
              @games.head.state.bonus -= 5000


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
    @games = engine.getNodeList(Nodes.GameNode)
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
      when Entities.ASTEROID
        switch(b.type)
          when Entities.BULLET
            @collisions.push(type: BulletHitAsteroid, a: b.entity, b: a.entity)
          when Entities.SPACESHIP
            @collisions.push(type: AsteroidHitShip, a: a.entity, b: b.entity)
      when Entities.BULLET
        if (b.type is Entities.ASTEROID)
          @collisions.push(type: BulletHitAsteroid, a: a.entity, b: b.entity)

      when Entities.SPACESHIP
        if (b.type is Entities.ASTEROID)
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

