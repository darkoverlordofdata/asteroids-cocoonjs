class BulletAgeSystem extends ash.tools.ListIteratingSystem

  entities: null
  PhysicsSystem: null

  constructor: (parent, @PhysicsSystem) ->
    super(parent.ash.nodes.BulletAgeNode, @updateNode)
    @entities = parent.entities

  updateNode: (node, time) =>

    bullet = node.bullet
    bullet.lifeRemaining -= time
    if bullet.lifeRemaining <= 0
      node.display.graphic.dispose()
      @PhysicsSystem.deadPool.push(node.physics.body)
      @entities.destroyEntity node.entity
    return # Void

