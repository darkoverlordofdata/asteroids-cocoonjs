class WaitForStartView

  @count = 0

  Signal0 = ash.signals.Signal0

  x: 0
  y: 0
  rotation: 0
  text1: null
  text2: null
  text3: null

  click: null
  
  constructor: (@game, @parent) ->
    @click = new Signal0()

    x = Math.floor(window.innerWidth/2)
    y = window.innerHeight-40

    if (WaitForStartView.count++) is 1
      @text1 = @game.add.text(x, 85, 'GAME OVER', font: 'bold 60px opendyslexic', fill: 'white', stroke: "black", strokeThickness: 30)
    else
      @text1 = @game.add.text(x, 85, 'ASTEROIDS', font: 'bold 60px opendyslexic', fill: 'white', stroke: "black", strokeThickness: 30)

    if @game.device.touch
      @text2 = @game.add.text(x, 175, 'TOUCH TO START', font: 'bold 12px opendyslexic', fill: 'white')
    else
      @text2 = @game.add.text(x, 175, 'CLICK TO START', font: 'bold 12px opendyslexic', fill: 'white')

    @text1.anchor.x = 0.5
    @text2.anchor.x = 0.5

    if @game.device.desktop
      @text3 = @game.add.text(x, y, 'Z ~ Fire  |  SPACE ~ Warp  |  Left/Right ~ Turn  |  Up ~ Accelerate', font: 'bold 10px opendyslexic', fill: 'white')
      @text3.anchor.x = 0.5

    @text1.inputEnabled = true
    @text2.inputEnabled = true
    @text1.events.onInputDown.add @start
    @text2.events.onInputDown.add @start

  start: (data) =>
    @faderBitmap = @game.make.bitmapData(@game.width, @game.height)
    @faderBitmap.rect(0, 0, @game.width, @game.height, 'rgb(0,0,0)')
    @faderSprite = @game.add.sprite(0,0, @faderBitmap)
    @faderSprite.alpha = 0
    fader = @game.add.tween(@faderSprite)
    fader.to(alpha: 1, 1000)
    fader.onComplete.add(@start1)
    fader.start()

  start1: =>
    @text1.destroy()
    @text2.destroy()
    @text3?.destroy()
    fader = @game.add.tween(@faderSprite)
    fader.to(alpha: 0, 1000)
    fader.onComplete.add => @click.dispatch()
    fader.start()
    @parent.controller?.start() # if @game.device.touch