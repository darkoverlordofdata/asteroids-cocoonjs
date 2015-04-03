class DeathThroesSystem extends ash.tools.ListIteratingSystem

  creator: null
  PhysicsSystem: null

  constructor: (@creator, @PhysicsSystem) ->

    super(DeathThroesNode, @updateNode)

  updateNode: (node, time) =>

    dead = node.dead
    dead.countdown -= time
    if (dead.countdown <= 0)
      @creator.destroyEntity(node.entity)
      node.display.graphic.dispose()
      @PhysicsSystem.deadPool.push(dead.body)

    return # Void
