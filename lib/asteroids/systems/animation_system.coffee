class AnimationSystem extends ash.tools.ListIteratingSystem

  constructor: (parent) ->

    super(parent.ash.nodes.AnimationNode, @updateNode)

  updateNode: (node, time) =>

    node.animation.animation.animate(time)
    return # Void