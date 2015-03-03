#+--------------------------------------------------------------------+
#| engine_state.coffee
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
# EngineState
#
'use strict'
ash = require('../../../lib')

SystemInstanceProvider = ash.fsm.SystemInstanceProvider
SystemSingletonProvider = ash.fsm.SystemSingletonProvider
DynamicSystemProvider = ash.fsm.DynamicSystemProvider
StateSystemMapping = ash.fsm.StateSystemMapping

###
 * Represents a state for a SystemStateMachine. The state contains any number of SystemProviders which
 * are used to add Systems to the Engine when this state is entered.
###
class ash.fsm.EngineState

  providers: null

  constructor: ->
    @providers = []

  ###
   * Creates a mapping for the System type to a specific System instance. A
   * SystemInstanceProvider is used for the mapping.
   *
   * @param system The System instance to use for the mapping
   * @return This StateSystemMapping, so more modifications can be applied
  ###
  addInstance: (system) ->
    return @addProvider(new SystemInstanceProvider(system))

  ###
   * Creates a mapping for the System type to a single instance of the provided type.
   * The instance is not created until it is first requested. The type should be the same
   * as or extend the type for this mapping. A SystemSingletonProvider is used for
   * the mapping.
   *
   * @param type The type of the single instance to be created. If omitted, the type of the
   * mapping is used.
   * @return This StateSystemMapping, so more modifications can be applied
  ###
  addSingleton: (type) ->
    return @addProvider(new SystemSingletonProvider(type))

  ###
   * Creates a mapping for the System type to a method call.
   * The method should return a System instance. A DynamicSystemProvider is used for
   * the mapping.
   *
   * @param method The method to provide the System instance.
   * @return This StateSystemMapping, so more modifications can be applied.
  ###
  addMethod: (method) ->
    return @addProvider(new DynamicSystemProvider(method))

  ###
   * Adds any SystemProvider.
   *
   * @param provider The component provider to use.
   * @return This StateSystemMapping, so more modifications can be applied.
  ###
  addProvider: (provider) ->
    mapping = new StateSystemMapping(this, provider)
    @providers.push(provider)
    return mapping