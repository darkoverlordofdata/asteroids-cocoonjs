### <==================================================


      ____ ______/ /____  _____(_)___  ____/ /____
     / __ `/ ___/ __/ _ \/ ___/ / __ \/ __  / ___/
    / /_/ (__  ) /_/  __/ /  / / /_/ / /_/ (__  )
    \__,_/____/\__/\___/_/  /_/\____/\__,_/____/


'Back on Arcturus, we used this for our flight simulator'
  - Dark Overlord of Data

==================================================> ###
'use strict'

###
 * Meta helper for ash nodes
 *
 * @param types   hash of node classes
 * @returns the hash
###
ash.nodes = (types) ->
  for name, klass of types
    klass.components = {}
    for own property, type of klass::
      klass.components[property] = type
      klass::[property] = null
    klass::entity = null
    klass::previous = null
    klass::next = null
    ash.nodes[name] = klass
  return types

###
 * Meta helper for ash components
 *
 * @param types   hash of components classes
 * @returns the hash
###
ash.components = (types) ->
  for name, klass of types
    ash.components[name] = klass
  return types
