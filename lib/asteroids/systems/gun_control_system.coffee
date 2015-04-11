class GunControlSystem extends ash.tools.ListIteratingSystem

  keyPoll     : null  # KeyPoll
  entities     : null  # EntityCreator
  buttons     : null

  constructor: (@parent) ->
    super(@parent.ash.nodes.GunControlNode, @updateNode)
    @keyPoll = @parent.keyPoll
    @entities = @parent.entities
    @buttons = @parent.controller?.buttons

  updateNode: (node, time) =>
    control = node.control
    position = node.position
    gun = node.gun
    # Fire!
    gun.shooting = @keyPoll.isDown(control.trigger) or @buttons?.fire
    gun.timeSinceLastShot += time
    if gun.shooting and gun.timeSinceLastShot >= gun.minimumShotInterval
      @entities.createUserBullet gun, position
      node.audio.play(ShootGun);
      gun.timeSinceLastShot = 0
    return # Void

