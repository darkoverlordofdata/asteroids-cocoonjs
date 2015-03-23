class SpaceshipDeathView


  stage: null
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

  constructor: (@stage) ->

    @shape1 = new PIXI.Graphics()
    @shape1.clear()
    @shape1.beginFill( 0xFFFFFF )
    @shape1.moveTo( 10 * window.devicePixelRatio, 0 )
    @shape1.lineTo( -7 * window.devicePixelRatio, 7 * window.devicePixelRatio )
    @shape1.lineTo( -4 * window.devicePixelRatio, 0 )
    @shape1.lineTo( 10 * window.devicePixelRatio, 0 )
    @shape1.endFill()

    @shape2 = new PIXI.Graphics()
    @shape2.clear()
    @shape2.beginFill( 0xFFFFFF )
    @shape2.moveTo( 10 * window.devicePixelRatio, 0 )
    @shape2.lineTo( -7 * window.devicePixelRatio, -7 * window.devicePixelRatio )
    @shape2.lineTo( -4 * window.devicePixelRatio, 0 )
    @shape2.lineTo( 10 * window.devicePixelRatio, 0 )
    @shape2.endFill()
#    @stage.addChild(@shape1)
#    @stage.addChild(@shape2)

    @vel1 = new Point(rnd.nextDouble() * 10 - 5, rnd.nextDouble() * 10 + 10)
    @vel2 = new Point(rnd.nextDouble() * 10 - 5, - (rnd.nextDouble() * 10 + 10))
    
    @rot1 = rnd.nextDouble() * 300 - 150
    @rot2 = rnd.nextDouble() * 300 - 150

  dispose: ->
    @stage.removeChild(@shape1)
    @stage.removeChild(@shape2)


  animate: (time) =>

    if @first
      @first = false
      @stage.addChild(@shape1)
      @stage.addChild(@shape2)
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


