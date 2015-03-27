###
 * Boot the game
###

do ->
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
      x = 0
      y = 0
      stats.setMode 0
      stats.domElement.style.position = "absolute"
      stats.domElement.style.left = "#{x}px"
      stats.domElement.style.top = "#{y}px"
      document.body.appendChild stats.domElement

    ###
     * start the game
    ###
    window.rnd = new MersenneTwister()
    window.asteroids = new Asteroids(stats)
    return

