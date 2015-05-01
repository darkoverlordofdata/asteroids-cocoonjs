class AsteroidSprite extends Phaser.Sprite

  constructor: (parent, radius) ->

    game = parent.game
    rnd = parent.rnd

    bitmap = game.add.bitmap(2*radius, 2*radius)
    ctx = bitmap.context
    ctx.beginPath()
    ctx.fillStyle = '#FFFFFF'
    ctx.moveTo radius, 0
    angle = 0
    while angle < Math.PI * 2
      length = (0.75 + rnd.nextDouble() * 0.25) * radius
      posX = Math.cos(angle) * length
      posY = Math.sin(angle) * length
      ctx.lineTo posX, posY
      angle += rnd.nextDouble() * 0.5

    ctx.lineTo radius, 0
    ctx.fill()

    super 0, 0, bitmap

