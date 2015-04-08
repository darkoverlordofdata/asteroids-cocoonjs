class TouchableJoystick extends TouchableArea

  constructor: (options) -> #x, y, radius, backgroundColor )
    for i of options
      this[i] = options[i]
    @currentX = @currentX or @x
    @currentY = @currentY or @y
    return

  type: 'joystick'

  ###
  Checks if the touch is within the bounds of this direction
  ###
  check: (touchX, touchY) ->
    return true  if (Math.abs(touchX - @x) < @radius + (GameController.getPixels(GameController.options.touchRadius) / 2)) and (Math.abs(touchY - @y) < @radius + (GameController.getPixels(GameController.options.touchRadius) / 2))
    false


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
  touchMoveWrapper: (e) ->
    @currentX = GameController.normalizeTouchPositionX(e.clientX)
    @currentY = GameController.normalizeTouchPositionY(e.clientY)

    # Fire the user specified callback
    if @touchMove
      if @moveDetails.dx isnt @currentX - @x and @moveDetails.dy isnt @y - @currentY
        @moveDetails.dx = @currentX - @x # reverse so right is positive
        @moveDetails.dy = @y - @currentY
        @moveDetails.max = @radius + (GameController.options.touchRadius / 2)
        @moveDetails.normalizedX = @moveDetails.dx / @moveDetails.max
        @moveDetails.normalizedY = @moveDetails.dy / @moveDetails.max
        @touchMove @moveDetails

    # Mark this direction as inactive
    @active = true
    return

  draw: ->
    # wait until id is set
    return false  unless @id
    cacheId = @type + '' + @id + '' + @active
    cached = GameController.cachedSprites[cacheId]
    unless cached
      @stroke = @stroke or 2
      hw = 2 * (@radius + (GameController.options.touchRadius) + @stroke)
      bitmap = GameController.game.add.bitmapData(hw, hw)
      ctx = bitmap.context
      gradient = null
      ctx.lineWidth = @stroke
      if @active # Direction currently being touched
        gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, @radius)
        gradient.addColorStop 0, 'rgba( 200,200,200,.5 )'
        gradient.addColorStop 1, 'rgba( 200,200,200,.9 )'
        ctx.strokeStyle = '#000'
      else

        # STYLING FOR BUTTONS
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
      cached = GameController.cachedSprites[cacheId] = bitmap
      GameController.game.add.sprite @currentX - @radius, @currentY - @radius, cached
    base = GameController.game.add.bitmapData(hw, hw)

    # Draw the base that stays static
    base.context.fillStyle = '#444'
    base.context.beginPath()
    base.context.arc 0, 0, @radius * 0.7, 0, 2 * Math.PI, false
    base.context.fill()
    base.context.stroke()
    GameController.game.add.sprite @x, @y, base
    return

