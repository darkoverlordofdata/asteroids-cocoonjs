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
#
# Points are scored as follows:
#
#   large asteroids                20 points
#   medium asteroids               50 points
#   small asteroids               100 points
#   satellites                    200 points *
#   ufos                         1000 points *
#   bonus life every             5000 points
#
#   * not yet implemented
#
#extra life every 5000 pts
# Asteroids
#
class Asteroids extends AbstractGame

  b2Vec2                    = Box2D.Common.Math.b2Vec2
  b2World                   = Box2D.Dynamics.b2World

  pad                       : null    # On Screen Controller
  profiler                  : null    # performance profiler
  engine                    : null    # Ash Engine
  entities                  : null    # EntityCreator
  keyPoll                   : null    # KeyPoll
  world                     : null    # b2World
  physics                   : null    # physics system
  background                : null    # background image
  leaderboard               : null    # leaderboard/settings ui
  bgdColor                  : 0x6A5ACD
  playMusic                 : true # localStorage.playMusic
  playSfx                   : true # localStorage.playSfx
  optBgd                    : 'blue' #localStorage.background || 'blue'

  properties:
    profiler                : 'on'    # display the profiler
    leaderboard             : 'off'   # use server leaderboard
    player                  : ''      # player screen name
    userId                  : ''      # unique user id
    background              : 'blue'  # blue | stars
    playMusic               : '50'    # music volume
    playSfx                 : '50'    # soundfx volume
    asteroidDensity         : '1.0'   # asteroid mass
    asteroidFriction        : '1.0'   # asteroid friction
    asteroidRestitution     : '0.2'   # asteroid bounce
    asteroidDamping         : '0.0'   # asteroid entropy
    asteroidLinearVelocity  : '4.0'   # asteroid speed
    asteroidAngularVelocity : '2.0'   # asteroid rotation
    spaceshipDensity        : '1.0'   # spaceship mass
    spaceshipFriction       : '1.0'   # spaceship friction
    spaceshipRestitution    : '0.2'   # spaceship bounce
    spaceshipDamping        : '0.75'  # spaceship enrtopy
    bulletDensity           : '1.0'   # bullet mass
    bulletFriction          : '0.0'   # bullet friction
    bulletRestitution       : '0.0'   # bullet bounce
    bulletDamping           : '0.0'   # bullet entropy
    bulletLinearVelocity    : '150'   # bullet  speed

  ###
   * Initialize game properties
  ###
  constructor: ->
    super('asteroids', @properties)

  ###
   * Load assets
   *
   * @return nothing
  ###
  preload: =>
    @game.load.image 'fb-login', 'res/fb-login.png'
    @game.load.image 'dialog-blue', 'res/dialog-box.png'
    @game.load.image 'dialog-star', 'res/black-dialog.png'
    @game.load.image 'button-blue', 'res/standard-button-on.png'
    @game.load.image 'button-star', 'res/black-button-on.png'
    @game.load.image 'background', 'res/BackdropBlackLittleSparkBlack.png'
    @game.load.image 'leaderboard', 'res/icons/b_Leaderboard.png'
    @game.load.image 'settings', 'res/icons/b_Parameters.png'
    @game.load.image 'round', 'res/round48.png'
    @game.load.image 'square', 'res/square48.png'

    @game.load.audio 'asteroid', [ExplodeAsteroid::src]
    @game.load.audio 'ship', [ExplodeShip::src]
    @game.load.audio 'shoot', [ShootGun::src]
    return

  ###
   * Create the game
   *
   * @return nothing
  ###
  create: =>
    useBox2dPlugin = not(not window.ext || typeof window.ext.IDTK_SRV_BOX2D is 'undefined')

    # install the profiler first
    @profiler = @game.plugins.add(Phaser.Plugin.PerformanceMonitor, profiler: @get('profiler'))

    # set the background
    @optBgd = Db.queryAll('settings', query: name: 'background')[0].value
    @game.stage.backgroundColor = @bgdColor
    @background = @game.add.sprite(0, 0, 'background')
    @background.width = @width
    @background.height = @height
    @background.alpha = if @optBgd is 'blue' then 0 else 1

    # Initialize leaderboard
    if useBox2dPlugin
      @leaderboard = new LocalLeaderboard(this, 'asteroids', 'Asteroid Simulator')
    else
      @leaderboard = new FacebookLeaderboard(this, '887669707958104', 'asteroids', 'Asteroid Simulator')

    # Initialize audio
    ExplodeAsteroid.audio = @game.add.audio('asteroid')
    ExplodeAsteroid.audio.play('', 0, 0)
    ExplodeShip.audio = @game.add.audio('ship')
    ExplodeShip.audio.play('', 0, 0)
    ShootGun.audio = @game.add.audio('shoot')
    ShootGun.audio.play('', 0, 0)

    # keyboard i/o
    @keyPoll = new KeyPoll(this)

    # Box2d
    @world = new b2World(new b2Vec2(0 ,0), true) # Zero-G physics
    @world.SetContinuousPhysics(true)

    # Create the Ash engine
    @ash = @game.plugins.add(ash.ext.PhaserEngine, Nodes, Components)

    # Entity Factory
    @entities = new Entities(this)

    # Set up a virtual gamepad
    @controller = @game.plugins.add(Phaser.Plugin.GameControllerPlugin, force: false)

    @controller.addDPad 'left', 60, @height-60,
      up    : width: '10%', height: '7%'
      left  : width: '7%',  height: '10%'
      right : width: '7%',  height: '10%'
      down  : false

    @controller.addButtons 'right', @width-180, @height-80,
      1     : title: 'warp', color: 'yellow'
      3     : title: 'FIRE', color: 'red'

    # check for cocoonjs native box2d
    PhysicsSystem = if useBox2dPlugin then FixedPhysicsSystem else SmoothPhysicsSystem
    @physics = new PhysicsSystem(this)

    @ash.addSystem(@physics, SystemPriorities.move)
    @ash.addSystem(new BulletAgeSystem(this, PhysicsSystem), SystemPriorities.update)
    @ash.addSystem(new DeathThroesSystem(this, PhysicsSystem), SystemPriorities.update)
    @ash.addSystem(new CollisionSystem(this, PhysicsSystem), SystemPriorities.resolveCollisions)

    @ash.addSystem(new AnimationSystem(this), SystemPriorities.animate)
    @ash.addSystem(new HudSystem(this), SystemPriorities.animate)
    @ash.addSystem(new RenderSystem(this), SystemPriorities.render)
    @ash.addSystem(new AudioSystem(this), SystemPriorities.render)

    @ash.addSystem(new WaitForStartSystem(this), SystemPriorities.preUpdate)
    @ash.addSystem(new GameManager(this), SystemPriorities.preUpdate)
    @ash.addSystem(new ShipControlSystem(this), SystemPriorities.update)
    @ash.addSystem(new GunControlSystem(this), SystemPriorities.update)

    @entities.createWaitForClick()
    @entities.createGame()
    return

  ###
   * External inteface to unpause the game
  ###
  resume: =>
    @leaderboard.pause()
    return

  score: (score) =>
    @leaderboard.score(score)
    return

  ### ============================================================>
      P R O P E R T I E S
  <============================================================ ###
  ###
   * Standard properties
  ###
  getFbAppId: => @leaderboard.fbAppId

  getFbUserID: => @leaderboard.fbUserID

  getFbUserName: => @leaderboard.fbUserName


  ###
   * Get Background
  ###
  getBackground: =>
    return if 'blue' is Db.queryAll('settings', query: name: 'background')[0].value then 0 else 1

  ###
   * Set Background
  ###
  setBackground: (value) =>
    background = ['blue', 'star']
    @background.alpha = value
    @optBgd = background[value]
    Db.update('settings', name: 'background', (row) -> row.value = background[value]; return row)
    Db.commit()
    return

  ###
   * Set Play Music
  ###
  setPlayMusic: (value) =>
    Db.update('settings', name: 'playMusic', (row) -> row.value = value; return row)
    Db.commit()
    @playMusic = value
    return

  ###
   * Set Play Sfx
  ###
  setPlaySfx: (value) =>
    Db.update('settings', name: 'playSfx', (row) -> row.value = value; return row)
    Db.commit()
    @playSfx = value
    Sound.volume = value/100
    return

