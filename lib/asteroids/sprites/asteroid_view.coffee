class AsteroidView

  x: 0
  y: 0
  rotation: 0
  radius: 0
  points: null


  constructor: (@radius) ->
    @width = @radius
    @height = @radius
    @points = []
    angle = 0
    while angle < Math.PI * 2
      length = (0.75 + rnd.nextDouble() * 0.25) * @radius
      posX = Math.cos(angle) * length
      posY = Math.sin(angle) * length
      @points.push
        x: posX
        y: posY

      angle += rnd.nextDouble() * 0.5

  draw: (ctx) =>
    ctx.save()
    ctx.beginPath()
    ctx.translate @x, @y
    ctx.rotate @rotation
    ctx.fillStyle = "#FFFFFF"
    ctx.moveTo @radius, 0
    i = 0

    while i < @points.length
      ctx.lineTo @points[i].x, @points[i].y
      ++i
    ctx.lineTo @radius, 0
    ctx.fill()
    ctx.restore()
    return


