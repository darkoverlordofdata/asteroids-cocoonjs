#+--------------------------------------------------------------------+
#| component_singleton_provider.coffee
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
# ComponentSingletonProvider
#
'use strict'
ash = require('../../../lib')

class ash.fsm.ComponentSingletonProvider

  componentType: null
  instance: null

  ###
   * Constructor
   *
   * @param type The type of the single instance
  ###
  constructor: (type) ->
    @componentType = type

    ###
     * Used to request a component from this provider
     *
     * @return The instance
    ###
  getComponent: () ->
    if not @instance?
      @instance = new @componentType()
    return @instance

  ###
   * Used to compare this provider with others. Any provider that returns the same component
   * instance will be regarded as equivalent.
   *
   * @return The instance
  ###
  Object.defineProperties ComponentSingletonProvider::,
    identifier: get: -> return @getComponent()



