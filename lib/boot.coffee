###
 * Boot the game
###
do ->
  window.rnd = new MersenneTwister
  ###
   * Polyfill the requestAnimationFrame method
  ###
  unless window.requestAnimationFrame
    window.requestAnimationFrame = do ->
      window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback) ->
        window.setTimeout callback, 1000 / 60
        return

  ###
   * when the doc loads
  ###
  window.addEventListener 'load', ->
    ###
     * perf, mon
    ###
    if navigator.isCocoonJS # cocoon has it's own
      stats = null
    else #  use https://github.com/mrdoob/stats.js
      stats = new Stats()
      container = document.createElement('div')
      document.body.appendChild container
      container.appendChild stats.domElement
      stats.domElement.style.position = 'absolute'
      x = Math.floor(window.innerWidth * window.devicePixelRatio/2)-40
      y = 0
      stats.setMode 0
      stats.domElement.style.position = "absolute"
      stats.domElement.style.left = "#{x}px"
      stats.domElement.style.top = "#{y}px"
      document.body.appendChild stats.domElement

    ###
     * configure the canvas element
    ###
    canvas = document.createElement((if navigator.isCocoonJS then 'screencanvas' else 'canvas'))
    canvas.width = window.innerWidth * window.devicePixelRatio
    canvas.height = window.innerHeight * window.devicePixelRatio
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    document.body.appendChild canvas

    ###
     * load assets and start the game
    ###
    game = new Asteroids()
    loader = new PIXI.AssetLoader(game.assets)
    loader.onComplete = -> game.start(canvas, stats)
    loader.load()
    return

