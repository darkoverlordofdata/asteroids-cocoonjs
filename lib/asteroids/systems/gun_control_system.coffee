class GunControlSystem extends ash.tools.ListIteratingSystem

  keyPoll     : null  # KeyPoll
  creator     : null  # EntityCreator

  constructor: (@keyPoll, @creator) ->
    super(GunControlNode, @updateNode)

  updateNode: (node, time) =>
    control = node.control
    position = node.position
    gun = node.gun
    # Fire!
    gun.shooting = @keyPoll.isDown(control.trigger)
    gun.timeSinceLastShot += time
    if gun.shooting and gun.timeSinceLastShot >= gun.minimumShotInterval
      @creator.createUserBullet gun, position
      #node.audio.play(ShootGun);
      gun.timeSinceLastShot = 0
    return # Void
