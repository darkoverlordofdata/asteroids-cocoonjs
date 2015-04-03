class BulletAgeSystem extends ash.tools.ListIteratingSystem

  creator: null
  PhysicsSystem: null

  constructor: (@creator, @PhysicsSystem) ->

    super(BulletAgeNode, @updateNode)

  updateNode: (node, time) =>

    bullet = node.bullet
    bullet.lifeRemaining -= time
    if bullet.lifeRemaining <= 0
      node.display.graphic.dispose()
      @PhysicsSystem.deadPool.push(node.physics.body)
      @creator.destroyEntity node.entity
    return # Void

