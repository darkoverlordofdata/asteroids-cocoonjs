class DeathThroesSystem extends ash.tools.ListIteratingSystem

  entities: null
  PhysicsSystem: null

  constructor: (parent, @PhysicsSystem) ->
    super(parent.ash.nodes.DeathThroesNode, @updateNode)
    @entities = parent.entities

  updateNode: (node, time) =>

    dead = node.dead
    dead.countdown -= time
    if (dead.countdown <= 0)
      @entities.destroyEntity(node.entity)
      node.display.graphic.dispose()
      @PhysicsSystem.deadPool.push(dead.body)

    return # Void
