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
  background      : null
  physics         : null
  playMusic       : Boolean(localStorage.playMusic)
  playSfx         : Boolean(localStorage.playSfx)
  optBgd          : localStorage.background || 'blue'
  bgdColor        : 0x6A5ACD

  ###
   * Assets for pre-loader
  ###
  assets: [
    'res/starfield.png'     # alternate background
    'res/b_Parameters.png'  # options button
    'res/b_Leaderboard.png' # leaderboard button
    'res/b_round.png'       # gameboard button1
    'res/b_square.png'      # gameboard button2
  ]

  ###
   * Start the game
   *
   * @param canvas  Canvas created for the game
   * @param stats   Perfmon
   * @return none
  ###
  start: (canvas, stats) ->

    width = canvas.width
    height = canvas.height
    @bgdColor = 0x000000 unless @optBgd is 'blue'
    @stage = new PIXI.Stage(@bgdColor)
    @renderer = new PIXI.CanvasRenderer(width, height, view:canvas)

    @background = PIXI.Sprite.fromImage('res/starfield.png')
    @background.width = window.innerWidth * window.devicePixelRatio
    @background.height = window.innerHeight * window.devicePixelRatio
    @background.x = 0
    @background.y = 0
    @background.alpha = 0.0 if @optBgd is 'blue'
    @stage.addChild(@background)

    @config = new GameConfig()
    @config.height = height
    @config.width = width

    @options()

    @world = new b2World(new b2Vec2(0 ,0), true) # Zero-G physics
    @engine = new Engine()
    @creator = new EntityCreator(@engine, @world, @config, @stage)
    @keyPoll = new KeyPoll(@stage, @config)

    @engine.addSystem(new WaitForStartSystem(@creator), SystemPriorities.preUpdate)
    @engine.addSystem(new GameManager(@creator, @config), SystemPriorities.preUpdate)
    @engine.addSystem(new PhysicsControlSystem(@keyPoll), SystemPriorities.update)
    @engine.addSystem(new GunControlSystem(@keyPoll, @creator), SystemPriorities.update)
    @engine.addSystem(new BulletAgeSystem(@creator), SystemPriorities.update)
    @engine.addSystem(new DeathThroesSystem(@creator), SystemPriorities.update)
    @engine.addSystem(@physics = new PhysicsSystem(@config, @world, @stage), SystemPriorities.move)
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
    return


  ### ============================================================>
  User Settings
  ============================================================> ###
  options: ->
    options = PIXI.Sprite.fromImage('res/b_Parameters.png')
    options.interactive = true
    options.mousedown = options.touchstart = (data) ->
      Cocoon.App.loadInTheWebView("options.html")
    options.anchor.x = 0.5
    options.anchor.y = 0.5
    options.position.x = @config.width - options.width
    options.position.y = options.height*2
    @stage.addChild(options)

    leaders = PIXI.Sprite.fromImage('res/b_Leaderboard.png')
    leaders.interactive = true
    leaders.mousedown = leaders.touchstart = (data) ->
      Cocoon.App.loadInTheWebView("leaders.html")
    leaders.anchor.x = 0.5
    leaders.anchor.y = 0.5
    leaders.position.x = @config.width - options.width
    leaders.position.y = leaders.height*3
    @stage.addChild(leaders)

    Cocoon.App.WebView.on "load",
      success : () =>
        @pause(true)
        Cocoon.App.showTheWebView()
      error : () =>
        console.log("Cannot show the Webview for some reason :/")
        console.log(JSON.stringify(arguments))

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
    localStorage.playSfx = value
    return
