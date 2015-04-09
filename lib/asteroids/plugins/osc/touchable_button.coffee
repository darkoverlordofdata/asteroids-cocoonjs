class TouchableButton extends TouchableArea

  uniqueId = 0

  constructor: (controller, options) -> #x, y, radius, backgroundColor )
    for property, value of options
      if property is 'x'
        @[property] = controller.getPixels(value, 'x')
      else if property is 'x' or property is 'radius'
        @[property] = controller.getPixels(value, 'y')
      else
        @[property] = value

    super controller
    @sprite = @createSprite(controller.game)

  sprite: null
  type: 'button'
  fontFamily: 'opendyslexic'
  id: -1

  ###
  Checks if the touch is within the bounds of this direction
  ###
  check: (touchX, touchY) ->
    return true  if (Math.abs(touchX - @x) < @radius + (@controller.options.touchRadius / 2)) and (Math.abs(touchY - @y) < @radius + (@controller.options.touchRadius / 2))
    false

  draw: ->
    return

  setActive: (active) =>
    @sprite.alpha = if active then 1.0 else 0.8
    return


  createSprite: (game) ->
    bitmap = game.add.bitmapData(2 * (@radius + @stroke), 2 * (@radius + @stroke))
    ctx = bitmap.context
    ctx.lineWidth = @stroke
    gradient = ctx.createRadialGradient(@radius, @radius, 1, @radius, @radius, @radius)
    textShadowColor = undefined
    switch @backgroundColor || 'white'
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
        gradient.addColorStop 0, 'rgba( 255,255,255,.3 )'
        gradient.addColorStop 1, '#eee'

    ctx.fillStyle = gradient
    ctx.strokeStyle = textShadowColor
    ctx.beginPath()
    ctx.arc bitmap.width / 2, bitmap.width / 2, @radius, 0, 2 * Math.PI, false
    ctx.fill()
    ctx.stroke()
    if @label

      # Text Shadow
      ctx.fillStyle = textShadowColor
      ctx.font = 'bold ' + (@fontSize or bitmap.height * 0.35) + 'px '+@fontFamily
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText @label, bitmap.height / 2 + 2, bitmap.height / 2 + 2
      ctx.fillStyle = @fontColor
      ctx.font = 'bold ' + (@fontSize or bitmap.height * 0.35) + 'px '+@fontFamily
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText @label, bitmap.height / 2, bitmap.height / 2

    sprite = game.add.sprite(@x, @y, bitmap)
    sprite.alpha = 0.8
    sprite.inputEnabled = true
    sprite.events.onInputDown.add(@touchStartWrapper, this)
    sprite.events.onInputUp.add(@touchEndWrapper, this)
    return sprite

