#+--------------------------------------------------------------------+
#| system_singleton_provider.coffee
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
# SystemSingletonProvider
#
'use strict'
ash = require('../../../lib')

###
 * This System provider always returns the same instance of the System. The instance
 * is created when first required and is of the type passed in to the constructor.
###
class ash.fsm.SystemSingletonProvider

  componentType: null
  instance: null
  systemPriority: 0

  ###
   * Constructor
   *
   * @param type The type of the single System instance
  ###
  constructor: (type) ->
    @componentType = type

  ###
   * Used to request a System from this provider
   *
   * @return The single instance
  ###
  getSystem: () ->
    if (not @instance)
      @instance = new @componentType()
    @instance

  Object.defineProperties SystemSingletonProvider::,
    ###
		 * Used to compare this provider with others. Any provider that returns the same single
		 * instance will be regarded as equivalent.
		 *
		 * @return The single instance
    ###
    identifier:
      get: -> return @getSystem()
    ###
     * The priority at which the System should be added to the Engine
    ###
    priority:
      get: -> @systemPriority
      set: (value) -> @systemPriority = value

