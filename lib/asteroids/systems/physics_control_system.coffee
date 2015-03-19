
class PhysicsControlSystem extends ash.tools.ListIteratingSystem

  b2Vec2                = Box2D.Common.Math.b2Vec2

  keyPoll: null # KeyPoll

  constructor: (@keyPoll) ->
    super(PhysicsControlNode, @updateNode)

  updateNode: (node, time) =>

    control = node.control
    body = node.physics.body

    rotation = body.GetAngularVelocity()

    if @keyPoll.isDown(control.left) and rotation < 10
      body.ApplyTorque(rotation/1000 - control.rotationRate / Math.PI * time)

    if @keyPoll.isDown(control.right) and rotation < 10
      body.ApplyTorque(rotation/1000 + control.rotationRate / Math.PI * time)

    if @keyPoll.isDown(control.accelerate)
      {x, y} = body.GetLinearVelocity()
      x += Math.cos(rotation) * control.accelerationRate * time
      y += Math.sin(rotation) * control.accelerationRate * time
      body.ApplyForce(new b2Vec2(x, y), body.GetWorldCenter())

    return # Void

