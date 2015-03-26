###
 * Provide user input
###
class KeyPoll

  @KEY_LEFT        = 37    # turn left
  @KEY_UP          = 38    # accelerate
  @KEY_RIGHT       = 39    # turn right
  @KEY_Z           = 90    # fire
  
  states: null
  keys: [@KEY_LEFT, @KEY_RIGHT, @KEY_Z, @KEY_UP]

  constructor:(config) ->
    @states = {}
    window.addEventListener 'keydown', @keyDownListener
    window.addEventListener 'keyup', @keyUpListener
    @gamePad(config)

  keyDownListener: (event) =>
    @states[event.keyCode] = true
    return

  keyUpListener: (event) =>
    @states[event.keyCode] = false  if @states[event.keyCode]
    return

  isDown: (keyCode) =>
    return @states[keyCode]

  isUp: (keyCode) =>
    return not @states[keyCode]

  ###
   * Build a virtual game pad
  ###
  gamePad: (config) ->

    btn0 = game.add.button(0, config.height-80, 'round')
    btn0.onInputDown.add =>
      @states[@keys[0]] = true
      return
    btn0.onInputUp.add =>
      @states[@keys[0]] = false
      return

    btn1 = game.add.button(35, config.height-45, 'round')
    btn1.onInputDown.add  =>
      @states[@keys[1]] = true
      return
    btn1.onInputUp.add  =>
      @states[@keys[1]] = false
      return

    btn2 = game.add.button(config.width-80, config.height-45, 'square')
    btn2.onInputDown.add  =>
      @states[@keys[2]] = true
      return
    btn2.onInputUp.add  =>
      @states[@keys[2]] = false
      return

    btn3 = game.add.button(config.width-45, config.height-80, 'round')
    btn3.onInputDown.add  =>
      @states[@keys[3]] = true
      return
    btn3.onInputUp.add  =>
      @states[@keys[3]] = false
      return

    