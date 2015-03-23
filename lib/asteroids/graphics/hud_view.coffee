class HudView

  graphics: null
  score: null
  lives: null
  x: 0
  y: 0
  rotation: 0


  constructor: (stage) ->

    @graphics = new PIXI.Graphics()
    @graphics.x = 0
    @graphics.y = 200
    @graphics.beginFill(0xc0c0c0)
    @graphics.drawRect(0, 0, 60, 80)
    @graphics.endFill()
    @graphics.alpha = 0.5
    stage.addChild(@graphics)

    @score = @createTextField()
    @score.x = window.innerWidth*window.devicePixelRatio-130
    @score.y = 20
    stage.addChild(@score)

    @setScore(0)
    @setLives(3)

  dispose: ->
    @stage.removeChild(@graphics)
    @stage.removeChild(@score)

  setLives: (lives) =>
    @graphics.clear()
    @graphics.beginFill(0xc0c0c0)
    @graphics.drawRect(0, 0, 60, 80)
    @graphics.endFill()
    @graphics.beginFill( 0x000000 )
    for i in [0...lives]
      c = i*20+20
      @graphics.moveTo( 10 * window.devicePixelRatio + 20, 0 + c)
      @graphics.lineTo( -7 * window.devicePixelRatio + 20, 7 * window.devicePixelRatio + c)
      @graphics.lineTo( -4 * window.devicePixelRatio + 20, 0 + c)
      @graphics.lineTo( -7 * window.devicePixelRatio + 20, -7 * window.devicePixelRatio + c)
      @graphics.lineTo( 10 * window.devicePixelRatio + 20, 0 + c)

    @graphics.endFill()
    @graphics.alpha = 0.5
    return

  setScore: (score) =>
    @score.setText("SCORE: #{score}")
    return

  createTextField: ->
    new PIXI.Text('', font: 'bold 22px opendyslexic', fill: '#00ffff')


