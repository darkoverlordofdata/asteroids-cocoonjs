class AsteroidDeathView

  dots: null
  x: 0
  y: 0
  rotation: 0
  stage: null
  first: true

  constructor: (parent, radius) ->
    @dots = []
    for i in [0...8]
      dot = new Dot(parent.game, parent.rnd, radius)
      @dots.push(dot)

  animate: (time) =>
    if @first
      @first = false
      for dot in @dots
        dot.graphics.x = @x
        dot.graphics.y = @y

    for dot in @dots
      dot.graphics.x += dot.velocity.x * time
      dot.graphics.y += dot.velocity.y * time

  dispose: () ->
    for dot in @dots
      dot.graphics.destroy()

class Dot

  velocity: null
  graphics: null
  x: 0
  y: 0

  constructor: (game, rnd, maxDistance) ->
    @graphics = game.add.graphics(0, 0)
    @graphics.beginFill(0xffffff)
    @graphics.drawCircle(0, 0, 1)
    @graphics.endFill()
    angle = rnd.nextDouble() * 2 * Math.PI
    distance = rnd.nextDouble() * maxDistance
    @graphics.x = Math.cos(angle) * distance
    @graphics.y = Math.sin(angle) * distance
    speed = rnd.nextDouble() * 10 + 10
    @velocity = new Point(Math.cos(angle)*speed, Math.sin(angle)*speed)
#    @stage.addChild(@graphics)