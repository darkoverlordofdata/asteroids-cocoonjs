'use strict'
#ash = require('../../../lib')
asteroids = require('../../../lib')

RenderNode = asteroids.nodes.RenderNode

class asteroids.systems.RenderSystem extends ash.core.System

  graphic   : null  # 2D Context
  nodes     : null  # NodeList

  constructor: (@ctx) ->

  addToEngine: (engine) ->
    @nodes = engine.getNodeList(RenderNode)
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

    @ctx.save()
    @ctx.translate 0, 0
    @ctx.rotate 0
    @ctx.clearRect 0, 0, @ctx.canvas.width, @ctx.canvas.height
    node = @nodes.head

    while node

      display = node.display
      graphic = display.graphic
      position = node.position
      graphic.x = position.position.x
      graphic.y = position.position.y
      graphic.rotation = position.rotation
      graphic.draw(@ctx)
      node = node.next

    @ctx.restore()
    return # Void
