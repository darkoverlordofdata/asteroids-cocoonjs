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

  # reference to our game application
  _instance = null

  joystick: null
  fire: false
  warp: false
  options: null

  ###
   * @param   game    current phaser game context
   * @param   parent  current phaser state context
  ###
  constructor: (game, parent) ->
    super game, parent
    _instance = this
    @options = {}

  start: =>
    GameController.init(@game, @options)
    return

  addSide: (side, x, y) =>
    @options[side] ?= {}
    @options[side].position = left: x, top:y
    return

  addJoystick: (side, radius=60) =>
    @options[side].type = 'joystick'
    @options[side].radius = radius
    @options[side].joystick =
        touchStart: ->
        touchEnd: ->
          _instance.joystick = null
          @currentX = @x
          @currentY = @y
          @draw()
          return
        touchMove: (joystick) ->
          _instance.joystick = joystick
          return
    return

  addButton: (side, index, text, color, radius=5, fontSize=13) =>
    @options[side].type = 'buttons'
    @options[side].buttons ?= [false, false, false, false]
    @options[side].buttons[index] =
      label: text
      radius: "#{radius}%"
      fontSize: fontSize
      backgroundColor: color
      touchStart: ->
        _instance[text.toLowerCase()] = true
        return
      touchEnd: ->
        _instance[text.toLowerCase()] = false
        return
    return

