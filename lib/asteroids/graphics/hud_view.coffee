class HudView

  graphics: null
  score: null
  lives: null
  x: 0
  y: 0
  rotation: 0


  constructor: (game, stage) ->

    @graphics = game.add.graphics(0, 100)
    @graphics.beginFill(0xc0c0c0)
    @graphics.drawRect(0, 0, 30, 40)
    @graphics.endFill()
    @graphics.alpha = 0.5

    @score = game.add.text(window.innerWidth-130, 20, '', font: 'bold 18px opendyslexic', fill: 'white')

    @setScore(0)
    @setLives(3)

  dispose: ->
    @graphics.destroy()
    @score.destroy()

  setLives: (lives) =>
    @graphics.clear()
    @graphics.beginFill(0xc0c0c0)
    @graphics.drawRect(0, 0, 30, 40)
    @graphics.endFill()
    @graphics.beginFill( 0x000000 )
    for i in [0...lives]
      c = i*10+10
      @graphics.moveTo( 10 + 10, c)
      @graphics.lineTo( -7 + 10, 7 + c)
      @graphics.lineTo( -4 + 10, c)
      @graphics.lineTo( -7 + 10, -7 + c)
      @graphics.lineTo( 10 + 10, c)

    @graphics.endFill()
    @graphics.alpha = 0.5
    return

  setScore: (score) =>
    @score.setText("SCORE: #{score}")
    return


