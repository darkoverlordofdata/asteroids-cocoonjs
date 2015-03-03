#+--------------------------------------------------------------------+
#| dynamic_component_provider.coffee
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
# DynamicComponentProvider
#
'use strict'
ash = require('../../../lib')

class ash.fsm.DynamicComponentProvider


  _closure: null

  ###
   * Constructor
   *
   * @param closure The function that will return the component instance when called.
  ###
  constructor: (closure) ->
    @_closure = closure
    ###
     * Used to request a component from this provider
     *
     * @return The instance
    ###
  getComponent: () ->
    return @_closure

  ###
   * Used to compare this provider with others. Any provider that returns the same component
   * instance will be regarded as equivalent.
   *
   * @return The instance
  ###
  Object.defineProperties DynamicComponentProvider::,
    identifier: get: -> return @_closure

