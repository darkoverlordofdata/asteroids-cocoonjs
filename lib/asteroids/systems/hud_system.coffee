class HudSystem extends ash.tools.ListIteratingSystem

  constructor: () ->

    super(HudNode, @updateNode)

  updateNode: (node, time) =>

    node.hud.view.setLives(node.state.lives)
    node.hud.view.setScore(node.state.hits)
    return # Void
