class TouchableButton extends TouchableArea

  constructor: (options) -> #x, y, radius, backgroundColor )
    for i of options
      if i is 'x'
        this[i] = GameController.getPixels(options[i], 'x')
      else if i is 'x' or i is 'radius'
        this[i] = GameController.getPixels(options[i], 'y')
      else
        this[i] = options[i]
    @draw()

  type: 'button'

  ###
  Checks if the touch is within the bounds of this direction
  ###
  check: (touchX, touchY) ->
    return true  if (Math.abs(touchX - @x) < @radius + (GameController.options.touchRadius / 2)) and (Math.abs(touchY - @y) < @radius + (GameController.options.touchRadius / 2))
    false

  draw: ->
    cacheId = @type + '' + @id + '' + @active
    cached = GameController.cachedSprites[cacheId]
    unless cached
      bitmap = GameController.game.add.bitmapData(2 * (@radius + @stroke), 2 * (@radius + @stroke))
      ctx = bitmap.context
      ctx.lineWidth = @stroke
      gradient = ctx.createRadialGradient(@radius, @radius, 1, @radius, @radius, @radius)
      textShadowColor = undefined
      switch @backgroundColor
        when 'blue'
          gradient.addColorStop 0, 'rgba(123, 181, 197, 0.6)'
          gradient.addColorStop 1, '#105a78'
          textShadowColor = '#0A4861'
        when 'green'
          gradient.addColorStop 0, 'rgba(29, 201, 36, 0.6)'
          gradient.addColorStop 1, '#107814'
          textShadowColor = '#085C0B'
        when 'red'
          gradient.addColorStop 0, 'rgba(165, 34, 34, 0.6)'
          gradient.addColorStop 1, '#520101'
          textShadowColor = '#330000'
        when 'yellow'
          gradient.addColorStop 0, 'rgba(219, 217, 59, 0.6)'
          gradient.addColorStop 1, '#E8E10E'
          textShadowColor = '#BDB600'
        when 'white'
        else
          gradient.addColorStop 0, 'rgba( 255,255,255,.3 )'
          gradient.addColorStop 1, '#eee'
      if @active
        ctx.fillStyle = textShadowColor
      else
        ctx.fillStyle = gradient
      ctx.strokeStyle = textShadowColor
      ctx.beginPath()

      #ctx.arc( this.x, this.y, this.radius, 0 , 2 * Math.PI, false );
      ctx.arc bitmap.width / 2, bitmap.width / 2, @radius, 0, 2 * Math.PI, false
      ctx.fill()
      ctx.stroke()
      if @label

        # Text Shadow
        ctx.fillStyle = textShadowColor
        ctx.font = 'bold ' + (@fontSize or bitmap.height * 0.35) + 'px Verdana'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText @label, bitmap.height / 2 + 2, bitmap.height / 2 + 2
        ctx.fillStyle = @fontColor
        ctx.font = 'bold ' + (@fontSize or bitmap.height * 0.35) + 'px Verdana'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText @label, bitmap.height / 2, bitmap.height / 2
      cached = GameController.cachedSprites[cacheId] = bitmap
      GameController.game.add.sprite @x, @y, cached
    return

