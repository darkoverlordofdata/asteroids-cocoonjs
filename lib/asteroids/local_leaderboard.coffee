#+--------------------------------------------------------------------+
#| local_leaderboard.coffee
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2015
#+--------------------------------------------------------------------+
#|
#| This file is a part of facebook_leaderboard.coffee
#|
#| facebook_leaderboard.coffee is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
#
# Local Leaderboard
#
class LocalLeaderboard extends GameSettings

  name              : ''    #   game slug
  title             : ''    #   game title
  fb                : null  #   facebook api
  fbButton          : null  #   facebook login button
  fbAppId           : ''    #   facebook application id
  fbUserID          : ''    #   facebook user id
  fbUserName        : ''    #   facebook user name
  fbStatus          : 0     #   facebook status

  constructor: (@parent, @name, @title) ->

    super(@parent)

    # settings
    @game.add.button(@width - 50, 125, 'leaderboard', @onLeaderboard)


  ### ============================================================>
      B U T T O N  E V E N T S
  <============================================================ ###

  onLeaderboard: =>
    @pause => @show(@pause)
    return

  ###
   * Create and display a leaderboard
  ###
  show: (pause = ->) =>
    @showLocal(Db.queryAll('leaderboard', limit: 10, sort: [['score', 'DESC']]), pause)
    return

  ###
   * Show leaderboard with local storage data
   *  - date
   *  - score
   *
   * @param data
   * @param pause
   * @return nothing
  ###
  showLocal: (data, pause) =>
    board = @game.add.group()

    dialog = new Phaser.Sprite(@game, 0, 0, "dialog-#{@optBgd}")
    dialog.width = @width
    dialog.height = @height
    board.add(dialog)

    big = font: 'bold 30px opendyslexic', fill: '#ffffff'
    normal = font: 'bold 20px opendyslexic', fill: '#ffffff'

    title = new Phaser.Text(@game, @width/2, 20, @title, big)
    title.anchor.x = 0.5
    board.add(title)

    board.add(new Phaser.Text(@game, 200, 80, 'Date', normal))
    board.add(new Phaser.Text(@game, 400, 80, 'Score', normal))
    board.add(new Phaser.Text(@game, 200, 100, '--------', normal))
    board.add(new Phaser.Text(@game, 400, 100, '--------', normal))

    y = 120
    for row in data
      mmddyyyy = row.date.substr(4,2)+'/'+row.date.substr(6,2)+'/'+row.date.substr(0,4)
      board.add(new Phaser.Text(@game, 200, y, mmddyyyy, normal))
      board.add(new Phaser.Text(@game, 400, y, row.score, normal))
      y+= 20

    button = new Phaser.Button(@game, @width/2, @height-64, "button-#{@optBgd}", =>
      board.destroy()
      board = null
      pause()
      return)
    button.anchor.x = 0.5
    board.add(button)

    label = new Phaser.Text(@game, 0, button.height/2, 'continue', big)
    label.anchor.x = 0.5
    label.anchor.y = 0.5
    button.addChild(label)
    return

  ###
   * Post to Leaderboard
   * Save the highest score for today
   *
   * @param score
   * @return nothing
  ###
  score: (score) =>
    today = new Date()
    mm = (today.getMonth()+1).toString()
    if mm.length is 1 then mm = '0'+mm
    dd = today.getDate().toString()
    if dd.length is 1 then dd = '0'+dd
    yyyy = today.getFullYear().toString()
    yyyymmdd = yyyy+mm+dd

    if 0 is Db.queryAll('leaderboard', query: date: yyyymmdd).length
      Db.insert 'leaderboard', date: yyyymmdd, score: score
    else
      Db.update 'leaderboard', date: yyyymmdd, (row) ->
        if score > row.score
          row.score = score
        return row
    Db.commit()
    return

