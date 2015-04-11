class HudSystem extends ash.tools.ListIteratingSystem

  constructor: (parent) ->

    super(parent.ash.nodes.HudNode, @updateNode)

  updateNode: (node, time) =>

    node.hud.view.setLives(node.state.lives)
    node.hud.view.setScore(node.state.hits)
    return # Void
