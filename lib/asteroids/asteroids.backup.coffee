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

  b2Vec2            = Box2D.Common.Math.b2Vec2
  b2World           = Box2D.Dynamics.b2World

  ucfirst           = (s) -> s.charAt(0).toUpperCase() + s.substr(1)

  game              : null  #   Phaser.io game object
  pad               : null  #   On Screen Controller
  profiler          : null  #   performance profiler
  engine            : null  #   Ash Engine
  entities          : null  #   EntityCreator
  keyPoll           : null  #   KeyPoll
  config            : null  #   GameConfig
  world             : null  #   b2World
  background        : null  #   background image
  physics           : null  #   physics system
  faderBitmap       : null  #   for screen fade
  faderSprite       : null  #   for screen fade
  account           : null  #   game account data
  fb                : null  #   facebook sdk
  fbButton          : null  #   facebook login button
  fbUserID          : ''    #   facebook user id
  fbUserName        : ''    #   facebbok uset name
  fbStatus          : 0     #   facebook status
  fbAppId           : '887669707958104'
  bgdColor          : 0x6A5ACD
  height            : window.innerHeight
  width             : window.innerWidth
  scale             : window.devicePixelRatio
  playMusic         : localStorage.playMusic
  playSfx           : localStorage.playSfx
  optBgd            : localStorage.background || 'blue'

  ###
   * location of the leaderboard server
  ###
  HOST = if window.location.hostname is 'localhost'
    'http://bosco.com:3000'
  else
    'https://games.darkoverlordofdata.com'


  ###
   * Create the phaser game component
  ###
  constructor: () ->
    # initialize the game
    @game = new Phaser.Game(@width * @scale, @height * @scale, Phaser.CANVAS, '',
      init: @init, preload: @preload, create: @create)

    # initialize the prng
    @rnd = new MersenneTwister()

    # initialize the database
    @initializeDb()

    # show the web view when it loads
    Cocoon.App.WebView.on "load",
      success : => Cocoon.App.showTheWebView()
      error   : => console.log("Cannot show the Webview: #{JSON.stringify(arguments)}")

  ###
   * Configure Phaser scaling
  ###
  init: =>
    @game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    @game.scale.minWidth = @width * @scale
    @game.scale.minHeight = @height * @scale
    @game.scale.maxWidth = @width * @scale
    @game.scale.maxHeight = @height * @scale
    @game.scale.pageAlignVertically = true
    @game.scale.pageAlignHorizontally = true
    return

  ###
   * Load assets
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
   * Start the game
  ###
  create: =>
    # install the profiler first
    @profiler = @game.plugins.add(Phaser.Plugin.PerformanceMonitor, profiler: @get('profiler'))

    # set the background
    @optBgd = Db.queryAll('settings', query: name: 'background')[0].value
    @game.stage.backgroundColor = @bgdColor
    @background = @game.add.sprite(0, 0, 'background')
    @background.width = @width
    @background.height = @height
    @background.alpha = if @optBgd is 'blue' then 0 else 1

    # settings
    @game.add.button(@width - 50, 50, 'settings', @onSettings)
    @game.add.button(@width - 50, 125, 'leaderboard', @onLeaderboard)

    @fb = Cocoon.Social.Facebook
    # initialize the facebook connection
    @fb.init
      appId: @fbAppId
#      status: true
#      xfbml: true
#      version: 'v2.3'

    console.log 'player', @get('player')
    console.log 'userId', @get('userId')
    console.log 'leaderboard', @get('leaderboard')
    #
    # check account preference -
    # should we display logon to facebook button?
    if @get('leaderboard') is 'on'
      # 'silent' login if we're already connected
      @fb.getLoginStatus (response) =>
        @fbUserID = response.userID
        if response.status is 'connected'
          @fbStatus = 1

        else
          @fbStatus = 0
          @fbButton = @game.add.button((@width-195)/2, 50, 'fb-login', @onLogin)
    else
      @fbStatus = 0
      @fbButton = @game.add.button((@width-195)/2, 50, 'fb-login', @onLogin)

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
    useBox2dPlugin = not(not window.ext || typeof window.ext.IDTK_SRV_BOX2D is 'undefined')
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
   * Post to Leaderboard
   * Save the highest score for today
  ###
  score: (score) =>
    today = new Date()
    mm = (today.getMonth()+1).toString()
    if mm.length is 1 then mm = '0'+mm
    dd = today.getDate().toString()
    if dd.length is 1 then dd = '0'+dd
    yyyy = today.getFullYear().toString()
    yyyymmdd = yyyy+mm+dd

    if @fbStatus is 0 # client leaderboard

      if 0 is Db.queryAll('leaderboard', query: date: yyyymmdd).length
        Db.insert 'leaderboard', date: yyyymmdd, score: score
      else
        Db.update 'leaderboard', date: yyyymmdd, (row) ->
          if score > row.score
            row.score = score
          return row
      Db.commit()

    else # post to leaderboard server

      form =
        key     : getKey(@fbAppId, @fbUserID)
        dt      : Date.now()
        id      : 'asteroids'
        title   : 'Asteroid Simulator'
        appId   : @fbAppId
        userId  : @fbUserID
        date    : yyyymmdd
        score   : score
        userName: @get('player')

      xhr = new XMLHttpRequest()
      xhr.open('post', HOST+'/leaderboard/score', true)
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
      xhr.send(JSON.stringify(form))

    return

  ###
   * Get Fader Sprite
   *
   * A screen sized black rectangle used for full screen fades
  ###
  getFaderSprite: =>
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

  ###
   * Create and display a leaderboard
  ###
  showLeaderboard: =>
    if @fbStatus is 1

      xhr = new XMLHttpRequest()
      xhr.onreadystatechange = =>
        if xhr.readyState is 4 and xhr.status is 200
          response = JSON.parse(xhr.responseText)
          @leaderboardServer(response)

      xhr.open('get', HOST+'/leaderboard/asteroids/'+@get('player'), true)
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
      xhr.send()

    else
      @leaderboardLocal(Db.queryAll('leaderboard', limit: 10, sort: [['score', 'DESC']]))
    return

  ###
   * Show leaderboard with server data
   *  - rank
   *  - member
   *  - score
  ###
  leaderboardServer: (data) =>
    board = @game.add.group()

    dialog = new Phaser.Sprite(@game, 0, 0, "dialog-#{@optBgd}")
    dialog.width = @width
    dialog.height = @height
    board.add(dialog)

    big = font: 'bold 30px opendyslexic', fill: '#ffffff'
    normal = font: 'bold 20px opendyslexic', fill: '#ffffff'

    title = new Phaser.Text(@game, @width/2, 20, 'Asteroids - '+@get('player'), big)
    title.anchor.x = 0.5
    board.add(title)

    board.add(new Phaser.Text(@game, 200, 80, '##', normal))
    board.add(new Phaser.Text(@game, 300, 80, 'Name', normal))
    board.add(new Phaser.Text(@game, 500, 80, 'Score', normal))
    board.add(new Phaser.Text(@game, 200, 100, '--', normal))
    board.add(new Phaser.Text(@game, 300, 100, '--------', normal))
    board.add(new Phaser.Text(@game, 500, 100, '--------', normal))

    y = 120
    for row in data
      board.add(new Phaser.Text(@game, 200, y, row.rank, normal))
      board.add(new Phaser.Text(@game, 300, y, row.member, normal))
      board.add(new Phaser.Text(@game, 500, y, row.score, normal))
      y+= 20

    button = new Phaser.Button(@game, @width/2, @height-64, "button-#{@optBgd}", =>
      board.destroy()
      board = null
      @pause()
      return)
    button.anchor.x = 0.5
    board.add(button)

    label = new Phaser.Text(@game, 0, button.height/2, 'continue', big)
    label.anchor.x = 0.5
    label.anchor.y = 0.5
    button.addChild(label)
    return

  ###
   * Show leaderboard with local storage data
   *  - date
   *  - score
  ###
  leaderboardLocal: (data) =>
    board = @game.add.group()

    dialog = new Phaser.Sprite(@game, 0, 0, "dialog-#{@optBgd}")
    dialog.width = @width
    dialog.height = @height
    board.add(dialog)

    big = font: 'bold 30px opendyslexic', fill: '#ffffff'
    normal = font: 'bold 20px opendyslexic', fill: '#ffffff'

    title = new Phaser.Text(@game, @width/2, 20, 'Asteroids', big)
    title.anchor.x = 0.5
    board.add(title)

    board.add(new Phaser.Text(@game, 200, 80, 'Date', normal))
    board.add(new Phaser.Text(@game, 400, 80, 'Score', normal))
    board.add(new Phaser.Text(@game, 200, 100, '--------', normal))
    board.add(new Phaser.Text(@game, 400, 100, '--------', normal))

    y = 120
    for row in data
      mmddyyyy = row.date.substr(4,2)+'/'+row.date.substr(6,2)+'/'+row.date.substr(0,4)
      board.add(new Phaser.Text(@game, 200, y, mmddyyyy, normal))
      board.add(new Phaser.Text(@game, 400, y, row.score, normal))
      y+= 20

    button = new Phaser.Button(@game, @width/2, @height-64, "button-#{@optBgd}", =>
      board.destroy()
      board = null
      @pause()
      return)
    button.anchor.x = 0.5
    board.add(button)

    label = new Phaser.Text(@game, 0, button.height/2, 'continue', big)
    label.anchor.x = 0.5
    label.anchor.y = 0.5
    button.addChild(label)
    return

  ### ============================================================>
      B U T T O N  E V E N T S
  <============================================================ ###

  onSettings: =>
    @pause => Cocoon.App.loadInTheWebView("settings.html")
    return

  onLeaderboard: =>
    @pause => @showLeaderboard()
    return

  onLogin: => # use FaceBook
    @pause =>
      @fb.login (response) =>
        if response.authResponse
          @fb.api '/me', (response) =>
            console.log response
            @pause()
            if response.error
              console.error("login error: " + response.error.message)
            else
              console.log("login succeeded")
              @fbButton.input.enabled = false
              @fbButton.alpha = 0
              @fbStatus = 1
              @fbUserID = response.id
              @fbUserName = response.name

              if @get('player') is '' or @get('player') is @fbUserName
                @set('player', @fbUserName)
                @set('userId', @fbUserID)
                @set('leaderboard', 'on')
                Cocoon.App.loadInTheWebView("settings.html")



  ### ============================================================>
      A S T E R O I D  S E T T I N G S
  <============================================================ ###
  ###
   * Get Asteroid Property
  ###
  get: (prop) =>
    n = 'get'+ucfirst(prop)
    if @[n]? then return @[n]()
    else
      return Db.queryAll('settings', query: name: prop)[0].value

  ###
   * Set Asteroid Property
  ###
  set: (prop, value) =>
    n = 'set'+ucfirst(prop)
    if @[n]? then @[n](value)
    else
      Db.update('settings', name: prop, (row) -> row.value = value; return row)
      Db.commit()
    return

  getFbAppId: => @fbAppId

  getFbUserID: => @fbUserID

  getFbUserName: => @fbUserName

  ###
   * Sgt Asteroid Background
  ###
  getBackground: =>
    return if 'blue' is Db.queryAll('settings', query: name: 'background')[0].value then 0 else 1

  ###
   * Set Asteroid Background
  ###
  setBackground: (value) =>
    background = ['blue', 'star']
    @background.alpha = value
    @optBgd = background[value]
    Db.update('settings', name: 'background', (row) -> row.value = background[value]; return row)
    Db.commit()
    return

  ###
   * Set Asteroid Play Music
  ###
  setPlayMusic: (value) =>
    Db.update('settings', name: 'playMusic', (row) -> row.value = value; return row)
    Db.commit()
    @playMusic = value
    return

  ###
   * Set Asteroid Play Sfx
  ###
  setPlaySfx: (value) =>
    Db.update('settings', name: 'playSfx', (row) -> row.value = value; return row)
    Db.commit()
    @playSfx = value
    Sound.volume = value/100
    return

  ###
   * Initialize Asteroid Database
  ###
  initializeDb: =>
    window.Db = new localStorageDB('asteroids', localStorage)

    if Db.isNew()

      Db.createTable 'settings', ['name', 'value']
      Db.createTable 'leaderboard', ['date', 'score']
      ###
       * Default Property Settings:
      ###
      Db.insert 'settings', name: 'profiler', value: 'on'
      Db.insert 'settings', name: 'leaderboard', value: 'off'
      Db.insert 'settings', name: 'player', value: ''
      Db.insert 'settings', name: 'userId', value: ''
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
      Db.insert 'settings', name: 'bulletFriction', value: '0.0'
      Db.insert 'settings', name: 'bulletRestitution', value: '0.0'
      Db.insert 'settings', name: 'bulletDamping', value: '0.0'
      Db.insert 'settings', name: 'bulletLinearVelocity', value: '150'
      Db.commit()

    ###
     * check upgrade
    ###
    if Db.queryAll('settings', query: name: 'profiler').length is 0
      Db.insert 'settings', name: 'profiler', value: 'off'

    if Db.queryAll('settings', query: name: 'leaderboard').length is 0
      Db.insert 'settings', name: 'leaderboard', value: 'off'

    if Db.queryAll('settings', query: name: 'player').length is 0
      Db.insert 'settings', name: 'player', value: ''

    if Db.queryAll('settings', query: name: 'userId').length is 0
      Db.insert 'settings', name: 'userId', value: ''

    return
