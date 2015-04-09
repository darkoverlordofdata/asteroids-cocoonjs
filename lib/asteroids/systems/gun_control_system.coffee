class GunControlSystem extends ash.tools.ListIteratingSystem

  keyPoll     : null  # KeyPoll
  creator     : null  # EntityCreator

  constructor: (@parent) ->
    super(GunControlNode, @updateNode)
    @keyPoll = @parent.keyPoll
    @creator = @parent.creator
    @pad = @parent.pad

  updateNode: (node, time) =>
    control = node.control
    position = node.position
    gun = node.gun
    # Fire!
    gun.shooting = @keyPoll.isDown(control.trigger) or @pad?.buttons?.fire
    gun.timeSinceLastShot += time
    if gun.shooting and gun.timeSinceLastShot >= gun.minimumShotInterval
      @creator.createUserBullet gun, position
      node.audio.play(ShootGun);
      gun.timeSinceLastShot = 0
    return # Void

