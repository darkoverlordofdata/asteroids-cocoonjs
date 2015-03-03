#+--------------------------------------------------------------------+
#| family.coffee
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
# Family
#
'use strict'
ash = require('../../../lib')

###
 * The interface for classes that are used to manage NodeLists (set as the familyClass property
 * in the Engine object). Most developers don't need to use this since the default implementation
 * is used by default and suits most needs.
###
class ash.core.Family

  nodes: null

  ###
   * Returns the NodeList managed by this class. This should be a reference that remains valid always
   * since it is retained and reused by Systems that use the list. i.e. never recreate the list,
   * always modify it in place.
  ###
  constructor: ->
    Object.defineProperties @,
      nodeList: get: -> this.nodes

  ###
   * An entity has been added to the engine. It may already have components so test the entity
   * for inclusion in this family's NodeList.
  ###
  newEntity: (entity) ->
    throw new Error('Method must be overriden')

  ###
   * An entity has been removed from the engine. If it's in this family's NodeList it should be removed.
  ###
  removeEntity: (entity) ->
    throw new Error('Method must be overriden')

  ###
   * A component has been added to an entity. Test whether the entity's inclusion in this family's
   * NodeList should be modified.
  ###
  componentAddedToEntity: (entity, componentClass) ->
    throw new Error('Method must be overriden')

  ###
   * A component has been removed from an entity. Test whether the entity's inclusion in this family's
   * NodeList should be modified.
  ###
  componentRemovedFromEntity: (entity, componentClass) ->
    throw new Error('Method must be overriden')

  ###
   * The family is about to be discarded. Clean up all properties as necessary. Usually, you will
   * want to empty the NodeList at this time.
  ###
  cleanUp: () ->
    throw new Error('Method must be overriden')

