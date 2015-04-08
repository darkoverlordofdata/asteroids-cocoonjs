class TouchableCircle extends TouchableArea

  constructor: (options) ->
    for i of options
      if i is 'x'
        this[i] = GameController.getPixels(options[i], 'x')
      else if i is 'x' or i is 'radius'
        this[i] = GameController.getPixels(options[i], 'y')
      else
        this[i] = options[i]
    bitmap = GameController.game.add.bitmapData(@radius, @radius)
    bitmap.context.fillStyle = 'rgba( 0, 0, 0, 0.5 )'
    bitmap.context.beginPath()
    bitmap.context.arc 0, 0, @radius, 0, 2 * Math.PI, false
    bitmap.context.fill()
    @sprite = GameController.game.add.sprite(@x, @y, bitmap)
    @draw()
    return

  ###
  No touch for this fella
  ###
  check: (touchX, touchY) ->
    false

  draw: ->
    @sprite.x = @x
    @sprite.y = @y
    return

