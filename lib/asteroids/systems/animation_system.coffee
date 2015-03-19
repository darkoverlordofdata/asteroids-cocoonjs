class AnimationSystem extends ash.tools.ListIteratingSystem

  constructor: () ->

    super(AnimationNode, @updateNode)

  updateNode: (node, time) =>

    node.animation.animation.animate(time)
    return # Void