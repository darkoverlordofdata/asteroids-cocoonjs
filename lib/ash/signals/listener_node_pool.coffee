#+--------------------------------------------------------------------+
#| listener_node_pool.coffee
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2015
#+--------------------------------------------------------------------+
#|
#| This file is a part of ash.coffee
#|
#| ash.coffee is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
#
# Listener Node Pool
#
'use strict'
ash = require('../../../lib')

ListenerNode = ash.signals.ListenerNode

###
 * This internal class maintains a pool of deleted listener nodes for reuse by framework. This reduces
 * the overhead from object creation and garbage collection.
###
class ash.signals.ListenerNodePool

  tail: null
  cacheTail: null

  get: () ->
    if (@tail isnt null)
      node = @tail
      @tail = @tail.previous
      node.previous = null
      return node
    else
      return new ListenerNode();

  dispose: (node) ->
    node.listener = null
    node.once = false
    node.next = null
    node.previous = @tail
    @tail = node
    return # Void

  cache: (node) ->
    node.listener = null
    node.previous = @cacheTail
    @cacheTail = node
    return # Void

  releaseCache: () ->
    while (@cacheTail isnt null)
      node = @cacheTail
      @cacheTail = node.previous;
      node.next = null;
      node.previous = @tail;
      @tail = node;

    return # Void
