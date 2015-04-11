class RenderSystem extends ash.core.System

  stage     : null
  renderer  : null
  nodes     : null  # NodeList

  constructor: (parent) ->
    @nodes = parent.ash.nodes

  addToEngine: (engine) ->
    @nodes = engine.getNodeList(@nodes.RenderNode)
    node = @nodes.head

    while node
      @addToDisplay node
      node = node.next
#    @nodes.nodeAdded.add @addToDisplay, this
#    @nodes.nodeRemoved.add @removeFromDisplay, this
    return # Void

  addToDisplay:(node) ->

  removeFromDisplay: (node) ->


  removeFromEngine: (engine) ->
    @nodes = null
    return # Void

  update: (time) =>

    node = @nodes.head

    while node
      display = node.display
      graphic = display.graphic
      position = node.position
      graphic.x = position.position.x
      graphic.y = position.position.y
      graphic.rotation = position.rotation

      node = node.next

    return

