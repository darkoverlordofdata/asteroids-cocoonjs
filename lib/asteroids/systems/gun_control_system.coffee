class GunControlSystem extends ash.tools.ListIteratingSystem

  keyPoll     : null  # KeyPoll
  creator     : null  # EntityCreator

  constructor: (@parent) ->
    super(GunControlNode, @updateNode)
    @keyPoll = @parent.keyPoll
    @creator = @parent.creator
    @controller = @parent.controller

  updateNode: (node, time) =>
    control = node.control
    position = node.position
    gun = node.gun
    # Fire!
    gun.shooting = @keyPoll.isDown(control.trigger) or @controller?.buttons?.fire
    gun.timeSinceLastShot += time
    if gun.shooting and gun.timeSinceLastShot >= gun.minimumShotInterval
      @creator.createUserBullet gun, position
      node.audio.play(ShootGun);
      gun.timeSinceLastShot = 0
    return # Void

