#+--------------------------------------------------------------------+
#| component_pool.coffee
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
# ComponentPool
#
'use strict'
ash = require('../../../lib')

class Dictionary

###
 * An object pool for re-using components. This is not integrated in to Ash but is used dierectly by
 * the developer. It expects components to not require any parameters in their constructor.
 *
 * <p>Fetch an object from the pool with</p>
 *
 * <p>ComponentPool.get( ComponentClass );</p>
 *
 * <p>If the pool contains an object of the required type, it will be returned. If it does not, a new object
 * will be created and returned.</p>
 *
 * <p>The object returned may have properties set on it from the time it was previously used, so all properties
 * should be reset in the object once it is received.</p>
 *
 * <p>Add an object to the pool with</p>
 *
 * <p>ComponentPool.dispose( component );</p>
 *
 * <p>You will usually want to do this when removing a component from an entity. The remove method on the entity
 * returns the component that was removed, so this can be done in one line of code like this</p>
 *
 * <p>ComponentPool.dispose( entity.remove( component ) );</p>
###
class ash.tools.ComponentPool

  pools = new Dictionary()

  getPool = (componentClass) ->
    if (componentClass.name in pools) then pools[componentClass.name] else pools[componentClass.name] = []

  ###
   * Get an object from the pool.
   *
   * @param componentClass The type of component wanted.
   * @return The component.
  ###
  @get: (componentClass) ->

    pool = getPool(componentClass)
    if (pool.length > 0)
      return pool.pop()
    else
      return new componentClass()

  ###
   * Return an object to the pool for reuse.
   *
   * @param component The component to return to the pool.
  ###
  @dispose: (component) ->
    if (component)
      type = component.constructor
      pool = getPool(type)
      pool.push(component)
    return # Void

  ###
   * Dispose of all pooled resources, freeing them for garbage collection.
  ###
  @empty: () ->
    pools = new Dictionary()