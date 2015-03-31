window.addEventListener("load", function() {

    try { /* Load all the values */

        $('body').css('visibility', 'visible');

        Cocoon.App.forwardAsync('asteroids.getBackground();', function(value) {
            if (value === 0) {
                $('#blueBgd').attr('checked', 'checked');
            } else {
                $('#starBgd').attr('checked', 'checked');
            }
            $('input[type=radio]').checkboxradio('refresh');

        });
        Cocoon.App.forwardAsync('asteroids.getPlayMusic();', function(value) {
            $('#playMusic').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getPlaySfx();', function(value) {
            $('#playSfx').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getAsteroidDensity();', function(value) {
            $('#asteroidDensity').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getAsteroidFriction();', function(value) {
            $('#asteroidFriction').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getAsteroidRestitution();', function(value) {
            $('#asteroidRestitution').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getAsteroidDamping();', function(value) {
            $('#asteroidDamping').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getAsteroidLinearVelocity();', function(value) {
            $('#asteroidLinearVelocity').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getAsteroidAngularVelocity();', function(value) {
            $('#asteroidAngularVelocity').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getSpaceshipDensity();', function(value) {
            $('#spaceshipDensity').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getSpaceshipFriction();', function(value) {
            $('#spaceshipFriction').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getSpaceshipRestitution();', function(value) {
            $('#spaceshipRestitution').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getSpaceshipDamping();', function(value) {
            $('#spaceshipDamping').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getBulletDensity();', function(value) {
            $('#bulletDensity').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getBulletFriction();', function(value) {
            $('#bulletFriction').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getBulletRestitution();', function(value) {
            $('#bulletRestitution').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getBulletDamping();', function(value) {
            $('#bulletDamping').val(value).slider('refresh');
        });
        Cocoon.App.forwardAsync('asteroids.getBulletLinearVelocity();', function(value) {
            $('#bulletLinearVelocity').val(value).slider('refresh');
        });



        Cocoon.Touch.disable();

    } catch (e) {
        alert(e.toString());
    }

});

function resumeGame() {
    Cocoon.WebView.hide();
    Cocoon.Touch.enable();
    Cocoon.App.forward('asteroids.pause();');
}

/**
 * Game Options
 */
function setBackground(value) {
    if (value === 1) {
        Cocoon.App.forwardAsync('asteroids.setBackground(1);');
    } else {
        Cocoon.App.forwardAsync('asteroids.setBackground(0);');
    }
}

function setPlayMusic(value) {
    Cocoon.App.forwardAsync('asteroids.setPlayMusic('+value+');');
    return value;
    //localStorage['playMusic'] = value;
}

function setPlaySfx(value) {
    Cocoon.App.forwardAsync('asteroids.setPlaySfx('+value+');');
    return value;
    //localStorage['playSfx'] = value;
}

/**
 *  Asteroids
 *
 */
function setAsteroidDensity(value) {
    Cocoon.App.forwardAsync('asteroids.setAsteroidDensity('+value+');');
    return value;
}

function setAsteroidFriction(value) {
    Cocoon.App.forwardAsync('asteroids.setAsteroidFriction('+value+');');
    return value;
}

function setAsteroidRestitution(value) {
    Cocoon.App.forwardAsync('asteroids.setAsteroidRestitution('+value+');');
    return value;
}

function setAsteroidDamping(value) {
    Cocoon.App.forwardAsync('asteroids.setAsteroidDamping('+value+');');
    return value;
}

function setAsteroidLinearVelocity(value) {
    Cocoon.App.forwardAsync('asteroids.setAsteroidLinearVelocity('+value+');');
    return value;
}

function setAsteroidAngularVelocity(value) {
    Cocoon.App.forwardAsync('asteroids.setAsteroidAngularVelocity('+value+');');
    return value;
}


/**
 *  Spaceships
 *
 */
function setSpaceshipDensity(value) {
    Cocoon.App.forwardAsync('asteroids.setSpaceshipDensity('+value+');');
    return value;
}

function setSpaceshipFriction(value) {
    Cocoon.App.forwardAsync('asteroids.setSpaceshipFriction('+value+');');
    return value;
}

function setSpaceshipRestitution(value) {
    Cocoon.App.forwardAsync('asteroids.setSpaceshipRestitution('+value+');');
    return value;
}

function setSpaceshipDamping(value) {
    Cocoon.App.forwardAsync('asteroids.setSpaceshipDamping('+value+');');
    return value;
}

/**
 *  Bullets
 *
 */
function setBulletDensity(value) {
    Cocoon.App.forwardAsync('asteroids.setBulletDensity('+value+');');
    return value;
}

function setBulletFriction(value) {
    Cocoon.App.forwardAsync('asteroids.setBulletFriction('+value+');');
    return value;
}

function setBulletRestitution(value) {
    Cocoon.App.forwardAsync('asteroids.setBulletRestitution('+value+');');
    return value;
}

function setBulletDamping(value) {
    Cocoon.App.forwardAsync('asteroids.setBulletDamping('+value+');');
    return value;
}

function setBulletLinearVelocity(value) {
    Cocoon.App.forwardAsync('asteroids.setBulletLinearVelocity('+value+');');
    return value;
}


