###
 *
 * Html5 Virtual Game Controller
 *
 * @see https://github.com/austinhallock/html5-virtual-game-controller
 *
 *  @game.plugins.add(Phaser.Plugin.GameController, x: 100, y: 100, mode: 1)
 *
###
class Phaser.Plugin.GameControllerPlugin extends Phaser.Plugin

  ###
   * So the virtual pad will display on desktop
  ###
  document.documentElement['ontouchstart'] = ->

  joystick  : null
  buttons   : null
  dpad      : null
  options   : null

  ###
   * @param   game    current phaser game context
   * @param   parent  current phaser state context
  ###
  constructor: (game, parent) ->
    super game, parent
    @options = {}
    @buttons = {}
    @dpad =
      up: false
      down: false
      left: false
      right: false

  ###
   * Start
  ###
  start: =>
    GameController.init(@game, @options)
    return

  ###
   * Add DPad
   *
   * @param   side
   * @param   x
   * @param   y
   * @param   options
  ###
  addDPad: (side, x, y, directions) =>
    @addSide side, x, y, 'dpad', background: true
    for direction, options of directions
      do (direction, options) => # create a closure for each set of options
        if options is false
          @options[side].dpad[direction] = false
        else
          @options[side].dpad[direction] =
            width: options.width
            height: options.height
            touchStart: =>
              @dpad[direction] = true
              return
            touchEnd: =>
              @dpad[direction] = false
              return

  ###
   * Add Joystick
   *
   * @param   side
   * @param   x
   * @param   y
   * @param   radius
  ###
  addJoystick: (side, x, y, radius=60) =>
    @addSide side, x, y, 'joystick',
      touchStart: ->
      touchEnd: =>
        @joystick = null
        return
      touchMove: (joystick) =>
        @joystick = joystick
        return
    @options[side].radius = radius
    return

  ###
   * Add DPad
   *
   * @param   side
   * @param   x
   * @param   y
   * @param   buttons
  ###
  addButtons: (side, x, y, buttons) =>
    @addSide side, x, y, 'buttons', [false, false, false, false]
    for index, options of buttons
      do (index, options) => # create a closure for each set of options
        @options[side].buttons[parseInt(index)-1] =
          label: options.title
          radius: "#{options.radius or 5}%"
          fontSize: options.fontSize or 15
          backgroundColor: options.color
          touchStart: =>
            @buttons[options.title.toLowerCase()] = true
            return
          touchEnd: =>
            @buttons[options.title.toLowerCase()] = false
            return

  addSide: (side, x, y, type, options={}) =>
    @options[side] ?= {}
    @options[side].position = left: x, top:y
    @options[side].type = type
    @options[side][type] = options
    return

