class Sound

  @volume = 0.5
  @enabled = true
  @FACTOR = 2

  @preload: (src) ->
    audio = new window.Audio()
    audio.src = src
    audio.volume = 0
    audio.play()
    return src


  src: ''
  audio: null

  constructor: ->
    @audio = new window.Audio()
    @audio.src = @src
    @audio.load()

  loop: ->
    return this

  play: ->
    if Sound.enabled
      @audio.volume = Sound.volume
      @audio.play()
    return this

  pause: ->
    @audio.pause()
    return this