class ExplodeShip #extends Sound

  src: Sound.preload('res/sounds/ship.wav')
  play: ->
    ExplodeShip.audio.play('', 0, Sound.volume/Sound.FACTOR)