class SpaceshipView

  stage: null
  graphics: null

  Object.defineProperties SpaceshipView::,
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
    @graphics.clear()
    @graphics.beginFill( 0xFFFFFF )
    @graphics.moveTo( 10 * window.devicePixelRatio, 0 )
    @graphics.lineTo( -7 * window.devicePixelRatio, 7 * window.devicePixelRatio )
    @graphics.lineTo( -4 * window.devicePixelRatio, 0 )
    @graphics.lineTo( -7 * window.devicePixelRatio, -7 * window.devicePixelRatio )
    @graphics.lineTo( 10 * window.devicePixelRatio, 0 )
    @graphics.endFill()
    @stage.addChild(@graphics)

  dispose: ->
    @stage.removeChild(@graphics)