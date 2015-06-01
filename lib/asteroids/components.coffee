###
 * Components
###
Components = do ->

  Animation: class Animation
    animation: null
    constructor: (@animation) ->

  Asteroid: class Asteroid
    fsm: null
    constructor: (@fsm) ->

  Audio: class Audio
    toPlay: null
    constructor: () ->
      @toPlay = []
    play: (sound) ->
      @toPlay.push(sound)

  Bullet: class Bullet
    lifeRemaining: 0
    constructor: (@lifeRemaining) ->

  Collision: class Collision
    radius: 0
    constructor: (@radius) ->

  DeathThroes: class DeathThroes
    countdown: 0
    body: null
    constructor: (duration) ->
      @countdown = duration

  Display: class Display
    graphic: 0
    constructor: (@graphic) ->

  GameState: class GameState
    lives: 3
    level: 0
    hits: 0
    bonus: 0
    playing: false
    setForStart: () ->
      @lives = 3
      @level = 0
      @hits = 0
      @playing = true
      return

  Gun: class Gun
    shooting: false
    offsetFromParent: null
    timeSinceLastShot: 0
    offsetFromParent: null
    constructor: (offsetX, offsetY, @minimumShotInterval, @bulletLifetime) ->
      @shooting = false
      @offsetFromParent = null
      @timeSinceLastShot = 0
      @offsetFromParent = new Point(offsetX, offsetY)

  GunControls: class GunControls
    trigger: 0
    constructor: (@trigger) ->

  Hud: class Hud
    view: null
    leaderboard: false
    constructor: (@view) ->

  MotionControls: class MotionControls
    left: 0
    right: 0
    accelerate: 0
    warp: 0
    accelerationRate: 0
    rotationRate: 0
    constructor: (@left, @right, @accelerate, @warp, @accelerationRate, @rotationRate) ->

  Physics: class Physics
    body: null
    previousX: 0
    previousY: 0
    previousAngle: 0
    constructor: (@body) ->

  Position: class Position
    position: null
    rotation: 0
    constructor: (x, y, @rotation) ->
      @position = new Point(x, y)

  Spaceship: class Spaceship
    fsm: null
    constructor: (@fsm) ->

  WaitForStart: class WaitForStart
    waitForStart: null
    startGame: false
    constructor: (@waitForStart) ->
      @waitForStart.click.add(@setStartGame)
    setStartGame: () =>
      @startGame = true
      return
