class LeaderboardView

  game: null
  score: 0

  constructor: (@game) ->
    @background = @game.add.sprite(0, 0, 'dialog')
    @background.width = @config.width
    @background.height = @config.height
    @background.alpha = 0

  setScore: (score) ->
    @score = score
    return
