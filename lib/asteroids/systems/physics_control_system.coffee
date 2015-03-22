
class PhysicsControlSystem extends ash.tools.ListIteratingSystem

  R = window.devicePixelRatio
  IDTK = window.ext?.IDTK_SRV_BOX2D?
  b2Vec2 = Box2D.Common.Math.b2Vec2

  keyPoll: null # KeyPoll

  constructor: (@keyPoll) ->
    super(PhysicsControlNode, @updateNode)

  updateNode: (node, time) =>

    control = node.control
    body = node.physics.body

    # Rotate Left
    if @keyPoll.isDown(control.left)
      rotation = body.GetAngularVelocity()
      console.log rotation
      body.SetAngularVelocity(rotation - control.rotationRate * time)

    # Rotate Right
    if @keyPoll.isDown(control.right)
      rotation = rotation || body.GetAngularVelocity()
      console.log rotation
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

