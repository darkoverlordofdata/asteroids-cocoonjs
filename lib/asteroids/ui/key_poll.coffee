###
 * Provide user input
###
class KeyPoll

  @KEY_LEFT        = 37    # turn left
  @KEY_UP          = 38    # accelerate
  @KEY_RIGHT       = 39    # turn right
  @KEY_Z           = 90    # fire
  
  states: null
  stage: null
  btn0: null
  btn1: null
  btn2: null
  btn3: null
  keys: [@KEY_LEFT, @KEY_RIGHT, @KEY_Z, @KEY_UP]

  constructor:(@stage, config) ->
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
    tmp1 = PIXI.Texture.fromImage('res/b_round.png')
    tmp2 = PIXI.Texture.fromImage('res/b_square.png')

    @btn0 = new PIXI.Sprite(tmp1)
    @btn0.interactive = true
    @btn0.width *= (window.devicePixelRatio*1.4)
    @btn0.height *= (window.devicePixelRatio*1.4)
    @btn0.position.x = 0
    @btn0.position.y = config.height-(@btn0.height*2)+35
    @btn0.mousedown = @btn0.touchstart = (evt) =>
      @states[@keys[0]] = true
      return
    @btn0.mouseup = @btn0.touchend = (evt) =>
      @states[@keys[0]] = false
      return

    @btn1 = new PIXI.Sprite(tmp1)
    @btn1.interactive = true
    @btn1.width *= (window.devicePixelRatio*1.4)
    @btn1.height *= (window.devicePixelRatio*1.4)
    @btn1.position.x = @btn1.width-35
    @btn1.position.y = config.height-@btn1.height
    @btn1.mousedown = @btn1.touchstart = (evt) =>
      @states[@keys[1]] = true
      return
    @btn1.mouseup = @btn1.touchend = (evt) =>
      @states[@keys[1]] = false
      return

    @btn2 = new PIXI.Sprite(tmp1)
    @btn2.interactive = true
    @btn2.width *= (window.devicePixelRatio*1.4)
    @btn2.height *= (window.devicePixelRatio*1.4)
    @btn2.position.x = config.width-@btn2.width*2+35
    @btn2.position.y = config.height-@btn2.height
    @btn2.mousedown = @btn2.touchstart = (evt) =>
      @states[@keys[2]] = true
      return
    @btn2.mouseup = @btn2.touchend = (evt) =>
      @states[@keys[2]] = false
      return

    @btn3 = new PIXI.Sprite(tmp2)
    @btn3.interactive = true
    @btn3.width *= (window.devicePixelRatio*1.4)
    @btn3.height *= (window.devicePixelRatio*1.4)
    @btn3.position.x = config.width-@btn3.width
    @btn3.position.y = config.height-(@btn3.height*2)+35
    @btn3.mousedown = @btn3.touchstart = (evt) =>
      @states[@keys[3]] = true
      return
    @btn3.mouseup = @btn3.touchend = (evt) =>
      @states[@keys[3]] = false
      return

    @stage.addChild(@btn0)
    @stage.addChild(@btn1)
    @stage.addChild(@btn2)
    @stage.addChild(@btn3)

    