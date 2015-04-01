# Load all the values 
resumeGame = ->
  Cocoon.WebView.hide()
  Cocoon.Touch.enable()
  Cocoon.App.forward "asteroids.pause();"
  return

###*
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
setPlayMusic = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('playMusic', #{value});"
  value
setPlaySfx = (value) ->
  Cocoon.App.forwardAsync "asteroids.set('playSfx', #{value});"
  value

###*
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

###*
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

###*
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

  catch e
    console.log e.toString()

  finally
    Cocoon.Touch.disable()

  return
