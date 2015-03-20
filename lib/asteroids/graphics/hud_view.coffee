class HudView

  graphics: null
  score: null
  lives: null
  x: 0
  y: 0
  rotation: 0


  constructor: (stage) ->

    @score = @createTextField()
    @score.x = 20
    @score.y = 20
    stage.addChild(@score)

    @lives = @createTextField()
    @lives.x = window.innerWidth*window.devicePixelRatio-110
    @lives.y = 20
    stage.addChild(@lives)

    @setScore(0)
    @setLives(3)

  dispose: ->
    @stage.removeChild(@score)
    @stage.removeChild(@lives)

  setLives: (lives) =>
    @lives.setText("LIVES: #{lives}")
    return

  setScore: (score) =>
    @score.setText("SCORE: #{score}")
    return

  createTextField: ->
    new PIXI.Text('', font: 'bold 22px opendyslexic', fill: '#00ffff')


