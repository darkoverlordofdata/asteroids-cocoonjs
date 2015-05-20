#+--------------------------------------------------------------------+
#| entity_creator.coffee
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2015
#+--------------------------------------------------------------------+
#|
#| This file is a part of asteroids.coffee
#|
#| asteroids.coffee is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
#
# Entities
#
class Entities

  ###
   * Imports
  ###
  Animation           = Components.Animation
  Asteroid            = Components.Asteroid
  Audio               = Components.Audio
  Bullet              = Components.Bullet
  Collision           = Components.Collision
  DeathThroes         = Components.DeathThroes
  Display             = Components.Display
  GameState           = Components.GameState
  Gun                 = Components.Gun
  GunControls         = Components.GunControls
  Hud                 = Components.Hud
  MotionControls      = Components.MotionControls
  Physics             = Components.Physics
  Position            = Components.Position
  Spaceship           = Components.Spaceship
  WaitForStart        = Components.WaitForStart
  Entity              = ash.core.Entity
  EntityStateMachine  = ash.fsm.EntityStateMachine

  @ASTEROID           : 1
  @SPACESHIP          : 2
  @BULLET             : 3

  LEFT                : KeyPoll.KEY_LEFT
  RIGHT               : KeyPoll.KEY_RIGHT
  THRUST              : KeyPoll.KEY_UP
  FIRE                : KeyPoll.KEY_Z
  WARP                : KeyPoll.KEY_SPACE


  get = (prop) -> parseFloat(asteroids.get(prop))
     

  ###
   * Box2D classes
  ###
  b2Body                = Box2D.Dynamics.b2Body
  b2BodyDef             = Box2D.Dynamics.b2BodyDef
  b2CircleShape         = Box2D.Collision.Shapes.b2CircleShape
  b2FixtureDef          = Box2D.Dynamics.b2FixtureDef
  b2PolygonShape        = Box2D.Collision.Shapes.b2PolygonShape
  b2Vec2                = Box2D.Common.Math.b2Vec2

  game            : null  # Phaser.io
  ash             : null  # Ash Engine
  world           : null  # Box2D World
  waitEntity      : null
  rnd             : null
  bulletId        : 0
  asteroidId      : 0
  spaceshipId     : 0

  constructor: (@parent) ->
    @game = @parent.game
    @ash = @parent.ash
    @world = @parent.world
    @rnd = @parent.rnd

  destroyEntity: (entity) ->
    @ash.removeEntity entity
    return

  ###
   * Game State
  ###
  createGame: () ->
    hud = new HudView(@game)
    gameEntity = new Entity('game')
    .add(new GameState())
    .add(new Hud(hud))
    .add(new Display(hud))
    .add(new Position(0, 0, 0, 0))
    @ash.addEntity gameEntity
    return gameEntity

  ###
   * Start...
  ###
  createWaitForClick: () ->
    #    if not @waitEntity
    waitView = new WaitForStartView(@game, @parent)
    @waitEntity = new Entity('wait')
    .add(new WaitForStart(waitView))
    .add(new Display(waitView))
    .add(new Position(0, 0, 0, 0))

    @waitEntity.get(WaitForStart).startGame = false
    @ash.addEntity(@waitEntity)
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
    v1 = (@rnd.nextDouble() - 0.5) * get('asteroidLinearVelocity') * (50 - radius)
    v2 = (@rnd.nextDouble() - 0.5) * get('asteroidLinearVelocity') * (50 - radius)

    bodyDef.linearVelocity.Set(v1, v2)
    bodyDef.angularVelocity = @rnd.nextDouble() * get('asteroidAngularVelocity') - 1
    bodyDef.linearDamping = get('asteroidDamping')

    fixDef = new b2FixtureDef()
    fixDef.density = get('asteroidDensity')
    fixDef.friction = get('asteroidFriction')
    fixDef.restitution = get('asteroidRestitution')
    fixDef.shape = new b2CircleShape(radius)

    body = @world.CreateBody(bodyDef)
    body.CreateFixture(fixDef)

    ###
     * Asteroid entity
    ###
    asteroid = new Entity()
    fsm = new EntityStateMachine(asteroid)

    liveView = new AsteroidView(@parent, radius)
    fsm.createState('alive')
    .add(Physics).withInstance(new Physics(body))
    .add(Collision).withInstance(new Collision(radius))
    .add(Display).withInstance(new Display(liveView))

    deathView = new AsteroidDeathView(@parent, radius)
    fsm.createState('destroyed')
    .add(DeathThroes).withInstance(new DeathThroes(3))
    .add(Display).withInstance(new Display(deathView))
    .add(Animation).withInstance(new Animation(deathView))

    asteroid
    .add(new Asteroid(fsm))
    .add(new Position(x, y, 0))
    .add(new Audio())

    body.SetUserData(type: Entities.ASTEROID, entity: asteroid)
    fsm.changeState('alive')
    @ash.addEntity asteroid
    return asteroid

  ###
   * Create Player Spaceship with FSM Animation
  ###
  createSpaceship: =>

    x = @rnd.nextInt(@parent.width)
    y = @rnd.nextInt(@parent.height)
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
    bodyDef.linearDamping = get('spaceshipDamping')

    fixDef = new b2FixtureDef()
    fixDef.density = get('spaceshipDensity')
    fixDef.friction = get('spaceshipFriction')
    fixDef.restitution = get('spaceshipRestitution')
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


    liveView = new SpaceshipView(@game)
    fsm.createState('playing')
    .add(Physics).withInstance(new Physics(body))
    .add(MotionControls).withInstance(new MotionControls(@LEFT, @RIGHT, @THRUST, @WARP, 100, 3))
    .add(Gun).withInstance(new Gun(8, 0, 0.3, 2 ))
    .add(GunControls).withInstance(new GunControls(@FIRE))
    .add(Collision).withInstance(new Collision(9))
    .add(Display).withInstance(new Display(liveView))

    deathView = new SpaceshipDeathView(@parent)
    fsm.createState('destroyed')
    .add(DeathThroes).withInstance(new DeathThroes(5))
    .add(Display).withInstance(new Display(deathView))
    .add(Animation).withInstance(new Animation(deathView))

    spaceship
    .add(new Spaceship(fsm))
    .add(new Position(x, y, 0))
    .add(new Audio())

    body.SetUserData(type: Entities.SPACESHIP, entity: spaceship)
    fsm.changeState('playing')
    @ash.addEntity spaceship

    return spaceship


  ###
   * Create a Bullet
  ###
  createUserBullet: (gun, parentPosition) =>

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
    bodyDef.bullet = true
    bodyDef.position.x = x
    bodyDef.position.y = y
    bodyDef.linearVelocity.Set(cos * get('bulletLinearVelocity'), sin * get('bulletLinearVelocity'))
    bodyDef.angularVelocity = 0
    bodyDef.linearDamping = get('bulletDamping')

    fixDef = new b2FixtureDef()
    fixDef.density = get('bulletDensity')
    fixDef.friction = get('bulletFriction')
    fixDef.restitution = get('bulletRestitution')
    fixDef.shape = new b2CircleShape(0)

    body = @world.CreateBody(bodyDef)
    body.CreateFixture(fixDef)

    ###
     * Bullet entity
    ###
    bulletView = new BulletView(@game)
    bullet = new Entity()
    .add(new Bullet(gun.bulletLifetime))
    .add(new Position(x, y, 0))
    .add(new Collision(0))
    .add(new Physics(body))
    .add(new Display(bulletView))

    body.SetUserData(type: Entities.BULLET, entity: bullet)
    @ash.addEntity(bullet)

    return bullet


