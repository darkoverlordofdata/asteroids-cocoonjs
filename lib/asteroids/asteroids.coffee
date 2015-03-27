#+--------------------------------------------------------------------+
#| asteroids.coffee
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
# Asteroids
#
class Asteroids

  width             = window.innerWidth
  height            = window.innerHeight
  scale             = window.devicePixelRatio

  b2Vec2            = Box2D.Common.Math.b2Vec2
  b2World           = Box2D.Dynamics.b2World

  Engine            = ash.core.Engine
  FrameTickProvider = ash.tick.FrameTickProvider

  game              : null  #  Phaser.io game object
  engine            : null  #  Ash Engine
  tickProvider      : null  #  FrameTickProvider
  creator           : null  #  EntityCreator
  keyPoll           : null  #  KeyPoll
  config            : null  #  GameConfig
  world             : null  #  b2World
  background        : null  #  background image
  physics           : null  #  physics system
  playMusic         : localStorage.playMusic
  playSfx           : localStorage.playSfx
  optBgd            : localStorage.background || 'blue'
  bgdColor          : 0x6A5ACD

  constructor: (@stats) ->
    @game = new Phaser.Game(width * scale, height * scale, Phaser.CANVAS, '',
      init: @init, preload: @preload, create: @create)

  ###
   * Configure Phaser scaling
  ###
  init: =>
    @game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    @game.scale.minWidth = width * scale
    @game.scale.minHeight = height * scale
    @game.scale.maxWidth = width * scale
    @game.scale.maxHeight = height * scale
    @game.scale.pageAlignVertically = true
    @game.scale.pageAlignHorizontally = true
    return

  ###
   * Load assets
  ###
  preload: =>
    @game.load.image 'background', 'res/starfield.png'
    @game.load.image 'leaderboard', 'res/icons/b_Leaderboard.png'
    @game.load.image 'more', 'res/icons/b_More1.png'
    @game.load.image 'parameters', 'res/icons/b_Parameters.png'
    @game.load.image 'round', 'res/round.png'
    @game.load.image 'square', 'res/square.png'
    @game.load.audio 'asteroid', [ExplodeAsteroid::src]
    @game.load.audio 'ship', [ExplodeShip::src]
    @game.load.audio 'shoot', [ShootGun::src]
    return

  ###
   * Start the game
  ###
  create: =>

    ExplodeAsteroid.audio = @game.add.audio('asteroid')
    ExplodeAsteroid.audio.play('', 0, 0)
    ExplodeShip.audio = @game.add.audio('ship')
    ExplodeShip.audio.play('', 0, 0)
    ShootGun.audio = @game.add.audio('shoot')
    ShootGun.audio.play('', 0, 0)

    @background = @game.add.sprite(0, 0, 'background')
    @background.width = width
    @background.height = height
    @game.stage.backgroundColor = @bgdColor

    ###
     * Options:
    ###
    @game.add.button width - 50, 50, 'parameters',
      => Cocoon.App.loadInTheWebView("options.html")
    @game.add.button width - 50, 125, 'leaderboard',
      => Cocoon.App.loadInTheWebView("leaders.html")
    @game.add.button width - 50, 200, 'more',
      => Cocoon.App.loadInTheWebView("more.html")

    Cocoon.App.WebView.on "load",
      success : =>
        @pause(true)
        Cocoon.App.showTheWebView()
      error : =>
        console.log("Cannot show the Webview for some reason :/")
        console.log(JSON.stringify(arguments))

    @config = new GameConfig()
    @config.height = height
    @config.width = width


    @world = new b2World(new b2Vec2(0 ,0), true) # Zero-G physics
    @engine = new Engine()
    @creator = new EntityCreator(@game, @engine, @world, @config)
    @keyPoll = new KeyPoll(@game, @config)

    @engine.addSystem(new WaitForStartSystem(@creator), SystemPriorities.preUpdate)
    @engine.addSystem(new GameManager(@creator, @config), SystemPriorities.preUpdate)
    @engine.addSystem(new PhysicsControlSystem(@keyPoll), SystemPriorities.update)
    @engine.addSystem(new GunControlSystem(@keyPoll, @creator), SystemPriorities.update)
    @engine.addSystem(new BulletAgeSystem(@creator), SystemPriorities.update)
    @engine.addSystem(new DeathThroesSystem(@creator), SystemPriorities.update)
    @engine.addSystem(@physics = new PhysicsSystem(@config, @world), SystemPriorities.move)
    @engine.addSystem(new CollisionSystem(@world, @creator), SystemPriorities.resolveCollisions)
    @engine.addSystem(new AnimationSystem(), SystemPriorities.animate)
    @engine.addSystem(new HudSystem(), SystemPriorities.animate)
    @engine.addSystem(new RenderSystem(), SystemPriorities.render)
    @engine.addSystem(new AudioSystem(), SystemPriorities.render)

    @creator.createWaitForClick()
    @creator.createGame()
    ###
     * We'll use Ash to run the game loop
     * Phaser will tend to it's own.
    ###
    @tickProvider = new FrameTickProvider(@stats)
    @tickProvider.add(@engine.update)
    @tickProvider.start()
    return

  pause: (bValue) =>
    @physics.enabled = not bValue
    return

  setBackground: (value) =>
    if value is 1
      @background.alpha = 1.0
      @optBgd = 'star'
      localStorage.background = 'star'
    else
      @background.alpha = 0.0
      @optBgd = 'blue'
      localStorage.background = 'blue'
    return

  setPlayMusic: (value) =>
    @playMusic = value
    localStorage.playMusic = value
    return

  setPlaySfx: (value) =>
    @playSfx = value
    Sound.volume = value/100
    localStorage.playSfx = value
    return
