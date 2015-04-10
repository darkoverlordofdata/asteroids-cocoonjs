class GunControlSystem extends ash.tools.ListIteratingSystem

  keyPoll     : null  # KeyPoll
  creator     : null  # EntityCreator
  buttons     : null

  constructor: (@parent) ->
    super(GunControlNode, @updateNode)
    @keyPoll = @parent.keyPoll
    @creator = @parent.creator
    @buttons = @parent.controller?.buttons

  updateNode: (node, time) =>
    control = node.control
    position = node.position
    gun = node.gun
    # Fire!
    gun.shooting = @keyPoll.isDown(control.trigger) or @buttons?.fire
    gun.timeSinceLastShot += time
    if gun.shooting and gun.timeSinceLastShot >= gun.minimumShotInterval
      @creator.createUserBullet gun, position
      node.audio.play(ShootGun);
      gun.timeSinceLastShot = 0
    return # Void

