#+--------------------------------------------------------------------+
#| abstract_game.coffee
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2015
#+--------------------------------------------------------------------+
#|
#| This file is a part of abstract_game.coffee
#|
#| abstract_game.coffee is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
#
# AbstractGame
#
# manages standard infrastructure:
#
#   Initialization
#   Settings
#
class AbstractGame

  ucfirst           = (s) -> s.charAt(0).toUpperCase() + s.substr(1)

  name              : ''    #   Game name
  game              : null  #   Phaser.io game object
  height            : window.innerHeight
  width             : window.innerWidth
  scale             : window.devicePixelRatio

  ###
   * Create the phaser game component
   *
   * @return nothing
  ###
  constructor: (@name, @properties) ->
    # initialize the game
    @game = new Phaser.Game(@width * @scale, @height * @scale, Phaser.CANVAS, '',
      init: @init, preload: @preload, create: @create)

    # initialize the prng
    @rnd = new MersenneTwister()

    # initialize the database
    @initializeDb(@name, @properties)


  ###
   * Configure Phaser scaling
   *
   * @return nothing
  ###
  init: =>
    @game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    @game.scale.minWidth = @width * @scale
    @game.scale.minHeight = @height * @scale
    @game.scale.maxWidth = @width * @scale
    @game.scale.maxHeight = @height * @scale
    @game.scale.pageAlignVertically = true
    @game.scale.pageAlignHorizontally = true
    return

  ###
   * Abstract method preload
   *
   * @return nothing
  ###
  preload: =>

  ###
   * Abstract method create
   *
   * @return nothing
  ###
  create: =>

  ### ============================================================>
      G A M E  S E T T I N G S
  <============================================================ ###
  ###
   * Get Game Property from local storage
   *
   * @param property name
   * @return property value
  ###
  get: (prop) =>
    n = 'get'+ucfirst(prop)
    if @[n]? then return @[n]()
    else
      return Db.queryAll('settings', query: name: prop)[0].value

  ###
   * Set Game Property in local storage
   *
   * @param property name
   * @param property value
   * @return nothing
  ###
  set: (prop, value) =>
    n = 'set'+ucfirst(prop)
    if @[n]? then @[n](value)
    else
      Db.update('settings', name: prop, (row) -> row.value = value; return row)
      Db.commit()
    return

  ###
   * Initialize Game Database
   *
   * @param name of database
   * @return true if Db is new
  ###
  initializeDb: (name, properties) =>
    window.Db = new localStorageDB(name, localStorage)
    isNew = Db.isNew()
    if isNew
      Db.createTable 'settings', ['name', 'value']
      Db.createTable 'leaderboard', ['date', 'score']
      for key, val of properties
        Db.insert 'settings', name: key, value: val
      Db.commit()


    return isNew
