example usage

  @con = @game.plugins.add(Phaser.Plugin.GameconPlugin)

  @con.addDPad 'left', 60, @height-60,
    up: width: '7%', height: '7%'
    down: false
    left: width: '7%', height: '7%'
    right: width: '7%', height: '7%'

  @con.addDPad
    left: 60, @height-60,
    up: width: '7%', height: '7%'
    down: false
    left: width: '7%', height: '7%'
    right: width: '7%', height: '7%'
    right: @width-60, @height-60,
    up: width: '7%', height: '7%'
    down: false
    left: width: '7%', height: '7%'
    right: width: '7%', height: '7%'

  @con.addButtons 'right', @width-180, @height-80,
    1: title: 'WARP', color: 'yellow'
    3: title: 'FIRE', color: 'red'

  @con.addButtons
    left: 180, @height-80,
    1: title: 'WARP', color: 'yellow'
    3: title: 'FIRE', color: 'red'
    right: @width-180, @height-80,
    1: title: 'WARP', color: 'yellow'
    3: title: 'FIRE', color: 'red'


  @con.addJoystick 'left', 60, @height-60
  @con.addJoystick
    left: x: 60, y: @height-60
    right: x: @width-60, y: @height-60

  @con.joystick
  @con.dpad
  @con.buttons

  @con.joystick[0]
  @con.joystick[1]

  @con.dpad[0]
  @con.dpad[1]

  @con.buttons[0]
  @con.buttons[1]

  @con.left.joystick
  @con.right.joystick

  @con.left.dpad
  @con.right.dpad

  @con.left.buttons
  @con.right.buttons
