class ExplodeAsteroid # extends Sound

  src: Sound.preload('res/sounds/asteroid.wav')

  play: ->
    ExplodeAsteroid.audio.play('', 0, Sound.volume/Sound.FACTOR)