#+--------------------------------------------------------------------+
#| system_list.coffee
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
# System List
#
'use strict'
ash = require('../../../lib')

###
 * Used internally, this is an ordered list of Systems for use by the engine update loop.
###
class ash.core.SystemList

  head: null  # System
  tail: null  # System

  add: (system) ->
    if (not @head)
      @head = @tail = system
      system.next = system.previous = null
    else
      node = @tail
      while (node)
        if (node.priority <= system.priority)
          break
        node = node.previous

      if (node is @tail)
        @tail.next = system
        system.previous = @tail
        system.next = null
        @tail = system
      else if (not node)
        system.next = @head
        system.previous = null
        @head.previous = system
        @head = system
      else
        system.next = node.next
        system.previous = node
        node.next.previous = system
        node.next = system
    return # Void

  remove: (system) ->
    if (@head is system)
      @head = @head.next
    if (@tail == system)
      @tail = @tail.previous

    if (system.previous)
      system.previous.next = system.next
    if (system.next)
      system.next.previous = system.previous
    # N.B. Don't set system.next and system.previous to null because that will break the list iteration if system is the current system in the iteration.
    return # Void

  removeAll: () ->
    while (@head)
      system = @head
      @head = @head.next
      system.previous = null
      system.next = null
    @tail = null
    return # Void

  get: (type) ->
    system = @head
    while system
      return system if (system.constructor is type)
      system = system.next

    return null
