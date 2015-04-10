class SpaceshipDeathView

  shape1: null
  shape2: null
  vel1: null
  vel2: null
  rot1: null
  rot2: null
  first: true
  x: 0
  y: 0
  rotation: 0
  check: true

  constructor: (parent) ->

    game = parent.game
    rnd = parent.rnd

    @shape1 = game.add.graphics(0, 0)
    @shape1.clear()
    @shape1.beginFill( 0xFFFFFF )
    @shape1.moveTo( 10, 0 )
    @shape1.lineTo( -7, 7 )
    @shape1.lineTo( -4, 0 )
    @shape1.lineTo( 10, 0 )
    @shape1.endFill()

    @shape2 = game.add.graphics(0, 0)
    @shape2.clear()
    @shape2.beginFill( 0xFFFFFF )
    @shape2.moveTo( 10, 0 )
    @shape2.lineTo( -7, -7 )
    @shape2.lineTo( -4, 0 )
    @shape2.lineTo( 10, 0 )
    @shape2.endFill()

    @vel1 = new Point(rnd.nextDouble() * 10 - 5, rnd.nextDouble() * 10 + 10)
    @vel2 = new Point(rnd.nextDouble() * 10 - 5, - (rnd.nextDouble() * 10 + 10))
    
    @rot1 = rnd.nextDouble() * 300 - 150
    @rot2 = rnd.nextDouble() * 300 - 150

  dispose: ->
    @shape1.destroy()
    @shape2.destroy()


  animate: (time) =>

    if @first
      @first = false
      @shape1.x = @shape2.x = @x
      @shape1.y = @shape2.y = @y
      @shape1.rotation = @shape2.rotation = @rotation

    @shape1.x += @vel1.x * time;
    @shape1.y += @vel1.y * time;
    @shape1.rotation += @rot1 * time;
    @shape2.x += @vel2.x * time;
    @shape2.y += @vel2.y * time;
    @shape2.rotation += @rot2 * time;

    return


