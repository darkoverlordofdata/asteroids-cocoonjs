###
 *
 * JavaScript Performance Monitor Plugin
 *
 * @see https://github.com/mrdoob/stats.js
 *
 *  @game.plugins.add(Phaser.Plugin.PerformanceMonitor, x: 100, y: 100, mode: 1)
 *
###
class Phaser.Plugin.AshPlugin extends Phaser.Plugin

  ###
   * @param   game    current phaser game context
   * @param   parent  current phaser state context
  ###
  constructor: (game, parent) ->
    super game, parent


  ###
   * Meta helper for ash components
   *
   * @param types   hash of components classes
   * @returns the hash
  ###
  components: (types) ->
    for name, klass of types
      ash.components[name] = klass
    return types

  ###
   * Meta helper for ash nodes
   *
   * @param types   hash of node classes
   * @returns the hash
  ###
  nodes: (types) ->
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

