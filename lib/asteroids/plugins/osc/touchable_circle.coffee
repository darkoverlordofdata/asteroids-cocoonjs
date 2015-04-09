class TouchableCircle extends TouchableArea

  constructor: (@controller, options) ->
    for property, value of options
      if property is 'x'
        @[property] = @controller.getPixels(value, 'x')
      else if property is 'x' or property is 'radius'
        @[property] = @controller.getPixels(value, 'y')
      else
        @[property] = value
    @sprite = @createSprite(@controller.game)
    super @controller

  ###
  No touch for this fella
  ###
  check: (touchX, touchY) ->
    false

  draw: ->
#    @sprite.x = @x
#    @sprite.y = @y
#    return

  createSprite: (game) ->
    @stroke = @stroke or 2
    hw = 2 * (@radius + (@controller.options.touchRadius) + @stroke)

    bitmap = game.add.bitmapData(hw, hw)
    ctx = bitmap.context

    gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, @radius)
    gradient.addColorStop 0, 'rgba( 200,200,200,.2 )'
    gradient.addColorStop 1, 'rgba( 200,200,200,.4 )'
    ctx.strokeStyle = 'rgba( 0,0,0,.4 )'
    ctx.fillStyle = gradient

    ctx.beginPath()
    ctx.arc @radius, @radius, @radius, 0, 2 * Math.PI, false
    ctx.fill()
    ctx.stroke()
    sprite = game.add.sprite(@x-@radius, @y-@radius, bitmap)
    return sprite
