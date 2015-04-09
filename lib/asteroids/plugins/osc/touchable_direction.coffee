class TouchableDirection extends TouchableArea

  constructor: (@controller, options) ->
    for property, value of options
      if property is 'x'
        @[property] = @controller.getPixels(value, 'x')
      else if property is 'y' or property is 'height' or property is 'width'
        @[property] = @controller.getPixels(value, 'y')
      else
        @[property] = value
    @sprite = @createSprite(@controller.game)
    super @controller

  bitmap: null
  type: 'direction'

  ###
  Checks if the touch is within the bounds of this direction
  ###
  check: (touchX, touchY) ->
    return true  if (Math.abs(touchX - @x) < (@controller.options.touchRadius / 2) or (touchX > @x)) and (Math.abs(touchX - (@x + @width)) < (@controller.options.touchRadius / 2) or (touchX < @x + @width)) and (Math.abs(touchY - @y) < (@controller.options.touchRadius / 2) or (touchY > @y)) and (Math.abs(touchY - (@y + @height)) < (@controller.options.touchRadius / 2) or (touchY < @y + @height))
    false

  draw: ->

  setActive: (active) =>
    @sprite.alpha = if active then 0.9 else 0.45
    return

  createSprite: (game) ->
    gradient = null
    bitmap = @controller.game.add.bitmapData(@width * 2 + @stroke, @height * 2 + @stroke)
    ctx = bitmap.context
    switch @direction || 'down'
      when 'up'
        gradient = ctx.createLinearGradient(0, 0, 0, @height)
        gradient.addColorStop 0, 'rgba( 0, 0, 0, 0.45)'
        gradient.addColorStop 1, 'rgba( 0, 0, 0, 0.90)'
      when 'left'
        gradient = ctx.createLinearGradient(0, 0, @width, 0)
        gradient.addColorStop 0, 'rgba( 0, 0, 0, 0.45)'
        gradient.addColorStop 1, 'rgba( 0, 0, 0, 0.90)'
      when 'right'
        gradient = ctx.createLinearGradient(0, 0, @width, 0)
        gradient.addColorStop 0, 'rgba( 0, 0, 0, 0.45)'
        gradient.addColorStop 1, 'rgba( 0, 0, 0, 0.90)'
      when 'down'
        gradient = ctx.createLinearGradient(0, 0, 0, @height)
        gradient.addColorStop 0, 'rgba( 0, 0, 0, 0.45)'
        gradient.addColorStop 1, 'rgba( 0, 0, 0, 0.90)'
    ctx.fillStyle = gradient
    ctx.fillRect 0, 0, @width, @height
    ctx.lineWidth = @stroke
    ctx.strokeStyle = 'rgba( 255, 255, 255, 0.1 )'
    ctx.strokeRect 0, 0, @width, @height
    sprite = game.add.sprite(@x, @y, bitmap)
    sprite.alpha = 0.45
    sprite.inputEnabled = true
    sprite.events.onInputDown.add(@touchStartWrapper, this)
    sprite.events.onInputUp.add(@touchEndWrapper, this)
    return sprite


