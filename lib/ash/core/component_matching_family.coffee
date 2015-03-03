#+--------------------------------------------------------------------+
#| component_matching_family.coffee
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
# ComponentMatchingFamily
#
'use strict'
ash = require('../../../lib')

NodeList = ash.core.NodeList
NodePool = ash.core.NodePool

class Dictionary # inline
###
 * The default class for managing a NodeList. This class creates the NodeList and adds and removes
 * nodes to/from the list as the entities and the components in the engine change.
 *
 * It uses the basic entity matching pattern of an entity system - entities are added to the list if
 * they contain components matching all the public properties of the node class.
###
class ash.core.ComponentMatchingFamily #extends Family

  nodes         : null  # NodeList
  entities      : null  # Dictionary
  nodeClass     : null  # Class
  components    : null  # Dictionary
  nodePool      : null  # NodePool
  engine        : null  # Engine

  ###
   * The constructor. Creates a ComponentMatchingFamily to provide a NodeList for the
   * given node class.
   *
   * @param nodeClass The type of node to create and manage a NodeList for.
   * @param engine The engine that this family is managing teh NodeList for.
  ###
  constructor:(@nodeClass, @engine) ->
    @init()

  ###
   * Initialises the class. Creates the nodelist and other tools. Analyses the node to determine
   * what component types the node requires.
  ###
  init: ->
    @nodes = new NodeList()
    @entities = new Dictionary()
    @components = new Dictionary()
#    @nodePool = new NodePool(@nodeClass, @components)
    @nodePool = new NodePool(@nodeClass, @nodeClass.components)

    for name, type of @nodeClass.components
      @components[type.name] = type
    return # Void

  ###
   * The nodelist managed by this family. This is a reference that remains valid always
   * since it is retained and reused by Systems that use the list. i.e. we never recreate the list,
   * we always modify it in place.
  ###
  Object.defineProperties ComponentMatchingFamily::,
    nodeList: get: -> @nodes

  ###
   * Called by the engine when an entity has been added to it. We check if the entity should be in
   * this family's NodeList and add it if appropriate.
  ###
  newEntity: (entity) ->
    @addIfMatch(entity)
    return # Void

  ###
   * Called by the engine when a component has been added to an entity. We check if the entity is not in
   * this family's NodeList and should be, and add it if appropriate.
  ###
  componentAddedToEntity: (entity, componentClass) ->
    @addIfMatch(entity)
    return # Void

  ###
   * Called by the engine when a component has been removed from an entity. We check if the removed component
   * is required by this family's NodeList and if so, we check if the entity is in this this NodeList and
   * remove it if so.
  ###
  componentRemovedFromEntity: (entity, componentClass) ->
    name = if componentClass.name? then componentClass.name else componentClass
#    name = if 'string' is typeof componentClass then componentClass else componentClass.name
    if name of @components
      @removeIfMatch(entity)
    return # Void

  ###
   * Called by the engine when an entity has been rmoved from it. We check if the entity is in
   * this family's NodeList and remove it if so.
  ###
  removeEntity: (entity) ->
    @removeIfMatch(entity)
    return # Void

  ###
   * If the entity is not in this family's NodeList, tests the components of the entity to see
   * if it should be in this NodeList and adds it if so.
  ###
  addIfMatch:(entity) ->

    if (not @entities[entity.name]?)
      for name, componentClass of @nodeClass.components
        if (not entity.has(componentClass))
          return

      node = @nodePool.get()
      node.entity = entity

      for name, componentClass of @nodeClass.components
        node[name] = entity.get(componentClass)
      @entities[entity.name] = node
      @nodes.add(node)

    return # Void

  ###
   * Removes the entity if it is in this family's NodeList.
  ###
  removeIfMatch: (entity) ->

    if (entity.name of @entities)
      node = @entities[entity.name]
      delete @entities[entity.name]
      @nodes.remove(node)
      if (@engine.updating)
        @nodePool.cache(node)
        @engine.updateComplete.add(@releaseNodePoolCache)
      else
        @nodePool.dispose(node)

    return # Void

  ###
   * Releases the nodes that were added to the node pool during this engine update, so they can
   * be reused.
  ###
  releaseNodePoolCache: () =>
    @engine.updateComplete.remove(@releaseNodePoolCache)
    @nodePool.releaseCache()
    return # Void

  ###
   * Removes all nodes from the NodeList.
  ###
  cleanUp: () ->
    node = @nodes.head
    while node
      @entities.remove(node.entity)
      node = node.next

    @nodes.removeAll()
    return # Void



