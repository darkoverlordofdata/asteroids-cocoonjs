class DeathThroesSystem extends ash.tools.ListIteratingSystem

  creator: null

  constructor: (@creator) ->

    super(DeathThroesNode, @updateNode)

  updateNode: (node, time) =>

    dead = node.dead
    dead.countdown -= time
    if (dead.countdown <= 0)
      @creator.destroyEntity(node.entity)
      PhysicsSystem.deadPool.push(dead.body)

    return # Void
