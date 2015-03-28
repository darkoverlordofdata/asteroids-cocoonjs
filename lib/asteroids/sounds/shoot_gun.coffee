class ShootGun # extends Sound

  src: Sound.preload('res/sounds/shoot.wav')
  play: ->
    ShootGun.audio.play('', 0, Sound.volume/Sound.FACTOR)