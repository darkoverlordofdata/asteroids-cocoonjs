###
 *
 * Modified Html5 Virtual Game Controller
 *
 * @see https://github.com/austinhallock/html5-virtual-game-controller
 *
###
GameController = do ->

  # $.extend functionality
  extend = (target, src) ->
    deep = true

    # Handle a deep copy situation
    if typeof target is 'boolean'
      deep = target

    # Handle case when target is a string or something( possible in deep copy )
    #if( typeof target !== 'object' && !typeof target === 'function' )
    # invalid operator precedence should be:
    target = {}  if typeof target isnt 'object' and typeof target isnt 'function'

    # Only deal with non-null/undefined values
    if options = src

      # Extend the base object
      for name of options
        src = target[name]
        copy = options[name]

        # Prevent never-ending loop
        unless target is copy

          # Recurse if we're merging plain objects or arrays
          if deep and (typeof copy is 'object' or (copyIsArray = Object::toString.call(copy) is '[object Array]'))
            if copyIsArray
              copyIsArray = false
              clone = (if src and Object::toString.call(src) is '[object Array]' then src else [])
            else
              clone = (if src and typeof src is 'object' then src else {})

            # Never move original objects, clone them
            target[name] = extend(clone, copy)

          # Don't bring in undefined values
          else target[name] = copy  if typeof copy isnt 'undefined'
    target

  return GameController =

    # Default options,
    options:
      left:
        type: 'dpad'
        position:
          left: '13%'
          bottom: '22%'

        dpad:
          up:
            width: '7%'
            height: '15%'
            stroke: 2
            touchStart: ->
              GameController.simulateKeyEvent 'press', 38
              GameController.simulateKeyEvent 'down', 38
              return

            touchEnd: ->
              GameController.simulateKeyEvent 'up', 38
              return

          left:
            width: '15%'
            height: '7%'
            stroke: 2
            touchStart: ->
              GameController.simulateKeyEvent 'press', 37
              GameController.simulateKeyEvent 'down', 37
              return

            touchEnd: ->
              GameController.simulateKeyEvent 'up', 37
              return

          down:
            width: '7%'
            height: '15%'
            stroke: 2
            touchStart: ->
              GameController.simulateKeyEvent 'press', 40
              GameController.simulateKeyEvent 'down', 40
              return

            touchEnd: ->
              GameController.simulateKeyEvent 'up', 40
              return

          right:
            width: '15%'
            height: '7%'
            stroke: 2
            touchStart: ->
              GameController.simulateKeyEvent 'press', 39
              GameController.simulateKeyEvent 'down', 39
              return

            touchEnd: ->
              GameController.simulateKeyEvent 'up', 39
              return

        joystick:
          radius: 60
          touchMove: (e) ->
            console.log e
            return

      right:
        type: 'buttons'
        position:
          right: '17%'
          bottom: '28%'

        buttons: [
          {
            offset:
              x: '-13%'
              y: 0

            label: 'X'
            radius: '7%'
            stroke: 2
            backgroundColor: 'blue'
            fontColor: '#fff'
            touchStart: ->

              # Blue is currently mapped to up button
              GameController.simulateKeyEvent 'press', 88 # x key
              GameController.simulateKeyEvent 'down', 88
              return

            touchEnd: ->
              GameController.simulateKeyEvent 'up', 88
              return
          }
          {
            offset:
              x: 0
              y: '-11%'

            label: 'Y'
            radius: '7%'
            stroke: 2
            backgroundColor: 'yellow'
            fontColor: '#fff'
            touchStart: ->
              GameController.simulateKeyEvent 'press', 70 # f key
              GameController.simulateKeyEvent 'down', 70
              return

            touchEnd: ->
              GameController.simulateKeyEvent 'up', 70
              return
          }
          {
            offset:
              x: '13%'
              y: 0

            label: 'B'
            radius: '7%'
            stroke: 2
            backgroundColor: 'red'
            fontColor: '#fff'
            touchStart: ->
              GameController.simulateKeyEvent 'press', 90 # z key
              GameController.simulateKeyEvent 'down', 90
              return

            touchEnd: ->
              GameController.simulateKeyEvent 'up', 90
              return
          }
          {
            offset:
              x: 0
              y: '11%'

            label: 'A'
            radius: '7%'
            stroke: 2
            backgroundColor: 'green'
            fontColor: '#fff'
            touchStart: ->
              GameController.simulateKeyEvent 'press', 67 # a key
              GameController.simulateKeyEvent 'down', 67
              return

            touchEnd: ->
              GameController.simulateKeyEvent 'up', 67
              return
          }
        ]
        dpad:
          up:
            width: '7%'
            height: '15%'
            stroke: 2

          left:
            width: '15%'
            height: '7%'
            stroke: 2

          down:
            width: '7%'
            height: '15%'
            stroke: 2

          right:
            width: '15%'
            height: '7%'
            stroke: 2

        joystick:
          radius: 60
          touchMove: (e) ->
            console.log e
            return

      touchRadius: 45


    # Areas (objects) on the screen that can be touched
    touchableAreas: []
    touchableAreasCount: 0

    # Multi-touch
    touches: []

    # Canvas offset on page (for coverting touch coordinates)
    offsetX: 0
    offsetY: 0

    # Bounding box - used for clearRect - first we determine which areas of the canvas are actually drawn to
    bound:
      left: false
      right: false
      top: false
      bottom: false


    # Heavy sprites (with gradients) are cached as a canvas to improve performance
    cachedSprites: {}
    paused: false
    game: null # Phaser.io game object
    init: (game, options={}) ->

      # Don't do anything if there's no touch support
      return  unless 'ontouchstart' of document.documentElement
      @game = game

      # Merge default options and specified options
      #options = options or {}
      extend @options, options
      userAgent = navigator.userAgent.toLowerCase()

      # See if we should run the performanceFriendly version (for slower CPUs)
      @performanceFriendly = (userAgent.indexOf('iphone') isnt -1 or userAgent.indexOf('android') isnt -1 or @options.forcePerformanceFriendly)

      # Create a canvas that goes directly on top of the game canvas
      @createOverlayCanvas()
      return


    ###
    Finds the actual 4 corners of canvas that are being used (so we don't have to clear the entire canvas each render)
    Called when each new touchableArea is added in
    @param {object} options - x, y, width, height
    ###
    boundingSet: (options) ->
      # Square - pivot is top left
      if options.width
        width = @getPixels(options.width)
        height = @getPixels(options.height)
        left = @getPixels(options.x)
        top = @getPixels(options.y)

      # Circle - pivot is center
      else
        if @options.touchRadius
          radius = @getPixels(options.radius) * 2 + (@getPixels(@options.touchRadius) / 2) # size of the box the joystick can go to
        else
          radius = options.radius
        width = height = (radius + @getPixels(options.stroke)) * 2
        left = @getPixels(options.x) - (width / 2)
        top = @getPixels(options.y) - (height / 2)
      right = left + width
      bottom = top + height
      @bound.left = left  if @bound.left is false or left < @bound.left
      @bound.right = right  if @bound.right is false or right > @bound.right
      @bound.top = top  if @bound.top is false or top < @bound.top
      @bound.bottom = bottom  if @bound.bottom is false or bottom > @bound.bottom
      return


    ###
    Creates the game controls
    ###
    createOverlayCanvas: ->
      # Set the touch events for this new canvas
      @setTouchEvents()

      # Load in the initial UI elements
      @loadSide 'left'
      @loadSide 'right'

      # Starts up the rendering / drawing
      @render()
      @paused = true  if not @touches or @touches.length is 0 # pause until a touch event
      return

    pixelRatio: 1
    ###
    Returns the scaled pixels. Given the value passed
    @param {int/string} value - either an integer for # of pixels, or 'x%' for relative
    @param {char} axis - x, y
    ###
    getPixels: (value, axis) ->
      if typeof value is 'undefined'
        0
      else if typeof value is 'number'
        value
      # a percentage
      else
        if axis is 'x'
          (parseInt(value) / 100) * @game.width
        else
          (parseInt(value) / 100) * @game.height


    ###
    Simulates a key press
    @param {string} eventName - 'down', 'up'
    @param {char} character
    ###
    simulateKeyEvent: (eventName, keyCode) ->
      # No keyboard, can't simulate...
      return false  if typeof window.onkeydown is 'undefined'

      oEvent = document.createEvent('KeyboardEvent')

      if oEvent.initKeyboardEvent?
        oEvent.initKeyboardEvent 'key' + eventName, true, true, document.defaultView, false, false, false, false, keyCode, keyCode
      else
        oEvent.initKeyEvent 'key' + eventName, true, true, document.defaultView, false, false, false, false, keyCode, keyCode
      oEvent.keyCodeVal = keyCode
      return

    # game.input.addMoveCallback = function(pointer, x, y
    setTouchEvents: ->


    ###
    Adds the area to a list of touchable areas, draws
    @param {object} options with properties: x, y, width, height, touchStart, touchEnd, touchMove
    ###
    addTouchableDirection: (options) ->
      direction = new TouchableDirection(this, options)
      direction.id = @touchableAreas.push(direction)
      @touchableAreasCount++
      @boundingSet options
      return


    ###
    Adds the circular area to a list of touchable areas, draws
    @param {object} options with properties: x, y, width, height, touchStart, touchEnd, touchMove
    ###
    addJoystick: (options) -> #x, y, radius, backgroundColor, touchStart, touchEnd ) {
      joystick = new TouchableJoystick(this, options)
      joystick.id = @touchableAreas.push(joystick)
      @touchableAreasCount++
      @boundingSet options
      return


    ###
    Adds the circular area to a list of touchable areas, draws
    @param {object} options with properties: x, y, width, height, touchStart, touchEnd, touchMove
    ###
    addButton: (options) -> #x, y, radius, backgroundColor, touchStart, touchEnd ) {
      button = new TouchableButton(this, options)
      button.id = @touchableAreas.push(button)
      @touchableAreasCount++
      @boundingSet options
      return

    addTouchableArea: (check, callback) ->

    loadButtons: (side) ->
      buttons = @options[side].buttons
      i = 0
      j = buttons.length

      while i < j
        if typeof buttons[i] is 'undefined' or typeof buttons[i].offset is 'undefined'
        else
          posX = @getPositionX(side)
          posY = @getPositionY(side)
          buttons[i].x = posX + @getPixels(buttons[i].offset.x, 'y')
          buttons[i].y = posY + @getPixels(buttons[i].offset.y, 'y')
          @addButton buttons[i]
        i++
      return

    loadDPad: (side) ->
      dpad = @options[side].dpad or {}

      # Centered value is at this.options[ side ].position
      posX = @getPositionX(side)
      posY = @getPositionY(side)

      # If they have all 4 directions, add a circle to the center for looks
      if (dpad.up and dpad.left and dpad.down and dpad.right) or dpad.background
        options =
          x: posX
          y: posY
          radius: dpad.right.height

        center = new TouchableCircle(this, options)
        @touchableAreas.push center
        @touchableAreasCount++

      # Up arrow
      if dpad.up isnt false
        dpad.up.x = posX - @getPixels(dpad.up.width, 'y') / 2
        dpad.up.y = posY - (@getPixels(dpad.up.height, 'y') + @getPixels(dpad.left.height, 'y') / 2)
        dpad.up.direction = 'up'
        @addTouchableDirection dpad.up

      # Left arrow
      if dpad.left isnt false
        dpad.left.x = posX - (@getPixels(dpad.left.width, 'y') + @getPixels(dpad.up.width, 'y') / 2)
        dpad.left.y = posY - (@getPixels(dpad.left.height, 'y') / 2)
        dpad.left.direction = 'left'
        @addTouchableDirection dpad.left

      # Down arrow
      if dpad.down isnt false
        dpad.down.x = posX - @getPixels(dpad.down.width, 'y') / 2
        dpad.down.y = posY + (@getPixels(dpad.left.height, 'y') / 2)
        dpad.down.direction = 'down'
        @addTouchableDirection dpad.down

      # Right arrow
      if dpad.right isnt false
        dpad.right.x = posX + (@getPixels(dpad.up.width, 'y') / 2)
        dpad.right.y = posY - @getPixels(dpad.right.height, 'y') / 2
        dpad.right.direction = 'right'
        @addTouchableDirection dpad.right
      return

    loadJoystick: (side) ->
      joystick = @options[side].joystick
      joystick.x = @getPositionX(side)
      joystick.y = @getPositionY(side)
      @addJoystick joystick
      return


    ###
    Used for resizing. Currently is just an alias for loadSide
    ###
    reloadSide: (side) ->

      # Load in new ones
      @loadSide side
      return

    loadSide: (side) ->
      if @options[side].type is 'dpad'
        @loadDPad side
      else if @options[side].type is 'joystick'
        @loadJoystick side
      else @loadButtons side  if @options[side].type is 'buttons'
      return


    ###
    Normalize touch positions by the left and top offsets
    @param {int} x
    ###
    normalizeTouchPositionX: (x) ->
      (x - @offsetX) * (@pixelRatio)


    ###
    Normalize touch positions by the left and top offsets
    @param {int} y
    ###
    normalizeTouchPositionY: (y) ->
      (y - @offsetY) * (@pixelRatio)


    ###
    Returns the x position when given # of pixels from right (based on canvas size)
    @param {int} right
    ###
    getXFromRight: (right) ->
      @game.width - right


    ###
    Returns the y position when given # of pixels from bottom (based on canvas size)
    @param {int} right
    ###
    getYFromBottom: (bottom) ->
      @game.height - bottom


    ###
    Grabs the x position of either the left or right side/controls
    @param {string} side - 'left', 'right'
    ###
    getPositionX: (side) ->
      if typeof @options[side].position.left isnt 'undefined'
        @getPixels @options[side].position.left, 'x'
      else
        @getXFromRight @getPixels(@options[side].position.right, 'x')


    ###
    Grabs the y position of either the left or right side/controls
    @param {string} side - 'left', 'right'
    ###
    getPositionY: (side) ->
      if typeof @options[side].position.top isnt 'undefined'
        @getPixels @options[side].position.top, 'y'
      else
        @getYFromBottom @getPixels(@options[side].position.bottom, 'y')


    ###
    Processes the info for each touchableArea
    ###
    renderAreas: ->
      i = 0
      j = @touchableAreasCount

      while i < j
        area = @touchableAreas[i]
        if typeof area isnt 'undefined'
          area.draw()

          # Go through all touches to see if any hit this area
          touched = false
          k = 0
          l = @touches.length

          while k < l
            touch = @touches[k]
            if typeof touch isnt 'undefined'
              x = @normalizeTouchPositionX(touch.clientX)
              y = @normalizeTouchPositionY(touch.clientY)

              # Check that it's in the bounding box/circle
              touched = @touches[k]  unless touched  if (area.check(x, y)) isnt false
              k++
          if touched
            area.touchStartWrapper touched  unless area.active
            area.touchMoveWrapper touched
          else area.touchEndWrapper touched  if area.active
          i++
      return

    render: ->

      # Render if the game isn't paused, or we're not in performanceFriendly mode (running when not paused keeps the semi-transparent gradients looking better for some reason)

      # Process all the info for each touchable area
      @renderAreas()  if not @paused or not @performanceFriendly
      @ready = true
      return


    #window.requestAnimationFrame( this.renderWrapper );

    ###
    So we can keep scope, and don't have to create a new obj every requestAnimationFrame (bad for garbage collection)
    ###
    renderWrapper: ->
      GameController.render()
      return


