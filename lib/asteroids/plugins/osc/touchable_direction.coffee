class TouchableDirection extends TouchableArea

  constructor: (options) ->
    for i of options
      if i is 'x'
        this[i] = GameController.getPixels(options[i], 'x')
      else if i is 'y' or i is 'height' or i is 'width'
        this[i] = GameController.getPixels(options[i], 'y')
      else
        this[i] = options[i]
    @draw()

  bitmap: null
  type: 'direction'

  ###
  Checks if the touch is within the bounds of this direction
  ###
  check: (touchX, touchY) ->
    distanceX = undefined
    distanceY = undefined
    # left
    # right
    # top
    # bottom
    return true  if (Math.abs(touchX - @x) < (GameController.options.touchRadius / 2) or (touchX > @x)) and (Math.abs(touchX - (@x + @width)) < (GameController.options.touchRadius / 2) or (touchX < @x + @width)) and (Math.abs(touchY - @y) < (GameController.options.touchRadius / 2) or (touchY > @y)) and (Math.abs(touchY - (@y + @height)) < (GameController.options.touchRadius / 2) or (touchY < @y + @height))
    false

  draw: ->
    cacheId = @type + '' + @id + '' + @active
    cached = GameController.cachedSprites[cacheId]
    gradient = null
    unless cached
      bitmap = GameController.game.add.bitmapData(@width + 2 * @stroke, @height + 2 * @stroke)
      ctx = bitmap.context
      opacity = @opacity or 0.9
      # Direction currently being touched
      opacity *= 0.5  unless @active
      switch @direction
        when 'up'
          gradient = ctx.createLinearGradient(0, 0, 0, @height)
          gradient.addColorStop 0, 'rgba( 0, 0, 0, ' + (opacity * 0.5) + ' )'
          gradient.addColorStop 1, 'rgba( 0, 0, 0, ' + opacity + ' )'
        when 'left'
          gradient = ctx.createLinearGradient(0, 0, @width, 0)
          gradient.addColorStop 0, 'rgba( 0, 0, 0, ' + (opacity * 0.5) + ' )'
          gradient.addColorStop 1, 'rgba( 0, 0, 0, ' + opacity + ' )'
        when 'right'
          gradient = ctx.createLinearGradient(0, 0, @width, 0)
          gradient.addColorStop 0, 'rgba( 0, 0, 0, ' + opacity + ' )'
          gradient.addColorStop 1, 'rgba( 0, 0, 0, ' + (opacity * 0.5) + ' )'
        when 'down'
        else
          gradient = ctx.createLinearGradient(0, 0, 0, @height)
          gradient.addColorStop 0, 'rgba( 0, 0, 0, ' + opacity + ' )'
          gradient.addColorStop 1, 'rgba( 0, 0, 0, ' + (opacity * 0.5) + ' )'
      ctx.fillStyle = gradient
      ctx.fillRect 0, 0, @width, @height
      ctx.lineWidth = @stroke
      ctx.strokeStyle = 'rgba( 255, 255, 255, 0.1 )'
      ctx.strokeRect 0, 0, @width, @height
      cached = GameController.cachedSprites[cacheId] = bitmap
      GameController.game.add.sprite @x, @y, cached
    return

