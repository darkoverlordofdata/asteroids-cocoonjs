'use strict'
ash = require('../../../lib')
asteroids = require('../../../example')

RenderNode = asteroids.nodes.RenderNode

class asteroids.systems.RenderSystem extends ash.core.System

  graphic   : null  # 2D Context
  nodes     : null  # NodeList

  constructor: (@graphic) ->

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

    @graphic.save()
    @graphic.translate 0, 0
    @graphic.rotate 0
    @graphic.clearRect 0, 0, @graphic.canvas.width, @graphic.canvas.height
    node = @nodes.head

    while node

      display = node.display
      graphic = display.graphic
      position = node.position
      graphic.x = position.position.x
      graphic.y = position.position.y
      graphic.rotation = position.rotation
      graphic.draw()
      node = node.next

    @graphic.restore()
    return # Void
