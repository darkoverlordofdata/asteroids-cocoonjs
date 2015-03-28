###
 * Das Boot
###
do ->
  window.addEventListener 'load', ->
    window.rnd = new MersenneTwister()
    window.asteroids = new Asteroids()
    return

