#+--------------------------------------------------------------------+
#| asteroids.coffee
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2015
#+--------------------------------------------------------------------+
#|
#| This file is a part of asteroids.coffee
#|
#| ash.coffee is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
#
# Asteroids
#
class Asteroids

  b2Vec2                = Box2D.Common.Math.b2Vec2
  b2World               = Box2D.Dynamics.b2World
  b2DebugDraw           = Box2D.Dynamics.b2DebugDraw

  Engine                = ash.core.Engine
  FrameTickProvider     = ash.tick.FrameTickProvider

  engine          : null #  Engine
  tickProvider    : null #  FrameTickProvider
  creator         : null #  EntityCreator
  keyPoll         : null #  KeyPoll
  config          : null #  GameConfig
  world           : null #  B2World
  stage           : null #  Display container
  renderer        : null #

  assets: ['res/starfield.png', 'res/+.png', 'res/-.png']


  start: (canvas, stats) ->

    width = canvas.width
    height = canvas.height
    @stage = new PIXI.Stage(0x6A5ACD)
    @renderer = new PIXI.CanvasRenderer(width, height, view:canvas)

    bgd = PIXI.Sprite.fromImage('res/starfield.png')
    bgd.width = window.innerWidth * window.devicePixelRatio
    bgd.height = window.innerHeight * window.devicePixelRatio
    @stage.addChild(bgd)

    @config = new GameConfig()
    @config.height = height
    @config.width = width

    @world = new b2World(new b2Vec2(0 ,0), true) # Zero-G physics
    @engine = new Engine()
    @creator = new EntityCreator(@engine, @world, @config, @stage)
    @keyPoll = new KeyPoll(window)

    @engine.addSystem(new WaitForStartSystem(@creator), SystemPriorities.preUpdate)
    @engine.addSystem(new GameManager(@creator, @config), SystemPriorities.preUpdate)
    @engine.addSystem(new PhysicsControlSystem(@keyPoll), SystemPriorities.update)
    @engine.addSystem(new GunControlSystem(@keyPoll, @creator), SystemPriorities.update)
    @engine.addSystem(new BulletAgeSystem(@creator), SystemPriorities.update)
    @engine.addSystem(new DeathThroesSystem(@creator), SystemPriorities.update)
    @engine.addSystem(new PhysicsSystem(@config, @world, @stage), SystemPriorities.move)
    @engine.addSystem(new CollisionSystem(@world, @creator), SystemPriorities.resolveCollisions)
    @engine.addSystem(new AnimationSystem(), SystemPriorities.animate)
    @engine.addSystem(new HudSystem(), SystemPriorities.animate)
    @engine.addSystem(new RenderSystem(@stage, @renderer), SystemPriorities.render)
    @engine.addSystem(new AudioSystem(), SystemPriorities.render)

    @creator.createWaitForClick()
    @creator.createGame()

    @tickProvider = new FrameTickProvider(stats)
    @tickProvider.add(@engine.update)
    @tickProvider.start()


