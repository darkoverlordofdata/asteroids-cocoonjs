
class PhysicsControlSystem extends ash.tools.ListIteratingSystem

  R = window.devicePixelRatio
  IDTK = window.ext?.IDTK_SRV_BOX2D?
  b2Vec2 = Box2D.Common.Math.b2Vec2

  colors = [
    0xff0000,
    0x00ff00,
    0x0000ff,
    0xff00ff,
    0x00ffff,
    0xffff00
  ]
  keyPoll: null # KeyPoll
  warping: 0

  constructor: (@keyPoll, @config) ->
    super(PhysicsControlNode, @updateNode)

  updateNode: (node, time) =>

    control = node.control
    body = node.physics.body

    if @warping
      @warping--
      x = rnd.nextInt(@config.width)
      y = rnd.nextInt(@config.height)
      body.SetPosition(x:x, y:y)
      if @warping is 0
        node.display.graphic.draw(0xFFFFFF)
      else
        node.display.graphic.draw(colors[rnd.nextInt(6)])
      return

    # Warp outa here!
    if @keyPoll.isDown(control.warp)
      @warping = rnd.nextInt(30)+30
      return

    # Rotate Left
    if @keyPoll.isDown(control.left)
      rotation = body.GetAngularVelocity()
      body.SetAngularVelocity(rotation - control.rotationRate * time)

    # Rotate Right
    if @keyPoll.isDown(control.right)
      rotation = rotation || body.GetAngularVelocity()
      body.SetAngularVelocity(rotation + control.rotationRate * time)

    # Speed up
    if @keyPoll.isDown(control.accelerate)
      rotation = rotation || body.GetAngularVelocity()
      v = body.GetLinearVelocity()
      v.x += (Math.cos(rotation) * control.accelerationRate * time * R)
      v.y += (Math.sin(rotation) * control.accelerationRate * time * R)
      body.SetAwake(true) unless IDTK # Cocoon Box2d
      body.SetLinearVelocity(v)

    return # Void

