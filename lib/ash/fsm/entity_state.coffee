#+--------------------------------------------------------------------+
#| entity_state.coffee
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
# EntityState
#
'use strict'
ash = require('../../../lib')

StateComponentMapping = ash.fsm.StateComponentMapping

class Dictionary

###
 * Represents a state for an EntityStateMachine. The state contains any number of ComponentProviders which
 * are used to add components to the entity when this state is entered.
###
class ash.fsm.EntityState

  providers: null

  constructor: ->
    @providers = new Dictionary()

  ###
   * Add a new ComponentMapping to this state. The mapping is a utility class that is used to
   * map a component type to the provider that provides the component.
   *
   * @param type The type of component to be mapped
   * @return The component mapping to use when setting the provider for the component
  ###
  add: (type) ->
    return new StateComponentMapping(this, type.name)

  ###
   * Get the ComponentProvider for a particular component type.
   *
   * @param type The type of component to get the provider for
   * @return The ComponentProvider
  ###
  get: (type) ->
    return @providers[type]

  ###
   * To determine whether this state has a provider for a specific component type.
   *
   * @param type The type of component to look for a provider for
   * @return true if there is a provider for the given type, false otherwise
  ###
  has: (type) ->
    return @providers[type] isnt null