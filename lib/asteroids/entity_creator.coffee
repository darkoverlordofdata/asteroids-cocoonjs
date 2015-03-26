#+--------------------------------------------------------------------+
#| entity_creator.coffee
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2015
#+--------------------------------------------------------------------+
#|
#| This file is a part of ash.coffee
#|
#| ash.coffee is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
#
# EntityCreator
#
class EntityCreator

  Entity                = ash.core.Entity
  EntityStateMachine    = ash.fsm.EntityStateMachine

  ###
   * Box2D classes
  ###
  b2Body                = Box2D.Dynamics.b2Body
  b2BodyDef             = Box2D.Dynamics.b2BodyDef
  b2CircleShape         = Box2D.Collision.Shapes.b2CircleShape
  b2FixtureDef          = Box2D.Dynamics.b2FixtureDef
  b2PolygonShape        = Box2D.Collision.Shapes.b2PolygonShape
  b2Vec2                = Box2D.Common.Math.b2Vec2

  engine          : null  # Ash Engine
  world           : null  # Box2D World
  waitEntity      : null
  bulletId        : 0
  asteroidId      : 0
  spaceshipId     : 0

  constructor: (@engine, @world, @config) ->

  destroyEntity: (entity) ->
    @engine.removeEntity entity
    return

  ###
   * Game State
  ###
  createGame: () ->
    hud = new HudView()
    gameEntity = new Entity('game')
    .add(new GameState())
    .add(new Hud(hud))
    .add(new Display(hud))
    .add(new Position(0, 0, 0, 0))
    @engine.addEntity gameEntity
    return gameEntity

  ###
   * Start...
  ###
  createWaitForClick: () ->
#    if not @waitEntity
    waitView = new WaitForStartView()
    @waitEntity = new Entity('wait')
    .add(new WaitForStart(waitView))
    .add(new Display(waitView))
    .add(new Position(0, 0, 0, 0))

    @waitEntity.get(WaitForStart).startGame = false
    @engine.addEntity(@waitEntity)
    return @waitEntity

  ###
   * Create an Asteroid with FSM Animation
  ###
  createAsteroid: (radius, x, y) ->

    ###
     * Asteroid simulation - box2d
    ###
    bodyDef = new b2BodyDef()
    bodyDef.type = b2Body.b2_dynamicBody
    bodyDef.fixedRotation = true
    bodyDef.position.x = x
    bodyDef.position.y = y
    v1 = (rnd.nextDouble() - 0.5) * 4 * (50 - radius) * 2
    v2 = (rnd.nextDouble() - 0.5) * 4 * (50 - radius) * 2

    bodyDef.linearVelocity.Set(v1, v2)
    bodyDef.angularVelocity = rnd.nextDouble() * 2 - 1

    fixDef = new b2FixtureDef()
    fixDef.density = 1.0
    fixDef.friction = 1.0
    fixDef.restitution = 0.2
    fixDef.shape = new b2CircleShape(radius)

    body = @world.CreateBody(bodyDef)
    body.CreateFixture(fixDef)

    ###
     * Asteroid entity
    ###
    asteroid = new Entity()
    fsm = new EntityStateMachine(asteroid)

    liveView = new AsteroidView(radius)
    fsm.createState('alive')
    .add(Physics).withInstance(new Physics(body))
    .add(Collision).withInstance(new Collision(radius))
    .add(Display).withInstance(new Display(liveView))

    deathView = new AsteroidDeathView(radius)
    fsm.createState('destroyed')
    .add(DeathThroes).withInstance(new DeathThroes(3))
    .add(Display).withInstance(new Display(deathView))
    .add(Animation).withInstance(new Animation(deathView))

    asteroid
    .add(new Asteroid(fsm))
    .add(new Position(x, y, 0))
    .add(new Audio())

    body.SetUserData(type: 'asteroid', entity: asteroid)
    fsm.changeState('alive')
    @engine.addEntity asteroid
    return asteroid

  ###
   * Create Player Spaceship with FSM Animation
  ###
  createSpaceship: ->

    x = rnd.nextInt(@config.width)
    y = rnd.nextInt(@config.height)
    ###
     * Spaceship simulation
    ###
    bodyDef = new b2BodyDef()
    bodyDef.type = b2Body.b2_dynamicBody
    bodyDef.fixedRotation = false
    bodyDef.position.x = x
    bodyDef.position.y = y
    bodyDef.linearVelocity.Set(0, 0)
    bodyDef.angularVelocity = 0
    bodyDef.linearDamping = 0.75

    fixDef = new b2FixtureDef()
    fixDef.density = 1.0
    fixDef.friction = 1.0
    fixDef.restitution = 0.2
    fixDef.shape = new b2PolygonShape()
    fixDef.shape.SetAsArray([
      new b2Vec2(0.45, 0)
      new b2Vec2(-0.25, 0.25)
      new b2Vec2(-0.25, -0.25)
    ], 3)

    body = @world.CreateBody(bodyDef)
    body.CreateFixture(fixDef)

    ###
     * Spaceship entity
    ###
    spaceship = new Entity()
    fsm = new EntityStateMachine(spaceship)

    liveView = new SpaceshipView()
    fsm.createState('playing')
    .add(Physics).withInstance(new Physics(body))
    .add(MotionControls).withInstance(new MotionControls(KeyPoll.KEY_LEFT, KeyPoll.KEY_RIGHT, KeyPoll.KEY_UP, 100, 3))
    .add(Gun).withInstance(new Gun(8, 0, 0.3, 2 ))
    .add(GunControls).withInstance(new GunControls(KeyPoll.KEY_Z))
    .add(Collision).withInstance(new Collision(9))
    .add(Display).withInstance(new Display(liveView))

    deathView = new SpaceshipDeathView()
    fsm.createState('destroyed')
    .add(DeathThroes).withInstance(new DeathThroes(5))
    .add(Display).withInstance(new Display(deathView))
    .add(Animation).withInstance(new Animation(deathView))

    spaceship
    .add(new Spaceship(fsm))
    .add(new Position(x, y, 0))
    .add(new Audio())

    body.SetUserData(type: 'spaceship', entity: spaceship)
    fsm.changeState('playing')
    @engine.addEntity spaceship

    return spaceship


  ###
   * Create a Bullet
  ###
  createUserBullet: (gun, parentPosition) ->

    cos = Math.cos(parentPosition.rotation)
    sin = Math.sin(parentPosition.rotation)

    x = cos * gun.offsetFromParent.x - sin * gun.offsetFromParent.y + parentPosition.position.x
    y = sin * gun.offsetFromParent.x + cos * gun.offsetFromParent.y + parentPosition.position.y

    ###
     * Bullet simulation
    ###
    bodyDef = new b2BodyDef()
    bodyDef.type = b2Body.b2_dynamicBody
    bodyDef.fixedRotation = true
    bodyDef.position.x = x
    bodyDef.position.y = y
    bodyDef.linearVelocity.Set(cos * 150, sin * 150)
    bodyDef.angularVelocity = 0

    fixDef = new b2FixtureDef()
    fixDef.density = 1.0
    fixDef.friction = 0.0
    fixDef.restitution = 0.2
    fixDef.shape = new b2CircleShape(0)

    body = @world.CreateBody(bodyDef)
    body.CreateFixture(fixDef)

    ###
     * Bullet entity
    ###
    bulletView = new BulletView()
    bullet = new Entity()
    .add(new Bullet(gun.bulletLifetime))
    .add(new Position(x, y, 0))
    .add(new Collision(0))
    .add(new Physics(body))
    .add(new Display(bulletView))

    body.SetUserData(type: 'bullet', entity: bullet)
    @engine.addEntity(bullet)

    return bullet


