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
  faderBitmap       : null  # for screen fade
  faderSprite       : null  # for screen fade

  ###
   * Create the phaser game component
  ###
  constructor: () ->
    @game = new Phaser.Game(width * scale, height * scale, Phaser.CANVAS, '',
      init: @init, preload: @preload, create: @create)

    # show the web view when it loads
    Cocoon.App.WebView.on "load",
      success : => Cocoon.App.showTheWebView()
      error : => console.log("Cannot show the Webview: #{JSON.stringify(arguments)}")


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
    @game.load.image 'dialog', 'res/dialog-box.png'
    @game.load.image 'background', 'res/starfield.png'
    @game.load.image 'leaderboard', 'res/icons/b_Leaderboard.png'
    @game.load.image 'settings', 'res/icons/b_Parameters.png'
    @game.load.image 'round', 'res/round48.png'
    @game.load.image 'square', 'res/square48.png'
    @game.load.audio 'asteroid', [ExplodeAsteroid::src]
    @game.load.audio 'ship', [ExplodeShip::src]
    @game.load.audio 'shoot', [ShootGun::src]
    return

  ###
   * Start the game
  ###
  create: =>
    # install the profiler first
    @game.plugins.add(Phaser.Plugin.PerformanceMonitor, mode:1)

    # set the background
    @game.stage.backgroundColor = @bgdColor
    @background = @game.add.sprite(0, 0, 'background')
    @background.width = width
    @background.height = height
    @background.alpha = if @optBgd is 'blue' then 0 else 1

    # settings
    @game.add.button width - 50, 50, 'settings', =>
      @pause => Cocoon.App.loadInTheWebView("settings.html")
      return

    # leaderboard
    @game.add.button width - 50, 125, 'leaderboard', =>
      @pause => Cocoon.App.loadInTheWebView("settings.html")
      return

    ExplodeAsteroid.audio = @game.add.audio('asteroid')
    ExplodeAsteroid.audio.play('', 0, 0)
    ExplodeShip.audio = @game.add.audio('ship')
    ExplodeShip.audio.play('', 0, 0)
    ShootGun.audio = @game.add.audio('shoot')
    ShootGun.audio.play('', 0, 0)

    @config = new GameConfig()
    @config.height = height
    @config.width = width

    @keyPoll = new KeyPoll(@game, @config)
    @engine = @game.plugins.add(ash.core.PhaserEngine)
    @world = new b2World(new b2Vec2(0 ,0), true) # Zero-G physics
    @creator = new EntityCreator(@game, @engine, @world, @config)

    @engine.addSystem(new WaitForStartSystem(@creator), SystemPriorities.preUpdate)
    @engine.addSystem(new GameManager(@creator, @config), SystemPriorities.preUpdate)
    @engine.addSystem(new PhysicsControlSystem(@keyPoll, @config), SystemPriorities.update)
    @engine.addSystem(new GunControlSystem(@keyPoll, @creator), SystemPriorities.update)
    @engine.addSystem(new BulletAgeSystem(@creator), SystemPriorities.update)
    @engine.addSystem(new DeathThroesSystem(@creator), SystemPriorities.update)
    @engine.addSystem(@physics = new PhysicsSystem(@config, @world), SystemPriorities.move)
    @engine.addSystem(new CollisionSystem(@world, @creator), SystemPriorities.resolveCollisions)
    @engine.addSystem(new AnimationSystem(), SystemPriorities.animate)
    @engine.addSystem(new HudSystem(), SystemPriorities.animate)
    @engine.addSystem(new LeaderboardSystem(@game, @config), SystemPriorities.animate)
    @engine.addSystem(new RenderSystem(), SystemPriorities.render)
    @engine.addSystem(new AudioSystem(), SystemPriorities.render)

    @creator.createWaitForClick()
    @creator.createGame()
    return

  ###
   * Get Fader Sprite
   *
   * A screen sized black rectangle used for full screen fades
  ###
  getFaderSprite: ->
    unless @faderSprite?
      @faderBitmap = @game.make.bitmapData(@game.width, @game.height)
      @faderBitmap.rect(0, 0, @game.width, @game.height, 'rgb(0,0,0)')
      @faderSprite = @game.add.sprite(0,0, @faderBitmap)
      @faderSprite.alpha = 0
    return @faderSprite


  ###
   * Fade
  ###
  fade: (next) =>
    sprite = @getFaderSprite()
    fader = @game.add.tween(sprite)
    if sprite.alpha is 0
      fader.to(alpha: 1, 500)
      fader.onComplete.add(next, this)
      fader.start()
    else
      @game.paused = false
      fader.to(alpha: 0, 500)
      fader.onComplete.add(next, this)
      fader.start()
    return

  ###
   * Pause
   *
   * If there is a callback, fadeout and run callback
   * Otherwise we fade in and restore
  ###
  pause: (next) =>
    if next?
      @physics.enabled = false
      @fade next
    else
      @fade => @physics.enabled = true
    return

  ###
   # Set Properties:
  ###
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

  ###
   * Asteroid Options
  ###
  setAsteroidDensity: (value) =>
    EntityCreator.ASTEROID_DENSITY = value
    return

  setAsteroidFriction: (value) =>
    EntityCreator.ASTEROID_FRICTION = value
    return

  setAsteroidRestitution: (value) =>
    EntityCreator.ASTEROID_RESTITUTION = value
    return

  setAsteroidDamping: (value) =>
    EntityCreator.ASTEROID_DAMPING = value
    return

  setAsteroidLinearVelocity: (value) =>
    EntityCreator.ASTEROID_LINEAR = value
    return

  setAsteroidAngularVelocity: (value) =>
    EntityCreator.ASTEROID_ANGULAR = value
    return

  ###
   * Spaceship Options
  ###
  setSpaceshipDensity: (value) =>
    EntityCreator.SPACESHIP_DENSITY = value
    return

  setSpaceshipFriction: (value) =>
    EntityCreator.SPACESHIP_FRICTION = value
    return

  setSpaceshipRestitution: (value) =>
    EntityCreator.SPACESHIP_RESTITUTION = value
    return

  setSpaceshipDamping: (value) =>
    EntityCreator.SPACESHIP_DAMPING = value
    return

  ###
   * Bullet Options
  ###
  setBulletDensity: (value) =>
    EntityCreator.BULLET_DENSITY = value
    return

  setBulletFriction: (value) =>
    EntityCreator.BULLET_FRICTION = value
    return

  setBulletRestitution: (value) =>
    EntityCreator.BULLET_RESTITUTION = value
    return

  setBulletDamping: (value) =>
    EntityCreator.BULLET_DAMPING = value
    return

  setBulletLinearVelocity: (value) =>
    EntityCreator.BULLET_LINEAR = value
    return




