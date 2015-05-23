#+--------------------------------------------------------------------+
#| game_settings.coffee
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2015
#+--------------------------------------------------------------------+
#|
#| This file is a part of game_settings.coffee
#|
#| game_settings.coffee is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
#
# GameSettings
#
class GameSettings

  parent            : null
  game              : null
  faderBitmap       : null  #   for screen fade
  faderSprite       : null  #   for screen fade
  optBgd            : ''
  height            : 0
  width             : 0

  constructor: (@parent) ->
    @game = @parent.game
    @height = @parent.height
    @width = @parent.width
    @optBgd = @parent.optBgd

    # show the web view when it loads
    Cocoon.App.WebView.on "load",
      success : => Cocoon.App.showTheWebView()
      error   : => console.log("Cannot show the Webview: #{JSON.stringify(arguments)}")

    @game.add.button(@width - 50, 50, 'settings', @onSettings)



  ### ============================================================>
      B U T T O N  E V E N T S
  <============================================================ ###

  onSettings: =>
    @pause => Cocoon.App.loadInTheWebView("settings.html")
    return



  ###
   * Pause
   *
   * If there is a callback, fadeout and run callback
   * Otherwise we fade in and restore
   *
   * @param next
   * @return nothing
  ###
  pause: (next) =>
    if next? # fade-out
      @faderSprite = null # force a new sprite
      @parent.physics.enabled = false
      @fade next
    else # fade-in
      @fade => @parent.physics.enabled = true
    return


  ###
   * Get Fader Sprite
   *
   * A screen sized black rectangle used for full screen fades
   *
   * @return Sprite
  ###
  getFaderSprite: =>
    unless @faderSprite?
      @faderBitmap = @game.make.bitmapData(@game.width, @game.height)
      @faderBitmap.rect(0, 0, @game.width, @game.height, 'rgb(0,0,0)')
      @faderSprite = @game.add.sprite(0,0, @faderBitmap)
      @faderSprite.alpha = 0
    return @faderSprite.bringToTop()


  ###
   * Fade
   *
   * @param next
   * @return nothing
  ###
  fade: (next) =>
    sprite = @getFaderSprite()
    fader = @game.add.tween(sprite)
    if sprite.alpha is 0
      fader.to(alpha: 1, 500)
      fader.onComplete.add(next, this)
      fader.start()
    else
      @game.paused = false
      fader.to(alpha: 0, 500)
      fader.onComplete.add(next, this)
      fader.start()
    return

