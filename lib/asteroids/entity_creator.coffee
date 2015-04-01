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
# EntityCreator
#
class EntityCreator

  ASTEROID_DENSITY        : localStorage.asteroidDensity          ? 1.0
  ASTEROID_FRICTION       : localStorage.asteroidFriction         ? 1.0
  ASTEROID_RESTITUTION    : localStorage.asteroidRestitution      ? 0.2
  ASTEROID_DAMPING        : localStorage.asteroidDamping          ? 0.0
  ASTEROID_LINEAR         : localStorage.asteroidLinearVelocity   ? 4.0
  ASTEROID_ANGULAR        : localStorage.asteroidAngularVelocity  ? 2.0

  SPACESHIP_DENSITY       : localStorage.spaceshipDensity         ? 1.0
  SPACESHIP_FRICTION      : localStorage.spaceshipFriction        ? 1.0
  SPACESHIP_RESTITUTION   : localStorage.spaceshipRestitution     ? 0.2
  SPACESHIP_DAMPING       : localStorage.spaceshipDamping         ? 0.75

  BULLET_DENSITY          : localStorage.bulletDensity            ? 1.0
  BULLET_FRICTION         : localStorage.bulletFriction           ? 1.0
  BULLET_RESTITUTION      : localStorage.bulletRestitution        ? 0.2
  BULLET_DAMPING          : localStorage.bulletDamping            ? 0.0
  BULLET_LINEAR           : localStorage.bulletLinearVelocity     ? 150.0

  LEFT                    : KeyPoll.KEY_LEFT
  RIGHT                   : KeyPoll.KEY_RIGHT
  THRUST                  : KeyPoll.KEY_UP
  FIRE                    : KeyPoll.KEY_Z
  WARP                    : KeyPoll.KEY_SPACE

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

  game            : null  # Phaser.io
  engine          : null  # Ash Engine
  world           : null  # Box2D World
  waitEntity      : null
  bulletId        : 0
  asteroidId      : 0
  spaceshipId     : 0

  constructor: (@game, @engine, @world, @config) ->

  destroyEntity: (entity) ->
    @engine.removeEntity entity
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
    @engine.addEntity gameEntity
    return gameEntity

  ###
   * Start...
  ###
  createWaitForClick: () ->
#    if not @waitEntity
    waitView = new WaitForStartView(@game)
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
    v1 = (rnd.nextDouble() - 0.5) * @ASTEROID_LINEAR * (50 - radius) * 2
    v2 = (rnd.nextDouble() - 0.5) * @ASTEROID_LINEAR * (50 - radius) * 2

    bodyDef.linearVelocity.Set(v1, v2)
    bodyDef.angularVelocity = rnd.nextDouble() * @ASTEROID_ANGULAR - 1
    bodyDef.linearDamping = @ASTEROID_DAMPING

    fixDef = new b2FixtureDef()
    fixDef.density = @ASTEROID_DENSITY
    fixDef.friction = @ASTEROID_FRICTION
    fixDef.restitution = @ASTEROID_RESTITUTION
    fixDef.shape = new b2CircleShape(radius)

    body = @world.CreateBody(bodyDef)
    body.CreateFixture(fixDef)

    ###
     * Asteroid entity
    ###
    asteroid = new Entity()
    fsm = new EntityStateMachine(asteroid)

    liveView = new AsteroidView(@game, radius)
    fsm.createState('alive')
    .add(Physics).withInstance(new Physics(body))
    .add(Collision).withInstance(new Collision(radius))
    .add(Display).withInstance(new Display(liveView))

    deathView = new AsteroidDeathView(@game, radius)
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
    bodyDef.linearDamping = @SPACESHIP_DAMPING

    fixDef = new b2FixtureDef()
    fixDef.density = @SPACESHIP_DENSITY
    fixDef.friction = @SPACESHIP_FRICTION
    fixDef.restitution = @SPACESHIP_RESTITUTION
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

    deathView = new SpaceshipDeathView(@game)
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
    bodyDef.linearVelocity.Set(cos * @BULLET_LINEAR, sin * @BULLET_LINEAR)
    bodyDef.angularVelocity = 0
    bodyDef.linearDamping = @BULLET_DAMPING

    fixDef = new b2FixtureDef()
    fixDef.density = @BULLET_DENSITY
    fixDef.friction = @BULLET_FRICTION
    fixDef.restitution = @BULLET_RESTITUTION
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

    body.SetUserData(type: 'bullet', entity: bullet)
    @engine.addEntity(bullet)

    return bullet


