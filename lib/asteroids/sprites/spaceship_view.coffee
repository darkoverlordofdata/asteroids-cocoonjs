class SpaceshipView

  x: 0
  y: 0
  rotation: 0

  draw: (ctx) =>
    ctx.save()
    ctx.beginPath()
    ctx.translate @x, @y
    ctx.rotate @rotation
    ctx.fillStyle = "#FFFFFF"
    ctx.moveTo 10, 0
    ctx.lineTo -7, 7
    ctx.lineTo -4, 0
    ctx.lineTo -7, -7
    ctx.lineTo 10, 0
    ctx.fill()
    ctx.restore()
    return

