class AsteroidView

  graphics: null

  Object.defineProperties AsteroidView::,
    x:
      get: -> @graphics.x
      set: (x) -> @graphics.x = x
    y:
      get: -> @graphics.x
      set: (y) -> @graphics.y = y
    rotation:
      get: -> @graphics.rotation
      set: (rotation) -> @graphics.rotation = rotation

  constructor: (@stage, radius) ->

    @graphics = new PIXI.Graphics()
    @graphics.clear()
    angle = 0
    @graphics.beginFill(0xffffff)
    @graphics.moveTo radius, 0
    while angle < Math.PI * 2
      length = (0.75 + rnd.nextDouble() * 0.25) * radius
      posX = Math.cos(angle) * length
      posY = Math.sin(angle) * length
      @graphics.lineTo posX, posY
      angle += rnd.nextDouble() * 0.5

    @graphics.moveTo radius, 0
    @graphics.endFill()
    @stage.addChild(@graphics)

  dispose: ->
    @stage.removeChild(@graphics)

