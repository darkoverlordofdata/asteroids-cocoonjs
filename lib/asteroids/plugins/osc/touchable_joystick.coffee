class TouchableJoystick extends TouchableArea

  constructor: (@controller, options) -> #x, y, radius, backgroundColor )
    for property, value of options
      @[property] = value
    @originX = @currentX = @currentX or @x
    @originY = @currentY = @currentY or @y
    @base = @createBase(@controller.game)
    @sprite = @createSprite(@controller.game)
    super @controller

  type: 'joystick'

  ###
  Checks if the touch is within the bounds of this direction
  ###
  check: (touchX, touchY) ->
    return true  if (Math.abs(touchX - @x) < @radius + (@controller.getPixels(@controller.options.touchRadius) / 2)) and (Math.abs(touchY - @y) < @radius + (@controller.getPixels(@controller.options.touchRadius) / 2))
    false


  setActive: (active) =>
    @sprite.alpha = if active then 0.8 else 0.4
    return
  ###
  details for the joystick move event, stored here so we're not constantly creating new objs for garbage. The object has params:
  dx - the number of pixels the current joystick center is from the base center in x direction
  dy - the number of pixels the current joystick center is from the base center in y direction
  max - the maximum number of pixels dx or dy can be
  normalizedX - a number between -1 and 1 relating to how far left or right the joystick is
  normalizedY - a number between -1 and 1 relating to how far up or down the joystick is
  ###
  moveDetails: {}

  ###
  Called when this joystick is moved
  ###
  touchMoveWrapper: (pointer, x, y) ->
    return unless @active

    @currentX = @controller.normalizeTouchPositionX(x)
    @currentY = @controller.normalizeTouchPositionY(y)

    # Fire the user specified callback
    if @touchMove
      if @moveDetails.dx isnt @currentX - @x and @moveDetails.dy isnt @y - @currentY
        x = @currentX - @radius
        y = @currentY - @radius
        @sprite.x = x
        @sprite.y = y
        @moveDetails.dx = @currentX - @x # reverse so right is positive
        @moveDetails.dy = @y - @currentY
        @moveDetails.max = @radius + (@controller.options.touchRadius / 2)
        @moveDetails.normalizedX = @moveDetails.dx / @moveDetails.max
        @moveDetails.normalizedY = @moveDetails.dy / @moveDetails.max
        @touchMove @moveDetails

    # Mark this direction as inactive
    return

  touchEndWrapper: (e) ->
    @sprite.x = @originX - @radius * 0.7
    @sprite.y = @originY - @radius * 0.7
    super e

  draw: ->


  createSprite: (game) ->

    @stroke = @stroke or 2
    hw = 2 * (@radius + (@controller.options.touchRadius) + @stroke)

    bitmap = game.add.bitmapData(hw, hw)

    # Draw the bitmap that stays static
    bitmap.context.fillStyle = '#444'
    bitmap.context.beginPath()
    bitmap.context.arc @radius * 0.7, @radius * 0.7, @radius * 0.7, 0, 2 * Math.PI, false
    bitmap.context.fill()
    bitmap.context.stroke()
    sprite = game.add.sprite(@currentX - @radius * 0.7, @currentY - @radius * 0.7, bitmap)
    sprite.alpha = 0.8
    sprite.inputEnabled = true
    sprite.events.onInputDown.add(@touchStartWrapper, this)
    sprite.events.onInputUp.add(@touchEndWrapper, this)
    game.input.addMoveCallback(@touchMoveWrapper, this)
    return sprite

  createBase: (game) ->

    @stroke = @stroke or 2
    hw = 2 * (@radius + (@controller.options.touchRadius) + @stroke)

    bitmap = game.add.bitmapData(hw, hw)
    ctx = bitmap.context
    gradient = null
    ctx.lineWidth = @stroke
    gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, @radius)
    gradient.addColorStop 0, 'rgba( 200,200,200,.2 )'
    gradient.addColorStop 1, 'rgba( 200,200,200,.4 )'
    ctx.strokeStyle = 'rgba( 0,0,0,.4 )'
    ctx.fillStyle = gradient

    # Actual joystick part that is being moved
    ctx.beginPath()
    ctx.arc @radius, @radius, @radius, 0, 2 * Math.PI, false
    ctx.fill()
    ctx.stroke()
    sprite = game.add.sprite(@currentX - @radius, @currentY - @radius, bitmap)
    sprite.alpha = 0.4
    return sprite


