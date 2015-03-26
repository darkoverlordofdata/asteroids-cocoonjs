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
  
  constructor: (game) ->
    @click = new Signal0()
    @createText(game, WaitForStartView.count++)


  createText: (game, first) ->

    x = Math.floor(window.innerWidth/2)
    y = window.innerHeight-40

    if first is 1
      @text1 = game.add.text(x, 85, 'GAME OVER', font: 'bold 60px opendyslexic', fill: 'white', stroke: "black", strokeThickness: 30)
    else
      @text1 = game.add.text(x, 85, 'ASTEROIDS', font: 'bold 60px opendyslexic', fill: 'white', stroke: "black", strokeThickness: 30)

    @text2 = game.add.text(x, 175, 'CLICK TO START', font: 'bold 12px opendyslexic', fill: 'white')
    @text3 = game.add.text(x, y, 'Z to Fire  ~  Arrow Keys to Move', font: 'bold 10px opendyslexic', fill: 'white')

    @text1.anchor.x = 0.5
    @text2.anchor.x = 0.5
    @text3.anchor.x = 0.5

    @text1.inputEnabled = true
    @text2.inputEnabled = true
    @text1.events.onInputDown.add @start
    @text2.events.onInputDown.add @start


  start: (data) =>
    @text1.destroy()
    @text2.destroy()
    @text3.destroy()
    @click.dispatch()
