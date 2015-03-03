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
'use strict'
ash = require('../../lib')
asteroids = require('../../example')

AnimationSystem       = asteroids.systems.AnimationSystem
AudioSystem           = asteroids.systems.AudioSystem
BulletAgeSystem       = asteroids.systems.BulletAgeSystem
CollisionSystem       = asteroids.systems.CollisionSystem
DeathThroesSystem     = asteroids.systems.DeathThroesSystem
GameManager           = asteroids.systems.GameManager
GunControlSystem      = asteroids.systems.GunControlSystem
HudSystem             = asteroids.systems.HudSystem
MotionControlSystem   = asteroids.systems.MotionControlSystem
MovementSystem        = asteroids.systems.MovementSystem
RenderSystem          = asteroids.systems.RenderSystem
SystemPriorities      = asteroids.systems.SystemPriorities
WaitForStartSystem    = asteroids.systems.WaitForStartSystem
PhysicsSystem         = asteroids.systems.PhysicsSystem


GameState             = asteroids.components.GameState
EntityCreator         = asteroids.EntityCreator
GameConfig            = asteroids.GameConfig
KeyPoll               = asteroids.input.KeyPoll

class asteroids.Asteroids

  container       : null #  DisplayObjectContainer
  engine          : null #  Engine
  tickProvider    : null #  FrameTickProvider
  creator         : null #  EntityCreator
  keyPoll         : null #  KeyPoll
  config          : null #  GameConfig

  constructor: (@container, width, height) ->

    @prepare(width, height)

  prepare: (width, height) ->

    @engine = new ash.core.Engine()
    @creator = new EntityCreator(@engine, @container, @world)
    @keyPoll = new KeyPoll(window)
    @config = new GameConfig()
    @config.height = height
    @config.width = width

    @engine.addSystem(new WaitForStartSystem(@creator), SystemPriorities.preUpdate );
    @engine.addSystem(new GameManager(@creator, @config), SystemPriorities.preUpdate)
    @engine.addSystem(new MotionControlSystem(@keyPoll), SystemPriorities.update)
    @engine.addSystem(new GunControlSystem(@keyPoll, @creator), SystemPriorities.update)
    @engine.addSystem(new BulletAgeSystem(@creator), SystemPriorities.update)
    @engine.addSystem(new DeathThroesSystem(@creator), SystemPriorities.update)
    @engine.addSystem(new MovementSystem(@config), SystemPriorities.move)
    @engine.addSystem(new CollisionSystem(@creator), SystemPriorities.resolveCollisions)
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

    @tickProvider = new ash.tick.FrameTickProvider(stats)
    @tickProvider.add(@engine.update)
    @tickProvider.start()
    return

