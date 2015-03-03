#+--------------------------------------------------------------------+
#| entity_list.coffee
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
# Entity List
#
'use strict'
ash = require('../../../lib')

###
 * An internal class for a linked list of entities. Used inside the framework for
 * managing the entities.
###
class ash.core.EntityList

  head: null  # Entity
  tail: null  # Entity

  add: (entity) ->
    if (not @head)
      @head = @tail = entity
      entity.next = entity.previous = null
    else
      @tail.next = entity
      entity.previous = @tail
      entity.next = null
      @tail = entity
    return # Void

  remove: (entity) ->
    if (@head is entity)
      @head = @head.next
    if (@tail is entity)
      @tail = @tail.previous
    if (entity.previous)
      entity.previous.next = entity.next
    if (entity.next)
      entity.next.previous = entity.previous
    # N.B. Don't set entity.next and entity.previous to null because that will break the list iteration if entity is the current entity in the iteration.
    return # Void

  removeAll: () ->
    while (@head)
      entity = @head
      @head = @head.next
      entity.previous = null
      entity.next = null

    @tail = null
    return # Void

