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

    window.rnd = new MersenneTwister()
    window.Db = new localStorageDB('asteroids', localStorage)
    if Db.isNew() then @initializeDb()

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
    @game.load.image 'button', 'res/standard-button-on.png'
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
      @pause => @displayLeaderboard()
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
    return @faderSprite.bringToTop()


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
    if next? # fade-out
      @faderSprite = null # force a new sprite
      @physics.enabled = false
      @fade next
    else # fade-in
      @fade => @physics.enabled = true
    return

  displayLeaderboard: =>
    board = @game.add.group()

    dialog = new Phaser.Sprite(@game, 0, 0, 'dialog')
    dialog.width = @config.width
    dialog.height = @config.height
    board.add(dialog)

    big = font: 'bold 30px opendyslexic', fill: '#ffffff'
    normal = font: 'bold 20px opendyslexic', fill: '#ffffff'

    title = new Phaser.Text(@game, @config.width/2, 0, 'Asteroids', big)
    title.anchor.x = 0.5
    board.add(title)

    y = 100
    for row in Db.queryAll('leaderboard', limit: 10, sort: [['score', 'DESC']])
      mmddyyyy = row.date.substr(4,2)+'/'+row.date.substr(6,2)+'/'+row.date.substr(0,4)
      board.add(new Phaser.Text(@game, 200, y, mmddyyyy, normal))
      board.add(new Phaser.Text(@game, 400, y, row.score, normal))
      y+= 20

    button = new Phaser.Button(@game, @config.width/2, @config.height-64, 'button', =>
      board.destroy()
      board = null
      @pause())
    button.anchor.x = 0.5
    board.add(button)

    label = new Phaser.Text(@game, 0, button.height/2, 'continue', big)
    label.anchor.x = 0.5
    label.anchor.y = 0.5
    button.addChild(label)


  ###
   # Properties:
  ###
  getBackground: =>
    return if 'blue' is Db.queryAll('settings', query: name: 'playMusic')[0].value then 0 else 1

  setBackground: (value) =>
    background = ['blue', 'star']
    @background.alpha = value
    @optBgd = background[value]
    Db.update('settings', name: 'background', (row) -> row.value = background[value]; return row)
    Db.commit()
    return

  getPlayMusic: =>
    return Db.queryAll('settings', query: name: 'playMusic')[0].value

  setPlayMusic: (value) =>
    Db.update('settings', name: 'playMusic', (row) -> row.value = value; return row)
    Db.commit()
    @playMusic = value
    return

  getPlaySfx: =>
    return Db.queryAll('settings', query: name: 'playSfx')[0].value

  setPlaySfx: (value) =>
    Db.update('settings', name: 'playSfx', (row) -> row.value = value; return row)
    Db.commit()
    @playSfx = value
    Sound.volume = value/100
    return

  ###
   * Asteroid Options
  ###
  getAsteroidDensity: =>
    return Db.queryAll('settings', query: name: 'asteroidDensity')[0].value

  setAsteroidDensity: (value) =>
    Db.update('settings', name: 'asteroidDensity', (row) -> row.value = value; return row)
    Db.commit()
    return

  getAsteroidFriction: =>
    return Db.queryAll('settings', query: name: 'asteroidFriction')[0].value

  setAsteroidFriction: (value) =>
    Db.update('settings', name: 'asteroidFriction', (row) -> row.value = value; return row)
    Db.commit()
    return

  getAsteroidRestitution: =>
    return Db.queryAll('settings', query: name: 'asteroidRestitution')[0].value

  setAsteroidRestitution: (value) =>
    Db.update('settings', name: 'a', (row) -> row.value = value; return row)
    Db.commit()
    return

  getAsteroidDamping: =>
    return Db.queryAll('settings', query: name: 'asteroidDamping')[0].value

  setAsteroidDamping: (value) =>
    Db.update('settings', name: 'asteroidDamping', (row) -> row.value = value; return row)
    Db.commit()
    return


  getAsteroidLinearVelocity: =>
    return Db.queryAll('settings', query: name: 'asteroidLinearVelocity')[0].value

  setAsteroidLinearVelocity: (value) =>
    Db.update('settings', name: 'asteroidLinearVelocity', (row) -> row.value = value; return row)
    Db.commit()
    return

  getAsteroidAngularVelocity: =>
    return Db.queryAll('settings', query: name: 'asteroidAngularVelocity')[0].value

  setAsteroidAngularVelocity: (value) =>
    Db.update('settings', name: 'asteroidAngularVelocity', (row) -> row.value = value; return row)
    Db.commit()
    return


  ###
   * Spaceship Options
  ###
  getSpaceshipDensity: =>
    return Db.queryAll('settings', query: name: 'spaceshipDensity')[0].value

  setSpaceshipDensity: (value) =>
    Db.update('settings', name: 'spaceshipDensity', (row) -> row.value = value; return row)
    Db.commit()
    return

  getSpaceshipFriction: =>
    return Db.queryAll('settings', query: name: 'spaceshipFriction')[0].value

  setSpaceshipFriction: (value) =>
    Db.update('settings', name: 'spaceshipFriction', (row) -> row.value = value; return row)
    Db.commit()
    return

  getSpaceshipRestitution: =>
    return Db.queryAll('settings', query: name: 'spaceshipRestitution')[0].value

  setSpaceshipRestitution: (value) =>
    Db.update('settings', name: 'spaceshipRestitution', (row) -> row.value = value; return row)
    Db.commit()
    return

  getSpaceshipDamping: =>
    return Db.queryAll('settings', query: name: 'spaceshipDamping')[0].value

  setSpaceshipDamping: (value) =>
    Db.update('settings', name: 'spaceshipDamping', (row) -> row.value = value; return row)
    Db.commit()
    return

  ###
   * Bullet Options
  ###
  getBulletDensity: =>
    return Db.queryAll('settings', query: name: 'bulletDensity')[0].value

  setBulletDensity: (value) =>
    Db.update('settings', name: 'bulletDensity', (row) -> row.value = value; return row)
    Db.commit()
    return

  getBulletFriction: =>
    return Db.queryAll('settings', query: name: 'bulletFriction')[0].value

  setBulletFriction: (value) =>
    Db.update('settings', name: 'bulletFriction', (row) -> row.value = value; return row)
    Db.commit()
    return

  getBulletRestitution: =>
    return Db.queryAll('settings', query: name: 'bulletRestitution')[0].value

  setBulletRestitution: (value) =>
    Db.update('settings', name: 'bulletRestitution', (row) -> row.value = value; return row)
    Db.commit()
    return

  getBulletDamping: =>
    return Db.queryAll('settings', query: name: 'bulletDamping')[0].value

  setBulletDamping: (value) =>
    Db.update('settings', name: 'bulletDamping', (row) -> row.value = value; return row)
    Db.commit()
    return

  getBulletLinearVelocity: =>
    return Db.queryAll('settings', query: name: 'bulletLinearVelocity')[0].value

  setBulletLinearVelocity: (value) =>
    Db.update('settings', name: 'bulletLinearVelocity', (row) -> row.value = value; return row)
    Db.commit()
    return

  initializeDb: =>
    Db.createTable 'leaderboard', ['date','score']
    Db.createTable 'settings', ['name', 'value']
    ###
     * Default Settings:
    ###
    Db.insert 'settings', name: 'background', value: 'blue'
    Db.insert 'settings', name: 'playMusic', value: '50'
    Db.insert 'settings', name: 'playSfx', value: '50'
    Db.insert 'settings', name: 'asteroidDensity', value: '1.0'
    Db.insert 'settings', name: 'asteroidFriction', value: '1.0'
    Db.insert 'settings', name: 'asteroidRestitution', value: '0.2'
    Db.insert 'settings', name: 'asteroidDamping', value: '0.0'
    Db.insert 'settings', name: 'asteroidLinearVelocity', value: '4.0'
    Db.insert 'settings', name: 'asteroidAngularVelocity', value: '2.0'
    Db.insert 'settings', name: 'spaceshipDensity', value: '1.0'
    Db.insert 'settings', name: 'spaceshipFriction', value: '1.0'
    Db.insert 'settings', name: 'spaceshipRestitution', value: '0.2'
    Db.insert 'settings', name: 'spaceshipDamping', value: '0.75'
    Db.insert 'settings', name: 'bulletDensity', value: '1.0'
    Db.insert 'settings', name: 'bulletFriction', value: '1.0'
    Db.insert 'settings', name: 'bulletRestitution', value: '0.2'
    Db.insert 'settings', name: 'bulletDamping', value: '0.0'
    Db.insert 'settings', name: 'bulletLinearVelocity', value: '150'

    Db.commit()
    return
    


