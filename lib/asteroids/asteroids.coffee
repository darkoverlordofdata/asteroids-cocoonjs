#+--------------------------------------------------------------------+
#| asteroids.coffee
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
# Asteroids
#
class Asteroids

  b2Vec2                = Box2D.Common.Math.b2Vec2
  b2World               = Box2D.Dynamics.b2World
  b2DebugDraw           = Box2D.Dynamics.b2DebugDraw

  Engine                = ash.core.Engine
  FrameTickProvider     = ash.tick.FrameTickProvider

  container       : null #  DisplayObjectContainer
  engine          : null #  Engine
  tickProvider    : null #  FrameTickProvider
  creator         : null #  EntityCreator
  keyPoll         : null #  KeyPoll
  config          : null #  GameConfig
  world           : null #  B2World

  constructor: (@container, width, height) ->

    @prepare(width, height)

  prepare: (width, height) ->

    @config = new GameConfig()
    @config.height = height
    @config.width = width

    @world = new b2World(new b2Vec2(0 ,0), true) # Zero-G physics
    @engine = new Engine()
    @creator = new EntityCreator(@engine, @world, @config)
    @keyPoll = new KeyPoll(window)

    @engine.addSystem(new WaitForStartSystem(@creator), SystemPriorities.preUpdate );
    @engine.addSystem(new GameManager(@creator, @config), SystemPriorities.preUpdate)
    @engine.addSystem(new PhysicsControlSystem(@keyPoll), SystemPriorities.update)
    @engine.addSystem(new GunControlSystem(@keyPoll, @creator), SystemPriorities.update)
    @engine.addSystem(new BulletAgeSystem(@creator), SystemPriorities.update)
    @engine.addSystem(new DeathThroesSystem(@creator), SystemPriorities.update)
    @engine.addSystem(new PhysicsSystem(@config, @world), SystemPriorities.move)
    @engine.addSystem(new CollisionSystem(@world, @creator), SystemPriorities.resolveCollisions)
    @engine.addSystem(new AnimationSystem(), SystemPriorities.animate);
    @engine.addSystem(new HudSystem(), SystemPriorities.animate);
    @engine.addSystem(new RenderSystem(@container), SystemPriorities.render)
    @engine.addSystem(new AudioSystem(), SystemPriorities.render);

    @creator.createWaitForClick()
    @creator.createGame()
    return

  start: ->

    if navigator.isCocoonJS
      stats = null
    else
      x = Math.floor(@config.width/2)-40
      y = 0
      stats = new Stats()
      stats.setMode 0
      stats.domElement.style.position = "absolute"
      stats.domElement.style.left = "#{x}px"
      stats.domElement.style.top = "#{y}px"
      document.body.appendChild stats.domElement

    @tickProvider = new FrameTickProvider(stats)
    @tickProvider.add(@engine.update)
    @tickProvider.start()
    return


  @main: ->
    window.rnd = new MersenneTwister
    canvas = document.createElement(if navigator.isCocoonJS then 'screencanvas' else 'canvas')
    canvas.width  = window.innerWidth*window.devicePixelRatio
    canvas.height = window.innerHeight*window.devicePixelRatio
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.backgroundColor = '#6A5ACD'
    document.body.appendChild(canvas)
    asteroids = new Asteroids(canvas.getContext('2d'), canvas.width, canvas.height)
    asteroids.start()
    return
