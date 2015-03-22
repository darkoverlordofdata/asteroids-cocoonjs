class WaitForStartView

  Signal0 = ash.signals.Signal0

  x: 0
  y: 0
  rotation: 0
  text1: null
  text2: null
  text3: null

  click: null
  
  constructor: (@stage) ->
    @click = new Signal0()
    #    document.addEventListener 'click', (event) =>
    @createText()


  createText: ->
    @text1 = new PIXI.Text('ASTEROIDS', font: 'bold 120px opendyslexic', fill: 'white', stroke: "black", strokeThickness: 60)
    @text2 = new PIXI.Text('CLICK TO START', font: 'bold 24px opendyslexic', fill: 'white')
    @text3 = new PIXI.Text('Z to Fire  ~  Arrow Keys to Move', font: 'bold 18px opendyslexic', fill: 'white')

    @text1.anchor.x = 0.5
    @text1.position.x = Math.floor(window.innerWidth*window.devicePixelRatio/2)
    @text1.position.y = 175

    @text2.anchor.x = 0.5
    @text2.position.x = Math.floor(window.innerWidth*window.devicePixelRatio/2)
    @text2.position.y = 335

    @text3.anchor.x = 0.5
    @text3.position.x = Math.floor(window.innerWidth*window.devicePixelRatio/2)
    @text3.position.y = window.innerHeight*window.devicePixelRatio-40

    @text1.interactive = true
    @text2.interactive = true
    @text1.mousedown = @text1.touchstart = @text2.mousedown = @text2.touchstart = @start


    @stage.addChild(@text1)
    @stage.addChild(@text2)
    @stage.addChild(@text3)


  start: (data) =>
    @stage.removeChild(@text1)
    @stage.removeChild(@text2)
    @stage.removeChild(@text3)
    @click.dispatch()
