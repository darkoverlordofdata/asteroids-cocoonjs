class SpaceshipView

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

  constructor: (game) ->
    @graphics = game.add.graphics(0, 0)
    @draw(0xFFFFFF)

  dispose: ->
    @graphics.destroy()

  draw: (color) ->
    @graphics.clear()
    @graphics.beginFill(color)
    @graphics.moveTo( 10, 0 )
    @graphics.lineTo( -7, 7 )
    @graphics.lineTo( -4, 0 )
    @graphics.lineTo( -7, -7 )
    @graphics.lineTo( 10, 0 )
    @graphics.endFill()
