class BulletView

  graphics: null

  Object.defineProperties BulletView::,
    x:
      get: -> @graphics.x
      set: (x) -> @graphics.x = x
    y:
      get: -> @graphics.x
      set: (y) -> @graphics.y = y
    rotation:
      get: -> @graphics.rotation
      set: (rotation) -> @graphics.rotation = rotation

  constructor: (@stage) ->

    @graphics = new PIXI.Graphics()
    @graphics.beginFill(0xffffff)
    @graphics.drawCircle(0, 0, 2)
    @graphics.endFill()
    @stage.addChild(@graphics)

  dispose: ->
    @stage.removeChild(@graphics)