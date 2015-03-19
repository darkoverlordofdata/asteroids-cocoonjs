class WaitForStart

  waitForStart: null
  startGame: false

  constructor: (@waitForStart) ->
    @waitForStart.click.add(@setStartGame)

  setStartGame: () =>
    @startGame = true
    return