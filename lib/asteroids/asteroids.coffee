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

  ###
   * Create the phaser game component
  ###
  constructor: () ->
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


    @game.load.image("bg","http://i221.photobucket.com/albums/dd22/djmid71/Untitled-1_zpswmvh3qea.jpg")
    @game.load.image("m1", "http://i221.photobucket.com/albums/dd22/djmid71/M1_zpsdprlkpno.png")
    @game.load.image("m2", "http://i221.photobucket.com/albums/dd22/djmid71/M2_zpsefls9w86.png")
    @game.load.image("m3", "http://i221.photobucket.com/albums/dd22/djmid71/m3_zpszzqyjbpa.png")
    @game.load.image("m4", "http://i221.photobucket.com/albums/dd22/djmid71/m4_zps5tnlccp0.png")
    @game.load.image("m5", "http://i221.photobucket.com/albums/dd22/djmid71/m5_zpsdpz0cohz.png")
    @game.load.image("m6", "http://i221.photobucket.com/albums/dd22/djmid71/m6_zpsvfvskl1d.png")
    @game.load.image("gameover","http://i221.photobucket.com/albums/dd22/djmid71/gameover_zpse663rlsp.png")
    @game.load.image("tryagain", "http://i221.photobucket.com/albums/dd22/djmid71/tryagain_zpszyvxhs8m.png")
    @game.load.image("yes","http://i221.photobucket.com/albums/dd22/djmid71/yes_zpsfppqya7h.png")
    @game.load.image("no","http://i221.photobucket.com/albums/dd22/djmid71/no_zpsnjisaare.png")
    @game.load.image("twitter","http://i221.photobucket.com/albums/dd22/djmid71/twitter_zpsyadnfz48.png")
    @game.load.image("facebook","http://i221.photobucket.com/albums/dd22/djmid71/facebook_zpsxiqll8e0.png")
    @game.load.image("clear", "http://i221.photobucket.com/albums/dd22/djmid71/clear_zpspuy7nqhg.png")
    @game.load.image("star", "http://i221.photobucket.com/albums/dd22/djmid71/star_zpseh4eqpzn.png")
    @game.load.image("modalBG","http://i221.photobucket.com/albums/dd22/djmid71/modalBG_zpsgvwlxhmv.png")
    return

  ###
   * Start the game
  ###
  create: =>

    # install the profiler before anything else
    @game.plugins.add(Phaser.Plugin.PerformanceMonitor)

#
#    @modal = new gameModal(@game)
#    @createModals()
#
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

    if @optBgd is 'blue'
      @background.alpha = 0.0

    ###
     * Options:
    ###
    k = 0
    @game.add.button width - 50, 50, 'parameters',
#      => @modal.showModal("modal#{((k++)%6)+1}")
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


    @keyPoll = new KeyPoll(@game, @config)
    @engine = @game.plugins.add(ash.core.PhaserEngine)
#    @engine = @game.plugins.add(Phaser.Plugin.AshEnginePlugin)
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

  createModals: ->
    @modal.createModal
      type: "modal1"
      includeBackground: true
      modalCloseOnInput: true
      itemsArr: [
        type: "text"
        content: "Simple Text with Modal background, \n nothing fancy here..."
        fontFamily: "Luckiest Guy"
        fontSize: 42
        color: "0xFEFF49"
        offsetY: -50
      ]


    #////// modal 2 ////////////
    @modal.createModal
      type: "modal2"
      includeBackground: true
      modalCloseOnInput: true
      itemsArr: [
        {
          type: "text"
          content: "Seriously???"
          fontFamily: "Luckiest Guy"
          fontSize: 42
          color: "0xFEFF49"
          offsetY: 50
        }
        {
          type: "image"
          content: "gameover"
          offsetY: -50
          contentScale: 0.6
        }
      ]


    #/////// modal 3 //////////
    @modal.createModal
      type: "modal3"
      includeBackground: true
      modalCloseOnInput: true
      itemsArr: [
        {
          type: "image"
          content: "gameover"
          offsetY: -110
          contentScale: 0.6
        }
        {
          type: "image"
          content: "tryagain"
          contentScale: 0.6
        }
        {
          type: "image"
          content: "yes"
          offsetY: 100
          offsetX: -80
          contentScale: 0.6
          callback: ->
            alert "YES!"
            return
        }
        {
          type: "image"
          content: "no"
          offsetY: 100
          offsetX: 80
          contentScale: 0.6
          callback: ->
            alert "NO!"
            return
        }
      ]


    #////// modal 4 //////////
    @modal.createModal
      type: "modal4"
      includeBackground: true
      modalCloseOnInput: true
      itemsArr: [
        {
          type: "text"
          content: "Share the awesomeness!"
          fontFamily: "Luckiest Guy"
          fontSize: 42
          color: "0xfb387c"
          offsetY: -80
        }
        {
          type: "image"
          content: "twitter"
          offsetY: 20
          offsetX: 80
          contentScale: 0.8
          callback: ->
            window.open "https://twitter.com/intent/tweet?text=Cool%20modals%20%40%20http%3A%2F%2Fcodepen.io%2Fnetgfx%2Fpen%2FbNLgaX", "twitter"
            return
        }
        {
          type: "image"
          content: "facebook"
          offsetY: 20
          offsetX: -80
          contentScale: 0.8
          callback: ->
            window.open "http://www.facebook.com/sharer.php?u=Cool%20modals%20%40%20http%3A%2F%2Fcodepen.io%2Fnetgfx%2Fpen%2FbNLgaX"
            return
        }
      ]


    #///// modal 5 //////////
    @modal.createModal
      type: "modal5"
      includeBackground: false
      modalCloseOnInput: true
      itemsArr: [
        {
          type: "image"
          content: "modalBG"
          offsetY: -20
          contentScale: 1
        }
        {
          type: "image"
          content: "clear"
          contentScale: 0.5
          offsetY: -80
        }
        {
          type: "image"
          content: "star"
          offsetY: 80
          offsetX: -100
          contentScale: 0.6
        }
        {
          type: "image"
          content: "star"
          offsetY: 50
          offsetX: 0
          contentScale: 0.6
        }
        {
          type: "image"
          content: "star"
          offsetY: 80
          offsetX: 100
          contentScale: 0.6
        }
        {
          type: "text"
          content: "X"
          fontSize: 52
          color: "0x000000"
          offsetY: -130
          offsetX: 240
          callback: =>
            @modal.hideModal "modal5"
            return
        }
      ]


    #//// modal 6 //////////
    @modal.createModal
      type: "modal6"
      includeBackground: true
      backgroundColor: "0xffffff"
      backgroundOpacity: 0.8
      itemsArr: [
        {
          type: "text"
          content: "Starting \nNext Level"
          fontFamily: "Luckiest Guy"
          fontSize: 52
          offsetY: -100
        }
        {
          type: "text"
          content: "5"
          fontFamily: "Luckiest Guy"
          fontSize: 42
          offsetY: 0
        }
      ]

    return
