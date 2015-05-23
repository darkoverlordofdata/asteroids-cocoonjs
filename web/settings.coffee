###
 * Settings Module
###

g_fbAppId = null
g_fbUserID = null
g_fbUserName = null
g_leaderboard = null
g_player = null
g_count = 0

###
 * location of the leaderboard server
###
HOST = if window.location.hostname is 'localhost'
  'http://bosco.com:3000'
else
  'https://games.darkoverlordofdata.com'


###
 * Return to the game
###
resumeGame = ->
  Cocoon.WebView.hide()
  Cocoon.Touch.enable()
  Cocoon.App.forward "asteroids.pause();"
  return

###
 * Build the key
###
getKey = (fbAppId, fbUserId) ->

  fbAppId = ''+fbAppId
  fbUserId = ''+fbUserId

  result = []
  for i in [0...Math.max(fbAppId.length, fbUserId.length)]
    result.push(fbAppId[i])
    result.push(fbUserId[i])

  return result.join('')

###
Game Options
###
setProfiler = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('profiler', '#{value}');"
  value
setBackground = (value) ->
  if value is 1
    Cocoon.App.forwardAsync "asteroids.set('background', 1);"
  else
    Cocoon.App.forwardAsync "asteroids.set('background', 0);"
  return
setLeaderboard = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('leaderboard', '#{value}');"
  value
setPlayMusic = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('playMusic', #{value});"
  value
setPlaySfx = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('playSfx', #{value});"
  value

###
Asteroids
###
setAsteroidDensity = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('asteroidDensity', #{value});"
  value
setAsteroidFriction = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('asteroidFriction', #{value});"
  value
setAsteroidRestitution = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('asteroidRestitution', #{value});"
  value
setAsteroidDamping = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('asteroidDamping', #{value});"
  value
setAsteroidLinearVelocity = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('asteroidLinearVelocity', #{value});"
  value
setAsteroidAngularVelocity = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('asteroidAngularVelocity', #{value});"
  value

###
Spaceships
###
setSpaceshipDensity = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('spaceshipDensity', #{value});"
  value
setSpaceshipFriction = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('spaceshipFriction', #{value});"
  value
setSpaceshipRestitution = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('spaceshipRestitution', #{value});"
  value
setSpaceshipDamping = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('spaceshipDamping', #{value});"
  value

###
Bullets
###
setBulletDensity = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('bulletDensity', #{value});"
  value
setBulletFriction = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('bulletFriction', #{value});"
  value
setBulletRestitution = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('bulletRestitution', #{value});"
  value
setBulletDamping = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('bulletDamping', #{value});"
  value
setBulletLinearVelocity = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('bulletLinearVelocity', #{value});"
  value

###
 * Register the player
###
registerPlayer = () ->
  xhr = new XMLHttpRequest()
  xhr.onreadystatechange = ->
    if xhr.readyState is 4 and xhr.status is 200
      response = JSON.parse(xhr.responseText)
      console.log response
      if response.status is 'ok'

        # lock the player selection
        $('#player').attr('disabled', true)
        $('#registerPlayer').attr('disabled', true)

        # enable the server side leaderboard
        $("#leaderboard").val('on').slider "refresh"
        setLeaderboard('on')

  data =
    key         : getKey(g_fbAppId, g_fbUserID)
    appId       : g_fbAppId
    userId      : g_fbUserID
    description : 'testing'

  xhr.open('POST', HOST+'/leaderboard/register/'+$('#player').val(), true)
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
  xhr.send(JSON.stringify(data))

setPlayer = (value) ->

  xhr = new XMLHttpRequest()
  xhr.onreadystatechange = ->
    if xhr.readyState is 4 and xhr.status is 200
      response = JSON.parse(xhr.responseText)
      console.log response
      unless response.status is 'ok'

        $('#player').val(value)
        $('#registerPlayer').attr('disabled', false)

  xhr.open('GET', HOST+'/leaderboard/register/'+value, true)
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
  xhr.send()

###
 * Display a dialog to enter the player screen name
###
enterPlayer = () ->
  return false unless Cocoon.App.nativeAvailable
  Cocoon.Dialog.prompt {
    title   : "Player"
    message : "Enter your screen name"
    text    : $("#player").val()
    type    : Cocoon.Dialog.keyboardType.TEXT
  },{
    success: setPlayer
    cancel: () ->
  }

###
 * Wait for all values to be ready
###
ready = (leaderboard, player, fbAppId, fbUserID, fbUserName) ->
  if leaderboard?
    g_leaderboard = leaderboard
    g_count++

  if player?
    g_player = player
    g_count++

  if fbAppId?
    g_fbAppId = fbAppId
    g_count++

  if fbUserID?
    g_fbUserID = fbUserID
    g_count++

  if fbUserName?
    g_fbUserName = fbUserName
    g_count++

  if g_count is 5 # then we're ready!
    console.log 'g_leaderboard', g_leaderboard
    console.log 'g_player', g_player
    console.log 'g_fbAppId', g_fbAppId
    console.log 'g_fbUserID', g_fbUserID
    console.log 'g_fbUserName', g_fbUserName

    if g_leaderboard is 'on' and (g_player is '' or g_player is g_fbUserName)
      console.log 'call enterPlayer'
      if Cocoon.App.nativeAvailable
        Cocoon.Dialog.prompt {
          title   : "Player"
          message : "Screen name required"
          text    : $("#player").val()
          type    : Cocoon.Dialog.keyboardType.TEXT
        },{
          success: setPlayer
          cancel: () ->
        }
      else
        setPlayer(prompt("Screen name required"))
###
 * OnLoad
###
window.addEventListener "load", ->
  $("body").css "visibility", "visible"

  try

    Cocoon.App.forwardAsync "asteroids.get('profiler');", (value) ->
      $("#profiler").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('background');", (value) ->
      if value is 0
        $("#blueBgd").attr "checked", "checked"
      else
        $("#starBgd").attr "checked", "checked"
      $("input[type=radio]").checkboxradio "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('leaderboard');", (value) ->
      $("#leaderboard").val(value).slider "refresh"
      console.log 'initialize leaderboard', value
      ready(value)
      return

    Cocoon.App.forwardAsync "asteroids.get('player');", (value) ->
      $("#player").val(value)
      console.log 'initialize player', value
      ready(undefined, value)
      return

    Cocoon.App.forwardAsync "asteroids.get('playMusic');", (value) ->
      $("#playMusic").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('playSfx');", (value) ->
      $("#playSfx").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('asteroidDensity');", (value) ->
      $("#asteroidDensity").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('asteroidFriction');", (value) ->
      $("#asteroidFriction").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('asteroidRestitution');", (value) ->
      $("#asteroidRestitution").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('asteroidDamping');", (value) ->
      $("#asteroidDamping").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('asteroidLinearVelocity');", (value) ->
      $("#asteroidLinearVelocity").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('asteroidAngularVelocity');", (value) ->
      $("#asteroidAngularVelocity").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('spaceshipDensity');", (value) ->
      $("#spaceshipDensity").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('spaceshipFriction');", (value) ->
      $("#spaceshipFriction").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('spaceshipRestitution');", (value) ->
      $("#spaceshipRestitution").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('spaceshipDamping');", (value) ->
      $("#spaceshipDamping").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('bulletDensity');", (value) ->
      $("#bulletDensity").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('bulletFriction');", (value) ->
      $("#bulletFriction").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('bulletRestitution');", (value) ->
      $("#bulletRestitution").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('bulletDamping');", (value) ->
      $("#bulletDamping").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.get('bulletLinearVelocity');", (value) ->
      $("#bulletLinearVelocity").val(value).slider "refresh"
      return

    Cocoon.App.forwardAsync "asteroids.getFbAppId();", (fbAppId) ->
      console.log 'initialize fbAppId', fbAppId
      ready(undefined, undefined, fbAppId)
      return

    Cocoon.App.forwardAsync "asteroids.getFbUserID();", (fbUserID) ->
      console.log 'initialize fbUserID', fbUserID
      ready(undefined, undefined, undefined, fbUserID)
      return

    Cocoon.App.forwardAsync "asteroids.getFbUserName();", (fbUserName) ->
      console.log 'initialize fbUserName', fbUserName
      ready(undefined, undefined, undefined, undefined, fbUserName)
      return

  catch e
    console.log e.toString()

  finally
    Cocoon.Touch.disable()


  return

