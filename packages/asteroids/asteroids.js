!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.asteroids=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var asteroids;

module.exports = asteroids = (function() {
  function asteroids() {}

  return asteroids;

})();

asteroids.input = (function() {
  function input() {}

  return input;

})();

require('./src/input/key_poll');

asteroids.ui = (function() {
  function ui() {}

  return ui;

})();

require('./src/ui/point');

asteroids.graphics = (function() {
  function graphics() {}

  return graphics;

})();

require('./src/graphics/asteroid_view');

require('./src/graphics/asteroid_death_view');

require('./src/graphics/bullet_view');

require('./src/graphics/hud_view');

require('./src/graphics/spaceship_death_view');

require('./src/graphics/spaceship_view');

require('./src/graphics/wait_for_start_view');

asteroids.components = (function() {
  function components() {}

  return components;

})();

require('./src/components/animation');

require('./src/components/asteroid');

require('./src/components/audio');

require('./src/components/bullet');

require('./src/components/collision');

require('./src/components/death_throes');

require('./src/components/display');

require('./src/components/game_state');

require('./src/components/gun');

require('./src/components/gun_controls');

require('./src/components/hud');

require('./src/components/motion');

require('./src/components/motion_controls');

require('./src/components/position');

require('./src/components/spaceship');

require('./src/components/wait_for_start');

asteroids.nodes = (function() {
  function nodes() {}

  return nodes;

})();

require('./src/nodes/animation_node');

require('./src/nodes/asteroid_collision_node');

require('./src/nodes/audio_node');

require('./src/nodes/bullet_age_node');

require('./src/nodes/bullet_collision_node');

require('./src/nodes/death_throes_node');

require('./src/nodes/game_node');

require('./src/nodes/gun_control_node');

require('./src/nodes/hud_node');

require('./src/nodes/motion_control_node');

require('./src/nodes/movement_node');

require('./src/nodes/render_node');

require('./src/nodes/spaceship_collision_node');

require('./src/nodes/spaceship_node');

require('./src/nodes/wait_for_start_node');

asteroids.systems = (function() {
  function systems() {}

  return systems;

})();

require('./src/systems/animation_system');

require('./src/systems/audio_system');

require('./src/systems/bullet_age_system');

require('./src/systems/collision_system');

require('./src/systems/death_throes_system');

require('./src/systems/game_manager');

require('./src/systems/gun_control_system');

require('./src/systems/hud_system');

require('./src/systems/motion_control_system');

require('./src/systems/movement_system');

require('./src/systems/render_system');

require('./src/systems/system_priorities');

require('./src/systems/wait_for_start_system');

require('./src/entity_creator');

require('./src/game_config');

require('./src/asteroids');

require('./src/main');

//# sourceMappingURL=index.js.map

},{"./src/asteroids":2,"./src/components/animation":3,"./src/components/asteroid":4,"./src/components/audio":5,"./src/components/bullet":6,"./src/components/collision":7,"./src/components/death_throes":8,"./src/components/display":9,"./src/components/game_state":10,"./src/components/gun":11,"./src/components/gun_controls":12,"./src/components/hud":13,"./src/components/motion":14,"./src/components/motion_controls":15,"./src/components/position":16,"./src/components/spaceship":17,"./src/components/wait_for_start":18,"./src/entity_creator":19,"./src/game_config":20,"./src/graphics/asteroid_death_view":21,"./src/graphics/asteroid_view":22,"./src/graphics/bullet_view":23,"./src/graphics/hud_view":24,"./src/graphics/spaceship_death_view":25,"./src/graphics/spaceship_view":26,"./src/graphics/wait_for_start_view":27,"./src/input/key_poll":28,"./src/main":29,"./src/nodes/animation_node":30,"./src/nodes/asteroid_collision_node":31,"./src/nodes/audio_node":32,"./src/nodes/bullet_age_node":33,"./src/nodes/bullet_collision_node":34,"./src/nodes/death_throes_node":35,"./src/nodes/game_node":36,"./src/nodes/gun_control_node":37,"./src/nodes/hud_node":38,"./src/nodes/motion_control_node":39,"./src/nodes/movement_node":40,"./src/nodes/render_node":41,"./src/nodes/spaceship_collision_node":42,"./src/nodes/spaceship_node":43,"./src/nodes/wait_for_start_node":44,"./src/systems/animation_system":45,"./src/systems/audio_system":46,"./src/systems/bullet_age_system":47,"./src/systems/collision_system":48,"./src/systems/death_throes_system":49,"./src/systems/game_manager":50,"./src/systems/gun_control_system":51,"./src/systems/hud_system":52,"./src/systems/motion_control_system":53,"./src/systems/movement_system":54,"./src/systems/render_system":55,"./src/systems/system_priorities":56,"./src/systems/wait_for_start_system":57,"./src/ui/point":58}],2:[function(require,module,exports){
'use strict';
var AnimationSystem, AudioSystem, BulletAgeSystem, CollisionSystem, DeathThroesSystem, EntityCreator, GameConfig, GameManager, GameState, GunControlSystem, HudSystem, KeyPoll, MotionControlSystem, MovementSystem, PhysicsSystem, RenderSystem, SystemPriorities, WaitForStartSystem, asteroids;

asteroids = require('../../lib');

AnimationSystem = asteroids.systems.AnimationSystem;

AudioSystem = asteroids.systems.AudioSystem;

BulletAgeSystem = asteroids.systems.BulletAgeSystem;

CollisionSystem = asteroids.systems.CollisionSystem;

DeathThroesSystem = asteroids.systems.DeathThroesSystem;

GameManager = asteroids.systems.GameManager;

GunControlSystem = asteroids.systems.GunControlSystem;

HudSystem = asteroids.systems.HudSystem;

MotionControlSystem = asteroids.systems.MotionControlSystem;

MovementSystem = asteroids.systems.MovementSystem;

RenderSystem = asteroids.systems.RenderSystem;

SystemPriorities = asteroids.systems.SystemPriorities;

WaitForStartSystem = asteroids.systems.WaitForStartSystem;

PhysicsSystem = asteroids.systems.PhysicsSystem;

GameState = asteroids.components.GameState;

EntityCreator = asteroids.EntityCreator;

GameConfig = asteroids.GameConfig;

KeyPoll = asteroids.input.KeyPoll;

asteroids.Asteroids = (function() {
  Asteroids.prototype.container = null;

  Asteroids.prototype.engine = null;

  Asteroids.prototype.tickProvider = null;

  Asteroids.prototype.creator = null;

  Asteroids.prototype.keyPoll = null;

  Asteroids.prototype.config = null;

  function Asteroids(container, width, height) {
    this.container = container;
    this.prepare(width, height);
  }

  Asteroids.prototype.prepare = function(width, height) {
    this.engine = new ash.core.Engine();
    this.creator = new EntityCreator(this.engine, this.container, this.world);
    this.keyPoll = new KeyPoll(window);
    this.config = new GameConfig();
    this.config.height = height;
    this.config.width = width;
    this.engine.addSystem(new WaitForStartSystem(this.creator), SystemPriorities.preUpdate);
    this.engine.addSystem(new GameManager(this.creator, this.config), SystemPriorities.preUpdate);
    this.engine.addSystem(new MotionControlSystem(this.keyPoll), SystemPriorities.update);
    this.engine.addSystem(new GunControlSystem(this.keyPoll, this.creator), SystemPriorities.update);
    this.engine.addSystem(new BulletAgeSystem(this.creator), SystemPriorities.update);
    this.engine.addSystem(new DeathThroesSystem(this.creator), SystemPriorities.update);
    this.engine.addSystem(new MovementSystem(this.config), SystemPriorities.move);
    this.engine.addSystem(new CollisionSystem(this.creator), SystemPriorities.resolveCollisions);
    this.engine.addSystem(new AnimationSystem(), SystemPriorities.animate);
    this.engine.addSystem(new HudSystem(), SystemPriorities.animate);
    this.engine.addSystem(new RenderSystem(this.container), SystemPriorities.render);
    this.engine.addSystem(new AudioSystem(), SystemPriorities.render);
    this.creator.createWaitForClick();
    this.creator.createGame();
  };

  Asteroids.prototype.start = function() {
    var stats, x, y;
    if (navigator.isCocoonJS) {
      stats = null;
    } else {
      x = Math.floor(this.config.width / 2) - 40;
      y = 0;
      stats = new Stats();
      stats.setMode(0);
      stats.domElement.style.position = "absolute";
      stats.domElement.style.left = "" + x + "px";
      stats.domElement.style.top = "" + y + "px";
      document.body.appendChild(stats.domElement);
    }
    this.tickProvider = new ash.tick.FrameTickProvider(stats);
    this.tickProvider.add(this.engine.update);
    this.tickProvider.start();
  };

  return Asteroids;

})();

//# sourceMappingURL=asteroids.js.map

},{"../../lib":1}],3:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.components.Animation = (function() {
  Animation.prototype.animation = null;

  function Animation(animation) {
    this.animation = animation;
  }

  return Animation;

})();

//# sourceMappingURL=animation.js.map

},{"../../../lib":1}],4:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.components.Asteroid = (function() {
  Asteroid.prototype.fsm = null;

  function Asteroid(fsm) {
    this.fsm = fsm;
  }

  return Asteroid;

})();

//# sourceMappingURL=asteroid.js.map

},{"../../../lib":1}],5:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.components.Audio = (function() {
  Audio.prototype.toPlay = null;

  function Audio() {
    this.toPlay = [];
  }

  Audio.prototype.play = function(sound) {
    return this.toPlay.push(sound);
  };

  return Audio;

})();

//# sourceMappingURL=audio.js.map

},{"../../../lib":1}],6:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.components.Bullet = (function() {
  Bullet.prototype.lifeRemaining = 0;

  function Bullet(lifeRemaining) {
    this.lifeRemaining = lifeRemaining;
  }

  return Bullet;

})();

//# sourceMappingURL=bullet.js.map

},{"../../../lib":1}],7:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.components.Collision = (function() {
  Collision.prototype.radius = 0;

  function Collision(radius) {
    this.radius = radius;
  }

  return Collision;

})();

//# sourceMappingURL=collision.js.map

},{"../../../lib":1}],8:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.components.DeathThroes = (function() {
  DeathThroes.prototype.countdown = 0;

  function DeathThroes(duration) {
    this.countdown = duration;
  }

  return DeathThroes;

})();

//# sourceMappingURL=death_throes.js.map

},{"../../../lib":1}],9:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.components.Display = (function() {
  Display.prototype.graphic = 0;

  function Display(graphic) {
    this.graphic = graphic;
  }

  return Display;

})();

//# sourceMappingURL=display.js.map

},{"../../../lib":1}],10:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.components.GameState = (function() {
  function GameState() {}

  GameState.prototype.lives = 3;

  GameState.prototype.level = 0;

  GameState.prototype.hits = 0;

  GameState.prototype.playing = false;

  GameState.prototype.setForStart = function() {
    this.lives = 3;
    this.level = 0;
    this.hits = 0;
    this.playing = true;
  };

  return GameState;

})();

//# sourceMappingURL=game_state.js.map

},{"../../../lib":1}],11:[function(require,module,exports){
'use strict';
var Point, asteroids;

asteroids = require('../../../lib');

Point = asteroids.ui.Point;

asteroids.components.Gun = (function() {
  Gun.prototype.shooting = false;

  Gun.prototype.offsetFromParent = null;

  Gun.prototype.timeSinceLastShot = 0;

  Gun.prototype.offsetFromParent = null;

  function Gun(offsetX, offsetY, minimumShotInterval, bulletLifetime) {
    this.minimumShotInterval = minimumShotInterval;
    this.bulletLifetime = bulletLifetime;
    this.shooting = false;
    this.offsetFromParent = null;
    this.timeSinceLastShot = 0;
    this.offsetFromParent = new Point(offsetX, offsetY);
  }

  return Gun;

})();

//# sourceMappingURL=gun.js.map

},{"../../../lib":1}],12:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.components.GunControls = (function() {
  GunControls.prototype.trigger = 0;

  function GunControls(trigger) {
    this.trigger = trigger;
  }

  return GunControls;

})();

//# sourceMappingURL=gun_controls.js.map

},{"../../../lib":1}],13:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.components.Hud = (function() {
  Hud.prototype.view = null;

  function Hud(view) {
    this.view = view;
  }

  return Hud;

})();

//# sourceMappingURL=hud.js.map

},{"../../../lib":1}],14:[function(require,module,exports){
'use strict';
var Point, asteroids;

asteroids = require('../../../lib');

Point = asteroids.ui.Point;

asteroids.components.Motion = (function() {
  Motion.prototype.velocity = null;

  Motion.prototype.angularVelocity = 0;

  Motion.prototype.damping = 0;

  function Motion(velocityX, velocityY, angularVelocity, damping) {
    this.angularVelocity = angularVelocity;
    this.damping = damping;
    this.velocity = new Point(velocityX, velocityY);
  }

  return Motion;

})();

//# sourceMappingURL=motion.js.map

},{"../../../lib":1}],15:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.components.MotionControls = (function() {
  MotionControls.prototype.left = 0;

  MotionControls.prototype.right = 0;

  MotionControls.prototype.accelerate = 0;

  MotionControls.prototype.accelerationRate = 0;

  MotionControls.prototype.rotationRate = 0;

  function MotionControls(left, right, accelerate, accelerationRate, rotationRate) {
    this.left = left;
    this.right = right;
    this.accelerate = accelerate;
    this.accelerationRate = accelerationRate;
    this.rotationRate = rotationRate;
  }

  return MotionControls;

})();

//# sourceMappingURL=motion_controls.js.map

},{"../../../lib":1}],16:[function(require,module,exports){
'use strict';
var Point, asteroids;

asteroids = require('../../../lib');

Point = asteroids.ui.Point;

asteroids.components.Position = (function() {
  Position.prototype.position = null;

  Position.prototype.rotation = 0;

  function Position(x, y, rotation) {
    this.rotation = rotation;
    this.position = new Point(x, y);
  }

  return Position;

})();

//# sourceMappingURL=position.js.map

},{"../../../lib":1}],17:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.components.Spaceship = (function() {
  Spaceship.prototype.fsm = null;

  function Spaceship(fsm) {
    this.fsm = fsm;
  }

  return Spaceship;

})();

//# sourceMappingURL=spaceship.js.map

},{"../../../lib":1}],18:[function(require,module,exports){
'use strict';
var asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../../lib');

asteroids.components.WaitForStart = (function() {
  WaitForStart.prototype.waitForStart = null;

  WaitForStart.prototype.startGame = false;

  function WaitForStart(waitForStart) {
    this.waitForStart = waitForStart;
    this.setStartGame = __bind(this.setStartGame, this);
    this.waitForStart.click.add(this.setStartGame);
  }

  WaitForStart.prototype.setStartGame = function() {
    this.startGame = true;
  };

  return WaitForStart;

})();

//# sourceMappingURL=wait_for_start.js.map

},{"../../../lib":1}],19:[function(require,module,exports){
'use strict';
var Animation, Asteroid, AsteroidDeathView, AsteroidView, Audio, Bullet, BulletView, Collision, DeathThroes, Display, Entity, EntityStateMachine, GameState, Gun, GunControls, Hud, HudView, Motion, MotionControls, Physics, Position, Spaceship, SpaceshipDeathView, SpaceshipView, WaitForStart, WaitForStartView, asteroids;

asteroids = require('../../lib');

WaitForStartView = asteroids.graphics.WaitForStartView;

Entity = ash.core.Entity;

EntityStateMachine = ash.fsm.EntityStateMachine;


/*
 * Asteroid Game Components
 */

Animation = asteroids.components.Animation;

Asteroid = asteroids.components.Asteroid;

Audio = asteroids.components.Audio;

Bullet = asteroids.components.Bullet;

Collision = asteroids.components.Collision;

DeathThroes = asteroids.components.DeathThroes;

Display = asteroids.components.Display;

GameState = asteroids.components.GameState;

Gun = asteroids.components.Gun;

GunControls = asteroids.components.GunControls;

Hud = asteroids.components.Hud;

Motion = asteroids.components.Motion;

MotionControls = asteroids.components.MotionControls;

Physics = asteroids.components.Physics;

Position = asteroids.components.Position;

Spaceship = asteroids.components.Spaceship;

WaitForStart = asteroids.components.WaitForStart;


/*
 * Drawable Components
 */

AsteroidDeathView = asteroids.graphics.AsteroidDeathView;

AsteroidView = asteroids.graphics.AsteroidView;

BulletView = asteroids.graphics.BulletView;

HudView = asteroids.graphics.HudView;

SpaceshipDeathView = asteroids.graphics.SpaceshipDeathView;

SpaceshipView = asteroids.graphics.SpaceshipView;

asteroids.EntityCreator = (function() {
  var KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_Z;

  KEY_LEFT = 37;

  KEY_UP = 38;

  KEY_RIGHT = 39;

  KEY_Z = 90;

  EntityCreator.prototype.engine = null;

  EntityCreator.prototype.waitEntity = null;

  EntityCreator.prototype.graphic = null;

  function EntityCreator(engine, graphic, world) {
    this.engine = engine;
    this.graphic = graphic;
    this.world = world;
  }

  EntityCreator.prototype.destroyEntity = function(entity) {
    this.engine.removeEntity(entity);
  };


  /*
   * Game State
   */

  EntityCreator.prototype.createGame = function() {
    var gameEntity, hud;
    hud = new HudView(this.graphic);
    gameEntity = new Entity('game').add(new GameState()).add(new Hud(hud)).add(new Display(hud)).add(new Position(0, 0, 0, 0));
    this.engine.addEntity(gameEntity);
    return gameEntity;
  };


  /*
   * Start...
   */

  EntityCreator.prototype.createWaitForClick = function() {
    var waitView;
    if (!this.waitEntity) {
      waitView = new WaitForStartView(this.graphic);
      this.waitEntity = new Entity('wait').add(new WaitForStart(waitView)).add(new Display(waitView)).add(new Position(0, 0, 0, 0));
    }
    this.waitEntity.get(WaitForStart).startGame = false;
    this.engine.addEntity(this.waitEntity);
    return this.waitEntity;
  };


  /*
   * Create an Asteroid with FSM Animation
   */

  EntityCreator.prototype.createAsteroid = function(radius, x, y) {
    var asteroid, deathView, fsm;
    asteroid = new Entity();
    fsm = new EntityStateMachine(asteroid);
    fsm.createState('alive').add(Motion).withInstance(new Motion((Math.random() - 0.5) * 4 * (50 - radius), (Math.random() - 0.5) * 4 * (50 - radius), Math.random() * 2 - 1, 0)).add(Collision).withInstance(new Collision(radius)).add(Display).withInstance(new Display(new AsteroidView(this.graphic, radius)));
    deathView = new AsteroidDeathView(this.graphic, radius);
    fsm.createState('destroyed').add(DeathThroes).withInstance(new DeathThroes(3)).add(Display).withInstance(new Display(deathView)).add(Animation).withInstance(new Animation(deathView));
    asteroid.add(new Asteroid(fsm)).add(new Position(x, y, 0)).add(new Audio());
    fsm.changeState('alive');
    this.engine.addEntity(asteroid);
    return asteroid;
  };


  /*
   * Create Player Spaceship with FSM Animation
   */

  EntityCreator.prototype.createSpaceship = function() {
    var deathView, fsm, spaceship;
    spaceship = new Entity();
    fsm = new EntityStateMachine(spaceship);
    fsm.createState('playing').add(Motion).withInstance(new Motion(0, 0, 0, 15)).add(MotionControls).withInstance(new MotionControls(KEY_LEFT, KEY_RIGHT, KEY_UP, 100, 3)).add(Gun).withInstance(new Gun(8, 0, 0.3, 2)).add(GunControls).withInstance(new GunControls(KEY_Z)).add(Collision).withInstance(new Collision(9)).add(Display).withInstance(new Display(new SpaceshipView(this.graphic)));
    deathView = new SpaceshipDeathView(this.graphic);
    fsm.createState('destroyed').add(DeathThroes).withInstance(new DeathThroes(5)).add(Display).withInstance(new Display(deathView)).add(Animation).withInstance(new Animation(deathView));
    spaceship.add(new Spaceship(fsm)).add(new Position(300, 225, 0)).add(new Audio());
    fsm.changeState('playing');
    this.engine.addEntity(spaceship);
    return spaceship;
  };


  /*
   * Create a Bullet
   */

  EntityCreator.prototype.createUserBullet = function(gun, parentPosition) {
    var bullet, cos, sin, x, y;
    cos = Math.cos(parentPosition.rotation);
    sin = Math.sin(parentPosition.rotation);
    x = cos * gun.offsetFromParent.x - sin * gun.offsetFromParent.y + parentPosition.position.x;
    y = sin * gun.offsetFromParent.x + cos * gun.offsetFromParent.y + parentPosition.position.y;
    bullet = new Entity().add(new Bullet(gun.bulletLifetime)).add(new Position(x, y, 0)).add(new Collision(0)).add(new Motion(cos * 150, sin * 150, 0, 0)).add(new Display(new BulletView(this.graphic)));
    this.engine.addEntity(bullet);
    return bullet;
  };

  return EntityCreator;

})();

//# sourceMappingURL=entity_creator.js.map

},{"../../lib":1}],20:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../lib');

asteroids.GameConfig = (function() {
  function GameConfig() {}

  GameConfig.prototype.width = 0;

  GameConfig.prototype.height = 0;

  return GameConfig;

})();

//# sourceMappingURL=game_config.js.map

},{"../../lib":1}],21:[function(require,module,exports){
'use strict';
var Dot, Point, asteroids;

asteroids = require('../../../lib');

Point = asteroids.ui.Point;

asteroids.graphics.AsteroidDeathView = (function() {
  var numDots;

  numDots = 8;

  AsteroidDeathView.prototype.dots = null;

  AsteroidDeathView.prototype.x = 0;

  AsteroidDeathView.prototype.y = 0;

  AsteroidDeathView.prototype.width = 0;

  AsteroidDeathView.prototype.height = 0;

  AsteroidDeathView.prototype.rotation = 0;

  AsteroidDeathView.prototype.graphic = null;

  AsteroidDeathView.prototype.radius = 0;

  AsteroidDeathView.prototype.points = null;

  AsteroidDeathView.prototype.count = 0;

  AsteroidDeathView.prototype.first = true;

  function AsteroidDeathView(graphic, radius) {
    this.graphic = graphic;
    this.radius = radius;
    this.dots = [];
  }

  AsteroidDeathView.prototype.animate = function(time) {
    var dot, i, _i, _j, _len, _ref;
    if (this.first) {
      this.first = false;
      for (i = _i = 0; 0 <= numDots ? _i < numDots : _i > numDots; i = 0 <= numDots ? ++_i : --_i) {
        dot = new Dot(this.graphic, this.radius);
        this.dots.push(dot);
      }
    }
    _ref = this.dots;
    for (_j = 0, _len = _ref.length; _j < _len; _j++) {
      dot = _ref[_j];
      dot.x += dot.velocity.x * time;
      dot.y += dot.velocity.y * time;
    }
    return this.draw();
  };

  AsteroidDeathView.prototype.draw = function() {
    var dot, _i, _len, _ref, _results;
    _ref = this.dots;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dot = _ref[_i];
      _results.push(dot.draw(this.x, this.y));
    }
    return _results;
  };

  return AsteroidDeathView;

})();

Dot = (function() {
  Dot.prototype.velocity = null;

  Dot.prototype.graphic = null;

  Dot.prototype.x1 = 0;

  Dot.prototype.y1 = 0;

  Dot.prototype.x = 0;

  Dot.prototype.y = 0;

  function Dot(graphic, maxDistance) {
    var angle, distance, speed;
    this.graphic = graphic;
    angle = Math.random() * 2 * Math.PI;
    distance = Math.random() * maxDistance;
    this.x = Math.cos(angle) * distance;
    this.y = Math.sin(angle) * distance;
    speed = Math.random() * 10 + 10;
    this.velocity = new Point(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  Dot.prototype.draw = function(x, y) {
    var graphic;
    graphic = this.graphic;
    graphic.save();
    graphic.beginPath();
    graphic.translate(x, y);
    graphic.rotate(this.rotation);
    graphic.fillStyle = "#FFFFFF";
    graphic.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
    graphic.fill();
    graphic.restore();
  };

  return Dot;

})();

//# sourceMappingURL=asteroid_death_view.js.map

},{"../../../lib":1}],22:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.graphics.AsteroidView = (function() {
  AsteroidView.prototype.x = 0;

  AsteroidView.prototype.y = 0;

  AsteroidView.prototype.width = 0;

  AsteroidView.prototype.height = 0;

  AsteroidView.prototype.rotation = 0;

  AsteroidView.prototype.graphic = null;

  AsteroidView.prototype.radius = 0;

  AsteroidView.prototype.points = null;

  AsteroidView.prototype.count = 0;

  function AsteroidView(graphic, radius) {
    var angle, length, posX, posY;
    this.graphic = graphic;
    this.radius = radius;
    this.width = this.radius;
    this.height = this.radius;
    this.points = [];
    angle = 0;
    while (angle < Math.PI * 2) {
      length = (0.75 + Math.random() * 0.25) * this.radius;
      posX = Math.cos(angle) * length;
      posY = Math.sin(angle) * length;
      this.points.push({
        x: posX,
        y: posY
      });
      angle += Math.random() * 0.5;
    }
  }

  AsteroidView.prototype.draw = function() {
    var graphic, i;
    graphic = this.graphic;
    graphic.save();
    graphic.beginPath();
    graphic.translate(this.x, this.y);
    graphic.rotate(this.rotation);
    graphic.fillStyle = "#FFFFFF";
    graphic.moveTo(this.radius, 0);
    i = 0;
    while (i < this.points.length) {
      graphic.lineTo(this.points[i].x, this.points[i].y);
      ++i;
    }
    graphic.lineTo(this.radius, 0);
    graphic.fill();
    graphic.restore();
  };

  return AsteroidView;

})();

//# sourceMappingURL=asteroid_view.js.map

},{"../../../lib":1}],23:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.graphics.BulletView = (function() {
  BulletView.prototype.x = 0;

  BulletView.prototype.y = 0;

  BulletView.prototype.width = 4;

  BulletView.prototype.height = 4;

  BulletView.prototype.rotation = 0;

  BulletView.prototype.graphic = null;

  function BulletView(graphic) {
    this.graphic = graphic;
  }

  BulletView.prototype.draw = function() {
    var graphic;
    graphic = this.graphic;
    graphic.save();
    graphic.beginPath();
    graphic.rotate(this.rotation);
    graphic.fillStyle = "#FFFFFF";
    graphic.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
    graphic.fill();
    graphic.restore();
  };

  return BulletView;

})();

//# sourceMappingURL=bullet_view.js.map

},{"../../../lib":1}],24:[function(require,module,exports){
'use strict';
var asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../../lib');

asteroids.graphics.HudView = (function() {
  HudView.prototype.x = 0;

  HudView.prototype.y = 0;

  HudView.prototype.width = 4;

  HudView.prototype.height = 4;

  HudView.prototype.rotation = 0;

  HudView.prototype.graphic = null;

  HudView.prototype.score = 0;

  HudView.prototype.lives = 3;

  HudView.prototype.drawScore = null;

  HudView.prototype.drawLives = null;

  function HudView(graphic) {
    this.graphic = graphic;
    this.setScore = __bind(this.setScore, this);
    this.setLives = __bind(this.setLives, this);
    this.draw = __bind(this.draw, this);
    this.drawScore = this.createScore;
    this.drawLives = this.createLives;
  }

  HudView.prototype.draw = function() {
    this.drawScore();
    this.drawLives();
  };

  HudView.prototype.setLives = function(lives) {
    return this.lives = lives;
  };

  HudView.prototype.setScore = function(score) {
    return this.score = score;
  };

  HudView.prototype.createLives = function() {
    var l, s, x, y;
    this.graphic.save();
    this.graphic.beginPath();
    this.graphic.font = 'bold 18px Helvetica';
    this.graphic.fillStyle = '#FFFFFF';
    this.graphic.textAlign = 'center';
    s = "LIVES: " + this.lives;
    l = this.graphic.measureText(s);
    x = l.width;
    y = 20;
    this.graphic.fillText(s, x, y);
    this.graphic.fill();
    this.graphic.restore();
  };

  HudView.prototype.createScore = function() {
    var l, s, x, y;
    this.graphic.save();
    this.graphic.beginPath();
    this.graphic.font = 'bold 18px Helvetica';
    this.graphic.fillStyle = '#FFFFFF';
    this.graphic.textAlign = 'center';
    s = "SCORE: " + this.score;
    l = this.graphic.measureText(s);
    x = (window.window.innerWidth * window.devicePixelRatio) - l.width;
    y = 20;
    this.graphic.fillText(s, x, y);
    this.graphic.fill();
    this.graphic.restore();
  };

  return HudView;

})();

//# sourceMappingURL=hud_view.js.map

},{"../../../lib":1}],25:[function(require,module,exports){
'use strict';
var Point, asteroids;

asteroids = require('../../../lib');

Point = asteroids.ui.Point;

asteroids.graphics.SpaceshipDeathView = (function() {
  SpaceshipDeathView.prototype.x = 0;

  SpaceshipDeathView.prototype.y = 0;

  SpaceshipDeathView.prototype.width = 20;

  SpaceshipDeathView.prototype.height = 20;

  SpaceshipDeathView.prototype.rotation = 0;

  SpaceshipDeathView.prototype.graphic = null;

  SpaceshipDeathView.prototype.vel1 = null;

  SpaceshipDeathView.prototype.vel2 = null;

  SpaceshipDeathView.prototype.rot1 = null;

  SpaceshipDeathView.prototype.rot2 = null;

  SpaceshipDeathView.prototype.x1 = 0;

  SpaceshipDeathView.prototype.y2 = 0;

  SpaceshipDeathView.prototype.y1 = 0;

  SpaceshipDeathView.prototype.y2 = 0;

  SpaceshipDeathView.prototype.first = true;

  function SpaceshipDeathView(graphic) {
    this.graphic = graphic;
  }

  SpaceshipDeathView.prototype.animate = function(time) {
    if (this.first) {
      this.first = false;
      this.vel1 = new Point(Math.random() * 10 - 5, Math.random() * 10 + 10);
      this.vel2 = new Point(Math.random() * 10 - 5, -(Math.random() * 10 + 10));
      this.rot1 = Math.random() * 300 - 150;
      this.rot2 = Math.random() * 300 - 150;
      this.x1 = this.x2 = this.x;
      this.y1 = this.y2 = this.y;
      this.r1 = this.r2 = this.rotation;
    }
    this.x1 += this.vel1.x * time;
    this.y1 += this.vel1.y * time;
    this.r1 += this.rot1 * time;
    this.x2 += this.vel2.x * time;
    this.y2 += this.vel2.y * time;
    this.r2 += this.rot2 * time;
    return this.draw();
  };

  SpaceshipDeathView.prototype.draw = function() {
    var graphic;
    graphic = this.graphic;
    graphic.save();
    graphic.beginPath();
    graphic.translate(this.x + this.x1, this.y + this.y1);
    graphic.rotate(this.r1);
    graphic.fillStyle = "#FFFFFF";
    graphic.moveTo(10, 0);
    graphic.lineTo(-7, 7);
    graphic.lineTo(-4, 0);
    graphic.lineTo(10, 0);
    graphic.fill();
    graphic.restore();
    graphic.save();
    graphic.beginPath();
    graphic.translate(this.x + this.x2, this.y + this.y2);
    graphic.rotate(this.r2);
    graphic.fillStyle = "#FFFFFF";
    graphic.moveTo(10, 0);
    graphic.lineTo(-7, 7);
    graphic.lineTo(-4, 0);
    graphic.lineTo(10, 0);
    graphic.fill();
    graphic.restore();
  };

  return SpaceshipDeathView;

})();

//# sourceMappingURL=spaceship_death_view.js.map

},{"../../../lib":1}],26:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.graphics.SpaceshipView = (function() {
  SpaceshipView.prototype.x = 0;

  SpaceshipView.prototype.y = 0;

  SpaceshipView.prototype.width = 20;

  SpaceshipView.prototype.height = 20;

  SpaceshipView.prototype.rotation = 0;

  SpaceshipView.prototype.graphic = null;

  function SpaceshipView(graphic) {
    this.graphic = graphic;
  }

  SpaceshipView.prototype.draw = function() {
    var graphic;
    graphic = this.graphic;
    graphic.save();
    graphic.beginPath();
    graphic.translate(this.x, this.y);
    graphic.rotate(this.rotation);
    graphic.fillStyle = "#FFFFFF";
    graphic.moveTo(10, 0);
    graphic.lineTo(-7, 7);
    graphic.lineTo(-4, 0);
    graphic.lineTo(-7, -7);
    graphic.lineTo(10, 0);
    graphic.fill();
    graphic.restore();
  };

  return SpaceshipView;

})();

//# sourceMappingURL=spaceship_view.js.map

},{"../../../lib":1}],27:[function(require,module,exports){
'use strict';
var Signal0, asteroids;

asteroids = require('../../../lib');

Signal0 = ash.signals.Signal0;

asteroids.graphics.WaitForStartView = (function() {
  WaitForStartView.prototype.x = 0;

  WaitForStartView.prototype.y = 0;

  WaitForStartView.prototype.width = 4;

  WaitForStartView.prototype.height = 4;

  WaitForStartView.prototype.rotation = 0;

  WaitForStartView.prototype.graphic = null;

  WaitForStartView.prototype.gameOver = null;

  WaitForStartView.prototype.clickToStart = null;

  WaitForStartView.prototype.instructions = null;

  WaitForStartView.prototype.click = null;

  function WaitForStartView(graphic) {
    this.graphic = graphic;
    this.click = new Signal0();
    this.gameOver = this.createGameOver;
    this.instructions = this.createInstructions;
    this.clickToStart = this.createClickToStart;
    this.graphic.canvas.addEventListener('click', (function(_this) {
      return function(event) {
        return _this.click.dispatch();
      };
    })(this));
  }

  WaitForStartView.prototype.createGameOver = function() {
    var l, s, x, y;
    this.graphic.save();
    this.graphic.beginPath();
    this.graphic.font = 'bold 32px Helvetica';
    this.graphic.fillStyle = '#FFFFFF';
    s = 'ASTEROIDS';
    l = this.graphic.measureText(s);
    x = Math.floor(((window.innerWidth * window.devicePixelRatio) - l.width) / 2);
    y = 175;
    this.graphic.fillText(s, x, y);
    this.graphic.fill();
    this.graphic.restore();
  };

  WaitForStartView.prototype.createClickToStart = function() {
    var l, s, x, y;
    this.graphic.save();
    this.graphic.beginPath();
    this.graphic.font = 'bold 18px Helvetica';
    this.graphic.fillStyle = '#FFFFFF';
    s = 'CLICK TO START';
    l = this.graphic.measureText(s);
    x = Math.floor(((window.innerWidth * window.devicePixelRatio) - l.width) / 2);
    y = 225;
    this.graphic.fillText(s, x, y);
    this.graphic.fill();
    this.graphic.restore();
  };

  WaitForStartView.prototype.createInstructions = function() {
    var l, s, x, y;
    this.graphic.save();
    this.graphic.beginPath();
    this.graphic.font = 'bold 14px Helvetica';
    this.graphic.fillStyle = '#FFFFFF';
    s = 'Z to Fire  ~  Arrow Keys to Move';
    l = this.graphic.measureText(s);
    x = 10;
    y = window.innerHeight * window.devicePixelRatio - 20;
    this.graphic.fillText(s, x, y);
    this.graphic.fill();
    this.graphic.restore();
  };

  WaitForStartView.prototype.draw = function() {
    this.gameOver();
    this.clickToStart();
    this.instructions();
  };

  return WaitForStartView;

})();

//# sourceMappingURL=wait_for_start_view.js.map

},{"../../../lib":1}],28:[function(require,module,exports){
'use strict';
var asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../../lib');

asteroids.input.KeyPoll = (function() {
  var displayObj, states;

  states = null;

  displayObj = null;

  function KeyPoll(displayObj) {
    this.displayObj = displayObj;
    this.isUp = __bind(this.isUp, this);
    this.isDown = __bind(this.isDown, this);
    this.keyUpListener = __bind(this.keyUpListener, this);
    this.keyDownListener = __bind(this.keyDownListener, this);
    this.states = {};
    this.displayObj.addEventListener("keydown", this.keyDownListener);
    this.displayObj.addEventListener("keyup", this.keyUpListener);
  }

  KeyPoll.prototype.keyDownListener = function(event) {
    this.states[event.keyCode] = true;
  };

  KeyPoll.prototype.keyUpListener = function(event) {
    if (this.states[event.keyCode]) {
      this.states[event.keyCode] = false;
    }
  };

  KeyPoll.prototype.isDown = function(keyCode) {
    return this.states[keyCode];
  };

  KeyPoll.prototype.isUp = function(keyCode) {
    return !this.states[keyCode];
  };

  return KeyPoll;

})();

//# sourceMappingURL=key_poll.js.map

},{"../../../lib":1}],29:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../lib');

asteroids.Main = (function() {
  function Main() {
    var canvas;
    canvas = this.canvas();
    asteroids = new asteroids.Asteroids(canvas.getContext('2d'), canvas.width, canvas.height);
    asteroids.start();
    return;
  }

  Main.prototype.canvas = function() {
    var canvas;
    canvas = document.createElement(navigator.isCocoonJS ? 'screencanvas' : 'canvas');
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.backgroundColor = '#000000';
    document.body.appendChild(canvas);
    return canvas;
  };

  return Main;

})();

//# sourceMappingURL=main.js.map

},{"../../lib":1}],30:[function(require,module,exports){
'use strict';
var asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

asteroids.nodes.AnimationNode = (function(_super) {
  __extends(AnimationNode, _super);

  function AnimationNode() {
    return AnimationNode.__super__.constructor.apply(this, arguments);
  }

  AnimationNode.components = {
    animation: asteroids.components.Animation
  };

  AnimationNode.prototype.animation = null;

  return AnimationNode;

})(ash.core.Node);

//# sourceMappingURL=animation_node.js.map

},{"../../../lib":1}],31:[function(require,module,exports){
'use strict';
var asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

asteroids.nodes.AsteroidCollisionNode = (function(_super) {
  __extends(AsteroidCollisionNode, _super);

  function AsteroidCollisionNode() {
    return AsteroidCollisionNode.__super__.constructor.apply(this, arguments);
  }

  AsteroidCollisionNode.components = {
    asteroid: asteroids.components.Asteroid,
    position: asteroids.components.Position,
    collision: asteroids.components.Collision,
    audio: asteroids.components.Audio
  };

  AsteroidCollisionNode.prototype.asteroid = null;

  AsteroidCollisionNode.prototype.position = null;

  AsteroidCollisionNode.prototype.collision = null;

  AsteroidCollisionNode.prototype.audio = null;

  return AsteroidCollisionNode;

})(ash.core.Node);

//# sourceMappingURL=asteroid_collision_node.js.map

},{"../../../lib":1}],32:[function(require,module,exports){
'use strict';
var asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

asteroids.nodes.AudioNode = (function(_super) {
  __extends(AudioNode, _super);

  function AudioNode() {
    return AudioNode.__super__.constructor.apply(this, arguments);
  }

  AudioNode.components = {
    audio: asteroids.components.Audio
  };

  AudioNode.prototype.audio = null;

  return AudioNode;

})(ash.core.Node);

//# sourceMappingURL=audio_node.js.map

},{"../../../lib":1}],33:[function(require,module,exports){
'use strict';
var asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

asteroids.nodes.BulletAgeNode = (function(_super) {
  __extends(BulletAgeNode, _super);

  function BulletAgeNode() {
    return BulletAgeNode.__super__.constructor.apply(this, arguments);
  }

  BulletAgeNode.components = {
    bullet: asteroids.components.Bullet
  };

  BulletAgeNode.prototype.bullet = null;

  return BulletAgeNode;

})(ash.core.Node);

//# sourceMappingURL=bullet_age_node.js.map

},{"../../../lib":1}],34:[function(require,module,exports){
'use strict';
var asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

asteroids.nodes.BulletCollisionNode = (function(_super) {
  __extends(BulletCollisionNode, _super);

  function BulletCollisionNode() {
    return BulletCollisionNode.__super__.constructor.apply(this, arguments);
  }

  BulletCollisionNode.components = {
    bullet: asteroids.components.Bullet,
    position: asteroids.components.Position,
    collision: asteroids.components.Collision
  };

  BulletCollisionNode.prototype.bullet = null;

  BulletCollisionNode.prototype.position = null;

  BulletCollisionNode.prototype.collision = null;

  return BulletCollisionNode;

})(ash.core.Node);

//# sourceMappingURL=bullet_collision_node.js.map

},{"../../../lib":1}],35:[function(require,module,exports){
'use strict';
var asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

asteroids.nodes.DeathThroesNode = (function(_super) {
  __extends(DeathThroesNode, _super);

  function DeathThroesNode() {
    return DeathThroesNode.__super__.constructor.apply(this, arguments);
  }

  DeathThroesNode.components = {
    death: asteroids.components.DeathThroes
  };

  DeathThroesNode.prototype.death = null;

  return DeathThroesNode;

})(ash.core.Node);

//# sourceMappingURL=death_throes_node.js.map

},{"../../../lib":1}],36:[function(require,module,exports){
'use strict';
var asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

asteroids.nodes.GameNode = (function(_super) {
  __extends(GameNode, _super);

  function GameNode() {
    return GameNode.__super__.constructor.apply(this, arguments);
  }

  GameNode.components = {
    state: asteroids.components.GameState
  };

  GameNode.prototype.state = null;

  return GameNode;

})(ash.core.Node);

//# sourceMappingURL=game_node.js.map

},{"../../../lib":1}],37:[function(require,module,exports){
'use strict';
var asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

asteroids.nodes.GunControlNode = (function(_super) {
  __extends(GunControlNode, _super);

  function GunControlNode() {
    return GunControlNode.__super__.constructor.apply(this, arguments);
  }

  GunControlNode.components = {
    audio: asteroids.components.Audio,
    control: asteroids.components.GunControls,
    gun: asteroids.components.Gun,
    position: asteroids.components.Position
  };

  GunControlNode.prototype.control = null;

  GunControlNode.prototype.gun = null;

  GunControlNode.prototype.position = null;

  GunControlNode.prototype.audio = null;

  return GunControlNode;

})(ash.core.Node);

//# sourceMappingURL=gun_control_node.js.map

},{"../../../lib":1}],38:[function(require,module,exports){
'use strict';
var asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

asteroids.nodes.HudNode = (function(_super) {
  __extends(HudNode, _super);

  function HudNode() {
    return HudNode.__super__.constructor.apply(this, arguments);
  }

  HudNode.components = {
    state: asteroids.components.GameState,
    hud: asteroids.components.Hud
  };

  HudNode.prototype.state = null;

  HudNode.prototype.hud = null;

  return HudNode;

})(ash.core.Node);

//# sourceMappingURL=hud_node.js.map

},{"../../../lib":1}],39:[function(require,module,exports){
'use strict';
var asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

asteroids.nodes.MotionControlNode = (function(_super) {
  __extends(MotionControlNode, _super);

  function MotionControlNode() {
    return MotionControlNode.__super__.constructor.apply(this, arguments);
  }

  MotionControlNode.components = {
    control: asteroids.components.MotionControls,
    position: asteroids.components.Position,
    motion: asteroids.components.Motion
  };

  MotionControlNode.prototype.control = null;

  MotionControlNode.prototype.position = null;

  MotionControlNode.prototype.motion = null;

  return MotionControlNode;

})(ash.core.Node);

//# sourceMappingURL=motion_control_node.js.map

},{"../../../lib":1}],40:[function(require,module,exports){
'use strict';
var asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

asteroids.nodes.MovementNode = (function(_super) {
  __extends(MovementNode, _super);

  function MovementNode() {
    return MovementNode.__super__.constructor.apply(this, arguments);
  }

  MovementNode.components = {
    position: asteroids.components.Position,
    motion: asteroids.components.Motion
  };

  MovementNode.prototype.position = null;

  MovementNode.prototype.motion = null;

  return MovementNode;

})(ash.core.Node);

//# sourceMappingURL=movement_node.js.map

},{"../../../lib":1}],41:[function(require,module,exports){
'use strict';
var asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

asteroids.nodes.RenderNode = (function(_super) {
  __extends(RenderNode, _super);

  function RenderNode() {
    return RenderNode.__super__.constructor.apply(this, arguments);
  }

  RenderNode.components = {
    position: asteroids.components.Position,
    display: asteroids.components.Display
  };

  RenderNode.prototype.position = null;

  RenderNode.prototype.display = null;

  return RenderNode;

})(ash.core.Node);

//# sourceMappingURL=render_node.js.map

},{"../../../lib":1}],42:[function(require,module,exports){
'use strict';
var asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

asteroids.nodes.SpaceshipCollisionNode = (function(_super) {
  __extends(SpaceshipCollisionNode, _super);

  function SpaceshipCollisionNode() {
    return SpaceshipCollisionNode.__super__.constructor.apply(this, arguments);
  }

  SpaceshipCollisionNode.components = {
    spaceship: asteroids.components.Spaceship,
    position: asteroids.components.Position,
    collision: asteroids.components.Collision,
    audio: asteroids.components.Audio
  };

  SpaceshipCollisionNode.prototype.spaceship = 0;

  SpaceshipCollisionNode.prototype.position = 0;

  SpaceshipCollisionNode.prototype.collision = null;

  SpaceshipCollisionNode.prototype.audio = null;

  return SpaceshipCollisionNode;

})(ash.core.Node);

//# sourceMappingURL=spaceship_collision_node.js.map

},{"../../../lib":1}],43:[function(require,module,exports){
'use strict';
var asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

asteroids.nodes.SpaceshipNode = (function(_super) {
  __extends(SpaceshipNode, _super);

  function SpaceshipNode() {
    return SpaceshipNode.__super__.constructor.apply(this, arguments);
  }

  SpaceshipNode.components = {
    spaceship: asteroids.components.Spaceship,
    position: asteroids.components.Position
  };

  SpaceshipNode.prototype.spaceship = 0;

  SpaceshipNode.prototype.position = 0;

  return SpaceshipNode;

})(ash.core.Node);

//# sourceMappingURL=spaceship_node.js.map

},{"../../../lib":1}],44:[function(require,module,exports){
'use strict';
var asteroids,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

asteroids.nodes.WaitForStartNode = (function(_super) {
  __extends(WaitForStartNode, _super);

  function WaitForStartNode() {
    return WaitForStartNode.__super__.constructor.apply(this, arguments);
  }

  WaitForStartNode.components = {
    wait: asteroids.components.WaitForStart
  };

  WaitForStartNode.prototype.wait = null;

  return WaitForStartNode;

})(ash.core.Node);

//# sourceMappingURL=wait_for_start_node.js.map

},{"../../../lib":1}],45:[function(require,module,exports){
'use strict';
var AnimationNode, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

AnimationNode = asteroids.nodes.AnimationNode;

asteroids.systems.AnimationSystem = (function(_super) {
  __extends(AnimationSystem, _super);

  function AnimationSystem() {
    this.updateNode = __bind(this.updateNode, this);
    AnimationSystem.__super__.constructor.call(this, AnimationNode, this.updateNode);
  }

  AnimationSystem.prototype.updateNode = function(node, time) {
    node.animation.animation.animate(time);
  };

  return AnimationSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=animation_system.js.map

},{"../../../lib":1}],46:[function(require,module,exports){
'use strict';
var AudioNode, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

AudioNode = asteroids.nodes.AudioNode;

asteroids.systems.AudioSystem = (function(_super) {
  __extends(AudioSystem, _super);

  function AudioSystem() {
    this.updateNode = __bind(this.updateNode, this);
    AudioSystem.__super__.constructor.call(this, AudioNode, this.updateNode);
  }

  AudioSystem.prototype.updateNode = function(node, time) {
    var each, sound, type, _ref;
    _ref = node.audio.toPlay;
    for (each in _ref) {
      type = _ref[each];
      sound = new type();
      sound.play(0, 1);
    }
    node.audio.toPlay.length = 0;
  };

  return AudioSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=audio_system.js.map

},{"../../../lib":1}],47:[function(require,module,exports){
'use strict';
var BulletAgeNode, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

BulletAgeNode = asteroids.nodes.BulletAgeNode;

asteroids.systems.BulletAgeSystem = (function(_super) {
  __extends(BulletAgeSystem, _super);

  BulletAgeSystem.prototype.creator = null;

  function BulletAgeSystem(creator) {
    this.creator = creator;
    this.updateNode = __bind(this.updateNode, this);
    BulletAgeSystem.__super__.constructor.call(this, BulletAgeNode, this.updateNode);
  }

  BulletAgeSystem.prototype.updateNode = function(node, time) {
    var bullet;
    bullet = node.bullet;
    bullet.lifeRemaining -= time;
    if (bullet.lifeRemaining <= 0) {
      this.creator.destroyEntity(node.entity);
    }
  };

  return BulletAgeSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=bullet_age_system.js.map

},{"../../../lib":1}],48:[function(require,module,exports){
'use strict';
var Animation, Asteroid, AsteroidCollisionNode, AsteroidDeathView, AsteroidView, Audio, Bullet, BulletCollisionNode, BulletView, Collision, DeathThroes, Display, GameNode, GameState, Gun, GunControls, Hud, HudView, Motion, MotionControls, Physics, Position, Spaceship, SpaceshipCollisionNode, SpaceshipDeathView, SpaceshipView, WaitForStart, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

SpaceshipCollisionNode = asteroids.nodes.SpaceshipCollisionNode;

AsteroidCollisionNode = asteroids.nodes.AsteroidCollisionNode;

BulletCollisionNode = asteroids.nodes.BulletCollisionNode;

GameNode = asteroids.nodes.GameNode;

Animation = asteroids.components.Animation;

Asteroid = asteroids.components.Asteroid;

Audio = asteroids.components.Audio;

Bullet = asteroids.components.Bullet;

Collision = asteroids.components.Collision;

DeathThroes = asteroids.components.DeathThroes;

Display = asteroids.components.Display;

GameState = asteroids.components.GameState;

Gun = asteroids.components.Gun;

GunControls = asteroids.components.GunControls;

Hud = asteroids.components.Hud;

Motion = asteroids.components.Motion;

MotionControls = asteroids.components.MotionControls;

Physics = asteroids.components.Physics;

Position = asteroids.components.Position;

Spaceship = asteroids.components.Spaceship;

WaitForStart = asteroids.components.WaitForStart;

AsteroidDeathView = asteroids.graphics.AsteroidDeathView;

AsteroidView = asteroids.graphics.AsteroidView;

BulletView = asteroids.graphics.BulletView;

HudView = asteroids.graphics.HudView;

SpaceshipDeathView = asteroids.graphics.SpaceshipDeathView;

SpaceshipView = asteroids.graphics.SpaceshipView;

asteroids.systems.CollisionSystem = (function(_super) {
  __extends(CollisionSystem, _super);

  CollisionSystem.prototype.creator = null;

  CollisionSystem.prototype.games = null;

  CollisionSystem.prototype.spaceships = null;

  CollisionSystem.prototype.asteroids = null;

  CollisionSystem.prototype.bullets = null;

  function CollisionSystem(creator) {
    this.creator = creator;
    this.update = __bind(this.update, this);
  }

  CollisionSystem.prototype.addToEngine = function(engine) {
    this.games = engine.getNodeList(GameNode);
    this.spaceships = engine.getNodeList(SpaceshipCollisionNode);
    this.asteroids = engine.getNodeList(AsteroidCollisionNode);
    this.bullets = engine.getNodeList(BulletCollisionNode);
  };

  CollisionSystem.prototype.removeFromEngine = function(engine) {
    this.games = null;
    this.spaceships = null;
    this.asteroids = null;
    this.bullets = null;
  };

  CollisionSystem.prototype.update = function(time) {
    var asteroid, bullet, spaceship;
    bullet = this.bullets.head;
    while (bullet) {
      asteroid = this.asteroids.head;
      while (asteroid) {
        if (asteroid.position.position.distanceTo(bullet.position.position) <= asteroid.collision.radius) {

          /*
           You hit an asteroid
           */
          this.creator.destroyEntity(bullet.entity);
          if (asteroid.collision.radius > 10) {
            this.creator.createAsteroid(asteroid.collision.radius - 10, asteroid.position.position.x + Math.random() * 10 - 5, asteroid.position.position.y + Math.random() * 10 - 5);
            this.creator.createAsteroid(asteroid.collision.radius - 10, asteroid.position.position.x + Math.random() * 10 - 5, asteroid.position.position.y + Math.random() * 10 - 5);
          }
          asteroid.asteroid.fsm.changeState('destroyed');
          if (this.games.head) {
            this.games.head.state.hits++;
          }
          break;
        }
        asteroid = asteroid.next;
      }
      bullet = bullet.next;
    }
    spaceship = this.spaceships.head;
    while (spaceship) {
      asteroid = this.asteroids.head;
      while (asteroid) {
        if (asteroid.position.position.distanceTo(spaceship.position.position) <= asteroid.collision.radius + spaceship.collision.radius) {

          /*
           You were hit
           */
          spaceship.spaceship.fsm.changeState('destroyed');
          if (this.games.head) {
            this.games.head.state.lives++;
          }
          break;
        }
        asteroid = asteroid.next;
      }
      spaceship = spaceship.next;
    }
  };

  return CollisionSystem;

})(ash.core.System);

//# sourceMappingURL=collision_system.js.map

},{"../../../lib":1}],49:[function(require,module,exports){
'use strict';
var DeathThroesNode, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

DeathThroesNode = asteroids.nodes.DeathThroesNode;

asteroids.systems.DeathThroesSystem = (function(_super) {
  __extends(DeathThroesSystem, _super);

  DeathThroesSystem.prototype.creator = null;

  function DeathThroesSystem(creator) {
    this.creator = creator;
    this.updateNode = __bind(this.updateNode, this);
    DeathThroesSystem.__super__.constructor.call(this, DeathThroesNode, this.updateNode);
  }

  DeathThroesSystem.prototype.updateNode = function(node, time) {
    node.death.countdown -= time;
    if (node.death.countdown <= 0) {
      this.creator.destroyEntity(node.entity);
    }
  };

  return DeathThroesSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=death_throes_system.js.map

},{"../../../lib":1}],50:[function(require,module,exports){
'use strict';
var AsteroidCollisionNode, BulletCollisionNode, GameNode, Point, SpaceshipNode, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

GameNode = asteroids.nodes.GameNode;

SpaceshipNode = asteroids.nodes.SpaceshipNode;

AsteroidCollisionNode = asteroids.nodes.AsteroidCollisionNode;

BulletCollisionNode = asteroids.nodes.BulletCollisionNode;

Point = asteroids.ui.Point;

asteroids.systems.GameManager = (function(_super) {
  __extends(GameManager, _super);

  GameManager.prototype.config = null;

  GameManager.prototype.creator = null;

  GameManager.prototype.gameNodes = null;

  GameManager.prototype.spaceships = null;

  GameManager.prototype.asteroids = null;

  GameManager.prototype.bullets = null;

  function GameManager(creator, config) {
    this.creator = creator;
    this.config = config;
    this.update = __bind(this.update, this);
  }

  GameManager.prototype.addToEngine = function(engine) {
    this.gameNodes = engine.getNodeList(GameNode);
    this.spaceships = engine.getNodeList(SpaceshipNode);
    this.asteroids = engine.getNodeList(AsteroidCollisionNode);
    this.bullets = engine.getNodeList(BulletCollisionNode);
  };

  GameManager.prototype.update = function(time) {
    var asteroid, asteroidCount, clearToAddSpaceship, i, newSpaceshipPosition, node, position, spaceship;
    node = this.gameNodes.head;
    if (node && node.state.playing) {
      if (this.spaceships.empty) {
        if (node.state.lives > 0) {
          newSpaceshipPosition = new Point(this.config.width * 0.5, this.config.height * 0.5);
          clearToAddSpaceship = true;
          asteroid = this.asteroids.head;
          while (asteroid) {
            if (Point.distance(asteroid.position.position, newSpaceshipPosition) <= asteroid.collision.radius + 50) {
              clearToAddSpaceship = false;
              break;
            }
            asteroid = asteroid.next;
          }
          if (clearToAddSpaceship) {
            this.creator.createSpaceship();
          }
        } else {
          node.state.playing = false;
          this.creator.createWaitForClick();
        }
      }
      if (this.asteroids.empty && this.bullets.empty && !this.spaceships.empty) {
        spaceship = this.spaceships.head;
        node.state.level++;
        asteroidCount = 2 + node.state.level;
        i = 0;
        while (i < asteroidCount) {
          while (true) {
            position = new Point(Math.random() * this.config.width, Math.random() * this.config.height);
            if (!(Point.distance(position, spaceship.position.position) <= 80)) {
              break;
            }
          }
          this.creator.createAsteroid(30, position.x, position.y);
          ++i;
        }
      }
    }
  };

  GameManager.prototype.removeFromEngine = function(engine) {
    this.gameNodes = null;
    this.spaceships = null;
    this.asteroids = null;
    this.bullets = null;
  };

  return GameManager;

})(ash.core.System);

//# sourceMappingURL=game_manager.js.map

},{"../../../lib":1}],51:[function(require,module,exports){
'use strict';
var GunControlNode, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

GunControlNode = asteroids.nodes.GunControlNode;

asteroids.systems.GunControlSystem = (function(_super) {
  __extends(GunControlSystem, _super);

  GunControlSystem.prototype.keyPoll = null;

  GunControlSystem.prototype.creator = null;

  function GunControlSystem(keyPoll, creator) {
    this.keyPoll = keyPoll;
    this.creator = creator;
    this.updateNode = __bind(this.updateNode, this);
    GunControlSystem.__super__.constructor.call(this, GunControlNode, this.updateNode);
  }

  GunControlSystem.prototype.updateNode = function(node, time) {
    var control, gun, position;
    control = node.control;
    position = node.position;
    gun = node.gun;
    gun.shooting = this.keyPoll.isDown(control.trigger);
    gun.timeSinceLastShot += time;
    if (gun.shooting && gun.timeSinceLastShot >= gun.minimumShotInterval) {
      this.creator.createUserBullet(gun, position);
      gun.timeSinceLastShot = 0;
    }
  };

  return GunControlSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=gun_control_system.js.map

},{"../../../lib":1}],52:[function(require,module,exports){
'use strict';
var HudNode, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

HudNode = asteroids.nodes.HudNode;

asteroids.systems.HudSystem = (function(_super) {
  __extends(HudSystem, _super);

  function HudSystem() {
    this.updateNode = __bind(this.updateNode, this);
    HudSystem.__super__.constructor.call(this, HudNode, this.updateNode);
  }

  HudSystem.prototype.updateNode = function(node, time) {
    node.hud.view.setLives(node.state.lives);
    node.hud.view.setScore(node.state.hits);
  };

  return HudSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=hud_system.js.map

},{"../../../lib":1}],53:[function(require,module,exports){
'use strict';
var MotionControlNode, asteroids, b2Vec2,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

MotionControlNode = asteroids.nodes.MotionControlNode;

b2Vec2 = Box2D.Common.Math.b2Vec2;

asteroids.systems.MotionControlSystem = (function(_super) {
  __extends(MotionControlSystem, _super);

  MotionControlSystem.prototype.keyPoll = null;

  function MotionControlSystem(keyPoll) {
    this.keyPoll = keyPoll;
    this.updateNode = __bind(this.updateNode, this);
    MotionControlSystem.__super__.constructor.call(this, MotionControlNode, this.updateNode);
  }

  MotionControlSystem.prototype.updateNode = function(node, time) {
    var control, left, motion, position, right;
    control = node.control;
    position = node.position;
    motion = node.motion;
    left = this.keyPoll.isDown(control.left);
    right = this.keyPoll.isDown(control.right);
    if (left) {
      position.rotation -= control.rotationRate * time;
    }
    if (right) {
      position.rotation += control.rotationRate * time;
    }
    if (this.keyPoll.isDown(control.accelerate)) {
      motion.velocity.x += Math.cos(position.rotation) * control.accelerationRate * time;
      motion.velocity.y += Math.sin(position.rotation) * control.accelerationRate * time;
    }
  };

  return MotionControlSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=motion_control_system.js.map

},{"../../../lib":1}],54:[function(require,module,exports){
'use strict';
var MovementNode, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

MovementNode = asteroids.nodes.MovementNode;

asteroids.systems.MovementSystem = (function(_super) {
  __extends(MovementSystem, _super);

  MovementSystem.prototype.config = null;

  function MovementSystem(config) {
    this.config = config;
    this.updateNode = __bind(this.updateNode, this);
    MovementSystem.__super__.constructor.call(this, MovementNode, this.updateNode);
  }

  MovementSystem.prototype.updateNode = function(node, time) {
    var motion, position, xDamp, yDamp;
    position = node.position;
    motion = node.motion;
    position.position.x += motion.velocity.x * time;
    position.position.y += motion.velocity.y * time;
    if (position.position.x < 0) {
      position.position.x += this.config.width;
    }
    if (position.position.x > this.config.width) {
      position.position.x -= this.config.width;
    }
    if (position.position.y < 0) {
      position.position.y += this.config.height;
    }
    if (position.position.y > this.config.height) {
      position.position.y -= this.config.height;
    }
    position.rotation += motion.angularVelocity * time;
    if (motion.damping > 0) {
      xDamp = Math.abs(Math.cos(position.rotation) * motion.damping * time);
      yDamp = Math.abs(Math.sin(position.rotation) * motion.damping * time);
      if (motion.velocity.x > xDamp) {
        motion.velocity.x -= xDamp;
      } else if (motion.velocity.x < -xDamp) {
        motion.velocity.x += xDamp;
      } else {
        motion.velocity.x = 0;
      }
      if (motion.velocity.y > yDamp) {
        motion.velocity.y -= yDamp;
      } else if (motion.velocity.y < -yDamp) {
        motion.velocity.y += yDamp;
      } else {
        motion.velocity.y = 0;
      }
    }
  };

  return MovementSystem;

})(ash.tools.ListIteratingSystem);

//# sourceMappingURL=movement_system.js.map

},{"../../../lib":1}],55:[function(require,module,exports){
'use strict';
var RenderNode, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

RenderNode = asteroids.nodes.RenderNode;

asteroids.systems.RenderSystem = (function(_super) {
  __extends(RenderSystem, _super);

  RenderSystem.prototype.graphic = null;

  RenderSystem.prototype.nodes = null;

  function RenderSystem(graphic) {
    this.graphic = graphic;
    this.update = __bind(this.update, this);
  }

  RenderSystem.prototype.addToEngine = function(engine) {
    var node;
    this.nodes = engine.getNodeList(RenderNode);
    node = this.nodes.head;
    while (node) {
      this.addToDisplay(node);
      node = node.next;
    }
  };

  RenderSystem.prototype.addToDisplay = function(node) {};

  RenderSystem.prototype.removeFromDisplay = function(node) {};

  RenderSystem.prototype.removeFromEngine = function(engine) {
    this.nodes = null;
  };

  RenderSystem.prototype.update = function(time) {
    var display, graphic, node, position;
    this.graphic.save();
    this.graphic.translate(0, 0);
    this.graphic.rotate(0);
    this.graphic.clearRect(0, 0, this.graphic.canvas.width, this.graphic.canvas.height);
    node = this.nodes.head;
    while (node) {
      display = node.display;
      graphic = display.graphic;
      position = node.position;
      graphic.x = position.position.x;
      graphic.y = position.position.y;
      graphic.rotation = position.rotation;
      graphic.draw();
      node = node.next;
    }
    this.graphic.restore();
  };

  return RenderSystem;

})(ash.core.System);

//# sourceMappingURL=render_system.js.map

},{"../../../lib":1}],56:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.systems.SystemPriorities = (function() {
  function SystemPriorities() {}

  SystemPriorities.preUpdate = 1;

  SystemPriorities.update = 2;

  SystemPriorities.move = 3;

  SystemPriorities.resolveCollisions = 4;

  SystemPriorities.stateMachines = 5;

  SystemPriorities.animate = 6;

  SystemPriorities.render = 7;

  return SystemPriorities;

})();

//# sourceMappingURL=system_priorities.js.map

},{"../../../lib":1}],57:[function(require,module,exports){
'use strict';
var AsteroidCollisionNode, GameNode, WaitForStartNode, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

asteroids = require('../../../lib');

WaitForStartNode = asteroids.nodes.WaitForStartNode;

AsteroidCollisionNode = asteroids.nodes.AsteroidCollisionNode;

GameNode = asteroids.nodes.GameNode;

asteroids.systems.WaitForStartSystem = (function(_super) {
  __extends(WaitForStartSystem, _super);

  WaitForStartSystem.prototype.engine = null;

  WaitForStartSystem.prototype.creator = null;

  WaitForStartSystem.prototype.gameNodes = null;

  WaitForStartSystem.prototype.waitNodes = null;

  WaitForStartSystem.prototype.asteroids = null;

  function WaitForStartSystem(creator) {
    this.creator = creator;
    this.update = __bind(this.update, this);
  }

  WaitForStartSystem.prototype.addToEngine = function(engine) {
    this.engine = engine;
    this.waitNodes = engine.getNodeList(WaitForStartNode);
    this.gameNodes = engine.getNodeList(GameNode);
    this.asteroids = engine.getNodeList(AsteroidCollisionNode);
  };

  WaitForStartSystem.prototype.removeFromEngine = function(engine) {
    this.waitNodes = null;
    this.gameNodes = null;
  };

  WaitForStartSystem.prototype.update = function(time) {
    var asteroid, game, node;
    node = this.waitNodes.head;
    game = this.gameNodes.head;
    if (node && node.wait.startGame && game) {
      asteroid = this.asteroids.head;
      while (asteroid) {
        this.creator.destroyEntity(asteroid.entity);
        asteroid = asteroid.next;
      }
      game.state.setForStart();
      node.wait.startGame = false;
      this.engine.removeEntity(node.entity);
    }
  };

  return WaitForStartSystem;

})(ash.core.System);

//# sourceMappingURL=wait_for_start_system.js.map

},{"../../../lib":1}],58:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../../lib');

asteroids.ui.Point = (function() {
  Point.prototype.x = 0;

  Point.prototype.y = 0;

  function Point(x, y) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
  }

  Point.distance = function(point1, point2) {
    var dx, dy;
    dx = point1.x - point2.x;
    dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  Point.prototype.distanceSquaredTo = function(targetPoint) {
    var dx, dy;
    dx = this.x - targetPoint.x;
    dy = this.y - targetPoint.y;
    return dx * dx + dy * dy;
  };

  Point.prototype.distanceTo = function(targetPoint) {
    var dx, dy;
    dx = this.x - targetPoint.x;
    dy = this.y - targetPoint.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return Point;

})();

//# sourceMappingURL=point.js.map

},{"../../../lib":1}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0bXAvbGliL2luZGV4LmpzIiwidG1wL2xpYi9zcmMvYXN0ZXJvaWRzLmpzIiwidG1wL2xpYi9zcmMvY29tcG9uZW50cy9hbmltYXRpb24uanMiLCJ0bXAvbGliL3NyYy9jb21wb25lbnRzL2FzdGVyb2lkLmpzIiwidG1wL2xpYi9zcmMvY29tcG9uZW50cy9hdWRpby5qcyIsInRtcC9saWIvc3JjL2NvbXBvbmVudHMvYnVsbGV0LmpzIiwidG1wL2xpYi9zcmMvY29tcG9uZW50cy9jb2xsaXNpb24uanMiLCJ0bXAvbGliL3NyYy9jb21wb25lbnRzL2RlYXRoX3Rocm9lcy5qcyIsInRtcC9saWIvc3JjL2NvbXBvbmVudHMvZGlzcGxheS5qcyIsInRtcC9saWIvc3JjL2NvbXBvbmVudHMvZ2FtZV9zdGF0ZS5qcyIsInRtcC9saWIvc3JjL2NvbXBvbmVudHMvZ3VuLmpzIiwidG1wL2xpYi9zcmMvY29tcG9uZW50cy9ndW5fY29udHJvbHMuanMiLCJ0bXAvbGliL3NyYy9jb21wb25lbnRzL2h1ZC5qcyIsInRtcC9saWIvc3JjL2NvbXBvbmVudHMvbW90aW9uLmpzIiwidG1wL2xpYi9zcmMvY29tcG9uZW50cy9tb3Rpb25fY29udHJvbHMuanMiLCJ0bXAvbGliL3NyYy9jb21wb25lbnRzL3Bvc2l0aW9uLmpzIiwidG1wL2xpYi9zcmMvY29tcG9uZW50cy9zcGFjZXNoaXAuanMiLCJ0bXAvbGliL3NyYy9jb21wb25lbnRzL3dhaXRfZm9yX3N0YXJ0LmpzIiwidG1wL2xpYi9zcmMvZW50aXR5X2NyZWF0b3IuanMiLCJ0bXAvbGliL3NyYy9nYW1lX2NvbmZpZy5qcyIsInRtcC9saWIvc3JjL2dyYXBoaWNzL2FzdGVyb2lkX2RlYXRoX3ZpZXcuanMiLCJ0bXAvbGliL3NyYy9ncmFwaGljcy9hc3Rlcm9pZF92aWV3LmpzIiwidG1wL2xpYi9zcmMvZ3JhcGhpY3MvYnVsbGV0X3ZpZXcuanMiLCJ0bXAvbGliL3NyYy9ncmFwaGljcy9odWRfdmlldy5qcyIsInRtcC9saWIvc3JjL2dyYXBoaWNzL3NwYWNlc2hpcF9kZWF0aF92aWV3LmpzIiwidG1wL2xpYi9zcmMvZ3JhcGhpY3Mvc3BhY2VzaGlwX3ZpZXcuanMiLCJ0bXAvbGliL3NyYy9ncmFwaGljcy93YWl0X2Zvcl9zdGFydF92aWV3LmpzIiwidG1wL2xpYi9zcmMvaW5wdXQva2V5X3BvbGwuanMiLCJ0bXAvbGliL3NyYy9tYWluLmpzIiwidG1wL2xpYi9zcmMvbm9kZXMvYW5pbWF0aW9uX25vZGUuanMiLCJ0bXAvbGliL3NyYy9ub2Rlcy9hc3Rlcm9pZF9jb2xsaXNpb25fbm9kZS5qcyIsInRtcC9saWIvc3JjL25vZGVzL2F1ZGlvX25vZGUuanMiLCJ0bXAvbGliL3NyYy9ub2Rlcy9idWxsZXRfYWdlX25vZGUuanMiLCJ0bXAvbGliL3NyYy9ub2Rlcy9idWxsZXRfY29sbGlzaW9uX25vZGUuanMiLCJ0bXAvbGliL3NyYy9ub2Rlcy9kZWF0aF90aHJvZXNfbm9kZS5qcyIsInRtcC9saWIvc3JjL25vZGVzL2dhbWVfbm9kZS5qcyIsInRtcC9saWIvc3JjL25vZGVzL2d1bl9jb250cm9sX25vZGUuanMiLCJ0bXAvbGliL3NyYy9ub2Rlcy9odWRfbm9kZS5qcyIsInRtcC9saWIvc3JjL25vZGVzL21vdGlvbl9jb250cm9sX25vZGUuanMiLCJ0bXAvbGliL3NyYy9ub2Rlcy9tb3ZlbWVudF9ub2RlLmpzIiwidG1wL2xpYi9zcmMvbm9kZXMvcmVuZGVyX25vZGUuanMiLCJ0bXAvbGliL3NyYy9ub2Rlcy9zcGFjZXNoaXBfY29sbGlzaW9uX25vZGUuanMiLCJ0bXAvbGliL3NyYy9ub2Rlcy9zcGFjZXNoaXBfbm9kZS5qcyIsInRtcC9saWIvc3JjL25vZGVzL3dhaXRfZm9yX3N0YXJ0X25vZGUuanMiLCJ0bXAvbGliL3NyYy9zeXN0ZW1zL2FuaW1hdGlvbl9zeXN0ZW0uanMiLCJ0bXAvbGliL3NyYy9zeXN0ZW1zL2F1ZGlvX3N5c3RlbS5qcyIsInRtcC9saWIvc3JjL3N5c3RlbXMvYnVsbGV0X2FnZV9zeXN0ZW0uanMiLCJ0bXAvbGliL3NyYy9zeXN0ZW1zL2NvbGxpc2lvbl9zeXN0ZW0uanMiLCJ0bXAvbGliL3NyYy9zeXN0ZW1zL2RlYXRoX3Rocm9lc19zeXN0ZW0uanMiLCJ0bXAvbGliL3NyYy9zeXN0ZW1zL2dhbWVfbWFuYWdlci5qcyIsInRtcC9saWIvc3JjL3N5c3RlbXMvZ3VuX2NvbnRyb2xfc3lzdGVtLmpzIiwidG1wL2xpYi9zcmMvc3lzdGVtcy9odWRfc3lzdGVtLmpzIiwidG1wL2xpYi9zcmMvc3lzdGVtcy9tb3Rpb25fY29udHJvbF9zeXN0ZW0uanMiLCJ0bXAvbGliL3NyYy9zeXN0ZW1zL21vdmVtZW50X3N5c3RlbS5qcyIsInRtcC9saWIvc3JjL3N5c3RlbXMvcmVuZGVyX3N5c3RlbS5qcyIsInRtcC9saWIvc3JjL3N5c3RlbXMvc3lzdGVtX3ByaW9yaXRpZXMuanMiLCJ0bXAvbGliL3NyYy9zeXN0ZW1zL3dhaXRfZm9yX3N0YXJ0X3N5c3RlbS5qcyIsInRtcC9saWIvc3JjL3VpL3BvaW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxubW9kdWxlLmV4cG9ydHMgPSBhc3Rlcm9pZHMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIGFzdGVyb2lkcygpIHt9XG5cbiAgcmV0dXJuIGFzdGVyb2lkcztcblxufSkoKTtcblxuYXN0ZXJvaWRzLmlucHV0ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBpbnB1dCgpIHt9XG5cbiAgcmV0dXJuIGlucHV0O1xuXG59KSgpO1xuXG5yZXF1aXJlKCcuL3NyYy9pbnB1dC9rZXlfcG9sbCcpO1xuXG5hc3Rlcm9pZHMudWkgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHVpKCkge31cblxuICByZXR1cm4gdWk7XG5cbn0pKCk7XG5cbnJlcXVpcmUoJy4vc3JjL3VpL3BvaW50Jyk7XG5cbmFzdGVyb2lkcy5ncmFwaGljcyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gZ3JhcGhpY3MoKSB7fVxuXG4gIHJldHVybiBncmFwaGljcztcblxufSkoKTtcblxucmVxdWlyZSgnLi9zcmMvZ3JhcGhpY3MvYXN0ZXJvaWRfdmlldycpO1xuXG5yZXF1aXJlKCcuL3NyYy9ncmFwaGljcy9hc3Rlcm9pZF9kZWF0aF92aWV3Jyk7XG5cbnJlcXVpcmUoJy4vc3JjL2dyYXBoaWNzL2J1bGxldF92aWV3Jyk7XG5cbnJlcXVpcmUoJy4vc3JjL2dyYXBoaWNzL2h1ZF92aWV3Jyk7XG5cbnJlcXVpcmUoJy4vc3JjL2dyYXBoaWNzL3NwYWNlc2hpcF9kZWF0aF92aWV3Jyk7XG5cbnJlcXVpcmUoJy4vc3JjL2dyYXBoaWNzL3NwYWNlc2hpcF92aWV3Jyk7XG5cbnJlcXVpcmUoJy4vc3JjL2dyYXBoaWNzL3dhaXRfZm9yX3N0YXJ0X3ZpZXcnKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIGNvbXBvbmVudHMoKSB7fVxuXG4gIHJldHVybiBjb21wb25lbnRzO1xuXG59KSgpO1xuXG5yZXF1aXJlKCcuL3NyYy9jb21wb25lbnRzL2FuaW1hdGlvbicpO1xuXG5yZXF1aXJlKCcuL3NyYy9jb21wb25lbnRzL2FzdGVyb2lkJyk7XG5cbnJlcXVpcmUoJy4vc3JjL2NvbXBvbmVudHMvYXVkaW8nKTtcblxucmVxdWlyZSgnLi9zcmMvY29tcG9uZW50cy9idWxsZXQnKTtcblxucmVxdWlyZSgnLi9zcmMvY29tcG9uZW50cy9jb2xsaXNpb24nKTtcblxucmVxdWlyZSgnLi9zcmMvY29tcG9uZW50cy9kZWF0aF90aHJvZXMnKTtcblxucmVxdWlyZSgnLi9zcmMvY29tcG9uZW50cy9kaXNwbGF5Jyk7XG5cbnJlcXVpcmUoJy4vc3JjL2NvbXBvbmVudHMvZ2FtZV9zdGF0ZScpO1xuXG5yZXF1aXJlKCcuL3NyYy9jb21wb25lbnRzL2d1bicpO1xuXG5yZXF1aXJlKCcuL3NyYy9jb21wb25lbnRzL2d1bl9jb250cm9scycpO1xuXG5yZXF1aXJlKCcuL3NyYy9jb21wb25lbnRzL2h1ZCcpO1xuXG5yZXF1aXJlKCcuL3NyYy9jb21wb25lbnRzL21vdGlvbicpO1xuXG5yZXF1aXJlKCcuL3NyYy9jb21wb25lbnRzL21vdGlvbl9jb250cm9scycpO1xuXG5yZXF1aXJlKCcuL3NyYy9jb21wb25lbnRzL3Bvc2l0aW9uJyk7XG5cbnJlcXVpcmUoJy4vc3JjL2NvbXBvbmVudHMvc3BhY2VzaGlwJyk7XG5cbnJlcXVpcmUoJy4vc3JjL2NvbXBvbmVudHMvd2FpdF9mb3Jfc3RhcnQnKTtcblxuYXN0ZXJvaWRzLm5vZGVzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBub2RlcygpIHt9XG5cbiAgcmV0dXJuIG5vZGVzO1xuXG59KSgpO1xuXG5yZXF1aXJlKCcuL3NyYy9ub2Rlcy9hbmltYXRpb25fbm9kZScpO1xuXG5yZXF1aXJlKCcuL3NyYy9ub2Rlcy9hc3Rlcm9pZF9jb2xsaXNpb25fbm9kZScpO1xuXG5yZXF1aXJlKCcuL3NyYy9ub2Rlcy9hdWRpb19ub2RlJyk7XG5cbnJlcXVpcmUoJy4vc3JjL25vZGVzL2J1bGxldF9hZ2Vfbm9kZScpO1xuXG5yZXF1aXJlKCcuL3NyYy9ub2Rlcy9idWxsZXRfY29sbGlzaW9uX25vZGUnKTtcblxucmVxdWlyZSgnLi9zcmMvbm9kZXMvZGVhdGhfdGhyb2VzX25vZGUnKTtcblxucmVxdWlyZSgnLi9zcmMvbm9kZXMvZ2FtZV9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vc3JjL25vZGVzL2d1bl9jb250cm9sX25vZGUnKTtcblxucmVxdWlyZSgnLi9zcmMvbm9kZXMvaHVkX25vZGUnKTtcblxucmVxdWlyZSgnLi9zcmMvbm9kZXMvbW90aW9uX2NvbnRyb2xfbm9kZScpO1xuXG5yZXF1aXJlKCcuL3NyYy9ub2Rlcy9tb3ZlbWVudF9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vc3JjL25vZGVzL3JlbmRlcl9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vc3JjL25vZGVzL3NwYWNlc2hpcF9jb2xsaXNpb25fbm9kZScpO1xuXG5yZXF1aXJlKCcuL3NyYy9ub2Rlcy9zcGFjZXNoaXBfbm9kZScpO1xuXG5yZXF1aXJlKCcuL3NyYy9ub2Rlcy93YWl0X2Zvcl9zdGFydF9ub2RlJyk7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBzeXN0ZW1zKCkge31cblxuICByZXR1cm4gc3lzdGVtcztcblxufSkoKTtcblxucmVxdWlyZSgnLi9zcmMvc3lzdGVtcy9hbmltYXRpb25fc3lzdGVtJyk7XG5cbnJlcXVpcmUoJy4vc3JjL3N5c3RlbXMvYXVkaW9fc3lzdGVtJyk7XG5cbnJlcXVpcmUoJy4vc3JjL3N5c3RlbXMvYnVsbGV0X2FnZV9zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9zcmMvc3lzdGVtcy9jb2xsaXNpb25fc3lzdGVtJyk7XG5cbnJlcXVpcmUoJy4vc3JjL3N5c3RlbXMvZGVhdGhfdGhyb2VzX3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL3NyYy9zeXN0ZW1zL2dhbWVfbWFuYWdlcicpO1xuXG5yZXF1aXJlKCcuL3NyYy9zeXN0ZW1zL2d1bl9jb250cm9sX3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL3NyYy9zeXN0ZW1zL2h1ZF9zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9zcmMvc3lzdGVtcy9tb3Rpb25fY29udHJvbF9zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9zcmMvc3lzdGVtcy9tb3ZlbWVudF9zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9zcmMvc3lzdGVtcy9yZW5kZXJfc3lzdGVtJyk7XG5cbnJlcXVpcmUoJy4vc3JjL3N5c3RlbXMvc3lzdGVtX3ByaW9yaXRpZXMnKTtcblxucmVxdWlyZSgnLi9zcmMvc3lzdGVtcy93YWl0X2Zvcl9zdGFydF9zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9zcmMvZW50aXR5X2NyZWF0b3InKTtcblxucmVxdWlyZSgnLi9zcmMvZ2FtZV9jb25maWcnKTtcblxucmVxdWlyZSgnLi9zcmMvYXN0ZXJvaWRzJyk7XG5cbnJlcXVpcmUoJy4vc3JjL21haW4nKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgQW5pbWF0aW9uU3lzdGVtLCBBdWRpb1N5c3RlbSwgQnVsbGV0QWdlU3lzdGVtLCBDb2xsaXNpb25TeXN0ZW0sIERlYXRoVGhyb2VzU3lzdGVtLCBFbnRpdHlDcmVhdG9yLCBHYW1lQ29uZmlnLCBHYW1lTWFuYWdlciwgR2FtZVN0YXRlLCBHdW5Db250cm9sU3lzdGVtLCBIdWRTeXN0ZW0sIEtleVBvbGwsIE1vdGlvbkNvbnRyb2xTeXN0ZW0sIE1vdmVtZW50U3lzdGVtLCBQaHlzaWNzU3lzdGVtLCBSZW5kZXJTeXN0ZW0sIFN5c3RlbVByaW9yaXRpZXMsIFdhaXRGb3JTdGFydFN5c3RlbSwgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9saWInKTtcblxuQW5pbWF0aW9uU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuQW5pbWF0aW9uU3lzdGVtO1xuXG5BdWRpb1N5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLkF1ZGlvU3lzdGVtO1xuXG5CdWxsZXRBZ2VTeXN0ZW0gPSBhc3Rlcm9pZHMuc3lzdGVtcy5CdWxsZXRBZ2VTeXN0ZW07XG5cbkNvbGxpc2lvblN5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLkNvbGxpc2lvblN5c3RlbTtcblxuRGVhdGhUaHJvZXNTeXN0ZW0gPSBhc3Rlcm9pZHMuc3lzdGVtcy5EZWF0aFRocm9lc1N5c3RlbTtcblxuR2FtZU1hbmFnZXIgPSBhc3Rlcm9pZHMuc3lzdGVtcy5HYW1lTWFuYWdlcjtcblxuR3VuQ29udHJvbFN5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLkd1bkNvbnRyb2xTeXN0ZW07XG5cbkh1ZFN5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLkh1ZFN5c3RlbTtcblxuTW90aW9uQ29udHJvbFN5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLk1vdGlvbkNvbnRyb2xTeXN0ZW07XG5cbk1vdmVtZW50U3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuTW92ZW1lbnRTeXN0ZW07XG5cblJlbmRlclN5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLlJlbmRlclN5c3RlbTtcblxuU3lzdGVtUHJpb3JpdGllcyA9IGFzdGVyb2lkcy5zeXN0ZW1zLlN5c3RlbVByaW9yaXRpZXM7XG5cbldhaXRGb3JTdGFydFN5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLldhaXRGb3JTdGFydFN5c3RlbTtcblxuUGh5c2ljc1N5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLlBoeXNpY3NTeXN0ZW07XG5cbkdhbWVTdGF0ZSA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkdhbWVTdGF0ZTtcblxuRW50aXR5Q3JlYXRvciA9IGFzdGVyb2lkcy5FbnRpdHlDcmVhdG9yO1xuXG5HYW1lQ29uZmlnID0gYXN0ZXJvaWRzLkdhbWVDb25maWc7XG5cbktleVBvbGwgPSBhc3Rlcm9pZHMuaW5wdXQuS2V5UG9sbDtcblxuYXN0ZXJvaWRzLkFzdGVyb2lkcyA9IChmdW5jdGlvbigpIHtcbiAgQXN0ZXJvaWRzLnByb3RvdHlwZS5jb250YWluZXIgPSBudWxsO1xuXG4gIEFzdGVyb2lkcy5wcm90b3R5cGUuZW5naW5lID0gbnVsbDtcblxuICBBc3Rlcm9pZHMucHJvdG90eXBlLnRpY2tQcm92aWRlciA9IG51bGw7XG5cbiAgQXN0ZXJvaWRzLnByb3RvdHlwZS5jcmVhdG9yID0gbnVsbDtcblxuICBBc3Rlcm9pZHMucHJvdG90eXBlLmtleVBvbGwgPSBudWxsO1xuXG4gIEFzdGVyb2lkcy5wcm90b3R5cGUuY29uZmlnID0gbnVsbDtcblxuICBmdW5jdGlvbiBBc3Rlcm9pZHMoY29udGFpbmVyLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5wcmVwYXJlKHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgQXN0ZXJvaWRzLnByb3RvdHlwZS5wcmVwYXJlID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMuZW5naW5lID0gbmV3IGFzaC5jb3JlLkVuZ2luZSgpO1xuICAgIHRoaXMuY3JlYXRvciA9IG5ldyBFbnRpdHlDcmVhdG9yKHRoaXMuZW5naW5lLCB0aGlzLmNvbnRhaW5lciwgdGhpcy53b3JsZCk7XG4gICAgdGhpcy5rZXlQb2xsID0gbmV3IEtleVBvbGwod2luZG93KTtcbiAgICB0aGlzLmNvbmZpZyA9IG5ldyBHYW1lQ29uZmlnKCk7XG4gICAgdGhpcy5jb25maWcuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIHRoaXMuY29uZmlnLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBXYWl0Rm9yU3RhcnRTeXN0ZW0odGhpcy5jcmVhdG9yKSwgU3lzdGVtUHJpb3JpdGllcy5wcmVVcGRhdGUpO1xuICAgIHRoaXMuZW5naW5lLmFkZFN5c3RlbShuZXcgR2FtZU1hbmFnZXIodGhpcy5jcmVhdG9yLCB0aGlzLmNvbmZpZyksIFN5c3RlbVByaW9yaXRpZXMucHJlVXBkYXRlKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IE1vdGlvbkNvbnRyb2xTeXN0ZW0odGhpcy5rZXlQb2xsKSwgU3lzdGVtUHJpb3JpdGllcy51cGRhdGUpO1xuICAgIHRoaXMuZW5naW5lLmFkZFN5c3RlbShuZXcgR3VuQ29udHJvbFN5c3RlbSh0aGlzLmtleVBvbGwsIHRoaXMuY3JlYXRvciksIFN5c3RlbVByaW9yaXRpZXMudXBkYXRlKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IEJ1bGxldEFnZVN5c3RlbSh0aGlzLmNyZWF0b3IpLCBTeXN0ZW1Qcmlvcml0aWVzLnVwZGF0ZSk7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBEZWF0aFRocm9lc1N5c3RlbSh0aGlzLmNyZWF0b3IpLCBTeXN0ZW1Qcmlvcml0aWVzLnVwZGF0ZSk7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBNb3ZlbWVudFN5c3RlbSh0aGlzLmNvbmZpZyksIFN5c3RlbVByaW9yaXRpZXMubW92ZSk7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBDb2xsaXNpb25TeXN0ZW0odGhpcy5jcmVhdG9yKSwgU3lzdGVtUHJpb3JpdGllcy5yZXNvbHZlQ29sbGlzaW9ucyk7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBBbmltYXRpb25TeXN0ZW0oKSwgU3lzdGVtUHJpb3JpdGllcy5hbmltYXRlKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IEh1ZFN5c3RlbSgpLCBTeXN0ZW1Qcmlvcml0aWVzLmFuaW1hdGUpO1xuICAgIHRoaXMuZW5naW5lLmFkZFN5c3RlbShuZXcgUmVuZGVyU3lzdGVtKHRoaXMuY29udGFpbmVyKSwgU3lzdGVtUHJpb3JpdGllcy5yZW5kZXIpO1xuICAgIHRoaXMuZW5naW5lLmFkZFN5c3RlbShuZXcgQXVkaW9TeXN0ZW0oKSwgU3lzdGVtUHJpb3JpdGllcy5yZW5kZXIpO1xuICAgIHRoaXMuY3JlYXRvci5jcmVhdGVXYWl0Rm9yQ2xpY2soKTtcbiAgICB0aGlzLmNyZWF0b3IuY3JlYXRlR2FtZSgpO1xuICB9O1xuXG4gIEFzdGVyb2lkcy5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhdHMsIHgsIHk7XG4gICAgaWYgKG5hdmlnYXRvci5pc0NvY29vbkpTKSB7XG4gICAgICBzdGF0cyA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHggPSBNYXRoLmZsb29yKHRoaXMuY29uZmlnLndpZHRoIC8gMikgLSA0MDtcbiAgICAgIHkgPSAwO1xuICAgICAgc3RhdHMgPSBuZXcgU3RhdHMoKTtcbiAgICAgIHN0YXRzLnNldE1vZGUoMCk7XG4gICAgICBzdGF0cy5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJcIiArIHggKyBcInB4XCI7XG4gICAgICBzdGF0cy5kb21FbGVtZW50LnN0eWxlLnRvcCA9IFwiXCIgKyB5ICsgXCJweFwiO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdGF0cy5kb21FbGVtZW50KTtcbiAgICB9XG4gICAgdGhpcy50aWNrUHJvdmlkZXIgPSBuZXcgYXNoLnRpY2suRnJhbWVUaWNrUHJvdmlkZXIoc3RhdHMpO1xuICAgIHRoaXMudGlja1Byb3ZpZGVyLmFkZCh0aGlzLmVuZ2luZS51cGRhdGUpO1xuICAgIHRoaXMudGlja1Byb3ZpZGVyLnN0YXJ0KCk7XG4gIH07XG5cbiAgcmV0dXJuIEFzdGVyb2lkcztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXN0ZXJvaWRzLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLkFuaW1hdGlvbiA9IChmdW5jdGlvbigpIHtcbiAgQW5pbWF0aW9uLnByb3RvdHlwZS5hbmltYXRpb24gPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEFuaW1hdGlvbihhbmltYXRpb24pIHtcbiAgICB0aGlzLmFuaW1hdGlvbiA9IGFuaW1hdGlvbjtcbiAgfVxuXG4gIHJldHVybiBBbmltYXRpb247XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFuaW1hdGlvbi5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5Bc3Rlcm9pZCA9IChmdW5jdGlvbigpIHtcbiAgQXN0ZXJvaWQucHJvdG90eXBlLmZzbSA9IG51bGw7XG5cbiAgZnVuY3Rpb24gQXN0ZXJvaWQoZnNtKSB7XG4gICAgdGhpcy5mc20gPSBmc207XG4gIH1cblxuICByZXR1cm4gQXN0ZXJvaWQ7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFzdGVyb2lkLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLkF1ZGlvID0gKGZ1bmN0aW9uKCkge1xuICBBdWRpby5wcm90b3R5cGUudG9QbGF5ID0gbnVsbDtcblxuICBmdW5jdGlvbiBBdWRpbygpIHtcbiAgICB0aGlzLnRvUGxheSA9IFtdO1xuICB9XG5cbiAgQXVkaW8ucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbihzb3VuZCkge1xuICAgIHJldHVybiB0aGlzLnRvUGxheS5wdXNoKHNvdW5kKTtcbiAgfTtcblxuICByZXR1cm4gQXVkaW87XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWF1ZGlvLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLkJ1bGxldCA9IChmdW5jdGlvbigpIHtcbiAgQnVsbGV0LnByb3RvdHlwZS5saWZlUmVtYWluaW5nID0gMDtcblxuICBmdW5jdGlvbiBCdWxsZXQobGlmZVJlbWFpbmluZykge1xuICAgIHRoaXMubGlmZVJlbWFpbmluZyA9IGxpZmVSZW1haW5pbmc7XG4gIH1cblxuICByZXR1cm4gQnVsbGV0O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWxsZXQuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuQ29sbGlzaW9uID0gKGZ1bmN0aW9uKCkge1xuICBDb2xsaXNpb24ucHJvdG90eXBlLnJhZGl1cyA9IDA7XG5cbiAgZnVuY3Rpb24gQ29sbGlzaW9uKHJhZGl1cykge1xuICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuICB9XG5cbiAgcmV0dXJuIENvbGxpc2lvbjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29sbGlzaW9uLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLkRlYXRoVGhyb2VzID0gKGZ1bmN0aW9uKCkge1xuICBEZWF0aFRocm9lcy5wcm90b3R5cGUuY291bnRkb3duID0gMDtcblxuICBmdW5jdGlvbiBEZWF0aFRocm9lcyhkdXJhdGlvbikge1xuICAgIHRoaXMuY291bnRkb3duID0gZHVyYXRpb247XG4gIH1cblxuICByZXR1cm4gRGVhdGhUaHJvZXM7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlYXRoX3Rocm9lcy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5EaXNwbGF5ID0gKGZ1bmN0aW9uKCkge1xuICBEaXNwbGF5LnByb3RvdHlwZS5ncmFwaGljID0gMDtcblxuICBmdW5jdGlvbiBEaXNwbGF5KGdyYXBoaWMpIHtcbiAgICB0aGlzLmdyYXBoaWMgPSBncmFwaGljO1xuICB9XG5cbiAgcmV0dXJuIERpc3BsYXk7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRpc3BsYXkuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuR2FtZVN0YXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBHYW1lU3RhdGUoKSB7fVxuXG4gIEdhbWVTdGF0ZS5wcm90b3R5cGUubGl2ZXMgPSAzO1xuXG4gIEdhbWVTdGF0ZS5wcm90b3R5cGUubGV2ZWwgPSAwO1xuXG4gIEdhbWVTdGF0ZS5wcm90b3R5cGUuaGl0cyA9IDA7XG5cbiAgR2FtZVN0YXRlLnByb3RvdHlwZS5wbGF5aW5nID0gZmFsc2U7XG5cbiAgR2FtZVN0YXRlLnByb3RvdHlwZS5zZXRGb3JTdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGl2ZXMgPSAzO1xuICAgIHRoaXMubGV2ZWwgPSAwO1xuICAgIHRoaXMuaGl0cyA9IDA7XG4gICAgdGhpcy5wbGF5aW5nID0gdHJ1ZTtcbiAgfTtcblxuICByZXR1cm4gR2FtZVN0YXRlO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nYW1lX3N0YXRlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFBvaW50LCBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5Qb2ludCA9IGFzdGVyb2lkcy51aS5Qb2ludDtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuR3VuID0gKGZ1bmN0aW9uKCkge1xuICBHdW4ucHJvdG90eXBlLnNob290aW5nID0gZmFsc2U7XG5cbiAgR3VuLnByb3RvdHlwZS5vZmZzZXRGcm9tUGFyZW50ID0gbnVsbDtcblxuICBHdW4ucHJvdG90eXBlLnRpbWVTaW5jZUxhc3RTaG90ID0gMDtcblxuICBHdW4ucHJvdG90eXBlLm9mZnNldEZyb21QYXJlbnQgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEd1bihvZmZzZXRYLCBvZmZzZXRZLCBtaW5pbXVtU2hvdEludGVydmFsLCBidWxsZXRMaWZldGltZSkge1xuICAgIHRoaXMubWluaW11bVNob3RJbnRlcnZhbCA9IG1pbmltdW1TaG90SW50ZXJ2YWw7XG4gICAgdGhpcy5idWxsZXRMaWZldGltZSA9IGJ1bGxldExpZmV0aW1lO1xuICAgIHRoaXMuc2hvb3RpbmcgPSBmYWxzZTtcbiAgICB0aGlzLm9mZnNldEZyb21QYXJlbnQgPSBudWxsO1xuICAgIHRoaXMudGltZVNpbmNlTGFzdFNob3QgPSAwO1xuICAgIHRoaXMub2Zmc2V0RnJvbVBhcmVudCA9IG5ldyBQb2ludChvZmZzZXRYLCBvZmZzZXRZKTtcbiAgfVxuXG4gIHJldHVybiBHdW47XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWd1bi5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5HdW5Db250cm9scyA9IChmdW5jdGlvbigpIHtcbiAgR3VuQ29udHJvbHMucHJvdG90eXBlLnRyaWdnZXIgPSAwO1xuXG4gIGZ1bmN0aW9uIEd1bkNvbnRyb2xzKHRyaWdnZXIpIHtcbiAgICB0aGlzLnRyaWdnZXIgPSB0cmlnZ2VyO1xuICB9XG5cbiAgcmV0dXJuIEd1bkNvbnRyb2xzO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1ndW5fY29udHJvbHMuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuSHVkID0gKGZ1bmN0aW9uKCkge1xuICBIdWQucHJvdG90eXBlLnZpZXcgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEh1ZCh2aWV3KSB7XG4gICAgdGhpcy52aWV3ID0gdmlldztcbiAgfVxuXG4gIHJldHVybiBIdWQ7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWh1ZC5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBQb2ludCwgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuUG9pbnQgPSBhc3Rlcm9pZHMudWkuUG9pbnQ7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLk1vdGlvbiA9IChmdW5jdGlvbigpIHtcbiAgTW90aW9uLnByb3RvdHlwZS52ZWxvY2l0eSA9IG51bGw7XG5cbiAgTW90aW9uLnByb3RvdHlwZS5hbmd1bGFyVmVsb2NpdHkgPSAwO1xuXG4gIE1vdGlvbi5wcm90b3R5cGUuZGFtcGluZyA9IDA7XG5cbiAgZnVuY3Rpb24gTW90aW9uKHZlbG9jaXR5WCwgdmVsb2NpdHlZLCBhbmd1bGFyVmVsb2NpdHksIGRhbXBpbmcpIHtcbiAgICB0aGlzLmFuZ3VsYXJWZWxvY2l0eSA9IGFuZ3VsYXJWZWxvY2l0eTtcbiAgICB0aGlzLmRhbXBpbmcgPSBkYW1waW5nO1xuICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgUG9pbnQodmVsb2NpdHlYLCB2ZWxvY2l0eVkpO1xuICB9XG5cbiAgcmV0dXJuIE1vdGlvbjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bW90aW9uLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLk1vdGlvbkNvbnRyb2xzID0gKGZ1bmN0aW9uKCkge1xuICBNb3Rpb25Db250cm9scy5wcm90b3R5cGUubGVmdCA9IDA7XG5cbiAgTW90aW9uQ29udHJvbHMucHJvdG90eXBlLnJpZ2h0ID0gMDtcblxuICBNb3Rpb25Db250cm9scy5wcm90b3R5cGUuYWNjZWxlcmF0ZSA9IDA7XG5cbiAgTW90aW9uQ29udHJvbHMucHJvdG90eXBlLmFjY2VsZXJhdGlvblJhdGUgPSAwO1xuXG4gIE1vdGlvbkNvbnRyb2xzLnByb3RvdHlwZS5yb3RhdGlvblJhdGUgPSAwO1xuXG4gIGZ1bmN0aW9uIE1vdGlvbkNvbnRyb2xzKGxlZnQsIHJpZ2h0LCBhY2NlbGVyYXRlLCBhY2NlbGVyYXRpb25SYXRlLCByb3RhdGlvblJhdGUpIHtcbiAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICB0aGlzLmFjY2VsZXJhdGUgPSBhY2NlbGVyYXRlO1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uUmF0ZSA9IGFjY2VsZXJhdGlvblJhdGU7XG4gICAgdGhpcy5yb3RhdGlvblJhdGUgPSByb3RhdGlvblJhdGU7XG4gIH1cblxuICByZXR1cm4gTW90aW9uQ29udHJvbHM7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1vdGlvbl9jb250cm9scy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBQb2ludCwgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuUG9pbnQgPSBhc3Rlcm9pZHMudWkuUG9pbnQ7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uID0gKGZ1bmN0aW9uKCkge1xuICBQb3NpdGlvbi5wcm90b3R5cGUucG9zaXRpb24gPSBudWxsO1xuXG4gIFBvc2l0aW9uLnByb3RvdHlwZS5yb3RhdGlvbiA9IDA7XG5cbiAgZnVuY3Rpb24gUG9zaXRpb24oeCwgeSwgcm90YXRpb24pIHtcbiAgICB0aGlzLnJvdGF0aW9uID0gcm90YXRpb247XG4gICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBQb2ludCh4LCB5KTtcbiAgfVxuXG4gIHJldHVybiBQb3NpdGlvbjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cG9zaXRpb24uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuU3BhY2VzaGlwID0gKGZ1bmN0aW9uKCkge1xuICBTcGFjZXNoaXAucHJvdG90eXBlLmZzbSA9IG51bGw7XG5cbiAgZnVuY3Rpb24gU3BhY2VzaGlwKGZzbSkge1xuICAgIHRoaXMuZnNtID0gZnNtO1xuICB9XG5cbiAgcmV0dXJuIFNwYWNlc2hpcDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3BhY2VzaGlwLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLldhaXRGb3JTdGFydCA9IChmdW5jdGlvbigpIHtcbiAgV2FpdEZvclN0YXJ0LnByb3RvdHlwZS53YWl0Rm9yU3RhcnQgPSBudWxsO1xuXG4gIFdhaXRGb3JTdGFydC5wcm90b3R5cGUuc3RhcnRHYW1lID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gV2FpdEZvclN0YXJ0KHdhaXRGb3JTdGFydCkge1xuICAgIHRoaXMud2FpdEZvclN0YXJ0ID0gd2FpdEZvclN0YXJ0O1xuICAgIHRoaXMuc2V0U3RhcnRHYW1lID0gX19iaW5kKHRoaXMuc2V0U3RhcnRHYW1lLCB0aGlzKTtcbiAgICB0aGlzLndhaXRGb3JTdGFydC5jbGljay5hZGQodGhpcy5zZXRTdGFydEdhbWUpO1xuICB9XG5cbiAgV2FpdEZvclN0YXJ0LnByb3RvdHlwZS5zZXRTdGFydEdhbWUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0YXJ0R2FtZSA9IHRydWU7XG4gIH07XG5cbiAgcmV0dXJuIFdhaXRGb3JTdGFydDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2FpdF9mb3Jfc3RhcnQuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgQW5pbWF0aW9uLCBBc3Rlcm9pZCwgQXN0ZXJvaWREZWF0aFZpZXcsIEFzdGVyb2lkVmlldywgQXVkaW8sIEJ1bGxldCwgQnVsbGV0VmlldywgQ29sbGlzaW9uLCBEZWF0aFRocm9lcywgRGlzcGxheSwgRW50aXR5LCBFbnRpdHlTdGF0ZU1hY2hpbmUsIEdhbWVTdGF0ZSwgR3VuLCBHdW5Db250cm9scywgSHVkLCBIdWRWaWV3LCBNb3Rpb24sIE1vdGlvbkNvbnRyb2xzLCBQaHlzaWNzLCBQb3NpdGlvbiwgU3BhY2VzaGlwLCBTcGFjZXNoaXBEZWF0aFZpZXcsIFNwYWNlc2hpcFZpZXcsIFdhaXRGb3JTdGFydCwgV2FpdEZvclN0YXJ0VmlldywgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9saWInKTtcblxuV2FpdEZvclN0YXJ0VmlldyA9IGFzdGVyb2lkcy5ncmFwaGljcy5XYWl0Rm9yU3RhcnRWaWV3O1xuXG5FbnRpdHkgPSBhc2guY29yZS5FbnRpdHk7XG5cbkVudGl0eVN0YXRlTWFjaGluZSA9IGFzaC5mc20uRW50aXR5U3RhdGVNYWNoaW5lO1xuXG5cbi8qXG4gKiBBc3Rlcm9pZCBHYW1lIENvbXBvbmVudHNcbiAqL1xuXG5BbmltYXRpb24gPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5BbmltYXRpb247XG5cbkFzdGVyb2lkID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuQXN0ZXJvaWQ7XG5cbkF1ZGlvID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuQXVkaW87XG5cbkJ1bGxldCA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkJ1bGxldDtcblxuQ29sbGlzaW9uID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuQ29sbGlzaW9uO1xuXG5EZWF0aFRocm9lcyA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkRlYXRoVGhyb2VzO1xuXG5EaXNwbGF5ID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuRGlzcGxheTtcblxuR2FtZVN0YXRlID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuR2FtZVN0YXRlO1xuXG5HdW4gPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5HdW47XG5cbkd1bkNvbnRyb2xzID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuR3VuQ29udHJvbHM7XG5cbkh1ZCA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkh1ZDtcblxuTW90aW9uID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuTW90aW9uO1xuXG5Nb3Rpb25Db250cm9scyA9IGFzdGVyb2lkcy5jb21wb25lbnRzLk1vdGlvbkNvbnRyb2xzO1xuXG5QaHlzaWNzID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuUGh5c2ljcztcblxuUG9zaXRpb24gPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5Qb3NpdGlvbjtcblxuU3BhY2VzaGlwID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuU3BhY2VzaGlwO1xuXG5XYWl0Rm9yU3RhcnQgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5XYWl0Rm9yU3RhcnQ7XG5cblxuLypcbiAqIERyYXdhYmxlIENvbXBvbmVudHNcbiAqL1xuXG5Bc3Rlcm9pZERlYXRoVmlldyA9IGFzdGVyb2lkcy5ncmFwaGljcy5Bc3Rlcm9pZERlYXRoVmlldztcblxuQXN0ZXJvaWRWaWV3ID0gYXN0ZXJvaWRzLmdyYXBoaWNzLkFzdGVyb2lkVmlldztcblxuQnVsbGV0VmlldyA9IGFzdGVyb2lkcy5ncmFwaGljcy5CdWxsZXRWaWV3O1xuXG5IdWRWaWV3ID0gYXN0ZXJvaWRzLmdyYXBoaWNzLkh1ZFZpZXc7XG5cblNwYWNlc2hpcERlYXRoVmlldyA9IGFzdGVyb2lkcy5ncmFwaGljcy5TcGFjZXNoaXBEZWF0aFZpZXc7XG5cblNwYWNlc2hpcFZpZXcgPSBhc3Rlcm9pZHMuZ3JhcGhpY3MuU3BhY2VzaGlwVmlldztcblxuYXN0ZXJvaWRzLkVudGl0eUNyZWF0b3IgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBLRVlfTEVGVCwgS0VZX1JJR0hULCBLRVlfVVAsIEtFWV9aO1xuXG4gIEtFWV9MRUZUID0gMzc7XG5cbiAgS0VZX1VQID0gMzg7XG5cbiAgS0VZX1JJR0hUID0gMzk7XG5cbiAgS0VZX1ogPSA5MDtcblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS5lbmdpbmUgPSBudWxsO1xuXG4gIEVudGl0eUNyZWF0b3IucHJvdG90eXBlLndhaXRFbnRpdHkgPSBudWxsO1xuXG4gIEVudGl0eUNyZWF0b3IucHJvdG90eXBlLmdyYXBoaWMgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEVudGl0eUNyZWF0b3IoZW5naW5lLCBncmFwaGljLCB3b3JsZCkge1xuICAgIHRoaXMuZW5naW5lID0gZW5naW5lO1xuICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWM7XG4gICAgdGhpcy53b3JsZCA9IHdvcmxkO1xuICB9XG5cbiAgRW50aXR5Q3JlYXRvci5wcm90b3R5cGUuZGVzdHJveUVudGl0eSA9IGZ1bmN0aW9uKGVudGl0eSkge1xuICAgIHRoaXMuZW5naW5lLnJlbW92ZUVudGl0eShlbnRpdHkpO1xuICB9O1xuXG5cbiAgLypcbiAgICogR2FtZSBTdGF0ZVxuICAgKi9cblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS5jcmVhdGVHYW1lID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGdhbWVFbnRpdHksIGh1ZDtcbiAgICBodWQgPSBuZXcgSHVkVmlldyh0aGlzLmdyYXBoaWMpO1xuICAgIGdhbWVFbnRpdHkgPSBuZXcgRW50aXR5KCdnYW1lJykuYWRkKG5ldyBHYW1lU3RhdGUoKSkuYWRkKG5ldyBIdWQoaHVkKSkuYWRkKG5ldyBEaXNwbGF5KGh1ZCkpLmFkZChuZXcgUG9zaXRpb24oMCwgMCwgMCwgMCkpO1xuICAgIHRoaXMuZW5naW5lLmFkZEVudGl0eShnYW1lRW50aXR5KTtcbiAgICByZXR1cm4gZ2FtZUVudGl0eTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIFN0YXJ0Li4uXG4gICAqL1xuXG4gIEVudGl0eUNyZWF0b3IucHJvdG90eXBlLmNyZWF0ZVdhaXRGb3JDbGljayA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB3YWl0VmlldztcbiAgICBpZiAoIXRoaXMud2FpdEVudGl0eSkge1xuICAgICAgd2FpdFZpZXcgPSBuZXcgV2FpdEZvclN0YXJ0Vmlldyh0aGlzLmdyYXBoaWMpO1xuICAgICAgdGhpcy53YWl0RW50aXR5ID0gbmV3IEVudGl0eSgnd2FpdCcpLmFkZChuZXcgV2FpdEZvclN0YXJ0KHdhaXRWaWV3KSkuYWRkKG5ldyBEaXNwbGF5KHdhaXRWaWV3KSkuYWRkKG5ldyBQb3NpdGlvbigwLCAwLCAwLCAwKSk7XG4gICAgfVxuICAgIHRoaXMud2FpdEVudGl0eS5nZXQoV2FpdEZvclN0YXJ0KS5zdGFydEdhbWUgPSBmYWxzZTtcbiAgICB0aGlzLmVuZ2luZS5hZGRFbnRpdHkodGhpcy53YWl0RW50aXR5KTtcbiAgICByZXR1cm4gdGhpcy53YWl0RW50aXR5O1xuICB9O1xuXG5cbiAgLypcbiAgICogQ3JlYXRlIGFuIEFzdGVyb2lkIHdpdGggRlNNIEFuaW1hdGlvblxuICAgKi9cblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS5jcmVhdGVBc3Rlcm9pZCA9IGZ1bmN0aW9uKHJhZGl1cywgeCwgeSkge1xuICAgIHZhciBhc3Rlcm9pZCwgZGVhdGhWaWV3LCBmc207XG4gICAgYXN0ZXJvaWQgPSBuZXcgRW50aXR5KCk7XG4gICAgZnNtID0gbmV3IEVudGl0eVN0YXRlTWFjaGluZShhc3Rlcm9pZCk7XG4gICAgZnNtLmNyZWF0ZVN0YXRlKCdhbGl2ZScpLmFkZChNb3Rpb24pLndpdGhJbnN0YW5jZShuZXcgTW90aW9uKChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDQgKiAoNTAgLSByYWRpdXMpLCAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiA0ICogKDUwIC0gcmFkaXVzKSwgTWF0aC5yYW5kb20oKSAqIDIgLSAxLCAwKSkuYWRkKENvbGxpc2lvbikud2l0aEluc3RhbmNlKG5ldyBDb2xsaXNpb24ocmFkaXVzKSkuYWRkKERpc3BsYXkpLndpdGhJbnN0YW5jZShuZXcgRGlzcGxheShuZXcgQXN0ZXJvaWRWaWV3KHRoaXMuZ3JhcGhpYywgcmFkaXVzKSkpO1xuICAgIGRlYXRoVmlldyA9IG5ldyBBc3Rlcm9pZERlYXRoVmlldyh0aGlzLmdyYXBoaWMsIHJhZGl1cyk7XG4gICAgZnNtLmNyZWF0ZVN0YXRlKCdkZXN0cm95ZWQnKS5hZGQoRGVhdGhUaHJvZXMpLndpdGhJbnN0YW5jZShuZXcgRGVhdGhUaHJvZXMoMykpLmFkZChEaXNwbGF5KS53aXRoSW5zdGFuY2UobmV3IERpc3BsYXkoZGVhdGhWaWV3KSkuYWRkKEFuaW1hdGlvbikud2l0aEluc3RhbmNlKG5ldyBBbmltYXRpb24oZGVhdGhWaWV3KSk7XG4gICAgYXN0ZXJvaWQuYWRkKG5ldyBBc3Rlcm9pZChmc20pKS5hZGQobmV3IFBvc2l0aW9uKHgsIHksIDApKS5hZGQobmV3IEF1ZGlvKCkpO1xuICAgIGZzbS5jaGFuZ2VTdGF0ZSgnYWxpdmUnKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRFbnRpdHkoYXN0ZXJvaWQpO1xuICAgIHJldHVybiBhc3Rlcm9pZDtcbiAgfTtcblxuXG4gIC8qXG4gICAqIENyZWF0ZSBQbGF5ZXIgU3BhY2VzaGlwIHdpdGggRlNNIEFuaW1hdGlvblxuICAgKi9cblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS5jcmVhdGVTcGFjZXNoaXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVhdGhWaWV3LCBmc20sIHNwYWNlc2hpcDtcbiAgICBzcGFjZXNoaXAgPSBuZXcgRW50aXR5KCk7XG4gICAgZnNtID0gbmV3IEVudGl0eVN0YXRlTWFjaGluZShzcGFjZXNoaXApO1xuICAgIGZzbS5jcmVhdGVTdGF0ZSgncGxheWluZycpLmFkZChNb3Rpb24pLndpdGhJbnN0YW5jZShuZXcgTW90aW9uKDAsIDAsIDAsIDE1KSkuYWRkKE1vdGlvbkNvbnRyb2xzKS53aXRoSW5zdGFuY2UobmV3IE1vdGlvbkNvbnRyb2xzKEtFWV9MRUZULCBLRVlfUklHSFQsIEtFWV9VUCwgMTAwLCAzKSkuYWRkKEd1bikud2l0aEluc3RhbmNlKG5ldyBHdW4oOCwgMCwgMC4zLCAyKSkuYWRkKEd1bkNvbnRyb2xzKS53aXRoSW5zdGFuY2UobmV3IEd1bkNvbnRyb2xzKEtFWV9aKSkuYWRkKENvbGxpc2lvbikud2l0aEluc3RhbmNlKG5ldyBDb2xsaXNpb24oOSkpLmFkZChEaXNwbGF5KS53aXRoSW5zdGFuY2UobmV3IERpc3BsYXkobmV3IFNwYWNlc2hpcFZpZXcodGhpcy5ncmFwaGljKSkpO1xuICAgIGRlYXRoVmlldyA9IG5ldyBTcGFjZXNoaXBEZWF0aFZpZXcodGhpcy5ncmFwaGljKTtcbiAgICBmc20uY3JlYXRlU3RhdGUoJ2Rlc3Ryb3llZCcpLmFkZChEZWF0aFRocm9lcykud2l0aEluc3RhbmNlKG5ldyBEZWF0aFRocm9lcyg1KSkuYWRkKERpc3BsYXkpLndpdGhJbnN0YW5jZShuZXcgRGlzcGxheShkZWF0aFZpZXcpKS5hZGQoQW5pbWF0aW9uKS53aXRoSW5zdGFuY2UobmV3IEFuaW1hdGlvbihkZWF0aFZpZXcpKTtcbiAgICBzcGFjZXNoaXAuYWRkKG5ldyBTcGFjZXNoaXAoZnNtKSkuYWRkKG5ldyBQb3NpdGlvbigzMDAsIDIyNSwgMCkpLmFkZChuZXcgQXVkaW8oKSk7XG4gICAgZnNtLmNoYW5nZVN0YXRlKCdwbGF5aW5nJyk7XG4gICAgdGhpcy5lbmdpbmUuYWRkRW50aXR5KHNwYWNlc2hpcCk7XG4gICAgcmV0dXJuIHNwYWNlc2hpcDtcbiAgfTtcblxuXG4gIC8qXG4gICAqIENyZWF0ZSBhIEJ1bGxldFxuICAgKi9cblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS5jcmVhdGVVc2VyQnVsbGV0ID0gZnVuY3Rpb24oZ3VuLCBwYXJlbnRQb3NpdGlvbikge1xuICAgIHZhciBidWxsZXQsIGNvcywgc2luLCB4LCB5O1xuICAgIGNvcyA9IE1hdGguY29zKHBhcmVudFBvc2l0aW9uLnJvdGF0aW9uKTtcbiAgICBzaW4gPSBNYXRoLnNpbihwYXJlbnRQb3NpdGlvbi5yb3RhdGlvbik7XG4gICAgeCA9IGNvcyAqIGd1bi5vZmZzZXRGcm9tUGFyZW50LnggLSBzaW4gKiBndW4ub2Zmc2V0RnJvbVBhcmVudC55ICsgcGFyZW50UG9zaXRpb24ucG9zaXRpb24ueDtcbiAgICB5ID0gc2luICogZ3VuLm9mZnNldEZyb21QYXJlbnQueCArIGNvcyAqIGd1bi5vZmZzZXRGcm9tUGFyZW50LnkgKyBwYXJlbnRQb3NpdGlvbi5wb3NpdGlvbi55O1xuICAgIGJ1bGxldCA9IG5ldyBFbnRpdHkoKS5hZGQobmV3IEJ1bGxldChndW4uYnVsbGV0TGlmZXRpbWUpKS5hZGQobmV3IFBvc2l0aW9uKHgsIHksIDApKS5hZGQobmV3IENvbGxpc2lvbigwKSkuYWRkKG5ldyBNb3Rpb24oY29zICogMTUwLCBzaW4gKiAxNTAsIDAsIDApKS5hZGQobmV3IERpc3BsYXkobmV3IEJ1bGxldFZpZXcodGhpcy5ncmFwaGljKSkpO1xuICAgIHRoaXMuZW5naW5lLmFkZEVudGl0eShidWxsZXQpO1xuICAgIHJldHVybiBidWxsZXQ7XG4gIH07XG5cbiAgcmV0dXJuIEVudGl0eUNyZWF0b3I7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVudGl0eV9jcmVhdG9yLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5HYW1lQ29uZmlnID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBHYW1lQ29uZmlnKCkge31cblxuICBHYW1lQ29uZmlnLnByb3RvdHlwZS53aWR0aCA9IDA7XG5cbiAgR2FtZUNvbmZpZy5wcm90b3R5cGUuaGVpZ2h0ID0gMDtcblxuICByZXR1cm4gR2FtZUNvbmZpZztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2FtZV9jb25maWcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgRG90LCBQb2ludCwgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuUG9pbnQgPSBhc3Rlcm9pZHMudWkuUG9pbnQ7XG5cbmFzdGVyb2lkcy5ncmFwaGljcy5Bc3Rlcm9pZERlYXRoVmlldyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIG51bURvdHM7XG5cbiAgbnVtRG90cyA9IDg7XG5cbiAgQXN0ZXJvaWREZWF0aFZpZXcucHJvdG90eXBlLmRvdHMgPSBudWxsO1xuXG4gIEFzdGVyb2lkRGVhdGhWaWV3LnByb3RvdHlwZS54ID0gMDtcblxuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUueSA9IDA7XG5cbiAgQXN0ZXJvaWREZWF0aFZpZXcucHJvdG90eXBlLndpZHRoID0gMDtcblxuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUuaGVpZ2h0ID0gMDtcblxuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUucm90YXRpb24gPSAwO1xuXG4gIEFzdGVyb2lkRGVhdGhWaWV3LnByb3RvdHlwZS5ncmFwaGljID0gbnVsbDtcblxuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUucmFkaXVzID0gMDtcblxuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUucG9pbnRzID0gbnVsbDtcblxuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUuY291bnQgPSAwO1xuXG4gIEFzdGVyb2lkRGVhdGhWaWV3LnByb3RvdHlwZS5maXJzdCA9IHRydWU7XG5cbiAgZnVuY3Rpb24gQXN0ZXJvaWREZWF0aFZpZXcoZ3JhcGhpYywgcmFkaXVzKSB7XG4gICAgdGhpcy5ncmFwaGljID0gZ3JhcGhpYztcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICB0aGlzLmRvdHMgPSBbXTtcbiAgfVxuXG4gIEFzdGVyb2lkRGVhdGhWaWV3LnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24odGltZSkge1xuICAgIHZhciBkb3QsIGksIF9pLCBfaiwgX2xlbiwgX3JlZjtcbiAgICBpZiAodGhpcy5maXJzdCkge1xuICAgICAgdGhpcy5maXJzdCA9IGZhbHNlO1xuICAgICAgZm9yIChpID0gX2kgPSAwOyAwIDw9IG51bURvdHMgPyBfaSA8IG51bURvdHMgOiBfaSA+IG51bURvdHM7IGkgPSAwIDw9IG51bURvdHMgPyArK19pIDogLS1faSkge1xuICAgICAgICBkb3QgPSBuZXcgRG90KHRoaXMuZ3JhcGhpYywgdGhpcy5yYWRpdXMpO1xuICAgICAgICB0aGlzLmRvdHMucHVzaChkb3QpO1xuICAgICAgfVxuICAgIH1cbiAgICBfcmVmID0gdGhpcy5kb3RzO1xuICAgIGZvciAoX2ogPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9qIDwgX2xlbjsgX2orKykge1xuICAgICAgZG90ID0gX3JlZltfal07XG4gICAgICBkb3QueCArPSBkb3QudmVsb2NpdHkueCAqIHRpbWU7XG4gICAgICBkb3QueSArPSBkb3QudmVsb2NpdHkueSAqIHRpbWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRyYXcoKTtcbiAgfTtcblxuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkb3QsIF9pLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICBfcmVmID0gdGhpcy5kb3RzO1xuICAgIF9yZXN1bHRzID0gW107XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBkb3QgPSBfcmVmW19pXTtcbiAgICAgIF9yZXN1bHRzLnB1c2goZG90LmRyYXcodGhpcy54LCB0aGlzLnkpKTtcbiAgICB9XG4gICAgcmV0dXJuIF9yZXN1bHRzO1xuICB9O1xuXG4gIHJldHVybiBBc3Rlcm9pZERlYXRoVmlldztcblxufSkoKTtcblxuRG90ID0gKGZ1bmN0aW9uKCkge1xuICBEb3QucHJvdG90eXBlLnZlbG9jaXR5ID0gbnVsbDtcblxuICBEb3QucHJvdG90eXBlLmdyYXBoaWMgPSBudWxsO1xuXG4gIERvdC5wcm90b3R5cGUueDEgPSAwO1xuXG4gIERvdC5wcm90b3R5cGUueTEgPSAwO1xuXG4gIERvdC5wcm90b3R5cGUueCA9IDA7XG5cbiAgRG90LnByb3RvdHlwZS55ID0gMDtcblxuICBmdW5jdGlvbiBEb3QoZ3JhcGhpYywgbWF4RGlzdGFuY2UpIHtcbiAgICB2YXIgYW5nbGUsIGRpc3RhbmNlLCBzcGVlZDtcbiAgICB0aGlzLmdyYXBoaWMgPSBncmFwaGljO1xuICAgIGFuZ2xlID0gTWF0aC5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xuICAgIGRpc3RhbmNlID0gTWF0aC5yYW5kb20oKSAqIG1heERpc3RhbmNlO1xuICAgIHRoaXMueCA9IE1hdGguY29zKGFuZ2xlKSAqIGRpc3RhbmNlO1xuICAgIHRoaXMueSA9IE1hdGguc2luKGFuZ2xlKSAqIGRpc3RhbmNlO1xuICAgIHNwZWVkID0gTWF0aC5yYW5kb20oKSAqIDEwICsgMTA7XG4gICAgdGhpcy52ZWxvY2l0eSA9IG5ldyBQb2ludChNYXRoLmNvcyhhbmdsZSkgKiBzcGVlZCwgTWF0aC5zaW4oYW5nbGUpICogc3BlZWQpO1xuICB9XG5cbiAgRG90LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIHZhciBncmFwaGljO1xuICAgIGdyYXBoaWMgPSB0aGlzLmdyYXBoaWM7XG4gICAgZ3JhcGhpYy5zYXZlKCk7XG4gICAgZ3JhcGhpYy5iZWdpblBhdGgoKTtcbiAgICBncmFwaGljLnRyYW5zbGF0ZSh4LCB5KTtcbiAgICBncmFwaGljLnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcbiAgICBncmFwaGljLmZpbGxTdHlsZSA9IFwiI0ZGRkZGRlwiO1xuICAgIGdyYXBoaWMuYXJjKHRoaXMueCwgdGhpcy55LCAyLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgIGdyYXBoaWMuZmlsbCgpO1xuICAgIGdyYXBoaWMucmVzdG9yZSgpO1xuICB9O1xuXG4gIHJldHVybiBEb3Q7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFzdGVyb2lkX2RlYXRoX3ZpZXcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLmdyYXBoaWNzLkFzdGVyb2lkVmlldyA9IChmdW5jdGlvbigpIHtcbiAgQXN0ZXJvaWRWaWV3LnByb3RvdHlwZS54ID0gMDtcblxuICBBc3Rlcm9pZFZpZXcucHJvdG90eXBlLnkgPSAwO1xuXG4gIEFzdGVyb2lkVmlldy5wcm90b3R5cGUud2lkdGggPSAwO1xuXG4gIEFzdGVyb2lkVmlldy5wcm90b3R5cGUuaGVpZ2h0ID0gMDtcblxuICBBc3Rlcm9pZFZpZXcucHJvdG90eXBlLnJvdGF0aW9uID0gMDtcblxuICBBc3Rlcm9pZFZpZXcucHJvdG90eXBlLmdyYXBoaWMgPSBudWxsO1xuXG4gIEFzdGVyb2lkVmlldy5wcm90b3R5cGUucmFkaXVzID0gMDtcblxuICBBc3Rlcm9pZFZpZXcucHJvdG90eXBlLnBvaW50cyA9IG51bGw7XG5cbiAgQXN0ZXJvaWRWaWV3LnByb3RvdHlwZS5jb3VudCA9IDA7XG5cbiAgZnVuY3Rpb24gQXN0ZXJvaWRWaWV3KGdyYXBoaWMsIHJhZGl1cykge1xuICAgIHZhciBhbmdsZSwgbGVuZ3RoLCBwb3NYLCBwb3NZO1xuICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWM7XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG4gICAgdGhpcy53aWR0aCA9IHRoaXMucmFkaXVzO1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5yYWRpdXM7XG4gICAgdGhpcy5wb2ludHMgPSBbXTtcbiAgICBhbmdsZSA9IDA7XG4gICAgd2hpbGUgKGFuZ2xlIDwgTWF0aC5QSSAqIDIpIHtcbiAgICAgIGxlbmd0aCA9ICgwLjc1ICsgTWF0aC5yYW5kb20oKSAqIDAuMjUpICogdGhpcy5yYWRpdXM7XG4gICAgICBwb3NYID0gTWF0aC5jb3MoYW5nbGUpICogbGVuZ3RoO1xuICAgICAgcG9zWSA9IE1hdGguc2luKGFuZ2xlKSAqIGxlbmd0aDtcbiAgICAgIHRoaXMucG9pbnRzLnB1c2goe1xuICAgICAgICB4OiBwb3NYLFxuICAgICAgICB5OiBwb3NZXG4gICAgICB9KTtcbiAgICAgIGFuZ2xlICs9IE1hdGgucmFuZG9tKCkgKiAwLjU7XG4gICAgfVxuICB9XG5cbiAgQXN0ZXJvaWRWaWV3LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGdyYXBoaWMsIGk7XG4gICAgZ3JhcGhpYyA9IHRoaXMuZ3JhcGhpYztcbiAgICBncmFwaGljLnNhdmUoKTtcbiAgICBncmFwaGljLmJlZ2luUGF0aCgpO1xuICAgIGdyYXBoaWMudHJhbnNsYXRlKHRoaXMueCwgdGhpcy55KTtcbiAgICBncmFwaGljLnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcbiAgICBncmFwaGljLmZpbGxTdHlsZSA9IFwiI0ZGRkZGRlwiO1xuICAgIGdyYXBoaWMubW92ZVRvKHRoaXMucmFkaXVzLCAwKTtcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHRoaXMucG9pbnRzLmxlbmd0aCkge1xuICAgICAgZ3JhcGhpYy5saW5lVG8odGhpcy5wb2ludHNbaV0ueCwgdGhpcy5wb2ludHNbaV0ueSk7XG4gICAgICArK2k7XG4gICAgfVxuICAgIGdyYXBoaWMubGluZVRvKHRoaXMucmFkaXVzLCAwKTtcbiAgICBncmFwaGljLmZpbGwoKTtcbiAgICBncmFwaGljLnJlc3RvcmUoKTtcbiAgfTtcblxuICByZXR1cm4gQXN0ZXJvaWRWaWV3O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hc3Rlcm9pZF92aWV3LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5ncmFwaGljcy5CdWxsZXRWaWV3ID0gKGZ1bmN0aW9uKCkge1xuICBCdWxsZXRWaWV3LnByb3RvdHlwZS54ID0gMDtcblxuICBCdWxsZXRWaWV3LnByb3RvdHlwZS55ID0gMDtcblxuICBCdWxsZXRWaWV3LnByb3RvdHlwZS53aWR0aCA9IDQ7XG5cbiAgQnVsbGV0Vmlldy5wcm90b3R5cGUuaGVpZ2h0ID0gNDtcblxuICBCdWxsZXRWaWV3LnByb3RvdHlwZS5yb3RhdGlvbiA9IDA7XG5cbiAgQnVsbGV0Vmlldy5wcm90b3R5cGUuZ3JhcGhpYyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gQnVsbGV0VmlldyhncmFwaGljKSB7XG4gICAgdGhpcy5ncmFwaGljID0gZ3JhcGhpYztcbiAgfVxuXG4gIEJ1bGxldFZpZXcucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZ3JhcGhpYztcbiAgICBncmFwaGljID0gdGhpcy5ncmFwaGljO1xuICAgIGdyYXBoaWMuc2F2ZSgpO1xuICAgIGdyYXBoaWMuYmVnaW5QYXRoKCk7XG4gICAgZ3JhcGhpYy5yb3RhdGUodGhpcy5yb3RhdGlvbik7XG4gICAgZ3JhcGhpYy5maWxsU3R5bGUgPSBcIiNGRkZGRkZcIjtcbiAgICBncmFwaGljLmFyYyh0aGlzLngsIHRoaXMueSwgMiwgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICBncmFwaGljLmZpbGwoKTtcbiAgICBncmFwaGljLnJlc3RvcmUoKTtcbiAgfTtcblxuICByZXR1cm4gQnVsbGV0VmlldztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnVsbGV0X3ZpZXcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLmdyYXBoaWNzLkh1ZFZpZXcgPSAoZnVuY3Rpb24oKSB7XG4gIEh1ZFZpZXcucHJvdG90eXBlLnggPSAwO1xuXG4gIEh1ZFZpZXcucHJvdG90eXBlLnkgPSAwO1xuXG4gIEh1ZFZpZXcucHJvdG90eXBlLndpZHRoID0gNDtcblxuICBIdWRWaWV3LnByb3RvdHlwZS5oZWlnaHQgPSA0O1xuXG4gIEh1ZFZpZXcucHJvdG90eXBlLnJvdGF0aW9uID0gMDtcblxuICBIdWRWaWV3LnByb3RvdHlwZS5ncmFwaGljID0gbnVsbDtcblxuICBIdWRWaWV3LnByb3RvdHlwZS5zY29yZSA9IDA7XG5cbiAgSHVkVmlldy5wcm90b3R5cGUubGl2ZXMgPSAzO1xuXG4gIEh1ZFZpZXcucHJvdG90eXBlLmRyYXdTY29yZSA9IG51bGw7XG5cbiAgSHVkVmlldy5wcm90b3R5cGUuZHJhd0xpdmVzID0gbnVsbDtcblxuICBmdW5jdGlvbiBIdWRWaWV3KGdyYXBoaWMpIHtcbiAgICB0aGlzLmdyYXBoaWMgPSBncmFwaGljO1xuICAgIHRoaXMuc2V0U2NvcmUgPSBfX2JpbmQodGhpcy5zZXRTY29yZSwgdGhpcyk7XG4gICAgdGhpcy5zZXRMaXZlcyA9IF9fYmluZCh0aGlzLnNldExpdmVzLCB0aGlzKTtcbiAgICB0aGlzLmRyYXcgPSBfX2JpbmQodGhpcy5kcmF3LCB0aGlzKTtcbiAgICB0aGlzLmRyYXdTY29yZSA9IHRoaXMuY3JlYXRlU2NvcmU7XG4gICAgdGhpcy5kcmF3TGl2ZXMgPSB0aGlzLmNyZWF0ZUxpdmVzO1xuICB9XG5cbiAgSHVkVmlldy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZHJhd1Njb3JlKCk7XG4gICAgdGhpcy5kcmF3TGl2ZXMoKTtcbiAgfTtcblxuICBIdWRWaWV3LnByb3RvdHlwZS5zZXRMaXZlcyA9IGZ1bmN0aW9uKGxpdmVzKSB7XG4gICAgcmV0dXJuIHRoaXMubGl2ZXMgPSBsaXZlcztcbiAgfTtcblxuICBIdWRWaWV3LnByb3RvdHlwZS5zZXRTY29yZSA9IGZ1bmN0aW9uKHNjb3JlKSB7XG4gICAgcmV0dXJuIHRoaXMuc2NvcmUgPSBzY29yZTtcbiAgfTtcblxuICBIdWRWaWV3LnByb3RvdHlwZS5jcmVhdGVMaXZlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsLCBzLCB4LCB5O1xuICAgIHRoaXMuZ3JhcGhpYy5zYXZlKCk7XG4gICAgdGhpcy5ncmFwaGljLmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuZ3JhcGhpYy5mb250ID0gJ2JvbGQgMThweCBIZWx2ZXRpY2EnO1xuICAgIHRoaXMuZ3JhcGhpYy5maWxsU3R5bGUgPSAnI0ZGRkZGRic7XG4gICAgdGhpcy5ncmFwaGljLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIHMgPSBcIkxJVkVTOiBcIiArIHRoaXMubGl2ZXM7XG4gICAgbCA9IHRoaXMuZ3JhcGhpYy5tZWFzdXJlVGV4dChzKTtcbiAgICB4ID0gbC53aWR0aDtcbiAgICB5ID0gMjA7XG4gICAgdGhpcy5ncmFwaGljLmZpbGxUZXh0KHMsIHgsIHkpO1xuICAgIHRoaXMuZ3JhcGhpYy5maWxsKCk7XG4gICAgdGhpcy5ncmFwaGljLnJlc3RvcmUoKTtcbiAgfTtcblxuICBIdWRWaWV3LnByb3RvdHlwZS5jcmVhdGVTY29yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsLCBzLCB4LCB5O1xuICAgIHRoaXMuZ3JhcGhpYy5zYXZlKCk7XG4gICAgdGhpcy5ncmFwaGljLmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuZ3JhcGhpYy5mb250ID0gJ2JvbGQgMThweCBIZWx2ZXRpY2EnO1xuICAgIHRoaXMuZ3JhcGhpYy5maWxsU3R5bGUgPSAnI0ZGRkZGRic7XG4gICAgdGhpcy5ncmFwaGljLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIHMgPSBcIlNDT1JFOiBcIiArIHRoaXMuc2NvcmU7XG4gICAgbCA9IHRoaXMuZ3JhcGhpYy5tZWFzdXJlVGV4dChzKTtcbiAgICB4ID0gKHdpbmRvdy53aW5kb3cuaW5uZXJXaWR0aCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSAtIGwud2lkdGg7XG4gICAgeSA9IDIwO1xuICAgIHRoaXMuZ3JhcGhpYy5maWxsVGV4dChzLCB4LCB5KTtcbiAgICB0aGlzLmdyYXBoaWMuZmlsbCgpO1xuICAgIHRoaXMuZ3JhcGhpYy5yZXN0b3JlKCk7XG4gIH07XG5cbiAgcmV0dXJuIEh1ZFZpZXc7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWh1ZF92aWV3LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFBvaW50LCBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5Qb2ludCA9IGFzdGVyb2lkcy51aS5Qb2ludDtcblxuYXN0ZXJvaWRzLmdyYXBoaWNzLlNwYWNlc2hpcERlYXRoVmlldyA9IChmdW5jdGlvbigpIHtcbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS54ID0gMDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLnkgPSAwO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUud2lkdGggPSAyMDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLmhlaWdodCA9IDIwO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUucm90YXRpb24gPSAwO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUuZ3JhcGhpYyA9IG51bGw7XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS52ZWwxID0gbnVsbDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLnZlbDIgPSBudWxsO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUucm90MSA9IG51bGw7XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS5yb3QyID0gbnVsbDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLngxID0gMDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLnkyID0gMDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLnkxID0gMDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLnkyID0gMDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLmZpcnN0ID0gdHJ1ZTtcblxuICBmdW5jdGlvbiBTcGFjZXNoaXBEZWF0aFZpZXcoZ3JhcGhpYykge1xuICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWM7XG4gIH1cblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLmFuaW1hdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gICAgaWYgKHRoaXMuZmlyc3QpIHtcbiAgICAgIHRoaXMuZmlyc3QgPSBmYWxzZTtcbiAgICAgIHRoaXMudmVsMSA9IG5ldyBQb2ludChNYXRoLnJhbmRvbSgpICogMTAgLSA1LCBNYXRoLnJhbmRvbSgpICogMTAgKyAxMCk7XG4gICAgICB0aGlzLnZlbDIgPSBuZXcgUG9pbnQoTWF0aC5yYW5kb20oKSAqIDEwIC0gNSwgLShNYXRoLnJhbmRvbSgpICogMTAgKyAxMCkpO1xuICAgICAgdGhpcy5yb3QxID0gTWF0aC5yYW5kb20oKSAqIDMwMCAtIDE1MDtcbiAgICAgIHRoaXMucm90MiA9IE1hdGgucmFuZG9tKCkgKiAzMDAgLSAxNTA7XG4gICAgICB0aGlzLngxID0gdGhpcy54MiA9IHRoaXMueDtcbiAgICAgIHRoaXMueTEgPSB0aGlzLnkyID0gdGhpcy55O1xuICAgICAgdGhpcy5yMSA9IHRoaXMucjIgPSB0aGlzLnJvdGF0aW9uO1xuICAgIH1cbiAgICB0aGlzLngxICs9IHRoaXMudmVsMS54ICogdGltZTtcbiAgICB0aGlzLnkxICs9IHRoaXMudmVsMS55ICogdGltZTtcbiAgICB0aGlzLnIxICs9IHRoaXMucm90MSAqIHRpbWU7XG4gICAgdGhpcy54MiArPSB0aGlzLnZlbDIueCAqIHRpbWU7XG4gICAgdGhpcy55MiArPSB0aGlzLnZlbDIueSAqIHRpbWU7XG4gICAgdGhpcy5yMiArPSB0aGlzLnJvdDIgKiB0aW1lO1xuICAgIHJldHVybiB0aGlzLmRyYXcoKTtcbiAgfTtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZ3JhcGhpYztcbiAgICBncmFwaGljID0gdGhpcy5ncmFwaGljO1xuICAgIGdyYXBoaWMuc2F2ZSgpO1xuICAgIGdyYXBoaWMuYmVnaW5QYXRoKCk7XG4gICAgZ3JhcGhpYy50cmFuc2xhdGUodGhpcy54ICsgdGhpcy54MSwgdGhpcy55ICsgdGhpcy55MSk7XG4gICAgZ3JhcGhpYy5yb3RhdGUodGhpcy5yMSk7XG4gICAgZ3JhcGhpYy5maWxsU3R5bGUgPSBcIiNGRkZGRkZcIjtcbiAgICBncmFwaGljLm1vdmVUbygxMCwgMCk7XG4gICAgZ3JhcGhpYy5saW5lVG8oLTcsIDcpO1xuICAgIGdyYXBoaWMubGluZVRvKC00LCAwKTtcbiAgICBncmFwaGljLmxpbmVUbygxMCwgMCk7XG4gICAgZ3JhcGhpYy5maWxsKCk7XG4gICAgZ3JhcGhpYy5yZXN0b3JlKCk7XG4gICAgZ3JhcGhpYy5zYXZlKCk7XG4gICAgZ3JhcGhpYy5iZWdpblBhdGgoKTtcbiAgICBncmFwaGljLnRyYW5zbGF0ZSh0aGlzLnggKyB0aGlzLngyLCB0aGlzLnkgKyB0aGlzLnkyKTtcbiAgICBncmFwaGljLnJvdGF0ZSh0aGlzLnIyKTtcbiAgICBncmFwaGljLmZpbGxTdHlsZSA9IFwiI0ZGRkZGRlwiO1xuICAgIGdyYXBoaWMubW92ZVRvKDEwLCAwKTtcbiAgICBncmFwaGljLmxpbmVUbygtNywgNyk7XG4gICAgZ3JhcGhpYy5saW5lVG8oLTQsIDApO1xuICAgIGdyYXBoaWMubGluZVRvKDEwLCAwKTtcbiAgICBncmFwaGljLmZpbGwoKTtcbiAgICBncmFwaGljLnJlc3RvcmUoKTtcbiAgfTtcblxuICByZXR1cm4gU3BhY2VzaGlwRGVhdGhWaWV3O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcGFjZXNoaXBfZGVhdGhfdmlldy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMuZ3JhcGhpY3MuU3BhY2VzaGlwVmlldyA9IChmdW5jdGlvbigpIHtcbiAgU3BhY2VzaGlwVmlldy5wcm90b3R5cGUueCA9IDA7XG5cbiAgU3BhY2VzaGlwVmlldy5wcm90b3R5cGUueSA9IDA7XG5cbiAgU3BhY2VzaGlwVmlldy5wcm90b3R5cGUud2lkdGggPSAyMDtcblxuICBTcGFjZXNoaXBWaWV3LnByb3RvdHlwZS5oZWlnaHQgPSAyMDtcblxuICBTcGFjZXNoaXBWaWV3LnByb3RvdHlwZS5yb3RhdGlvbiA9IDA7XG5cbiAgU3BhY2VzaGlwVmlldy5wcm90b3R5cGUuZ3JhcGhpYyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gU3BhY2VzaGlwVmlldyhncmFwaGljKSB7XG4gICAgdGhpcy5ncmFwaGljID0gZ3JhcGhpYztcbiAgfVxuXG4gIFNwYWNlc2hpcFZpZXcucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZ3JhcGhpYztcbiAgICBncmFwaGljID0gdGhpcy5ncmFwaGljO1xuICAgIGdyYXBoaWMuc2F2ZSgpO1xuICAgIGdyYXBoaWMuYmVnaW5QYXRoKCk7XG4gICAgZ3JhcGhpYy50cmFuc2xhdGUodGhpcy54LCB0aGlzLnkpO1xuICAgIGdyYXBoaWMucm90YXRlKHRoaXMucm90YXRpb24pO1xuICAgIGdyYXBoaWMuZmlsbFN0eWxlID0gXCIjRkZGRkZGXCI7XG4gICAgZ3JhcGhpYy5tb3ZlVG8oMTAsIDApO1xuICAgIGdyYXBoaWMubGluZVRvKC03LCA3KTtcbiAgICBncmFwaGljLmxpbmVUbygtNCwgMCk7XG4gICAgZ3JhcGhpYy5saW5lVG8oLTcsIC03KTtcbiAgICBncmFwaGljLmxpbmVUbygxMCwgMCk7XG4gICAgZ3JhcGhpYy5maWxsKCk7XG4gICAgZ3JhcGhpYy5yZXN0b3JlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFNwYWNlc2hpcFZpZXc7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNwYWNlc2hpcF92aWV3LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFNpZ25hbDAsIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cblNpZ25hbDAgPSBhc2guc2lnbmFscy5TaWduYWwwO1xuXG5hc3Rlcm9pZHMuZ3JhcGhpY3MuV2FpdEZvclN0YXJ0VmlldyA9IChmdW5jdGlvbigpIHtcbiAgV2FpdEZvclN0YXJ0Vmlldy5wcm90b3R5cGUueCA9IDA7XG5cbiAgV2FpdEZvclN0YXJ0Vmlldy5wcm90b3R5cGUueSA9IDA7XG5cbiAgV2FpdEZvclN0YXJ0Vmlldy5wcm90b3R5cGUud2lkdGggPSA0O1xuXG4gIFdhaXRGb3JTdGFydFZpZXcucHJvdG90eXBlLmhlaWdodCA9IDQ7XG5cbiAgV2FpdEZvclN0YXJ0Vmlldy5wcm90b3R5cGUucm90YXRpb24gPSAwO1xuXG4gIFdhaXRGb3JTdGFydFZpZXcucHJvdG90eXBlLmdyYXBoaWMgPSBudWxsO1xuXG4gIFdhaXRGb3JTdGFydFZpZXcucHJvdG90eXBlLmdhbWVPdmVyID0gbnVsbDtcblxuICBXYWl0Rm9yU3RhcnRWaWV3LnByb3RvdHlwZS5jbGlja1RvU3RhcnQgPSBudWxsO1xuXG4gIFdhaXRGb3JTdGFydFZpZXcucHJvdG90eXBlLmluc3RydWN0aW9ucyA9IG51bGw7XG5cbiAgV2FpdEZvclN0YXJ0Vmlldy5wcm90b3R5cGUuY2xpY2sgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIFdhaXRGb3JTdGFydFZpZXcoZ3JhcGhpYykge1xuICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWM7XG4gICAgdGhpcy5jbGljayA9IG5ldyBTaWduYWwwKCk7XG4gICAgdGhpcy5nYW1lT3ZlciA9IHRoaXMuY3JlYXRlR2FtZU92ZXI7XG4gICAgdGhpcy5pbnN0cnVjdGlvbnMgPSB0aGlzLmNyZWF0ZUluc3RydWN0aW9ucztcbiAgICB0aGlzLmNsaWNrVG9TdGFydCA9IHRoaXMuY3JlYXRlQ2xpY2tUb1N0YXJ0O1xuICAgIHRoaXMuZ3JhcGhpYy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZXR1cm4gX3RoaXMuY2xpY2suZGlzcGF0Y2goKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9XG5cbiAgV2FpdEZvclN0YXJ0Vmlldy5wcm90b3R5cGUuY3JlYXRlR2FtZU92ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbCwgcywgeCwgeTtcbiAgICB0aGlzLmdyYXBoaWMuc2F2ZSgpO1xuICAgIHRoaXMuZ3JhcGhpYy5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmdyYXBoaWMuZm9udCA9ICdib2xkIDMycHggSGVsdmV0aWNhJztcbiAgICB0aGlzLmdyYXBoaWMuZmlsbFN0eWxlID0gJyNGRkZGRkYnO1xuICAgIHMgPSAnQVNURVJPSURTJztcbiAgICBsID0gdGhpcy5ncmFwaGljLm1lYXN1cmVUZXh0KHMpO1xuICAgIHggPSBNYXRoLmZsb29yKCgod2luZG93LmlubmVyV2lkdGggKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbykgLSBsLndpZHRoKSAvIDIpO1xuICAgIHkgPSAxNzU7XG4gICAgdGhpcy5ncmFwaGljLmZpbGxUZXh0KHMsIHgsIHkpO1xuICAgIHRoaXMuZ3JhcGhpYy5maWxsKCk7XG4gICAgdGhpcy5ncmFwaGljLnJlc3RvcmUoKTtcbiAgfTtcblxuICBXYWl0Rm9yU3RhcnRWaWV3LnByb3RvdHlwZS5jcmVhdGVDbGlja1RvU3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbCwgcywgeCwgeTtcbiAgICB0aGlzLmdyYXBoaWMuc2F2ZSgpO1xuICAgIHRoaXMuZ3JhcGhpYy5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmdyYXBoaWMuZm9udCA9ICdib2xkIDE4cHggSGVsdmV0aWNhJztcbiAgICB0aGlzLmdyYXBoaWMuZmlsbFN0eWxlID0gJyNGRkZGRkYnO1xuICAgIHMgPSAnQ0xJQ0sgVE8gU1RBUlQnO1xuICAgIGwgPSB0aGlzLmdyYXBoaWMubWVhc3VyZVRleHQocyk7XG4gICAgeCA9IE1hdGguZmxvb3IoKCh3aW5kb3cuaW5uZXJXaWR0aCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSAtIGwud2lkdGgpIC8gMik7XG4gICAgeSA9IDIyNTtcbiAgICB0aGlzLmdyYXBoaWMuZmlsbFRleHQocywgeCwgeSk7XG4gICAgdGhpcy5ncmFwaGljLmZpbGwoKTtcbiAgICB0aGlzLmdyYXBoaWMucmVzdG9yZSgpO1xuICB9O1xuXG4gIFdhaXRGb3JTdGFydFZpZXcucHJvdG90eXBlLmNyZWF0ZUluc3RydWN0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsLCBzLCB4LCB5O1xuICAgIHRoaXMuZ3JhcGhpYy5zYXZlKCk7XG4gICAgdGhpcy5ncmFwaGljLmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuZ3JhcGhpYy5mb250ID0gJ2JvbGQgMTRweCBIZWx2ZXRpY2EnO1xuICAgIHRoaXMuZ3JhcGhpYy5maWxsU3R5bGUgPSAnI0ZGRkZGRic7XG4gICAgcyA9ICdaIHRvIEZpcmUgIH4gIEFycm93IEtleXMgdG8gTW92ZSc7XG4gICAgbCA9IHRoaXMuZ3JhcGhpYy5tZWFzdXJlVGV4dChzKTtcbiAgICB4ID0gMTA7XG4gICAgeSA9IHdpbmRvdy5pbm5lckhlaWdodCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIC0gMjA7XG4gICAgdGhpcy5ncmFwaGljLmZpbGxUZXh0KHMsIHgsIHkpO1xuICAgIHRoaXMuZ3JhcGhpYy5maWxsKCk7XG4gICAgdGhpcy5ncmFwaGljLnJlc3RvcmUoKTtcbiAgfTtcblxuICBXYWl0Rm9yU3RhcnRWaWV3LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5nYW1lT3ZlcigpO1xuICAgIHRoaXMuY2xpY2tUb1N0YXJ0KCk7XG4gICAgdGhpcy5pbnN0cnVjdGlvbnMoKTtcbiAgfTtcblxuICByZXR1cm4gV2FpdEZvclN0YXJ0VmlldztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2FpdF9mb3Jfc3RhcnRfdmlldy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMuaW5wdXQuS2V5UG9sbCA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGRpc3BsYXlPYmosIHN0YXRlcztcblxuICBzdGF0ZXMgPSBudWxsO1xuXG4gIGRpc3BsYXlPYmogPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEtleVBvbGwoZGlzcGxheU9iaikge1xuICAgIHRoaXMuZGlzcGxheU9iaiA9IGRpc3BsYXlPYmo7XG4gICAgdGhpcy5pc1VwID0gX19iaW5kKHRoaXMuaXNVcCwgdGhpcyk7XG4gICAgdGhpcy5pc0Rvd24gPSBfX2JpbmQodGhpcy5pc0Rvd24sIHRoaXMpO1xuICAgIHRoaXMua2V5VXBMaXN0ZW5lciA9IF9fYmluZCh0aGlzLmtleVVwTGlzdGVuZXIsIHRoaXMpO1xuICAgIHRoaXMua2V5RG93bkxpc3RlbmVyID0gX19iaW5kKHRoaXMua2V5RG93bkxpc3RlbmVyLCB0aGlzKTtcbiAgICB0aGlzLnN0YXRlcyA9IHt9O1xuICAgIHRoaXMuZGlzcGxheU9iai5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmtleURvd25MaXN0ZW5lcik7XG4gICAgdGhpcy5kaXNwbGF5T2JqLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLmtleVVwTGlzdGVuZXIpO1xuICB9XG5cbiAgS2V5UG9sbC5wcm90b3R5cGUua2V5RG93bkxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLnN0YXRlc1tldmVudC5rZXlDb2RlXSA9IHRydWU7XG4gIH07XG5cbiAgS2V5UG9sbC5wcm90b3R5cGUua2V5VXBMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKHRoaXMuc3RhdGVzW2V2ZW50LmtleUNvZGVdKSB7XG4gICAgICB0aGlzLnN0YXRlc1tldmVudC5rZXlDb2RlXSA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBLZXlQb2xsLnByb3RvdHlwZS5pc0Rvd24gPSBmdW5jdGlvbihrZXlDb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGVzW2tleUNvZGVdO1xuICB9O1xuXG4gIEtleVBvbGwucHJvdG90eXBlLmlzVXAgPSBmdW5jdGlvbihrZXlDb2RlKSB7XG4gICAgcmV0dXJuICF0aGlzLnN0YXRlc1trZXlDb2RlXTtcbiAgfTtcblxuICByZXR1cm4gS2V5UG9sbDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9a2V5X3BvbGwuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLk1haW4gPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIE1haW4oKSB7XG4gICAgdmFyIGNhbnZhcztcbiAgICBjYW52YXMgPSB0aGlzLmNhbnZhcygpO1xuICAgIGFzdGVyb2lkcyA9IG5ldyBhc3Rlcm9pZHMuQXN0ZXJvaWRzKGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgIGFzdGVyb2lkcy5zdGFydCgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIE1haW4ucHJvdG90eXBlLmNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYW52YXM7XG4gICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYXZpZ2F0b3IuaXNDb2Nvb25KUyA/ICdzY3JlZW5jYW52YXMnIDogJ2NhbnZhcycpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgIGNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzAwMDAwMCc7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgIHJldHVybiBjYW52YXM7XG4gIH07XG5cbiAgcmV0dXJuIE1haW47XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1haW4uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMubm9kZXMuQW5pbWF0aW9uTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKEFuaW1hdGlvbk5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gQW5pbWF0aW9uTm9kZSgpIHtcbiAgICByZXR1cm4gQW5pbWF0aW9uTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEFuaW1hdGlvbk5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBhbmltYXRpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLkFuaW1hdGlvblxuICB9O1xuXG4gIEFuaW1hdGlvbk5vZGUucHJvdG90eXBlLmFuaW1hdGlvbiA9IG51bGw7XG5cbiAgcmV0dXJuIEFuaW1hdGlvbk5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbmltYXRpb25fbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5Bc3Rlcm9pZENvbGxpc2lvbk5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhBc3Rlcm9pZENvbGxpc2lvbk5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gQXN0ZXJvaWRDb2xsaXNpb25Ob2RlKCkge1xuICAgIHJldHVybiBBc3Rlcm9pZENvbGxpc2lvbk5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBc3Rlcm9pZENvbGxpc2lvbk5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBhc3Rlcm9pZDogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQXN0ZXJvaWQsXG4gICAgcG9zaXRpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uLFxuICAgIGNvbGxpc2lvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQ29sbGlzaW9uLFxuICAgIGF1ZGlvOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5BdWRpb1xuICB9O1xuXG4gIEFzdGVyb2lkQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUuYXN0ZXJvaWQgPSBudWxsO1xuXG4gIEFzdGVyb2lkQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUucG9zaXRpb24gPSBudWxsO1xuXG4gIEFzdGVyb2lkQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUuY29sbGlzaW9uID0gbnVsbDtcblxuICBBc3Rlcm9pZENvbGxpc2lvbk5vZGUucHJvdG90eXBlLmF1ZGlvID0gbnVsbDtcblxuICByZXR1cm4gQXN0ZXJvaWRDb2xsaXNpb25Ob2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXN0ZXJvaWRfY29sbGlzaW9uX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMubm9kZXMuQXVkaW9Ob2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoQXVkaW9Ob2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIEF1ZGlvTm9kZSgpIHtcbiAgICByZXR1cm4gQXVkaW9Ob2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQXVkaW9Ob2RlLmNvbXBvbmVudHMgPSB7XG4gICAgYXVkaW86IGFzdGVyb2lkcy5jb21wb25lbnRzLkF1ZGlvXG4gIH07XG5cbiAgQXVkaW9Ob2RlLnByb3RvdHlwZS5hdWRpbyA9IG51bGw7XG5cbiAgcmV0dXJuIEF1ZGlvTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWF1ZGlvX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMubm9kZXMuQnVsbGV0QWdlTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKEJ1bGxldEFnZU5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gQnVsbGV0QWdlTm9kZSgpIHtcbiAgICByZXR1cm4gQnVsbGV0QWdlTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEJ1bGxldEFnZU5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBidWxsZXQ6IGFzdGVyb2lkcy5jb21wb25lbnRzLkJ1bGxldFxuICB9O1xuXG4gIEJ1bGxldEFnZU5vZGUucHJvdG90eXBlLmJ1bGxldCA9IG51bGw7XG5cbiAgcmV0dXJuIEJ1bGxldEFnZU5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWxsZXRfYWdlX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMubm9kZXMuQnVsbGV0Q29sbGlzaW9uTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKEJ1bGxldENvbGxpc2lvbk5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gQnVsbGV0Q29sbGlzaW9uTm9kZSgpIHtcbiAgICByZXR1cm4gQnVsbGV0Q29sbGlzaW9uTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEJ1bGxldENvbGxpc2lvbk5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBidWxsZXQ6IGFzdGVyb2lkcy5jb21wb25lbnRzLkJ1bGxldCxcbiAgICBwb3NpdGlvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb24sXG4gICAgY29sbGlzaW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Db2xsaXNpb25cbiAgfTtcblxuICBCdWxsZXRDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5idWxsZXQgPSBudWxsO1xuXG4gIEJ1bGxldENvbGxpc2lvbk5vZGUucHJvdG90eXBlLnBvc2l0aW9uID0gbnVsbDtcblxuICBCdWxsZXRDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5jb2xsaXNpb24gPSBudWxsO1xuXG4gIHJldHVybiBCdWxsZXRDb2xsaXNpb25Ob2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnVsbGV0X2NvbGxpc2lvbl9ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLm5vZGVzLkRlYXRoVGhyb2VzTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKERlYXRoVGhyb2VzTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBEZWF0aFRocm9lc05vZGUoKSB7XG4gICAgcmV0dXJuIERlYXRoVGhyb2VzTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIERlYXRoVGhyb2VzTm9kZS5jb21wb25lbnRzID0ge1xuICAgIGRlYXRoOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5EZWF0aFRocm9lc1xuICB9O1xuXG4gIERlYXRoVGhyb2VzTm9kZS5wcm90b3R5cGUuZGVhdGggPSBudWxsO1xuXG4gIHJldHVybiBEZWF0aFRocm9lc05vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kZWF0aF90aHJvZXNfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5HYW1lTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKEdhbWVOb2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIEdhbWVOb2RlKCkge1xuICAgIHJldHVybiBHYW1lTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEdhbWVOb2RlLmNvbXBvbmVudHMgPSB7XG4gICAgc3RhdGU6IGFzdGVyb2lkcy5jb21wb25lbnRzLkdhbWVTdGF0ZVxuICB9O1xuXG4gIEdhbWVOb2RlLnByb3RvdHlwZS5zdGF0ZSA9IG51bGw7XG5cbiAgcmV0dXJuIEdhbWVOb2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2FtZV9ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLm5vZGVzLkd1bkNvbnRyb2xOb2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoR3VuQ29udHJvbE5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gR3VuQ29udHJvbE5vZGUoKSB7XG4gICAgcmV0dXJuIEd1bkNvbnRyb2xOb2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgR3VuQ29udHJvbE5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBhdWRpbzogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQXVkaW8sXG4gICAgY29udHJvbDogYXN0ZXJvaWRzLmNvbXBvbmVudHMuR3VuQ29udHJvbHMsXG4gICAgZ3VuOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5HdW4sXG4gICAgcG9zaXRpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uXG4gIH07XG5cbiAgR3VuQ29udHJvbE5vZGUucHJvdG90eXBlLmNvbnRyb2wgPSBudWxsO1xuXG4gIEd1bkNvbnRyb2xOb2RlLnByb3RvdHlwZS5ndW4gPSBudWxsO1xuXG4gIEd1bkNvbnRyb2xOb2RlLnByb3RvdHlwZS5wb3NpdGlvbiA9IG51bGw7XG5cbiAgR3VuQ29udHJvbE5vZGUucHJvdG90eXBlLmF1ZGlvID0gbnVsbDtcblxuICByZXR1cm4gR3VuQ29udHJvbE5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1ndW5fY29udHJvbF9ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLm5vZGVzLkh1ZE5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhIdWROb2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIEh1ZE5vZGUoKSB7XG4gICAgcmV0dXJuIEh1ZE5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBIdWROb2RlLmNvbXBvbmVudHMgPSB7XG4gICAgc3RhdGU6IGFzdGVyb2lkcy5jb21wb25lbnRzLkdhbWVTdGF0ZSxcbiAgICBodWQ6IGFzdGVyb2lkcy5jb21wb25lbnRzLkh1ZFxuICB9O1xuXG4gIEh1ZE5vZGUucHJvdG90eXBlLnN0YXRlID0gbnVsbDtcblxuICBIdWROb2RlLnByb3RvdHlwZS5odWQgPSBudWxsO1xuXG4gIHJldHVybiBIdWROb2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aHVkX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMubm9kZXMuTW90aW9uQ29udHJvbE5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhNb3Rpb25Db250cm9sTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBNb3Rpb25Db250cm9sTm9kZSgpIHtcbiAgICByZXR1cm4gTW90aW9uQ29udHJvbE5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBNb3Rpb25Db250cm9sTm9kZS5jb21wb25lbnRzID0ge1xuICAgIGNvbnRyb2w6IGFzdGVyb2lkcy5jb21wb25lbnRzLk1vdGlvbkNvbnRyb2xzLFxuICAgIHBvc2l0aW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Qb3NpdGlvbixcbiAgICBtb3Rpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLk1vdGlvblxuICB9O1xuXG4gIE1vdGlvbkNvbnRyb2xOb2RlLnByb3RvdHlwZS5jb250cm9sID0gbnVsbDtcblxuICBNb3Rpb25Db250cm9sTm9kZS5wcm90b3R5cGUucG9zaXRpb24gPSBudWxsO1xuXG4gIE1vdGlvbkNvbnRyb2xOb2RlLnByb3RvdHlwZS5tb3Rpb24gPSBudWxsO1xuXG4gIHJldHVybiBNb3Rpb25Db250cm9sTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1vdGlvbl9jb250cm9sX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMubm9kZXMuTW92ZW1lbnROb2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoTW92ZW1lbnROb2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIE1vdmVtZW50Tm9kZSgpIHtcbiAgICByZXR1cm4gTW92ZW1lbnROb2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgTW92ZW1lbnROb2RlLmNvbXBvbmVudHMgPSB7XG4gICAgcG9zaXRpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uLFxuICAgIG1vdGlvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuTW90aW9uXG4gIH07XG5cbiAgTW92ZW1lbnROb2RlLnByb3RvdHlwZS5wb3NpdGlvbiA9IG51bGw7XG5cbiAgTW92ZW1lbnROb2RlLnByb3RvdHlwZS5tb3Rpb24gPSBudWxsO1xuXG4gIHJldHVybiBNb3ZlbWVudE5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tb3ZlbWVudF9ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLm5vZGVzLlJlbmRlck5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhSZW5kZXJOb2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIFJlbmRlck5vZGUoKSB7XG4gICAgcmV0dXJuIFJlbmRlck5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBSZW5kZXJOb2RlLmNvbXBvbmVudHMgPSB7XG4gICAgcG9zaXRpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uLFxuICAgIGRpc3BsYXk6IGFzdGVyb2lkcy5jb21wb25lbnRzLkRpc3BsYXlcbiAgfTtcblxuICBSZW5kZXJOb2RlLnByb3RvdHlwZS5wb3NpdGlvbiA9IG51bGw7XG5cbiAgUmVuZGVyTm9kZS5wcm90b3R5cGUuZGlzcGxheSA9IG51bGw7XG5cbiAgcmV0dXJuIFJlbmRlck5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZW5kZXJfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5TcGFjZXNoaXBDb2xsaXNpb25Ob2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoU3BhY2VzaGlwQ29sbGlzaW9uTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBTcGFjZXNoaXBDb2xsaXNpb25Ob2RlKCkge1xuICAgIHJldHVybiBTcGFjZXNoaXBDb2xsaXNpb25Ob2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgU3BhY2VzaGlwQ29sbGlzaW9uTm9kZS5jb21wb25lbnRzID0ge1xuICAgIHNwYWNlc2hpcDogYXN0ZXJvaWRzLmNvbXBvbmVudHMuU3BhY2VzaGlwLFxuICAgIHBvc2l0aW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Qb3NpdGlvbixcbiAgICBjb2xsaXNpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLkNvbGxpc2lvbixcbiAgICBhdWRpbzogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQXVkaW9cbiAgfTtcblxuICBTcGFjZXNoaXBDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5zcGFjZXNoaXAgPSAwO1xuXG4gIFNwYWNlc2hpcENvbGxpc2lvbk5vZGUucHJvdG90eXBlLnBvc2l0aW9uID0gMDtcblxuICBTcGFjZXNoaXBDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5jb2xsaXNpb24gPSBudWxsO1xuXG4gIFNwYWNlc2hpcENvbGxpc2lvbk5vZGUucHJvdG90eXBlLmF1ZGlvID0gbnVsbDtcblxuICByZXR1cm4gU3BhY2VzaGlwQ29sbGlzaW9uTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNwYWNlc2hpcF9jb2xsaXNpb25fbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5TcGFjZXNoaXBOb2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoU3BhY2VzaGlwTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBTcGFjZXNoaXBOb2RlKCkge1xuICAgIHJldHVybiBTcGFjZXNoaXBOb2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgU3BhY2VzaGlwTm9kZS5jb21wb25lbnRzID0ge1xuICAgIHNwYWNlc2hpcDogYXN0ZXJvaWRzLmNvbXBvbmVudHMuU3BhY2VzaGlwLFxuICAgIHBvc2l0aW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Qb3NpdGlvblxuICB9O1xuXG4gIFNwYWNlc2hpcE5vZGUucHJvdG90eXBlLnNwYWNlc2hpcCA9IDA7XG5cbiAgU3BhY2VzaGlwTm9kZS5wcm90b3R5cGUucG9zaXRpb24gPSAwO1xuXG4gIHJldHVybiBTcGFjZXNoaXBOb2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3BhY2VzaGlwX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMubm9kZXMuV2FpdEZvclN0YXJ0Tm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKFdhaXRGb3JTdGFydE5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gV2FpdEZvclN0YXJ0Tm9kZSgpIHtcbiAgICByZXR1cm4gV2FpdEZvclN0YXJ0Tm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFdhaXRGb3JTdGFydE5vZGUuY29tcG9uZW50cyA9IHtcbiAgICB3YWl0OiBhc3Rlcm9pZHMuY29tcG9uZW50cy5XYWl0Rm9yU3RhcnRcbiAgfTtcblxuICBXYWl0Rm9yU3RhcnROb2RlLnByb3RvdHlwZS53YWl0ID0gbnVsbDtcblxuICByZXR1cm4gV2FpdEZvclN0YXJ0Tm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdhaXRfZm9yX3N0YXJ0X25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgQW5pbWF0aW9uTm9kZSwgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5BbmltYXRpb25Ob2RlID0gYXN0ZXJvaWRzLm5vZGVzLkFuaW1hdGlvbk5vZGU7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLkFuaW1hdGlvblN5c3RlbSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKEFuaW1hdGlvblN5c3RlbSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBBbmltYXRpb25TeXN0ZW0oKSB7XG4gICAgdGhpcy51cGRhdGVOb2RlID0gX19iaW5kKHRoaXMudXBkYXRlTm9kZSwgdGhpcyk7XG4gICAgQW5pbWF0aW9uU3lzdGVtLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIEFuaW1hdGlvbk5vZGUsIHRoaXMudXBkYXRlTm9kZSk7XG4gIH1cblxuICBBbmltYXRpb25TeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZU5vZGUgPSBmdW5jdGlvbihub2RlLCB0aW1lKSB7XG4gICAgbm9kZS5hbmltYXRpb24uYW5pbWF0aW9uLmFuaW1hdGUodGltZSk7XG4gIH07XG5cbiAgcmV0dXJuIEFuaW1hdGlvblN5c3RlbTtcblxufSkoYXNoLnRvb2xzLkxpc3RJdGVyYXRpbmdTeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbmltYXRpb25fc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEF1ZGlvTm9kZSwgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5BdWRpb05vZGUgPSBhc3Rlcm9pZHMubm9kZXMuQXVkaW9Ob2RlO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5BdWRpb1N5c3RlbSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKEF1ZGlvU3lzdGVtLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIEF1ZGlvU3lzdGVtKCkge1xuICAgIHRoaXMudXBkYXRlTm9kZSA9IF9fYmluZCh0aGlzLnVwZGF0ZU5vZGUsIHRoaXMpO1xuICAgIEF1ZGlvU3lzdGVtLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIEF1ZGlvTm9kZSwgdGhpcy51cGRhdGVOb2RlKTtcbiAgfVxuXG4gIEF1ZGlvU3lzdGVtLnByb3RvdHlwZS51cGRhdGVOb2RlID0gZnVuY3Rpb24obm9kZSwgdGltZSkge1xuICAgIHZhciBlYWNoLCBzb3VuZCwgdHlwZSwgX3JlZjtcbiAgICBfcmVmID0gbm9kZS5hdWRpby50b1BsYXk7XG4gICAgZm9yIChlYWNoIGluIF9yZWYpIHtcbiAgICAgIHR5cGUgPSBfcmVmW2VhY2hdO1xuICAgICAgc291bmQgPSBuZXcgdHlwZSgpO1xuICAgICAgc291bmQucGxheSgwLCAxKTtcbiAgICB9XG4gICAgbm9kZS5hdWRpby50b1BsYXkubGVuZ3RoID0gMDtcbiAgfTtcblxuICByZXR1cm4gQXVkaW9TeXN0ZW07XG5cbn0pKGFzaC50b29scy5MaXN0SXRlcmF0aW5nU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXVkaW9fc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEJ1bGxldEFnZU5vZGUsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuQnVsbGV0QWdlTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5CdWxsZXRBZ2VOb2RlO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5CdWxsZXRBZ2VTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhCdWxsZXRBZ2VTeXN0ZW0sIF9zdXBlcik7XG5cbiAgQnVsbGV0QWdlU3lzdGVtLnByb3RvdHlwZS5jcmVhdG9yID0gbnVsbDtcblxuICBmdW5jdGlvbiBCdWxsZXRBZ2VTeXN0ZW0oY3JlYXRvcikge1xuICAgIHRoaXMuY3JlYXRvciA9IGNyZWF0b3I7XG4gICAgdGhpcy51cGRhdGVOb2RlID0gX19iaW5kKHRoaXMudXBkYXRlTm9kZSwgdGhpcyk7XG4gICAgQnVsbGV0QWdlU3lzdGVtLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIEJ1bGxldEFnZU5vZGUsIHRoaXMudXBkYXRlTm9kZSk7XG4gIH1cblxuICBCdWxsZXRBZ2VTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZU5vZGUgPSBmdW5jdGlvbihub2RlLCB0aW1lKSB7XG4gICAgdmFyIGJ1bGxldDtcbiAgICBidWxsZXQgPSBub2RlLmJ1bGxldDtcbiAgICBidWxsZXQubGlmZVJlbWFpbmluZyAtPSB0aW1lO1xuICAgIGlmIChidWxsZXQubGlmZVJlbWFpbmluZyA8PSAwKSB7XG4gICAgICB0aGlzLmNyZWF0b3IuZGVzdHJveUVudGl0eShub2RlLmVudGl0eSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBCdWxsZXRBZ2VTeXN0ZW07XG5cbn0pKGFzaC50b29scy5MaXN0SXRlcmF0aW5nU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnVsbGV0X2FnZV9zeXN0ZW0uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgQW5pbWF0aW9uLCBBc3Rlcm9pZCwgQXN0ZXJvaWRDb2xsaXNpb25Ob2RlLCBBc3Rlcm9pZERlYXRoVmlldywgQXN0ZXJvaWRWaWV3LCBBdWRpbywgQnVsbGV0LCBCdWxsZXRDb2xsaXNpb25Ob2RlLCBCdWxsZXRWaWV3LCBDb2xsaXNpb24sIERlYXRoVGhyb2VzLCBEaXNwbGF5LCBHYW1lTm9kZSwgR2FtZVN0YXRlLCBHdW4sIEd1bkNvbnRyb2xzLCBIdWQsIEh1ZFZpZXcsIE1vdGlvbiwgTW90aW9uQ29udHJvbHMsIFBoeXNpY3MsIFBvc2l0aW9uLCBTcGFjZXNoaXAsIFNwYWNlc2hpcENvbGxpc2lvbk5vZGUsIFNwYWNlc2hpcERlYXRoVmlldywgU3BhY2VzaGlwVmlldywgV2FpdEZvclN0YXJ0LCBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cblNwYWNlc2hpcENvbGxpc2lvbk5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuU3BhY2VzaGlwQ29sbGlzaW9uTm9kZTtcblxuQXN0ZXJvaWRDb2xsaXNpb25Ob2RlID0gYXN0ZXJvaWRzLm5vZGVzLkFzdGVyb2lkQ29sbGlzaW9uTm9kZTtcblxuQnVsbGV0Q29sbGlzaW9uTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5CdWxsZXRDb2xsaXNpb25Ob2RlO1xuXG5HYW1lTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5HYW1lTm9kZTtcblxuQW5pbWF0aW9uID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuQW5pbWF0aW9uO1xuXG5Bc3Rlcm9pZCA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkFzdGVyb2lkO1xuXG5BdWRpbyA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkF1ZGlvO1xuXG5CdWxsZXQgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5CdWxsZXQ7XG5cbkNvbGxpc2lvbiA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkNvbGxpc2lvbjtcblxuRGVhdGhUaHJvZXMgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5EZWF0aFRocm9lcztcblxuRGlzcGxheSA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkRpc3BsYXk7XG5cbkdhbWVTdGF0ZSA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkdhbWVTdGF0ZTtcblxuR3VuID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuR3VuO1xuXG5HdW5Db250cm9scyA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkd1bkNvbnRyb2xzO1xuXG5IdWQgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5IdWQ7XG5cbk1vdGlvbiA9IGFzdGVyb2lkcy5jb21wb25lbnRzLk1vdGlvbjtcblxuTW90aW9uQ29udHJvbHMgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5Nb3Rpb25Db250cm9scztcblxuUGh5c2ljcyA9IGFzdGVyb2lkcy5jb21wb25lbnRzLlBoeXNpY3M7XG5cblBvc2l0aW9uID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb247XG5cblNwYWNlc2hpcCA9IGFzdGVyb2lkcy5jb21wb25lbnRzLlNwYWNlc2hpcDtcblxuV2FpdEZvclN0YXJ0ID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuV2FpdEZvclN0YXJ0O1xuXG5Bc3Rlcm9pZERlYXRoVmlldyA9IGFzdGVyb2lkcy5ncmFwaGljcy5Bc3Rlcm9pZERlYXRoVmlldztcblxuQXN0ZXJvaWRWaWV3ID0gYXN0ZXJvaWRzLmdyYXBoaWNzLkFzdGVyb2lkVmlldztcblxuQnVsbGV0VmlldyA9IGFzdGVyb2lkcy5ncmFwaGljcy5CdWxsZXRWaWV3O1xuXG5IdWRWaWV3ID0gYXN0ZXJvaWRzLmdyYXBoaWNzLkh1ZFZpZXc7XG5cblNwYWNlc2hpcERlYXRoVmlldyA9IGFzdGVyb2lkcy5ncmFwaGljcy5TcGFjZXNoaXBEZWF0aFZpZXc7XG5cblNwYWNlc2hpcFZpZXcgPSBhc3Rlcm9pZHMuZ3JhcGhpY3MuU3BhY2VzaGlwVmlldztcblxuYXN0ZXJvaWRzLnN5c3RlbXMuQ29sbGlzaW9uU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoQ29sbGlzaW9uU3lzdGVtLCBfc3VwZXIpO1xuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUuY3JlYXRvciA9IG51bGw7XG5cbiAgQ29sbGlzaW9uU3lzdGVtLnByb3RvdHlwZS5nYW1lcyA9IG51bGw7XG5cbiAgQ29sbGlzaW9uU3lzdGVtLnByb3RvdHlwZS5zcGFjZXNoaXBzID0gbnVsbDtcblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLmFzdGVyb2lkcyA9IG51bGw7XG5cbiAgQ29sbGlzaW9uU3lzdGVtLnByb3RvdHlwZS5idWxsZXRzID0gbnVsbDtcblxuICBmdW5jdGlvbiBDb2xsaXNpb25TeXN0ZW0oY3JlYXRvcikge1xuICAgIHRoaXMuY3JlYXRvciA9IGNyZWF0b3I7XG4gICAgdGhpcy51cGRhdGUgPSBfX2JpbmQodGhpcy51cGRhdGUsIHRoaXMpO1xuICB9XG5cbiAgQ29sbGlzaW9uU3lzdGVtLnByb3RvdHlwZS5hZGRUb0VuZ2luZSA9IGZ1bmN0aW9uKGVuZ2luZSkge1xuICAgIHRoaXMuZ2FtZXMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoR2FtZU5vZGUpO1xuICAgIHRoaXMuc3BhY2VzaGlwcyA9IGVuZ2luZS5nZXROb2RlTGlzdChTcGFjZXNoaXBDb2xsaXNpb25Ob2RlKTtcbiAgICB0aGlzLmFzdGVyb2lkcyA9IGVuZ2luZS5nZXROb2RlTGlzdChBc3Rlcm9pZENvbGxpc2lvbk5vZGUpO1xuICAgIHRoaXMuYnVsbGV0cyA9IGVuZ2luZS5nZXROb2RlTGlzdChCdWxsZXRDb2xsaXNpb25Ob2RlKTtcbiAgfTtcblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLnJlbW92ZUZyb21FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB0aGlzLmdhbWVzID0gbnVsbDtcbiAgICB0aGlzLnNwYWNlc2hpcHMgPSBudWxsO1xuICAgIHRoaXMuYXN0ZXJvaWRzID0gbnVsbDtcbiAgICB0aGlzLmJ1bGxldHMgPSBudWxsO1xuICB9O1xuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICAgIHZhciBhc3Rlcm9pZCwgYnVsbGV0LCBzcGFjZXNoaXA7XG4gICAgYnVsbGV0ID0gdGhpcy5idWxsZXRzLmhlYWQ7XG4gICAgd2hpbGUgKGJ1bGxldCkge1xuICAgICAgYXN0ZXJvaWQgPSB0aGlzLmFzdGVyb2lkcy5oZWFkO1xuICAgICAgd2hpbGUgKGFzdGVyb2lkKSB7XG4gICAgICAgIGlmIChhc3Rlcm9pZC5wb3NpdGlvbi5wb3NpdGlvbi5kaXN0YW5jZVRvKGJ1bGxldC5wb3NpdGlvbi5wb3NpdGlvbikgPD0gYXN0ZXJvaWQuY29sbGlzaW9uLnJhZGl1cykge1xuXG4gICAgICAgICAgLypcbiAgICAgICAgICAgWW91IGhpdCBhbiBhc3Rlcm9pZFxuICAgICAgICAgICAqL1xuICAgICAgICAgIHRoaXMuY3JlYXRvci5kZXN0cm95RW50aXR5KGJ1bGxldC5lbnRpdHkpO1xuICAgICAgICAgIGlmIChhc3Rlcm9pZC5jb2xsaXNpb24ucmFkaXVzID4gMTApIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRvci5jcmVhdGVBc3Rlcm9pZChhc3Rlcm9pZC5jb2xsaXNpb24ucmFkaXVzIC0gMTAsIGFzdGVyb2lkLnBvc2l0aW9uLnBvc2l0aW9uLnggKyBNYXRoLnJhbmRvbSgpICogMTAgLSA1LCBhc3Rlcm9pZC5wb3NpdGlvbi5wb3NpdGlvbi55ICsgTWF0aC5yYW5kb20oKSAqIDEwIC0gNSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0b3IuY3JlYXRlQXN0ZXJvaWQoYXN0ZXJvaWQuY29sbGlzaW9uLnJhZGl1cyAtIDEwLCBhc3Rlcm9pZC5wb3NpdGlvbi5wb3NpdGlvbi54ICsgTWF0aC5yYW5kb20oKSAqIDEwIC0gNSwgYXN0ZXJvaWQucG9zaXRpb24ucG9zaXRpb24ueSArIE1hdGgucmFuZG9tKCkgKiAxMCAtIDUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhc3Rlcm9pZC5hc3Rlcm9pZC5mc20uY2hhbmdlU3RhdGUoJ2Rlc3Ryb3llZCcpO1xuICAgICAgICAgIGlmICh0aGlzLmdhbWVzLmhlYWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZXMuaGVhZC5zdGF0ZS5oaXRzKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGFzdGVyb2lkID0gYXN0ZXJvaWQubmV4dDtcbiAgICAgIH1cbiAgICAgIGJ1bGxldCA9IGJ1bGxldC5uZXh0O1xuICAgIH1cbiAgICBzcGFjZXNoaXAgPSB0aGlzLnNwYWNlc2hpcHMuaGVhZDtcbiAgICB3aGlsZSAoc3BhY2VzaGlwKSB7XG4gICAgICBhc3Rlcm9pZCA9IHRoaXMuYXN0ZXJvaWRzLmhlYWQ7XG4gICAgICB3aGlsZSAoYXN0ZXJvaWQpIHtcbiAgICAgICAgaWYgKGFzdGVyb2lkLnBvc2l0aW9uLnBvc2l0aW9uLmRpc3RhbmNlVG8oc3BhY2VzaGlwLnBvc2l0aW9uLnBvc2l0aW9uKSA8PSBhc3Rlcm9pZC5jb2xsaXNpb24ucmFkaXVzICsgc3BhY2VzaGlwLmNvbGxpc2lvbi5yYWRpdXMpIHtcblxuICAgICAgICAgIC8qXG4gICAgICAgICAgIFlvdSB3ZXJlIGhpdFxuICAgICAgICAgICAqL1xuICAgICAgICAgIHNwYWNlc2hpcC5zcGFjZXNoaXAuZnNtLmNoYW5nZVN0YXRlKCdkZXN0cm95ZWQnKTtcbiAgICAgICAgICBpZiAodGhpcy5nYW1lcy5oZWFkKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWVzLmhlYWQuc3RhdGUubGl2ZXMrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYXN0ZXJvaWQgPSBhc3Rlcm9pZC5uZXh0O1xuICAgICAgfVxuICAgICAgc3BhY2VzaGlwID0gc3BhY2VzaGlwLm5leHQ7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBDb2xsaXNpb25TeXN0ZW07XG5cbn0pKGFzaC5jb3JlLlN5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbGxpc2lvbl9zeXN0ZW0uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgRGVhdGhUaHJvZXNOb2RlLCBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbkRlYXRoVGhyb2VzTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5EZWF0aFRocm9lc05vZGU7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLkRlYXRoVGhyb2VzU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoRGVhdGhUaHJvZXNTeXN0ZW0sIF9zdXBlcik7XG5cbiAgRGVhdGhUaHJvZXNTeXN0ZW0ucHJvdG90eXBlLmNyZWF0b3IgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIERlYXRoVGhyb2VzU3lzdGVtKGNyZWF0b3IpIHtcbiAgICB0aGlzLmNyZWF0b3IgPSBjcmVhdG9yO1xuICAgIHRoaXMudXBkYXRlTm9kZSA9IF9fYmluZCh0aGlzLnVwZGF0ZU5vZGUsIHRoaXMpO1xuICAgIERlYXRoVGhyb2VzU3lzdGVtLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIERlYXRoVGhyb2VzTm9kZSwgdGhpcy51cGRhdGVOb2RlKTtcbiAgfVxuXG4gIERlYXRoVGhyb2VzU3lzdGVtLnByb3RvdHlwZS51cGRhdGVOb2RlID0gZnVuY3Rpb24obm9kZSwgdGltZSkge1xuICAgIG5vZGUuZGVhdGguY291bnRkb3duIC09IHRpbWU7XG4gICAgaWYgKG5vZGUuZGVhdGguY291bnRkb3duIDw9IDApIHtcbiAgICAgIHRoaXMuY3JlYXRvci5kZXN0cm95RW50aXR5KG5vZGUuZW50aXR5KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIERlYXRoVGhyb2VzU3lzdGVtO1xuXG59KShhc2gudG9vbHMuTGlzdEl0ZXJhdGluZ1N5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlYXRoX3Rocm9lc19zeXN0ZW0uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgQXN0ZXJvaWRDb2xsaXNpb25Ob2RlLCBCdWxsZXRDb2xsaXNpb25Ob2RlLCBHYW1lTm9kZSwgUG9pbnQsIFNwYWNlc2hpcE5vZGUsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuR2FtZU5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuR2FtZU5vZGU7XG5cblNwYWNlc2hpcE5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuU3BhY2VzaGlwTm9kZTtcblxuQXN0ZXJvaWRDb2xsaXNpb25Ob2RlID0gYXN0ZXJvaWRzLm5vZGVzLkFzdGVyb2lkQ29sbGlzaW9uTm9kZTtcblxuQnVsbGV0Q29sbGlzaW9uTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5CdWxsZXRDb2xsaXNpb25Ob2RlO1xuXG5Qb2ludCA9IGFzdGVyb2lkcy51aS5Qb2ludDtcblxuYXN0ZXJvaWRzLnN5c3RlbXMuR2FtZU1hbmFnZXIgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhHYW1lTWFuYWdlciwgX3N1cGVyKTtcblxuICBHYW1lTWFuYWdlci5wcm90b3R5cGUuY29uZmlnID0gbnVsbDtcblxuICBHYW1lTWFuYWdlci5wcm90b3R5cGUuY3JlYXRvciA9IG51bGw7XG5cbiAgR2FtZU1hbmFnZXIucHJvdG90eXBlLmdhbWVOb2RlcyA9IG51bGw7XG5cbiAgR2FtZU1hbmFnZXIucHJvdG90eXBlLnNwYWNlc2hpcHMgPSBudWxsO1xuXG4gIEdhbWVNYW5hZ2VyLnByb3RvdHlwZS5hc3Rlcm9pZHMgPSBudWxsO1xuXG4gIEdhbWVNYW5hZ2VyLnByb3RvdHlwZS5idWxsZXRzID0gbnVsbDtcblxuICBmdW5jdGlvbiBHYW1lTWFuYWdlcihjcmVhdG9yLCBjb25maWcpIHtcbiAgICB0aGlzLmNyZWF0b3IgPSBjcmVhdG9yO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMudXBkYXRlID0gX19iaW5kKHRoaXMudXBkYXRlLCB0aGlzKTtcbiAgfVxuXG4gIEdhbWVNYW5hZ2VyLnByb3RvdHlwZS5hZGRUb0VuZ2luZSA9IGZ1bmN0aW9uKGVuZ2luZSkge1xuICAgIHRoaXMuZ2FtZU5vZGVzID0gZW5naW5lLmdldE5vZGVMaXN0KEdhbWVOb2RlKTtcbiAgICB0aGlzLnNwYWNlc2hpcHMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoU3BhY2VzaGlwTm9kZSk7XG4gICAgdGhpcy5hc3Rlcm9pZHMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoQXN0ZXJvaWRDb2xsaXNpb25Ob2RlKTtcbiAgICB0aGlzLmJ1bGxldHMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoQnVsbGV0Q29sbGlzaW9uTm9kZSk7XG4gIH07XG5cbiAgR2FtZU1hbmFnZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgYXN0ZXJvaWQsIGFzdGVyb2lkQ291bnQsIGNsZWFyVG9BZGRTcGFjZXNoaXAsIGksIG5ld1NwYWNlc2hpcFBvc2l0aW9uLCBub2RlLCBwb3NpdGlvbiwgc3BhY2VzaGlwO1xuICAgIG5vZGUgPSB0aGlzLmdhbWVOb2Rlcy5oZWFkO1xuICAgIGlmIChub2RlICYmIG5vZGUuc3RhdGUucGxheWluZykge1xuICAgICAgaWYgKHRoaXMuc3BhY2VzaGlwcy5lbXB0eSkge1xuICAgICAgICBpZiAobm9kZS5zdGF0ZS5saXZlcyA+IDApIHtcbiAgICAgICAgICBuZXdTcGFjZXNoaXBQb3NpdGlvbiA9IG5ldyBQb2ludCh0aGlzLmNvbmZpZy53aWR0aCAqIDAuNSwgdGhpcy5jb25maWcuaGVpZ2h0ICogMC41KTtcbiAgICAgICAgICBjbGVhclRvQWRkU3BhY2VzaGlwID0gdHJ1ZTtcbiAgICAgICAgICBhc3Rlcm9pZCA9IHRoaXMuYXN0ZXJvaWRzLmhlYWQ7XG4gICAgICAgICAgd2hpbGUgKGFzdGVyb2lkKSB7XG4gICAgICAgICAgICBpZiAoUG9pbnQuZGlzdGFuY2UoYXN0ZXJvaWQucG9zaXRpb24ucG9zaXRpb24sIG5ld1NwYWNlc2hpcFBvc2l0aW9uKSA8PSBhc3Rlcm9pZC5jb2xsaXNpb24ucmFkaXVzICsgNTApIHtcbiAgICAgICAgICAgICAgY2xlYXJUb0FkZFNwYWNlc2hpcCA9IGZhbHNlO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFzdGVyb2lkID0gYXN0ZXJvaWQubmV4dDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNsZWFyVG9BZGRTcGFjZXNoaXApIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRvci5jcmVhdGVTcGFjZXNoaXAoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZS5zdGF0ZS5wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5jcmVhdG9yLmNyZWF0ZVdhaXRGb3JDbGljaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5hc3Rlcm9pZHMuZW1wdHkgJiYgdGhpcy5idWxsZXRzLmVtcHR5ICYmICF0aGlzLnNwYWNlc2hpcHMuZW1wdHkpIHtcbiAgICAgICAgc3BhY2VzaGlwID0gdGhpcy5zcGFjZXNoaXBzLmhlYWQ7XG4gICAgICAgIG5vZGUuc3RhdGUubGV2ZWwrKztcbiAgICAgICAgYXN0ZXJvaWRDb3VudCA9IDIgKyBub2RlLnN0YXRlLmxldmVsO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBhc3Rlcm9pZENvdW50KSB7XG4gICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gbmV3IFBvaW50KE1hdGgucmFuZG9tKCkgKiB0aGlzLmNvbmZpZy53aWR0aCwgTWF0aC5yYW5kb20oKSAqIHRoaXMuY29uZmlnLmhlaWdodCk7XG4gICAgICAgICAgICBpZiAoIShQb2ludC5kaXN0YW5jZShwb3NpdGlvbiwgc3BhY2VzaGlwLnBvc2l0aW9uLnBvc2l0aW9uKSA8PSA4MCkpIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuY3JlYXRvci5jcmVhdGVBc3Rlcm9pZCgzMCwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG4gICAgICAgICAgKytpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIEdhbWVNYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmVGcm9tRW5naW5lID0gZnVuY3Rpb24oZW5naW5lKSB7XG4gICAgdGhpcy5nYW1lTm9kZXMgPSBudWxsO1xuICAgIHRoaXMuc3BhY2VzaGlwcyA9IG51bGw7XG4gICAgdGhpcy5hc3Rlcm9pZHMgPSBudWxsO1xuICAgIHRoaXMuYnVsbGV0cyA9IG51bGw7XG4gIH07XG5cbiAgcmV0dXJuIEdhbWVNYW5hZ2VyO1xuXG59KShhc2guY29yZS5TeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nYW1lX21hbmFnZXIuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgR3VuQ29udHJvbE5vZGUsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuR3VuQ29udHJvbE5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuR3VuQ29udHJvbE5vZGU7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLkd1bkNvbnRyb2xTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhHdW5Db250cm9sU3lzdGVtLCBfc3VwZXIpO1xuXG4gIEd1bkNvbnRyb2xTeXN0ZW0ucHJvdG90eXBlLmtleVBvbGwgPSBudWxsO1xuXG4gIEd1bkNvbnRyb2xTeXN0ZW0ucHJvdG90eXBlLmNyZWF0b3IgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEd1bkNvbnRyb2xTeXN0ZW0oa2V5UG9sbCwgY3JlYXRvcikge1xuICAgIHRoaXMua2V5UG9sbCA9IGtleVBvbGw7XG4gICAgdGhpcy5jcmVhdG9yID0gY3JlYXRvcjtcbiAgICB0aGlzLnVwZGF0ZU5vZGUgPSBfX2JpbmQodGhpcy51cGRhdGVOb2RlLCB0aGlzKTtcbiAgICBHdW5Db250cm9sU3lzdGVtLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIEd1bkNvbnRyb2xOb2RlLCB0aGlzLnVwZGF0ZU5vZGUpO1xuICB9XG5cbiAgR3VuQ29udHJvbFN5c3RlbS5wcm90b3R5cGUudXBkYXRlTm9kZSA9IGZ1bmN0aW9uKG5vZGUsIHRpbWUpIHtcbiAgICB2YXIgY29udHJvbCwgZ3VuLCBwb3NpdGlvbjtcbiAgICBjb250cm9sID0gbm9kZS5jb250cm9sO1xuICAgIHBvc2l0aW9uID0gbm9kZS5wb3NpdGlvbjtcbiAgICBndW4gPSBub2RlLmd1bjtcbiAgICBndW4uc2hvb3RpbmcgPSB0aGlzLmtleVBvbGwuaXNEb3duKGNvbnRyb2wudHJpZ2dlcik7XG4gICAgZ3VuLnRpbWVTaW5jZUxhc3RTaG90ICs9IHRpbWU7XG4gICAgaWYgKGd1bi5zaG9vdGluZyAmJiBndW4udGltZVNpbmNlTGFzdFNob3QgPj0gZ3VuLm1pbmltdW1TaG90SW50ZXJ2YWwpIHtcbiAgICAgIHRoaXMuY3JlYXRvci5jcmVhdGVVc2VyQnVsbGV0KGd1biwgcG9zaXRpb24pO1xuICAgICAgZ3VuLnRpbWVTaW5jZUxhc3RTaG90ID0gMDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIEd1bkNvbnRyb2xTeXN0ZW07XG5cbn0pKGFzaC50b29scy5MaXN0SXRlcmF0aW5nU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z3VuX2NvbnRyb2xfc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEh1ZE5vZGUsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuSHVkTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5IdWROb2RlO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5IdWRTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhIdWRTeXN0ZW0sIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gSHVkU3lzdGVtKCkge1xuICAgIHRoaXMudXBkYXRlTm9kZSA9IF9fYmluZCh0aGlzLnVwZGF0ZU5vZGUsIHRoaXMpO1xuICAgIEh1ZFN5c3RlbS5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBIdWROb2RlLCB0aGlzLnVwZGF0ZU5vZGUpO1xuICB9XG5cbiAgSHVkU3lzdGVtLnByb3RvdHlwZS51cGRhdGVOb2RlID0gZnVuY3Rpb24obm9kZSwgdGltZSkge1xuICAgIG5vZGUuaHVkLnZpZXcuc2V0TGl2ZXMobm9kZS5zdGF0ZS5saXZlcyk7XG4gICAgbm9kZS5odWQudmlldy5zZXRTY29yZShub2RlLnN0YXRlLmhpdHMpO1xuICB9O1xuXG4gIHJldHVybiBIdWRTeXN0ZW07XG5cbn0pKGFzaC50b29scy5MaXN0SXRlcmF0aW5nU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aHVkX3N5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBNb3Rpb25Db250cm9sTm9kZSwgYXN0ZXJvaWRzLCBiMlZlYzIsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbk1vdGlvbkNvbnRyb2xOb2RlID0gYXN0ZXJvaWRzLm5vZGVzLk1vdGlvbkNvbnRyb2xOb2RlO1xuXG5iMlZlYzIgPSBCb3gyRC5Db21tb24uTWF0aC5iMlZlYzI7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLk1vdGlvbkNvbnRyb2xTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhNb3Rpb25Db250cm9sU3lzdGVtLCBfc3VwZXIpO1xuXG4gIE1vdGlvbkNvbnRyb2xTeXN0ZW0ucHJvdG90eXBlLmtleVBvbGwgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIE1vdGlvbkNvbnRyb2xTeXN0ZW0oa2V5UG9sbCkge1xuICAgIHRoaXMua2V5UG9sbCA9IGtleVBvbGw7XG4gICAgdGhpcy51cGRhdGVOb2RlID0gX19iaW5kKHRoaXMudXBkYXRlTm9kZSwgdGhpcyk7XG4gICAgTW90aW9uQ29udHJvbFN5c3RlbS5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBNb3Rpb25Db250cm9sTm9kZSwgdGhpcy51cGRhdGVOb2RlKTtcbiAgfVxuXG4gIE1vdGlvbkNvbnRyb2xTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZU5vZGUgPSBmdW5jdGlvbihub2RlLCB0aW1lKSB7XG4gICAgdmFyIGNvbnRyb2wsIGxlZnQsIG1vdGlvbiwgcG9zaXRpb24sIHJpZ2h0O1xuICAgIGNvbnRyb2wgPSBub2RlLmNvbnRyb2w7XG4gICAgcG9zaXRpb24gPSBub2RlLnBvc2l0aW9uO1xuICAgIG1vdGlvbiA9IG5vZGUubW90aW9uO1xuICAgIGxlZnQgPSB0aGlzLmtleVBvbGwuaXNEb3duKGNvbnRyb2wubGVmdCk7XG4gICAgcmlnaHQgPSB0aGlzLmtleVBvbGwuaXNEb3duKGNvbnRyb2wucmlnaHQpO1xuICAgIGlmIChsZWZ0KSB7XG4gICAgICBwb3NpdGlvbi5yb3RhdGlvbiAtPSBjb250cm9sLnJvdGF0aW9uUmF0ZSAqIHRpbWU7XG4gICAgfVxuICAgIGlmIChyaWdodCkge1xuICAgICAgcG9zaXRpb24ucm90YXRpb24gKz0gY29udHJvbC5yb3RhdGlvblJhdGUgKiB0aW1lO1xuICAgIH1cbiAgICBpZiAodGhpcy5rZXlQb2xsLmlzRG93bihjb250cm9sLmFjY2VsZXJhdGUpKSB7XG4gICAgICBtb3Rpb24udmVsb2NpdHkueCArPSBNYXRoLmNvcyhwb3NpdGlvbi5yb3RhdGlvbikgKiBjb250cm9sLmFjY2VsZXJhdGlvblJhdGUgKiB0aW1lO1xuICAgICAgbW90aW9uLnZlbG9jaXR5LnkgKz0gTWF0aC5zaW4ocG9zaXRpb24ucm90YXRpb24pICogY29udHJvbC5hY2NlbGVyYXRpb25SYXRlICogdGltZTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIE1vdGlvbkNvbnRyb2xTeXN0ZW07XG5cbn0pKGFzaC50b29scy5MaXN0SXRlcmF0aW5nU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bW90aW9uX2NvbnRyb2xfc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIE1vdmVtZW50Tm9kZSwgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5Nb3ZlbWVudE5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuTW92ZW1lbnROb2RlO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5Nb3ZlbWVudFN5c3RlbSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKE1vdmVtZW50U3lzdGVtLCBfc3VwZXIpO1xuXG4gIE1vdmVtZW50U3lzdGVtLnByb3RvdHlwZS5jb25maWcgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIE1vdmVtZW50U3lzdGVtKGNvbmZpZykge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMudXBkYXRlTm9kZSA9IF9fYmluZCh0aGlzLnVwZGF0ZU5vZGUsIHRoaXMpO1xuICAgIE1vdmVtZW50U3lzdGVtLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIE1vdmVtZW50Tm9kZSwgdGhpcy51cGRhdGVOb2RlKTtcbiAgfVxuXG4gIE1vdmVtZW50U3lzdGVtLnByb3RvdHlwZS51cGRhdGVOb2RlID0gZnVuY3Rpb24obm9kZSwgdGltZSkge1xuICAgIHZhciBtb3Rpb24sIHBvc2l0aW9uLCB4RGFtcCwgeURhbXA7XG4gICAgcG9zaXRpb24gPSBub2RlLnBvc2l0aW9uO1xuICAgIG1vdGlvbiA9IG5vZGUubW90aW9uO1xuICAgIHBvc2l0aW9uLnBvc2l0aW9uLnggKz0gbW90aW9uLnZlbG9jaXR5LnggKiB0aW1lO1xuICAgIHBvc2l0aW9uLnBvc2l0aW9uLnkgKz0gbW90aW9uLnZlbG9jaXR5LnkgKiB0aW1lO1xuICAgIGlmIChwb3NpdGlvbi5wb3NpdGlvbi54IDwgMCkge1xuICAgICAgcG9zaXRpb24ucG9zaXRpb24ueCArPSB0aGlzLmNvbmZpZy53aWR0aDtcbiAgICB9XG4gICAgaWYgKHBvc2l0aW9uLnBvc2l0aW9uLnggPiB0aGlzLmNvbmZpZy53aWR0aCkge1xuICAgICAgcG9zaXRpb24ucG9zaXRpb24ueCAtPSB0aGlzLmNvbmZpZy53aWR0aDtcbiAgICB9XG4gICAgaWYgKHBvc2l0aW9uLnBvc2l0aW9uLnkgPCAwKSB7XG4gICAgICBwb3NpdGlvbi5wb3NpdGlvbi55ICs9IHRoaXMuY29uZmlnLmhlaWdodDtcbiAgICB9XG4gICAgaWYgKHBvc2l0aW9uLnBvc2l0aW9uLnkgPiB0aGlzLmNvbmZpZy5oZWlnaHQpIHtcbiAgICAgIHBvc2l0aW9uLnBvc2l0aW9uLnkgLT0gdGhpcy5jb25maWcuaGVpZ2h0O1xuICAgIH1cbiAgICBwb3NpdGlvbi5yb3RhdGlvbiArPSBtb3Rpb24uYW5ndWxhclZlbG9jaXR5ICogdGltZTtcbiAgICBpZiAobW90aW9uLmRhbXBpbmcgPiAwKSB7XG4gICAgICB4RGFtcCA9IE1hdGguYWJzKE1hdGguY29zKHBvc2l0aW9uLnJvdGF0aW9uKSAqIG1vdGlvbi5kYW1waW5nICogdGltZSk7XG4gICAgICB5RGFtcCA9IE1hdGguYWJzKE1hdGguc2luKHBvc2l0aW9uLnJvdGF0aW9uKSAqIG1vdGlvbi5kYW1waW5nICogdGltZSk7XG4gICAgICBpZiAobW90aW9uLnZlbG9jaXR5LnggPiB4RGFtcCkge1xuICAgICAgICBtb3Rpb24udmVsb2NpdHkueCAtPSB4RGFtcDtcbiAgICAgIH0gZWxzZSBpZiAobW90aW9uLnZlbG9jaXR5LnggPCAteERhbXApIHtcbiAgICAgICAgbW90aW9uLnZlbG9jaXR5LnggKz0geERhbXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtb3Rpb24udmVsb2NpdHkueCA9IDA7XG4gICAgICB9XG4gICAgICBpZiAobW90aW9uLnZlbG9jaXR5LnkgPiB5RGFtcCkge1xuICAgICAgICBtb3Rpb24udmVsb2NpdHkueSAtPSB5RGFtcDtcbiAgICAgIH0gZWxzZSBpZiAobW90aW9uLnZlbG9jaXR5LnkgPCAteURhbXApIHtcbiAgICAgICAgbW90aW9uLnZlbG9jaXR5LnkgKz0geURhbXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtb3Rpb24udmVsb2NpdHkueSA9IDA7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBNb3ZlbWVudFN5c3RlbTtcblxufSkoYXNoLnRvb2xzLkxpc3RJdGVyYXRpbmdTeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tb3ZlbWVudF9zeXN0ZW0uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgUmVuZGVyTm9kZSwgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5SZW5kZXJOb2RlID0gYXN0ZXJvaWRzLm5vZGVzLlJlbmRlck5vZGU7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLlJlbmRlclN5c3RlbSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKFJlbmRlclN5c3RlbSwgX3N1cGVyKTtcblxuICBSZW5kZXJTeXN0ZW0ucHJvdG90eXBlLmdyYXBoaWMgPSBudWxsO1xuXG4gIFJlbmRlclN5c3RlbS5wcm90b3R5cGUubm9kZXMgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIFJlbmRlclN5c3RlbShncmFwaGljKSB7XG4gICAgdGhpcy5ncmFwaGljID0gZ3JhcGhpYztcbiAgICB0aGlzLnVwZGF0ZSA9IF9fYmluZCh0aGlzLnVwZGF0ZSwgdGhpcyk7XG4gIH1cblxuICBSZW5kZXJTeXN0ZW0ucHJvdG90eXBlLmFkZFRvRW5naW5lID0gZnVuY3Rpb24oZW5naW5lKSB7XG4gICAgdmFyIG5vZGU7XG4gICAgdGhpcy5ub2RlcyA9IGVuZ2luZS5nZXROb2RlTGlzdChSZW5kZXJOb2RlKTtcbiAgICBub2RlID0gdGhpcy5ub2Rlcy5oZWFkO1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICB0aGlzLmFkZFRvRGlzcGxheShub2RlKTtcbiAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgfVxuICB9O1xuXG4gIFJlbmRlclN5c3RlbS5wcm90b3R5cGUuYWRkVG9EaXNwbGF5ID0gZnVuY3Rpb24obm9kZSkge307XG5cbiAgUmVuZGVyU3lzdGVtLnByb3RvdHlwZS5yZW1vdmVGcm9tRGlzcGxheSA9IGZ1bmN0aW9uKG5vZGUpIHt9O1xuXG4gIFJlbmRlclN5c3RlbS5wcm90b3R5cGUucmVtb3ZlRnJvbUVuZ2luZSA9IGZ1bmN0aW9uKGVuZ2luZSkge1xuICAgIHRoaXMubm9kZXMgPSBudWxsO1xuICB9O1xuXG4gIFJlbmRlclN5c3RlbS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICAgIHZhciBkaXNwbGF5LCBncmFwaGljLCBub2RlLCBwb3NpdGlvbjtcbiAgICB0aGlzLmdyYXBoaWMuc2F2ZSgpO1xuICAgIHRoaXMuZ3JhcGhpYy50cmFuc2xhdGUoMCwgMCk7XG4gICAgdGhpcy5ncmFwaGljLnJvdGF0ZSgwKTtcbiAgICB0aGlzLmdyYXBoaWMuY2xlYXJSZWN0KDAsIDAsIHRoaXMuZ3JhcGhpYy5jYW52YXMud2lkdGgsIHRoaXMuZ3JhcGhpYy5jYW52YXMuaGVpZ2h0KTtcbiAgICBub2RlID0gdGhpcy5ub2Rlcy5oZWFkO1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICBkaXNwbGF5ID0gbm9kZS5kaXNwbGF5O1xuICAgICAgZ3JhcGhpYyA9IGRpc3BsYXkuZ3JhcGhpYztcbiAgICAgIHBvc2l0aW9uID0gbm9kZS5wb3NpdGlvbjtcbiAgICAgIGdyYXBoaWMueCA9IHBvc2l0aW9uLnBvc2l0aW9uLng7XG4gICAgICBncmFwaGljLnkgPSBwb3NpdGlvbi5wb3NpdGlvbi55O1xuICAgICAgZ3JhcGhpYy5yb3RhdGlvbiA9IHBvc2l0aW9uLnJvdGF0aW9uO1xuICAgICAgZ3JhcGhpYy5kcmF3KCk7XG4gICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgIH1cbiAgICB0aGlzLmdyYXBoaWMucmVzdG9yZSgpO1xuICB9O1xuXG4gIHJldHVybiBSZW5kZXJTeXN0ZW07XG5cbn0pKGFzaC5jb3JlLlN5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlbmRlcl9zeXN0ZW0uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLnN5c3RlbXMuU3lzdGVtUHJpb3JpdGllcyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gU3lzdGVtUHJpb3JpdGllcygpIHt9XG5cbiAgU3lzdGVtUHJpb3JpdGllcy5wcmVVcGRhdGUgPSAxO1xuXG4gIFN5c3RlbVByaW9yaXRpZXMudXBkYXRlID0gMjtcblxuICBTeXN0ZW1Qcmlvcml0aWVzLm1vdmUgPSAzO1xuXG4gIFN5c3RlbVByaW9yaXRpZXMucmVzb2x2ZUNvbGxpc2lvbnMgPSA0O1xuXG4gIFN5c3RlbVByaW9yaXRpZXMuc3RhdGVNYWNoaW5lcyA9IDU7XG5cbiAgU3lzdGVtUHJpb3JpdGllcy5hbmltYXRlID0gNjtcblxuICBTeXN0ZW1Qcmlvcml0aWVzLnJlbmRlciA9IDc7XG5cbiAgcmV0dXJuIFN5c3RlbVByaW9yaXRpZXM7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN5c3RlbV9wcmlvcml0aWVzLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEFzdGVyb2lkQ29sbGlzaW9uTm9kZSwgR2FtZU5vZGUsIFdhaXRGb3JTdGFydE5vZGUsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuV2FpdEZvclN0YXJ0Tm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5XYWl0Rm9yU3RhcnROb2RlO1xuXG5Bc3Rlcm9pZENvbGxpc2lvbk5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuQXN0ZXJvaWRDb2xsaXNpb25Ob2RlO1xuXG5HYW1lTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5HYW1lTm9kZTtcblxuYXN0ZXJvaWRzLnN5c3RlbXMuV2FpdEZvclN0YXJ0U3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoV2FpdEZvclN0YXJ0U3lzdGVtLCBfc3VwZXIpO1xuXG4gIFdhaXRGb3JTdGFydFN5c3RlbS5wcm90b3R5cGUuZW5naW5lID0gbnVsbDtcblxuICBXYWl0Rm9yU3RhcnRTeXN0ZW0ucHJvdG90eXBlLmNyZWF0b3IgPSBudWxsO1xuXG4gIFdhaXRGb3JTdGFydFN5c3RlbS5wcm90b3R5cGUuZ2FtZU5vZGVzID0gbnVsbDtcblxuICBXYWl0Rm9yU3RhcnRTeXN0ZW0ucHJvdG90eXBlLndhaXROb2RlcyA9IG51bGw7XG5cbiAgV2FpdEZvclN0YXJ0U3lzdGVtLnByb3RvdHlwZS5hc3Rlcm9pZHMgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIFdhaXRGb3JTdGFydFN5c3RlbShjcmVhdG9yKSB7XG4gICAgdGhpcy5jcmVhdG9yID0gY3JlYXRvcjtcbiAgICB0aGlzLnVwZGF0ZSA9IF9fYmluZCh0aGlzLnVwZGF0ZSwgdGhpcyk7XG4gIH1cblxuICBXYWl0Rm9yU3RhcnRTeXN0ZW0ucHJvdG90eXBlLmFkZFRvRW5naW5lID0gZnVuY3Rpb24oZW5naW5lKSB7XG4gICAgdGhpcy5lbmdpbmUgPSBlbmdpbmU7XG4gICAgdGhpcy53YWl0Tm9kZXMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoV2FpdEZvclN0YXJ0Tm9kZSk7XG4gICAgdGhpcy5nYW1lTm9kZXMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoR2FtZU5vZGUpO1xuICAgIHRoaXMuYXN0ZXJvaWRzID0gZW5naW5lLmdldE5vZGVMaXN0KEFzdGVyb2lkQ29sbGlzaW9uTm9kZSk7XG4gIH07XG5cbiAgV2FpdEZvclN0YXJ0U3lzdGVtLnByb3RvdHlwZS5yZW1vdmVGcm9tRW5naW5lID0gZnVuY3Rpb24oZW5naW5lKSB7XG4gICAgdGhpcy53YWl0Tm9kZXMgPSBudWxsO1xuICAgIHRoaXMuZ2FtZU5vZGVzID0gbnVsbDtcbiAgfTtcblxuICBXYWl0Rm9yU3RhcnRTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgYXN0ZXJvaWQsIGdhbWUsIG5vZGU7XG4gICAgbm9kZSA9IHRoaXMud2FpdE5vZGVzLmhlYWQ7XG4gICAgZ2FtZSA9IHRoaXMuZ2FtZU5vZGVzLmhlYWQ7XG4gICAgaWYgKG5vZGUgJiYgbm9kZS53YWl0LnN0YXJ0R2FtZSAmJiBnYW1lKSB7XG4gICAgICBhc3Rlcm9pZCA9IHRoaXMuYXN0ZXJvaWRzLmhlYWQ7XG4gICAgICB3aGlsZSAoYXN0ZXJvaWQpIHtcbiAgICAgICAgdGhpcy5jcmVhdG9yLmRlc3Ryb3lFbnRpdHkoYXN0ZXJvaWQuZW50aXR5KTtcbiAgICAgICAgYXN0ZXJvaWQgPSBhc3Rlcm9pZC5uZXh0O1xuICAgICAgfVxuICAgICAgZ2FtZS5zdGF0ZS5zZXRGb3JTdGFydCgpO1xuICAgICAgbm9kZS53YWl0LnN0YXJ0R2FtZSA9IGZhbHNlO1xuICAgICAgdGhpcy5lbmdpbmUucmVtb3ZlRW50aXR5KG5vZGUuZW50aXR5KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFdhaXRGb3JTdGFydFN5c3RlbTtcblxufSkoYXNoLmNvcmUuU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2FpdF9mb3Jfc3RhcnRfc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy51aS5Qb2ludCA9IChmdW5jdGlvbigpIHtcbiAgUG9pbnQucHJvdG90eXBlLnggPSAwO1xuXG4gIFBvaW50LnByb3RvdHlwZS55ID0gMDtcblxuICBmdW5jdGlvbiBQb2ludCh4LCB5KSB7XG4gICAgdGhpcy54ID0geCAhPSBudWxsID8geCA6IDA7XG4gICAgdGhpcy55ID0geSAhPSBudWxsID8geSA6IDA7XG4gIH1cblxuICBQb2ludC5kaXN0YW5jZSA9IGZ1bmN0aW9uKHBvaW50MSwgcG9pbnQyKSB7XG4gICAgdmFyIGR4LCBkeTtcbiAgICBkeCA9IHBvaW50MS54IC0gcG9pbnQyLng7XG4gICAgZHkgPSBwb2ludDEueSAtIHBvaW50Mi55O1xuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICB9O1xuXG4gIFBvaW50LnByb3RvdHlwZS5kaXN0YW5jZVNxdWFyZWRUbyA9IGZ1bmN0aW9uKHRhcmdldFBvaW50KSB7XG4gICAgdmFyIGR4LCBkeTtcbiAgICBkeCA9IHRoaXMueCAtIHRhcmdldFBvaW50Lng7XG4gICAgZHkgPSB0aGlzLnkgLSB0YXJnZXRQb2ludC55O1xuICAgIHJldHVybiBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgfTtcblxuICBQb2ludC5wcm90b3R5cGUuZGlzdGFuY2VUbyA9IGZ1bmN0aW9uKHRhcmdldFBvaW50KSB7XG4gICAgdmFyIGR4LCBkeTtcbiAgICBkeCA9IHRoaXMueCAtIHRhcmdldFBvaW50Lng7XG4gICAgZHkgPSB0aGlzLnkgLSB0YXJnZXRQb2ludC55O1xuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICB9O1xuXG4gIHJldHVybiBQb2ludDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cG9pbnQuanMubWFwXG4iXX0=
