var ASTEROID_DENSITY        = 1.0;
var ASTEROID_FRICTION       = 1.0;
var ASTEROID_RESTITUTION    = 0.2;
var ASTEROID_DAMPING        = 0.0;
var ASTEROID_LINEAR         = 4.0;
var ASTEROID_ANGULAR        = 2.0;

var SPACESHIP_DENSITY       = 1.0;
var SPACESHIP_FRICTION      = 1.0;
var SPACESHIP_RESTITUTION   = 0.2;
var SPACESHIP_DAMPING       = 0.75;

var BULLET_DENSITY          = 1.0;
var BULLET_FRICTION         = 1.0;
var BULLET_RESTITUTION      = 0.2;
var BULLET_DAMPING          = 0.0;
var BULLET_LINEAR           = 150.0;

window.addEventListener("load", function() {

    try {
        $('body').css('visibility', 'visible');

        if (getBackground() === 0) {
            $('#blueBgd').attr('checked', 'checked');
        } else {
            $('#starBgd').attr('checked', 'checked');
        }
        $('input[type=radio]').checkboxradio('refresh');

        $('#playMusic').val(getPlayMusic()).slider('refresh');

        $('#playSfx').val(getPlaySfx()).slider('refresh');


        $('#asteroidDensity').val(getAsteroidDensity()).slider('refresh');
        $('#asteroidFriction').val(getAsteroidFriction()).slider('refresh');
        $('#asteroidRestitution').val(getAsteroidRestitution()).slider('refresh');
        $('#asteroidDamping').val(getAsteroidDamping()).slider('refresh');
        $('#asteroidLinearVelocity').val(getAsteroidLinearVelocity()).slider('refresh');
        $('#asteroidAngularVelocity').val(getAsteroidAngularVelocity()).slider('refresh');

        $('#spaceshipDensity').val(getSpaceshipDensity()).slider('refresh');
        $('#spaceshipFriction').val(getSpaceshipFriction()).slider('refresh');
        $('#spaceshipRestitution').val(getSpaceshipRestitution()).slider('refresh');
        $('#spaceshipDamping').val(getSpaceshipDamping()).slider('refresh');

        $('#bulletDensity').val(getBulletDensity()).slider('refresh');
        $('#bulletFriction').val(getBulletFriction()).slider('refresh');
        $('#bulletRestitution').val(getBulletRestitution()).slider('refresh');
        $('#bulletDamping').val(getBulletDamping()).slider('refresh');
        $('#bulletLinearVelocity').val(getBulletLinearVelocity()).slider('refresh');


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
function getBackground() {
    var b = localStorage['background'] || 'blue';
    if (b === 'star') {
        return 1;
    } else {
        return 0;
    }
}

function setBackground(value) {
    if (value === 1) {
        localStorage['background'] = 'star';
        Cocoon.App.forwardAsync('asteroids.setBackground(1);');
    } else {
        localStorage['background'] = 'blue';
        Cocoon.App.forwardAsync('asteroids.setBackground(0);');
    }
}

function getPlayMusic() {
    return localStorage['playMusic'] || 50;
}
function getPlaySfx() {
    return localStorage['playSfx'] || 50;
}
function setPlayMusic(value) {
    localStorage['playMusic'] = value;
    Cocoon.App.forwardAsync('asteroids.setPlayMusic('+value+');');
    return value;
}
function setPlaySfx(value) {
    localStorage['playSfx'] = value;
    Cocoon.App.forwardAsync('asteroids.setPlaySfx('+value+');');
    return value;
}

function setBlueBgd() {
    Cocoon.App.forwardAsync('asteroids.setBackground(0);');
}


function setStarBgd() {
    Cocoon.App.forwardAsync('asteroids.setBackground(1);');
}

/**
 *  Asteroids
 *
 */
function getAsteroidDensity() {
    return localStorage['asteroidDensity'] || ASTEROID_DENSITY;
}

function setAsteroidDensity(value) {
    localStorage['asteroidDensity'] = value;
    Cocoon.App.forwardAsync('asteroids.setAsteroidDensity('+value+');');
    return value;
}

function getAsteroidFriction() {
    return localStorage['asteroidFriction'] || ASTEROID_FRICTION;
}

function setAsteroidFriction(value) {
    localStorage['asteroidFriction'] = value;
    Cocoon.App.forwardAsync('asteroids.setAsteroidFriction('+value+');');
    return value;
}

function getAsteroidRestitution() {
    return localStorage['asteroidRestitution'] || ASTEROID_RESTITUTION;
}

function setAsteroidRestitution(value) {
    localStorage['asteroidRestitution'] = value;
    Cocoon.App.forwardAsync('asteroids.setAsteroidRestitution('+value+');');
    return value;
}

function getAsteroidDamping() {
    return localStorage['asteroidDamping'] || ASTEROID_DAMPING;
}

function setAsteroidDamping(value) {
    localStorage['asteroidDamping'] = value;
    Cocoon.App.forwardAsync('asteroids.setAsteroidDamping('+value+');');
    return value;
}

function getAsteroidLinearVelocity() {
    return localStorage['asteroidLinearVelocity'] || ASTEROID_LINEAR;
}

function setAsteroidLinearVelocity(value) {
    localStorage['asteroidLinearVelocity'] = value;
    Cocoon.App.forwardAsync('asteroids.setAsteroidLinearVelocity('+value+');');
    return value;
}

function getAsteroidAngularVelocity() {
    return localStorage['asteroidAngularVelocity'] || ASTEROID_ANGULAR;
}

function setAsteroidAngularVelocity(value) {
    localStorage['asteroidAngularVelocity'] = value;
    Cocoon.App.forwardAsync('asteroids.setAsteroidAngularVelocity('+value+');');
    return value;
}


/**
 *  Spaceships
 *
 */
function getSpaceshipDensity() {
    return localStorage['spaceshipDensity'] || SPACESHIP_DENSITY;
}

function setSpaceshipDensity(value) {
    localStorage['spaceshipDensity'] = value;
    Cocoon.App.forwardAsync('spaceships.setSpaceshipDensity('+value+');');
    return value;
}

function getSpaceshipFriction() {
    return localStorage['spaceshipFriction'] || SPACESHIP_FRICTION;
}

function setSpaceshipFriction(value) {
    localStorage['spaceshipFriction'] = value;
    Cocoon.App.forwardAsync('spaceships.setSpaceshipFriction('+value+');');
    return value;
}

function getSpaceshipRestitution() {
    return localStorage['spaceshipRestitution'] || SPACESHIP_RESTITUTION;
}

function setSpaceshipRestitution(value) {
    localStorage['spaceshipRestitution'] = value;
    Cocoon.App.forwardAsync('spaceships.setSpaceshipRestitution('+value+');');
    return value;
}

function getSpaceshipDamping() {
    return localStorage['spaceshipDamping'] || SPACESHIP_DAMPING;
}

function setSpaceshipDamping(value) {
    localStorage['spaceshipDamping'] = value;
    Cocoon.App.forwardAsync('spaceships.setSpaceshipDamping('+value+');');
    return value;
}

/**
 *  Bullets
 *
 */
function getBulletDensity() {
    return localStorage['bulletDensity'] || BULLET_DENSITY;
}

function setBulletDensity(value) {
    localStorage['bulletDensity'] = value;
    Cocoon.App.forwardAsync('bullets.setBulletDensity('+value+');');
    return value;
}

function getBulletFriction() {
    return localStorage['bulletFriction'] || BULLET_FRICTION;
}

function setBulletFriction(value) {
    localStorage['bulletFriction'] = value;
    Cocoon.App.forwardAsync('bullets.setBulletFriction('+value+');');
    return value;
}

function getBulletRestitution() {
    return localStorage['bulletRestitution'] || BULLET_RESTITUTION;
}

function setBulletRestitution(value) {
    localStorage['bulletRestitution'] = value;
    Cocoon.App.forwardAsync('bullets.setBulletRestitution('+value+');');
    return value;
}

function getBulletDamping() {
    return localStorage['bulletDamping'] || BULLET_DAMPING;
}

function setBulletDamping(value) {
    localStorage['bulletDamping'] = value;
    Cocoon.App.forwardAsync('bullets.setBulletDamping('+value+');');
    return value;
}

function getBulletLinearVelocity() {
    return localStorage['bulletLinearVelocity'] || BULLET_LINEAR;
}

function setBulletLinearVelocity(value) {
    localStorage['bulletLinearVelocity'] = value;
    Cocoon.App.forwardAsync('bullets.setBulletLinearVelocity('+value+');');
    return value;
}


