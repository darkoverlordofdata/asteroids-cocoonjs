
class ShipControlSystem extends ash.tools.ListIteratingSystem

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
  rnd: null
  warping: 0
  kount: 0
  width: 0
  height: 0

  constructor: (parent) ->
    super(parent.ash.nodes.PhysicsControlNode, @updateNode)
    @keyPoll = parent.keyPoll
    @rnd = parent.rnd
    @width = parent.width
    @height = parent.height
    @game = parent.game
    @controller = parent.controller

  updateNode: (node, time) =>

    control = node.control
    body = node.physics.body

    if @warping
      @warping--
      x = @rnd.nextInt(@width)
      y = @rnd.nextInt(@height)
      body.SetPosition(x:x, y:y)
      if @warping is 0
        node.display.graphic.draw(0xFFFFFF)
      else
        node.display.graphic.draw(colors[@rnd.nextInt(6)])
      return

    # Warp outa here!
    if @keyPoll.isDown(control.warp) or @controller?.buttons?.warp
      @controller.warp = false
      @warping = @rnd.nextInt(30)+30
      return

    dpad = @controller?.dpad
    if dpad?
      # Rotate Left
      if dpad.left
        rotation = body.GetAngularVelocity()
        body.SetAngularVelocity(rotation - control.rotationRate * time)

      # Rotate Right
      if dpad.right
        rotation = rotation || body.GetAngularVelocity()
        body.SetAngularVelocity(rotation + control.rotationRate * time)

      # Speed up
      if dpad.up
        rotation = rotation || body.GetAngularVelocity()
        v = body.GetLinearVelocity()
        v.x += (Math.cos(rotation) * control.accelerationRate * time * R)
        v.y += (Math.sin(rotation) * control.accelerationRate * time * R)

        body.SetAwake(true) unless IDTK # Cocoon Box2d
        body.SetLinearVelocity(v)




    joystick = @controller?.joystick
    if joystick?

      angle = Math.atan2(joystick.normalizedY, joystick.normalizedX) / Math.PI*180
      a1 = Math.abs(angle)
      rotation = body.GetAngularVelocity()
      if a1>135 and a1<179
        body.SetAngularVelocity(rotation - control.rotationRate * time)
      else if a1>1 and a1<45
        body.SetAngularVelocity(rotation + control.rotationRate * time)

      else if angle>45 and angle<135
        speed = 127/Math.sqrt(joystick.normalizedX*joystick.normalizedX + joystick.normalizedY*joystick.normalizedY)
        v = body.GetLinearVelocity()
        v.x += (Math.cos(rotation) * speed * time * R)
        v.y += (Math.sin(rotation) * speed * time * R)
        body.SetAwake(true) unless IDTK # Cocoon Box2d
        body.SetLinearVelocity(v)

    # Rotate Left
    if @keyPoll.isDown(control.left) # or @game.touchControl.cursors.left
      rotation = body.GetAngularVelocity()
      body.SetAngularVelocity(rotation - control.rotationRate * time)

    # Rotate Right
    if @keyPoll.isDown(control.right) # or @game.touchControl.cursors.right
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

