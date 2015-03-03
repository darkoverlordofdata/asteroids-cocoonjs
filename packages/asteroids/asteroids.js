!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.asteroids=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

KeyPoll = asteroids.ui.KeyPoll;


/*
 * Minimal Box2D interface supported in cocoon
 */

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
    this.creator = new EntityCreator(this.engine);
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

},{"../../lib":58}],2:[function(require,module,exports){
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

},{"../../../lib":58}],3:[function(require,module,exports){
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

},{"../../../lib":58}],4:[function(require,module,exports){
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

},{"../../../lib":58}],5:[function(require,module,exports){
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

},{"../../../lib":58}],6:[function(require,module,exports){
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

},{"../../../lib":58}],7:[function(require,module,exports){
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

},{"../../../lib":58}],8:[function(require,module,exports){
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

},{"../../../lib":58}],9:[function(require,module,exports){
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

},{"../../../lib":58}],10:[function(require,module,exports){
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

},{"../../../lib":58}],11:[function(require,module,exports){
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

},{"../../../lib":58}],12:[function(require,module,exports){
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

},{"../../../lib":58}],13:[function(require,module,exports){
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

},{"../../../lib":58}],14:[function(require,module,exports){
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

},{"../../../lib":58}],15:[function(require,module,exports){
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

},{"../../../lib":58}],16:[function(require,module,exports){
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

},{"../../../lib":58}],17:[function(require,module,exports){
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

},{"../../../lib":58}],18:[function(require,module,exports){
'use strict';
var Animation, Asteroid, AsteroidDeathView, AsteroidView, Audio, Bullet, BulletView, Collision, DeathThroes, Display, Entity, EntityStateMachine, GameState, Gun, GunControls, Hud, HudView, Motion, MotionControls, Physics, Position, Spaceship, SpaceshipDeathView, SpaceshipView, WaitForStart, WaitForStartView, asteroids;

asteroids = require('../../lib');

WaitForStartView = asteroids.sprites.WaitForStartView;

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

AsteroidDeathView = asteroids.sprites.AsteroidDeathView;

AsteroidView = asteroids.sprites.AsteroidView;

BulletView = asteroids.sprites.BulletView;

HudView = asteroids.sprites.HudView;

SpaceshipDeathView = asteroids.sprites.SpaceshipDeathView;

SpaceshipView = asteroids.sprites.SpaceshipView;

asteroids.EntityCreator = (function() {
  var KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_Z;

  KEY_LEFT = 37;

  KEY_UP = 38;

  KEY_RIGHT = 39;

  KEY_Z = 90;

  EntityCreator.prototype.engine = null;

  EntityCreator.prototype.waitEntity = null;

  EntityCreator.prototype.graphic = null;

  function EntityCreator(engine) {
    this.engine = engine;
  }

  EntityCreator.prototype.destroyEntity = function(entity) {
    this.engine.removeEntity(entity);
  };


  /*
   * Game State
   */

  EntityCreator.prototype.createGame = function() {
    var gameEntity, hud;
    hud = new HudView();
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
      waitView = new WaitForStartView();
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
    fsm.createState('alive').add(Motion).withInstance(new Motion((Math.random() - 0.5) * 4 * (50 - radius), (Math.random() - 0.5) * 4 * (50 - radius), Math.random() * 2 - 1, 0)).add(Collision).withInstance(new Collision(radius)).add(Display).withInstance(new Display(new AsteroidView(radius)));
    deathView = new AsteroidDeathView(radius);
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
    fsm.createState('playing').add(Motion).withInstance(new Motion(0, 0, 0, 15)).add(MotionControls).withInstance(new MotionControls(KEY_LEFT, KEY_RIGHT, KEY_UP, 100, 3)).add(Gun).withInstance(new Gun(8, 0, 0.3, 2)).add(GunControls).withInstance(new GunControls(KEY_Z)).add(Collision).withInstance(new Collision(9)).add(Display).withInstance(new Display(new SpaceshipView()));
    deathView = new SpaceshipDeathView();
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
    bullet = new Entity().add(new Bullet(gun.bulletLifetime)).add(new Position(x, y, 0)).add(new Collision(0)).add(new Motion(cos * 150, sin * 150, 0, 0)).add(new Display(new BulletView()));
    this.engine.addEntity(bullet);
    return bullet;
  };

  return EntityCreator;

})();

//# sourceMappingURL=entity_creator.js.map

},{"../../lib":58}],19:[function(require,module,exports){
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

},{"../../lib":58}],20:[function(require,module,exports){
'use strict';
var asteroids;

asteroids = require('../../lib');

asteroids.Main = (function() {
  function Main() {
    var canvas;
    canvas = this.canvas('#6A5ACD');
    asteroids = new asteroids.Asteroids(canvas.getContext('2d'), canvas.width, canvas.height);
    asteroids.start();
    return;
  }

  Main.prototype.canvas = function(backgroundColor) {
    var canvas;
    canvas = document.createElement(navigator.isCocoonJS ? 'screencanvas' : 'canvas');
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.backgroundColor = backgroundColor;
    document.body.appendChild(canvas);
    return canvas;
  };

  return Main;

})();

//# sourceMappingURL=main.js.map

},{"../../lib":58}],21:[function(require,module,exports){
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

},{"../../../lib":58}],22:[function(require,module,exports){
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

},{"../../../lib":58}],23:[function(require,module,exports){
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

},{"../../../lib":58}],24:[function(require,module,exports){
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

},{"../../../lib":58}],25:[function(require,module,exports){
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

},{"../../../lib":58}],26:[function(require,module,exports){
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

},{"../../../lib":58}],27:[function(require,module,exports){
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

},{"../../../lib":58}],28:[function(require,module,exports){
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

},{"../../../lib":58}],29:[function(require,module,exports){
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

},{"../../../lib":58}],30:[function(require,module,exports){
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

},{"../../../lib":58}],31:[function(require,module,exports){
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

},{"../../../lib":58}],32:[function(require,module,exports){
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

},{"../../../lib":58}],33:[function(require,module,exports){
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

},{"../../../lib":58}],34:[function(require,module,exports){
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

},{"../../../lib":58}],35:[function(require,module,exports){
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

},{"../../../lib":58}],36:[function(require,module,exports){
'use strict';
var Dot, Point, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../../lib');

Point = asteroids.ui.Point;

asteroids.sprites.AsteroidDeathView = (function() {
  AsteroidDeathView.prototype.x = 0;

  AsteroidDeathView.prototype.y = 0;

  AsteroidDeathView.prototype.rotation = 0;

  AsteroidDeathView.prototype.radius = 0;

  AsteroidDeathView.prototype.points = null;

  AsteroidDeathView.prototype.first = true;

  AsteroidDeathView.prototype.dots = null;

  function AsteroidDeathView(radius) {
    this.radius = radius;
    this.draw = __bind(this.draw, this);
    this.dots = [];
  }

  AsteroidDeathView.prototype.draw = function(ctx) {
    var dot, _i, _len, _ref, _results;
    _ref = this.dots;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dot = _ref[_i];
      _results.push(dot.draw(ctx, this.x, this.y));
    }
    return _results;
  };

  AsteroidDeathView.prototype.animate = function(time) {
    var dot, i, _i, _j, _len, _ref, _results;
    if (this.first) {
      this.first = false;
      for (i = _i = 0; _i < 8; i = ++_i) {
        dot = new Dot(this.radius);
        this.dots.push(dot);
      }
    }
    _ref = this.dots;
    _results = [];
    for (_j = 0, _len = _ref.length; _j < _len; _j++) {
      dot = _ref[_j];
      dot.x += dot.velocity.x * time;
      _results.push(dot.y += dot.velocity.y * time);
    }
    return _results;
  };

  return AsteroidDeathView;

})();

Dot = (function() {
  Dot.prototype.velocity = null;

  Dot.prototype.x = 0;

  Dot.prototype.y = 0;

  function Dot(maxDistance) {
    var angle, distance, speed;
    angle = Math.random() * 2 * Math.PI;
    distance = Math.random() * maxDistance;
    this.x = Math.cos(angle) * distance;
    this.y = Math.sin(angle) * distance;
    speed = Math.random() * 10 + 10;
    this.velocity = new Point(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  Dot.prototype.draw = function(ctx, x, y) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = "#FFFFFF";
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  };

  return Dot;

})();

//# sourceMappingURL=asteroid_death_view.js.map

},{"../../../lib":58}],37:[function(require,module,exports){
'use strict';
var asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../../lib');

asteroids.sprites.AsteroidView = (function() {
  AsteroidView.prototype.x = 0;

  AsteroidView.prototype.y = 0;

  AsteroidView.prototype.rotation = 0;

  AsteroidView.prototype.radius = 0;

  AsteroidView.prototype.points = null;

  function AsteroidView(radius) {
    var angle, length, posX, posY;
    this.radius = radius;
    this.draw = __bind(this.draw, this);
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

  AsteroidView.prototype.draw = function(ctx) {
    var i;
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = "#FFFFFF";
    ctx.moveTo(this.radius, 0);
    i = 0;
    while (i < this.points.length) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
      ++i;
    }
    ctx.lineTo(this.radius, 0);
    ctx.fill();
    ctx.restore();
  };

  return AsteroidView;

})();

//# sourceMappingURL=asteroid_view.js.map

},{"../../../lib":58}],38:[function(require,module,exports){
'use strict';
var asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../../lib');

asteroids.sprites.BulletView = (function() {
  function BulletView() {
    this.draw = __bind(this.draw, this);
  }

  BulletView.prototype.x = 0;

  BulletView.prototype.y = 0;

  BulletView.prototype.rotation = 0;

  BulletView.prototype.draw = function(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.rotate(this.rotation);
    ctx.fillStyle = "#FFFFFF";
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  };

  return BulletView;

})();

//# sourceMappingURL=bullet_view.js.map

},{"../../../lib":58}],39:[function(require,module,exports){
'use strict';
var asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../../lib');

asteroids.sprites.HudView = (function() {
  function HudView() {
    this.draw = __bind(this.draw, this);
    this.setScore = __bind(this.setScore, this);
    this.setLives = __bind(this.setLives, this);
  }

  HudView.prototype.x = 0;

  HudView.prototype.y = 0;

  HudView.prototype.rotation = 0;

  HudView.prototype.score = 0;

  HudView.prototype.lives = 3;

  HudView.prototype.setLives = function(lives) {
    this.lives = lives;
  };

  HudView.prototype.setScore = function(score) {
    this.score = score;
  };

  HudView.prototype.draw = function(ctx) {
    var l, s, x, y;
    ctx.save();
    ctx.beginPath();
    ctx.font = 'bold 18px opendyslexic';
    ctx.fillStyle = '#00FFFF';
    ctx.textAlign = 'center';
    s = "LIVES: " + this.lives;
    l = ctx.measureText(s);
    x = l.width;
    y = 20;
    ctx.fillText(s, x, y);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.font = 'bold 18px opendyslexic';
    ctx.fillStyle = '#00FFFF';
    ctx.textAlign = 'center';
    s = "SCORE: " + this.score;
    l = ctx.measureText(s);
    x = (window.window.innerWidth * window.devicePixelRatio) - l.width;
    y = 20;
    ctx.fillText(s, x, y);
    ctx.fill();
    ctx.restore();
  };

  return HudView;

})();

//# sourceMappingURL=hud_view.js.map

},{"../../../lib":58}],40:[function(require,module,exports){
'use strict';
var Point, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../../lib');

Point = asteroids.ui.Point;

asteroids.sprites.SpaceshipDeathView = (function() {
  function SpaceshipDeathView() {
    this.draw = __bind(this.draw, this);
  }

  SpaceshipDeathView.prototype.x = 0;

  SpaceshipDeathView.prototype.y = 0;

  SpaceshipDeathView.prototype.rotation = 0;

  SpaceshipDeathView.prototype.vel1 = null;

  SpaceshipDeathView.prototype.vel2 = null;

  SpaceshipDeathView.prototype.rot1 = null;

  SpaceshipDeathView.prototype.rot2 = null;

  SpaceshipDeathView.prototype.x1 = 0;

  SpaceshipDeathView.prototype.y2 = 0;

  SpaceshipDeathView.prototype.y1 = 0;

  SpaceshipDeathView.prototype.y2 = 0;

  SpaceshipDeathView.prototype.first = true;

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
  };

  SpaceshipDeathView.prototype.draw = function(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x + this.x1, this.y + this.y1);
    ctx.rotate(this.r1);
    ctx.fillStyle = "#FFFFFF";
    ctx.moveTo(10, 0);
    ctx.lineTo(-7, 7);
    ctx.lineTo(-4, 0);
    ctx.lineTo(10, 0);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x + this.x2, this.y + this.y2);
    ctx.rotate(this.r2);
    ctx.fillStyle = "#FFFFFF";
    ctx.moveTo(10, 0);
    ctx.lineTo(-7, 7);
    ctx.lineTo(-4, 0);
    ctx.lineTo(10, 0);
    ctx.fill();
    ctx.restore();
  };

  return SpaceshipDeathView;

})();

//# sourceMappingURL=spaceship_death_view.js.map

},{"../../../lib":58}],41:[function(require,module,exports){
'use strict';
var asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../../lib');

asteroids.sprites.SpaceshipView = (function() {
  function SpaceshipView() {
    this.draw = __bind(this.draw, this);
  }

  SpaceshipView.prototype.x = 0;

  SpaceshipView.prototype.y = 0;

  SpaceshipView.prototype.rotation = 0;

  SpaceshipView.prototype.draw = function(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = "#FFFFFF";
    ctx.moveTo(10, 0);
    ctx.lineTo(-7, 7);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-7, -7);
    ctx.lineTo(10, 0);
    ctx.fill();
    ctx.restore();
  };

  return SpaceshipView;

})();

//# sourceMappingURL=spaceship_view.js.map

},{"../../../lib":58}],42:[function(require,module,exports){
'use strict';
var Signal0, asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../../lib');

Signal0 = ash.signals.Signal0;

asteroids.sprites.WaitForStartView = (function() {
  WaitForStartView.prototype.x = 0;

  WaitForStartView.prototype.y = 0;

  WaitForStartView.prototype.rotation = 0;

  WaitForStartView.prototype.first = true;

  WaitForStartView.prototype.click = null;

  function WaitForStartView() {
    this.draw = __bind(this.draw, this);
    this.click = new Signal0();
  }

  WaitForStartView.prototype.draw = function(ctx) {
    var l, s, x, y;
    if (this.first) {
      this.first = false;
      ctx.canvas.addEventListener('click', (function(_this) {
        return function(event) {
          return _this.click.dispatch();
        };
      })(this));
    }
    ctx.save();
    ctx.beginPath();
    ctx.font = 'bold 40px opendyslexic';
    ctx.fillStyle = '#FFFFFF';
    s = 'ASTEROIDS';
    l = ctx.measureText(s);
    x = Math.floor(((window.innerWidth * window.devicePixelRatio) - l.width) / 2);
    y = 175;
    ctx.fillText(s, x, y);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.font = 'bold 18px opendyslexic';
    ctx.fillStyle = '#FFFFFF';
    s = 'CLICK TO START';
    l = ctx.measureText(s);
    x = Math.floor(((window.innerWidth * window.devicePixelRatio) - l.width) / 2);
    y = 225;
    ctx.fillText(s, x, y);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.font = 'bold 14px opendyslexic';
    ctx.fillStyle = '#FFFFFF';
    s = 'Z to Fire  ~  Arrow Keys to Move';
    l = ctx.measureText(s);
    x = 10;
    y = window.innerHeight * window.devicePixelRatio - 20;
    ctx.fillText(s, x, y);
    ctx.fill();
    ctx.restore();
  };

  return WaitForStartView;

})();

//# sourceMappingURL=wait_for_start_view.js.map

},{"../../../lib":58}],43:[function(require,module,exports){
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

},{"../../../lib":58}],44:[function(require,module,exports){
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

},{"../../../lib":58}],45:[function(require,module,exports){
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

},{"../../../lib":58}],46:[function(require,module,exports){
'use strict';
var Animation, Asteroid, AsteroidCollisionNode, Audio, Bullet, BulletCollisionNode, Collision, DeathThroes, Display, GameNode, GameState, Gun, GunControls, Hud, Motion, MotionControls, Physics, Position, Spaceship, SpaceshipCollisionNode, WaitForStart, asteroids,
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

},{"../../../lib":58}],47:[function(require,module,exports){
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

},{"../../../lib":58}],48:[function(require,module,exports){
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

},{"../../../lib":58}],49:[function(require,module,exports){
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

},{"../../../lib":58}],50:[function(require,module,exports){
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

},{"../../../lib":58}],51:[function(require,module,exports){
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

},{"../../../lib":58}],52:[function(require,module,exports){
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

},{"../../../lib":58}],53:[function(require,module,exports){
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

  function RenderSystem(ctx) {
    this.ctx = ctx;
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
    this.ctx.save();
    this.ctx.translate(0, 0);
    this.ctx.rotate(0);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    node = this.nodes.head;
    while (node) {
      display = node.display;
      graphic = display.graphic;
      position = node.position;
      graphic.x = position.position.x;
      graphic.y = position.position.y;
      graphic.rotation = position.rotation;
      graphic.draw(this.ctx);
      node = node.next;
    }
    this.ctx.restore();
  };

  return RenderSystem;

})(ash.core.System);

//# sourceMappingURL=render_system.js.map

},{"../../../lib":58}],54:[function(require,module,exports){
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

},{"../../../lib":58}],55:[function(require,module,exports){
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

},{"../../../lib":58}],56:[function(require,module,exports){
'use strict';
var asteroids,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

asteroids = require('../../../lib');

asteroids.ui.KeyPoll = (function() {
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

},{"../../../lib":58}],57:[function(require,module,exports){
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

},{"../../../lib":58}],58:[function(require,module,exports){
'use strict';
var asteroids;

module.exports = asteroids = (function() {
  function asteroids() {}

  return asteroids;

})();

asteroids.ui = (function() {
  function ui() {}

  return ui;

})();

require('./asteroids/ui/point');

require('./asteroids/ui/key_poll');

asteroids.sprites = (function() {
  function sprites() {}

  return sprites;

})();

require('./asteroids/sprites/asteroid_view');

require('./asteroids/sprites/asteroid_death_view');

require('./asteroids/sprites/bullet_view');

require('./asteroids/sprites/hud_view');

require('./asteroids/sprites/spaceship_death_view');

require('./asteroids/sprites/spaceship_view');

require('./asteroids/sprites/wait_for_start_view');

asteroids.components = (function() {
  function components() {}

  return components;

})();

require('./asteroids/components/animation');

require('./asteroids/components/asteroid');

require('./asteroids/components/audio');

require('./asteroids/components/bullet');

require('./asteroids/components/collision');

require('./asteroids/components/death_throes');

require('./asteroids/components/display');

require('./asteroids/components/game_state');

require('./asteroids/components/gun');

require('./asteroids/components/gun_controls');

require('./asteroids/components/hud');

require('./asteroids/components/motion');

require('./asteroids/components/motion_controls');

require('./asteroids/components/position');

require('./asteroids/components/spaceship');

require('./asteroids/components/wait_for_start');

asteroids.nodes = (function() {
  function nodes() {}

  return nodes;

})();

require('./asteroids/nodes/animation_node');

require('./asteroids/nodes/asteroid_collision_node');

require('./asteroids/nodes/audio_node');

require('./asteroids/nodes/bullet_age_node');

require('./asteroids/nodes/bullet_collision_node');

require('./asteroids/nodes/death_throes_node');

require('./asteroids/nodes/game_node');

require('./asteroids/nodes/gun_control_node');

require('./asteroids/nodes/hud_node');

require('./asteroids/nodes/motion_control_node');

require('./asteroids/nodes/movement_node');

require('./asteroids/nodes/render_node');

require('./asteroids/nodes/spaceship_collision_node');

require('./asteroids/nodes/spaceship_node');

require('./asteroids/nodes/wait_for_start_node');

asteroids.systems = (function() {
  function systems() {}

  return systems;

})();

require('./asteroids/systems/animation_system');

require('./asteroids/systems/audio_system');

require('./asteroids/systems/bullet_age_system');

require('./asteroids/systems/collision_system');

require('./asteroids/systems/death_throes_system');

require('./asteroids/systems/game_manager');

require('./asteroids/systems/gun_control_system');

require('./asteroids/systems/hud_system');

require('./asteroids/systems/motion_control_system');

require('./asteroids/systems/movement_system');

require('./asteroids/systems/render_system');

require('./asteroids/systems/system_priorities');

require('./asteroids/systems/wait_for_start_system');

require('./asteroids/entity_creator');

require('./asteroids/game_config');

require('./asteroids/asteroids');

require('./asteroids/main');

//# sourceMappingURL=index.js.map

},{"./asteroids/asteroids":1,"./asteroids/components/animation":2,"./asteroids/components/asteroid":3,"./asteroids/components/audio":4,"./asteroids/components/bullet":5,"./asteroids/components/collision":6,"./asteroids/components/death_throes":7,"./asteroids/components/display":8,"./asteroids/components/game_state":9,"./asteroids/components/gun":10,"./asteroids/components/gun_controls":11,"./asteroids/components/hud":12,"./asteroids/components/motion":13,"./asteroids/components/motion_controls":14,"./asteroids/components/position":15,"./asteroids/components/spaceship":16,"./asteroids/components/wait_for_start":17,"./asteroids/entity_creator":18,"./asteroids/game_config":19,"./asteroids/main":20,"./asteroids/nodes/animation_node":21,"./asteroids/nodes/asteroid_collision_node":22,"./asteroids/nodes/audio_node":23,"./asteroids/nodes/bullet_age_node":24,"./asteroids/nodes/bullet_collision_node":25,"./asteroids/nodes/death_throes_node":26,"./asteroids/nodes/game_node":27,"./asteroids/nodes/gun_control_node":28,"./asteroids/nodes/hud_node":29,"./asteroids/nodes/motion_control_node":30,"./asteroids/nodes/movement_node":31,"./asteroids/nodes/render_node":32,"./asteroids/nodes/spaceship_collision_node":33,"./asteroids/nodes/spaceship_node":34,"./asteroids/nodes/wait_for_start_node":35,"./asteroids/sprites/asteroid_death_view":36,"./asteroids/sprites/asteroid_view":37,"./asteroids/sprites/bullet_view":38,"./asteroids/sprites/hud_view":39,"./asteroids/sprites/spaceship_death_view":40,"./asteroids/sprites/spaceship_view":41,"./asteroids/sprites/wait_for_start_view":42,"./asteroids/systems/animation_system":43,"./asteroids/systems/audio_system":44,"./asteroids/systems/bullet_age_system":45,"./asteroids/systems/collision_system":46,"./asteroids/systems/death_throes_system":47,"./asteroids/systems/game_manager":48,"./asteroids/systems/gun_control_system":49,"./asteroids/systems/hud_system":50,"./asteroids/systems/motion_control_system":51,"./asteroids/systems/movement_system":52,"./asteroids/systems/render_system":53,"./asteroids/systems/system_priorities":54,"./asteroids/systems/wait_for_start_system":55,"./asteroids/ui/key_poll":56,"./asteroids/ui/point":57}]},{},[58])(58)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9hc3Rlcm9pZHMuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9jb21wb25lbnRzL2FuaW1hdGlvbi5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvYXN0ZXJvaWQuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9jb21wb25lbnRzL2F1ZGlvLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9idWxsZXQuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9jb21wb25lbnRzL2NvbGxpc2lvbi5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvZGVhdGhfdGhyb2VzLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9kaXNwbGF5LmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9nYW1lX3N0YXRlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9ndW4uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9jb21wb25lbnRzL2d1bl9jb250cm9scy5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvaHVkLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvY29tcG9uZW50cy9tb3Rpb24uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9jb21wb25lbnRzL21vdGlvbl9jb250cm9scy5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvcG9zaXRpb24uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9jb21wb25lbnRzL3NwYWNlc2hpcC5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2NvbXBvbmVudHMvd2FpdF9mb3Jfc3RhcnQuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9lbnRpdHlfY3JlYXRvci5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL2dhbWVfY29uZmlnLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvbWFpbi5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL25vZGVzL2FuaW1hdGlvbl9ub2RlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvbm9kZXMvYXN0ZXJvaWRfY29sbGlzaW9uX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9hdWRpb19ub2RlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvbm9kZXMvYnVsbGV0X2FnZV9ub2RlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvbm9kZXMvYnVsbGV0X2NvbGxpc2lvbl9ub2RlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvbm9kZXMvZGVhdGhfdGhyb2VzX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9nYW1lX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9ndW5fY29udHJvbF9ub2RlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvbm9kZXMvaHVkX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy9tb3Rpb25fY29udHJvbF9ub2RlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvbm9kZXMvbW92ZW1lbnRfbm9kZS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL25vZGVzL3JlbmRlcl9ub2RlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvbm9kZXMvc3BhY2VzaGlwX2NvbGxpc2lvbl9ub2RlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvbm9kZXMvc3BhY2VzaGlwX25vZGUuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9ub2Rlcy93YWl0X2Zvcl9zdGFydF9ub2RlLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3ByaXRlcy9hc3Rlcm9pZF9kZWF0aF92aWV3LmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3ByaXRlcy9hc3Rlcm9pZF92aWV3LmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3ByaXRlcy9idWxsZXRfdmlldy5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3Nwcml0ZXMvaHVkX3ZpZXcuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9zcHJpdGVzL3NwYWNlc2hpcF9kZWF0aF92aWV3LmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3ByaXRlcy9zcGFjZXNoaXBfdmlldy5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3Nwcml0ZXMvd2FpdF9mb3Jfc3RhcnRfdmlldy5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvYW5pbWF0aW9uX3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvYXVkaW9fc3lzdGVtLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3lzdGVtcy9idWxsZXRfYWdlX3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvY29sbGlzaW9uX3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvZGVhdGhfdGhyb2VzX3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvZ2FtZV9tYW5hZ2VyLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3lzdGVtcy9ndW5fY29udHJvbF9zeXN0ZW0uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9zeXN0ZW1zL2h1ZF9zeXN0ZW0uanMiLCJ0bXAvbGliL2FzdGVyb2lkcy9zeXN0ZW1zL21vdGlvbl9jb250cm9sX3N5c3RlbS5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvbW92ZW1lbnRfc3lzdGVtLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3lzdGVtcy9yZW5kZXJfc3lzdGVtLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvc3lzdGVtcy9zeXN0ZW1fcHJpb3JpdGllcy5qcyIsInRtcC9saWIvYXN0ZXJvaWRzL3N5c3RlbXMvd2FpdF9mb3Jfc3RhcnRfc3lzdGVtLmpzIiwidG1wL2xpYi9hc3Rlcm9pZHMvdWkva2V5X3BvbGwuanMiLCJ0bXAvbGliL2FzdGVyb2lkcy91aS9wb2ludC5qcyIsInRtcC9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcbnZhciBBbmltYXRpb25TeXN0ZW0sIEF1ZGlvU3lzdGVtLCBCdWxsZXRBZ2VTeXN0ZW0sIENvbGxpc2lvblN5c3RlbSwgRGVhdGhUaHJvZXNTeXN0ZW0sIEVudGl0eUNyZWF0b3IsIEdhbWVDb25maWcsIEdhbWVNYW5hZ2VyLCBHYW1lU3RhdGUsIEd1bkNvbnRyb2xTeXN0ZW0sIEh1ZFN5c3RlbSwgS2V5UG9sbCwgTW90aW9uQ29udHJvbFN5c3RlbSwgTW92ZW1lbnRTeXN0ZW0sIFBoeXNpY3NTeXN0ZW0sIFJlbmRlclN5c3RlbSwgU3lzdGVtUHJpb3JpdGllcywgV2FpdEZvclN0YXJ0U3lzdGVtLCBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2xpYicpO1xuXG5BbmltYXRpb25TeXN0ZW0gPSBhc3Rlcm9pZHMuc3lzdGVtcy5BbmltYXRpb25TeXN0ZW07XG5cbkF1ZGlvU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuQXVkaW9TeXN0ZW07XG5cbkJ1bGxldEFnZVN5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLkJ1bGxldEFnZVN5c3RlbTtcblxuQ29sbGlzaW9uU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuQ29sbGlzaW9uU3lzdGVtO1xuXG5EZWF0aFRocm9lc1N5c3RlbSA9IGFzdGVyb2lkcy5zeXN0ZW1zLkRlYXRoVGhyb2VzU3lzdGVtO1xuXG5HYW1lTWFuYWdlciA9IGFzdGVyb2lkcy5zeXN0ZW1zLkdhbWVNYW5hZ2VyO1xuXG5HdW5Db250cm9sU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuR3VuQ29udHJvbFN5c3RlbTtcblxuSHVkU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuSHVkU3lzdGVtO1xuXG5Nb3Rpb25Db250cm9sU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuTW90aW9uQ29udHJvbFN5c3RlbTtcblxuTW92ZW1lbnRTeXN0ZW0gPSBhc3Rlcm9pZHMuc3lzdGVtcy5Nb3ZlbWVudFN5c3RlbTtcblxuUmVuZGVyU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuUmVuZGVyU3lzdGVtO1xuXG5TeXN0ZW1Qcmlvcml0aWVzID0gYXN0ZXJvaWRzLnN5c3RlbXMuU3lzdGVtUHJpb3JpdGllcztcblxuV2FpdEZvclN0YXJ0U3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuV2FpdEZvclN0YXJ0U3lzdGVtO1xuXG5QaHlzaWNzU3lzdGVtID0gYXN0ZXJvaWRzLnN5c3RlbXMuUGh5c2ljc1N5c3RlbTtcblxuR2FtZVN0YXRlID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuR2FtZVN0YXRlO1xuXG5FbnRpdHlDcmVhdG9yID0gYXN0ZXJvaWRzLkVudGl0eUNyZWF0b3I7XG5cbkdhbWVDb25maWcgPSBhc3Rlcm9pZHMuR2FtZUNvbmZpZztcblxuS2V5UG9sbCA9IGFzdGVyb2lkcy51aS5LZXlQb2xsO1xuXG5cbi8qXG4gKiBNaW5pbWFsIEJveDJEIGludGVyZmFjZSBzdXBwb3J0ZWQgaW4gY29jb29uXG4gKi9cblxuYXN0ZXJvaWRzLkFzdGVyb2lkcyA9IChmdW5jdGlvbigpIHtcbiAgQXN0ZXJvaWRzLnByb3RvdHlwZS5jb250YWluZXIgPSBudWxsO1xuXG4gIEFzdGVyb2lkcy5wcm90b3R5cGUuZW5naW5lID0gbnVsbDtcblxuICBBc3Rlcm9pZHMucHJvdG90eXBlLnRpY2tQcm92aWRlciA9IG51bGw7XG5cbiAgQXN0ZXJvaWRzLnByb3RvdHlwZS5jcmVhdG9yID0gbnVsbDtcblxuICBBc3Rlcm9pZHMucHJvdG90eXBlLmtleVBvbGwgPSBudWxsO1xuXG4gIEFzdGVyb2lkcy5wcm90b3R5cGUuY29uZmlnID0gbnVsbDtcblxuICBmdW5jdGlvbiBBc3Rlcm9pZHMoY29udGFpbmVyLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5wcmVwYXJlKHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgQXN0ZXJvaWRzLnByb3RvdHlwZS5wcmVwYXJlID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMuZW5naW5lID0gbmV3IGFzaC5jb3JlLkVuZ2luZSgpO1xuICAgIHRoaXMuY3JlYXRvciA9IG5ldyBFbnRpdHlDcmVhdG9yKHRoaXMuZW5naW5lKTtcbiAgICB0aGlzLmtleVBvbGwgPSBuZXcgS2V5UG9sbCh3aW5kb3cpO1xuICAgIHRoaXMuY29uZmlnID0gbmV3IEdhbWVDb25maWcoKTtcbiAgICB0aGlzLmNvbmZpZy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy5jb25maWcud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IFdhaXRGb3JTdGFydFN5c3RlbSh0aGlzLmNyZWF0b3IpLCBTeXN0ZW1Qcmlvcml0aWVzLnByZVVwZGF0ZSk7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBHYW1lTWFuYWdlcih0aGlzLmNyZWF0b3IsIHRoaXMuY29uZmlnKSwgU3lzdGVtUHJpb3JpdGllcy5wcmVVcGRhdGUpO1xuICAgIHRoaXMuZW5naW5lLmFkZFN5c3RlbShuZXcgTW90aW9uQ29udHJvbFN5c3RlbSh0aGlzLmtleVBvbGwpLCBTeXN0ZW1Qcmlvcml0aWVzLnVwZGF0ZSk7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBHdW5Db250cm9sU3lzdGVtKHRoaXMua2V5UG9sbCwgdGhpcy5jcmVhdG9yKSwgU3lzdGVtUHJpb3JpdGllcy51cGRhdGUpO1xuICAgIHRoaXMuZW5naW5lLmFkZFN5c3RlbShuZXcgQnVsbGV0QWdlU3lzdGVtKHRoaXMuY3JlYXRvciksIFN5c3RlbVByaW9yaXRpZXMudXBkYXRlKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IERlYXRoVGhyb2VzU3lzdGVtKHRoaXMuY3JlYXRvciksIFN5c3RlbVByaW9yaXRpZXMudXBkYXRlKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IE1vdmVtZW50U3lzdGVtKHRoaXMuY29uZmlnKSwgU3lzdGVtUHJpb3JpdGllcy5tb3ZlKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IENvbGxpc2lvblN5c3RlbSh0aGlzLmNyZWF0b3IpLCBTeXN0ZW1Qcmlvcml0aWVzLnJlc29sdmVDb2xsaXNpb25zKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRTeXN0ZW0obmV3IEFuaW1hdGlvblN5c3RlbSgpLCBTeXN0ZW1Qcmlvcml0aWVzLmFuaW1hdGUpO1xuICAgIHRoaXMuZW5naW5lLmFkZFN5c3RlbShuZXcgSHVkU3lzdGVtKCksIFN5c3RlbVByaW9yaXRpZXMuYW5pbWF0ZSk7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBSZW5kZXJTeXN0ZW0odGhpcy5jb250YWluZXIpLCBTeXN0ZW1Qcmlvcml0aWVzLnJlbmRlcik7XG4gICAgdGhpcy5lbmdpbmUuYWRkU3lzdGVtKG5ldyBBdWRpb1N5c3RlbSgpLCBTeXN0ZW1Qcmlvcml0aWVzLnJlbmRlcik7XG4gICAgdGhpcy5jcmVhdG9yLmNyZWF0ZVdhaXRGb3JDbGljaygpO1xuICAgIHRoaXMuY3JlYXRvci5jcmVhdGVHYW1lKCk7XG4gIH07XG5cbiAgQXN0ZXJvaWRzLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGF0cywgeCwgeTtcbiAgICBpZiAobmF2aWdhdG9yLmlzQ29jb29uSlMpIHtcbiAgICAgIHN0YXRzID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgeCA9IE1hdGguZmxvb3IodGhpcy5jb25maWcud2lkdGggLyAyKSAtIDQwO1xuICAgICAgeSA9IDA7XG4gICAgICBzdGF0cyA9IG5ldyBTdGF0cygpO1xuICAgICAgc3RhdHMuc2V0TW9kZSgwKTtcbiAgICAgIHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICBzdGF0cy5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSBcIlwiICsgeCArIFwicHhcIjtcbiAgICAgIHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gXCJcIiArIHkgKyBcInB4XCI7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN0YXRzLmRvbUVsZW1lbnQpO1xuICAgIH1cbiAgICB0aGlzLnRpY2tQcm92aWRlciA9IG5ldyBhc2gudGljay5GcmFtZVRpY2tQcm92aWRlcihzdGF0cyk7XG4gICAgdGhpcy50aWNrUHJvdmlkZXIuYWRkKHRoaXMuZW5naW5lLnVwZGF0ZSk7XG4gICAgdGhpcy50aWNrUHJvdmlkZXIuc3RhcnQoKTtcbiAgfTtcblxuICByZXR1cm4gQXN0ZXJvaWRzO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hc3Rlcm9pZHMuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuQW5pbWF0aW9uID0gKGZ1bmN0aW9uKCkge1xuICBBbmltYXRpb24ucHJvdG90eXBlLmFuaW1hdGlvbiA9IG51bGw7XG5cbiAgZnVuY3Rpb24gQW5pbWF0aW9uKGFuaW1hdGlvbikge1xuICAgIHRoaXMuYW5pbWF0aW9uID0gYW5pbWF0aW9uO1xuICB9XG5cbiAgcmV0dXJuIEFuaW1hdGlvbjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YW5pbWF0aW9uLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLkFzdGVyb2lkID0gKGZ1bmN0aW9uKCkge1xuICBBc3Rlcm9pZC5wcm90b3R5cGUuZnNtID0gbnVsbDtcblxuICBmdW5jdGlvbiBBc3Rlcm9pZChmc20pIHtcbiAgICB0aGlzLmZzbSA9IGZzbTtcbiAgfVxuXG4gIHJldHVybiBBc3Rlcm9pZDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXN0ZXJvaWQuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuQXVkaW8gPSAoZnVuY3Rpb24oKSB7XG4gIEF1ZGlvLnByb3RvdHlwZS50b1BsYXkgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEF1ZGlvKCkge1xuICAgIHRoaXMudG9QbGF5ID0gW107XG4gIH1cblxuICBBdWRpby5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKHNvdW5kKSB7XG4gICAgcmV0dXJuIHRoaXMudG9QbGF5LnB1c2goc291bmQpO1xuICB9O1xuXG4gIHJldHVybiBBdWRpbztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXVkaW8uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuQnVsbGV0ID0gKGZ1bmN0aW9uKCkge1xuICBCdWxsZXQucHJvdG90eXBlLmxpZmVSZW1haW5pbmcgPSAwO1xuXG4gIGZ1bmN0aW9uIEJ1bGxldChsaWZlUmVtYWluaW5nKSB7XG4gICAgdGhpcy5saWZlUmVtYWluaW5nID0gbGlmZVJlbWFpbmluZztcbiAgfVxuXG4gIHJldHVybiBCdWxsZXQ7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1bGxldC5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5Db2xsaXNpb24gPSAoZnVuY3Rpb24oKSB7XG4gIENvbGxpc2lvbi5wcm90b3R5cGUucmFkaXVzID0gMDtcblxuICBmdW5jdGlvbiBDb2xsaXNpb24ocmFkaXVzKSB7XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG4gIH1cblxuICByZXR1cm4gQ29sbGlzaW9uO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb2xsaXNpb24uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuRGVhdGhUaHJvZXMgPSAoZnVuY3Rpb24oKSB7XG4gIERlYXRoVGhyb2VzLnByb3RvdHlwZS5jb3VudGRvd24gPSAwO1xuXG4gIGZ1bmN0aW9uIERlYXRoVGhyb2VzKGR1cmF0aW9uKSB7XG4gICAgdGhpcy5jb3VudGRvd24gPSBkdXJhdGlvbjtcbiAgfVxuXG4gIHJldHVybiBEZWF0aFRocm9lcztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVhdGhfdGhyb2VzLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLkRpc3BsYXkgPSAoZnVuY3Rpb24oKSB7XG4gIERpc3BsYXkucHJvdG90eXBlLmdyYXBoaWMgPSAwO1xuXG4gIGZ1bmN0aW9uIERpc3BsYXkoZ3JhcGhpYykge1xuICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWM7XG4gIH1cblxuICByZXR1cm4gRGlzcGxheTtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGlzcGxheS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5HYW1lU3RhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEdhbWVTdGF0ZSgpIHt9XG5cbiAgR2FtZVN0YXRlLnByb3RvdHlwZS5saXZlcyA9IDM7XG5cbiAgR2FtZVN0YXRlLnByb3RvdHlwZS5sZXZlbCA9IDA7XG5cbiAgR2FtZVN0YXRlLnByb3RvdHlwZS5oaXRzID0gMDtcblxuICBHYW1lU3RhdGUucHJvdG90eXBlLnBsYXlpbmcgPSBmYWxzZTtcblxuICBHYW1lU3RhdGUucHJvdG90eXBlLnNldEZvclN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5saXZlcyA9IDM7XG4gICAgdGhpcy5sZXZlbCA9IDA7XG4gICAgdGhpcy5oaXRzID0gMDtcbiAgICB0aGlzLnBsYXlpbmcgPSB0cnVlO1xuICB9O1xuXG4gIHJldHVybiBHYW1lU3RhdGU7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdhbWVfc3RhdGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgUG9pbnQsIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cblBvaW50ID0gYXN0ZXJvaWRzLnVpLlBvaW50O1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5HdW4gPSAoZnVuY3Rpb24oKSB7XG4gIEd1bi5wcm90b3R5cGUuc2hvb3RpbmcgPSBmYWxzZTtcblxuICBHdW4ucHJvdG90eXBlLm9mZnNldEZyb21QYXJlbnQgPSBudWxsO1xuXG4gIEd1bi5wcm90b3R5cGUudGltZVNpbmNlTGFzdFNob3QgPSAwO1xuXG4gIEd1bi5wcm90b3R5cGUub2Zmc2V0RnJvbVBhcmVudCA9IG51bGw7XG5cbiAgZnVuY3Rpb24gR3VuKG9mZnNldFgsIG9mZnNldFksIG1pbmltdW1TaG90SW50ZXJ2YWwsIGJ1bGxldExpZmV0aW1lKSB7XG4gICAgdGhpcy5taW5pbXVtU2hvdEludGVydmFsID0gbWluaW11bVNob3RJbnRlcnZhbDtcbiAgICB0aGlzLmJ1bGxldExpZmV0aW1lID0gYnVsbGV0TGlmZXRpbWU7XG4gICAgdGhpcy5zaG9vdGluZyA9IGZhbHNlO1xuICAgIHRoaXMub2Zmc2V0RnJvbVBhcmVudCA9IG51bGw7XG4gICAgdGhpcy50aW1lU2luY2VMYXN0U2hvdCA9IDA7XG4gICAgdGhpcy5vZmZzZXRGcm9tUGFyZW50ID0gbmV3IFBvaW50KG9mZnNldFgsIG9mZnNldFkpO1xuICB9XG5cbiAgcmV0dXJuIEd1bjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z3VuLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5jb21wb25lbnRzLkd1bkNvbnRyb2xzID0gKGZ1bmN0aW9uKCkge1xuICBHdW5Db250cm9scy5wcm90b3R5cGUudHJpZ2dlciA9IDA7XG5cbiAgZnVuY3Rpb24gR3VuQ29udHJvbHModHJpZ2dlcikge1xuICAgIHRoaXMudHJpZ2dlciA9IHRyaWdnZXI7XG4gIH1cblxuICByZXR1cm4gR3VuQ29udHJvbHM7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWd1bl9jb250cm9scy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5IdWQgPSAoZnVuY3Rpb24oKSB7XG4gIEh1ZC5wcm90b3R5cGUudmlldyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gSHVkKHZpZXcpIHtcbiAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICB9XG5cbiAgcmV0dXJuIEh1ZDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aHVkLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFBvaW50LCBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5Qb2ludCA9IGFzdGVyb2lkcy51aS5Qb2ludDtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuTW90aW9uID0gKGZ1bmN0aW9uKCkge1xuICBNb3Rpb24ucHJvdG90eXBlLnZlbG9jaXR5ID0gbnVsbDtcblxuICBNb3Rpb24ucHJvdG90eXBlLmFuZ3VsYXJWZWxvY2l0eSA9IDA7XG5cbiAgTW90aW9uLnByb3RvdHlwZS5kYW1waW5nID0gMDtcblxuICBmdW5jdGlvbiBNb3Rpb24odmVsb2NpdHlYLCB2ZWxvY2l0eVksIGFuZ3VsYXJWZWxvY2l0eSwgZGFtcGluZykge1xuICAgIHRoaXMuYW5ndWxhclZlbG9jaXR5ID0gYW5ndWxhclZlbG9jaXR5O1xuICAgIHRoaXMuZGFtcGluZyA9IGRhbXBpbmc7XG4gICAgdGhpcy52ZWxvY2l0eSA9IG5ldyBQb2ludCh2ZWxvY2l0eVgsIHZlbG9jaXR5WSk7XG4gIH1cblxuICByZXR1cm4gTW90aW9uO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tb3Rpb24uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuTW90aW9uQ29udHJvbHMgPSAoZnVuY3Rpb24oKSB7XG4gIE1vdGlvbkNvbnRyb2xzLnByb3RvdHlwZS5sZWZ0ID0gMDtcblxuICBNb3Rpb25Db250cm9scy5wcm90b3R5cGUucmlnaHQgPSAwO1xuXG4gIE1vdGlvbkNvbnRyb2xzLnByb3RvdHlwZS5hY2NlbGVyYXRlID0gMDtcblxuICBNb3Rpb25Db250cm9scy5wcm90b3R5cGUuYWNjZWxlcmF0aW9uUmF0ZSA9IDA7XG5cbiAgTW90aW9uQ29udHJvbHMucHJvdG90eXBlLnJvdGF0aW9uUmF0ZSA9IDA7XG5cbiAgZnVuY3Rpb24gTW90aW9uQ29udHJvbHMobGVmdCwgcmlnaHQsIGFjY2VsZXJhdGUsIGFjY2VsZXJhdGlvblJhdGUsIHJvdGF0aW9uUmF0ZSkge1xuICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgIHRoaXMuYWNjZWxlcmF0ZSA9IGFjY2VsZXJhdGU7XG4gICAgdGhpcy5hY2NlbGVyYXRpb25SYXRlID0gYWNjZWxlcmF0aW9uUmF0ZTtcbiAgICB0aGlzLnJvdGF0aW9uUmF0ZSA9IHJvdGF0aW9uUmF0ZTtcbiAgfVxuXG4gIHJldHVybiBNb3Rpb25Db250cm9scztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bW90aW9uX2NvbnRyb2xzLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFBvaW50LCBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5Qb2ludCA9IGFzdGVyb2lkcy51aS5Qb2ludDtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb24gPSAoZnVuY3Rpb24oKSB7XG4gIFBvc2l0aW9uLnByb3RvdHlwZS5wb3NpdGlvbiA9IG51bGw7XG5cbiAgUG9zaXRpb24ucHJvdG90eXBlLnJvdGF0aW9uID0gMDtcblxuICBmdW5jdGlvbiBQb3NpdGlvbih4LCB5LCByb3RhdGlvbikge1xuICAgIHRoaXMucm90YXRpb24gPSByb3RhdGlvbjtcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFBvaW50KHgsIHkpO1xuICB9XG5cbiAgcmV0dXJuIFBvc2l0aW9uO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wb3NpdGlvbi5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cy5TcGFjZXNoaXAgPSAoZnVuY3Rpb24oKSB7XG4gIFNwYWNlc2hpcC5wcm90b3R5cGUuZnNtID0gbnVsbDtcblxuICBmdW5jdGlvbiBTcGFjZXNoaXAoZnNtKSB7XG4gICAgdGhpcy5mc20gPSBmc207XG4gIH1cblxuICByZXR1cm4gU3BhY2VzaGlwO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcGFjZXNoaXAuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLmNvbXBvbmVudHMuV2FpdEZvclN0YXJ0ID0gKGZ1bmN0aW9uKCkge1xuICBXYWl0Rm9yU3RhcnQucHJvdG90eXBlLndhaXRGb3JTdGFydCA9IG51bGw7XG5cbiAgV2FpdEZvclN0YXJ0LnByb3RvdHlwZS5zdGFydEdhbWUgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBXYWl0Rm9yU3RhcnQod2FpdEZvclN0YXJ0KSB7XG4gICAgdGhpcy53YWl0Rm9yU3RhcnQgPSB3YWl0Rm9yU3RhcnQ7XG4gICAgdGhpcy5zZXRTdGFydEdhbWUgPSBfX2JpbmQodGhpcy5zZXRTdGFydEdhbWUsIHRoaXMpO1xuICAgIHRoaXMud2FpdEZvclN0YXJ0LmNsaWNrLmFkZCh0aGlzLnNldFN0YXJ0R2FtZSk7XG4gIH1cblxuICBXYWl0Rm9yU3RhcnQucHJvdG90eXBlLnNldFN0YXJ0R2FtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3RhcnRHYW1lID0gdHJ1ZTtcbiAgfTtcblxuICByZXR1cm4gV2FpdEZvclN0YXJ0O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD13YWl0X2Zvcl9zdGFydC5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBBbmltYXRpb24sIEFzdGVyb2lkLCBBc3Rlcm9pZERlYXRoVmlldywgQXN0ZXJvaWRWaWV3LCBBdWRpbywgQnVsbGV0LCBCdWxsZXRWaWV3LCBDb2xsaXNpb24sIERlYXRoVGhyb2VzLCBEaXNwbGF5LCBFbnRpdHksIEVudGl0eVN0YXRlTWFjaGluZSwgR2FtZVN0YXRlLCBHdW4sIEd1bkNvbnRyb2xzLCBIdWQsIEh1ZFZpZXcsIE1vdGlvbiwgTW90aW9uQ29udHJvbHMsIFBoeXNpY3MsIFBvc2l0aW9uLCBTcGFjZXNoaXAsIFNwYWNlc2hpcERlYXRoVmlldywgU3BhY2VzaGlwVmlldywgV2FpdEZvclN0YXJ0LCBXYWl0Rm9yU3RhcnRWaWV3LCBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2xpYicpO1xuXG5XYWl0Rm9yU3RhcnRWaWV3ID0gYXN0ZXJvaWRzLnNwcml0ZXMuV2FpdEZvclN0YXJ0VmlldztcblxuRW50aXR5ID0gYXNoLmNvcmUuRW50aXR5O1xuXG5FbnRpdHlTdGF0ZU1hY2hpbmUgPSBhc2guZnNtLkVudGl0eVN0YXRlTWFjaGluZTtcblxuXG4vKlxuICogQXN0ZXJvaWQgR2FtZSBDb21wb25lbnRzXG4gKi9cblxuQW5pbWF0aW9uID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuQW5pbWF0aW9uO1xuXG5Bc3Rlcm9pZCA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkFzdGVyb2lkO1xuXG5BdWRpbyA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkF1ZGlvO1xuXG5CdWxsZXQgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5CdWxsZXQ7XG5cbkNvbGxpc2lvbiA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkNvbGxpc2lvbjtcblxuRGVhdGhUaHJvZXMgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5EZWF0aFRocm9lcztcblxuRGlzcGxheSA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkRpc3BsYXk7XG5cbkdhbWVTdGF0ZSA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkdhbWVTdGF0ZTtcblxuR3VuID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuR3VuO1xuXG5HdW5Db250cm9scyA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkd1bkNvbnRyb2xzO1xuXG5IdWQgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5IdWQ7XG5cbk1vdGlvbiA9IGFzdGVyb2lkcy5jb21wb25lbnRzLk1vdGlvbjtcblxuTW90aW9uQ29udHJvbHMgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5Nb3Rpb25Db250cm9scztcblxuUGh5c2ljcyA9IGFzdGVyb2lkcy5jb21wb25lbnRzLlBoeXNpY3M7XG5cblBvc2l0aW9uID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb247XG5cblNwYWNlc2hpcCA9IGFzdGVyb2lkcy5jb21wb25lbnRzLlNwYWNlc2hpcDtcblxuV2FpdEZvclN0YXJ0ID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuV2FpdEZvclN0YXJ0O1xuXG5cbi8qXG4gKiBEcmF3YWJsZSBDb21wb25lbnRzXG4gKi9cblxuQXN0ZXJvaWREZWF0aFZpZXcgPSBhc3Rlcm9pZHMuc3ByaXRlcy5Bc3Rlcm9pZERlYXRoVmlldztcblxuQXN0ZXJvaWRWaWV3ID0gYXN0ZXJvaWRzLnNwcml0ZXMuQXN0ZXJvaWRWaWV3O1xuXG5CdWxsZXRWaWV3ID0gYXN0ZXJvaWRzLnNwcml0ZXMuQnVsbGV0VmlldztcblxuSHVkVmlldyA9IGFzdGVyb2lkcy5zcHJpdGVzLkh1ZFZpZXc7XG5cblNwYWNlc2hpcERlYXRoVmlldyA9IGFzdGVyb2lkcy5zcHJpdGVzLlNwYWNlc2hpcERlYXRoVmlldztcblxuU3BhY2VzaGlwVmlldyA9IGFzdGVyb2lkcy5zcHJpdGVzLlNwYWNlc2hpcFZpZXc7XG5cbmFzdGVyb2lkcy5FbnRpdHlDcmVhdG9yID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgS0VZX0xFRlQsIEtFWV9SSUdIVCwgS0VZX1VQLCBLRVlfWjtcblxuICBLRVlfTEVGVCA9IDM3O1xuXG4gIEtFWV9VUCA9IDM4O1xuXG4gIEtFWV9SSUdIVCA9IDM5O1xuXG4gIEtFWV9aID0gOTA7XG5cbiAgRW50aXR5Q3JlYXRvci5wcm90b3R5cGUuZW5naW5lID0gbnVsbDtcblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS53YWl0RW50aXR5ID0gbnVsbDtcblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS5ncmFwaGljID0gbnVsbDtcblxuICBmdW5jdGlvbiBFbnRpdHlDcmVhdG9yKGVuZ2luZSkge1xuICAgIHRoaXMuZW5naW5lID0gZW5naW5lO1xuICB9XG5cbiAgRW50aXR5Q3JlYXRvci5wcm90b3R5cGUuZGVzdHJveUVudGl0eSA9IGZ1bmN0aW9uKGVudGl0eSkge1xuICAgIHRoaXMuZW5naW5lLnJlbW92ZUVudGl0eShlbnRpdHkpO1xuICB9O1xuXG5cbiAgLypcbiAgICogR2FtZSBTdGF0ZVxuICAgKi9cblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS5jcmVhdGVHYW1lID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGdhbWVFbnRpdHksIGh1ZDtcbiAgICBodWQgPSBuZXcgSHVkVmlldygpO1xuICAgIGdhbWVFbnRpdHkgPSBuZXcgRW50aXR5KCdnYW1lJykuYWRkKG5ldyBHYW1lU3RhdGUoKSkuYWRkKG5ldyBIdWQoaHVkKSkuYWRkKG5ldyBEaXNwbGF5KGh1ZCkpLmFkZChuZXcgUG9zaXRpb24oMCwgMCwgMCwgMCkpO1xuICAgIHRoaXMuZW5naW5lLmFkZEVudGl0eShnYW1lRW50aXR5KTtcbiAgICByZXR1cm4gZ2FtZUVudGl0eTtcbiAgfTtcblxuXG4gIC8qXG4gICAqIFN0YXJ0Li4uXG4gICAqL1xuXG4gIEVudGl0eUNyZWF0b3IucHJvdG90eXBlLmNyZWF0ZVdhaXRGb3JDbGljayA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB3YWl0VmlldztcbiAgICBpZiAoIXRoaXMud2FpdEVudGl0eSkge1xuICAgICAgd2FpdFZpZXcgPSBuZXcgV2FpdEZvclN0YXJ0VmlldygpO1xuICAgICAgdGhpcy53YWl0RW50aXR5ID0gbmV3IEVudGl0eSgnd2FpdCcpLmFkZChuZXcgV2FpdEZvclN0YXJ0KHdhaXRWaWV3KSkuYWRkKG5ldyBEaXNwbGF5KHdhaXRWaWV3KSkuYWRkKG5ldyBQb3NpdGlvbigwLCAwLCAwLCAwKSk7XG4gICAgfVxuICAgIHRoaXMud2FpdEVudGl0eS5nZXQoV2FpdEZvclN0YXJ0KS5zdGFydEdhbWUgPSBmYWxzZTtcbiAgICB0aGlzLmVuZ2luZS5hZGRFbnRpdHkodGhpcy53YWl0RW50aXR5KTtcbiAgICByZXR1cm4gdGhpcy53YWl0RW50aXR5O1xuICB9O1xuXG5cbiAgLypcbiAgICogQ3JlYXRlIGFuIEFzdGVyb2lkIHdpdGggRlNNIEFuaW1hdGlvblxuICAgKi9cblxuICBFbnRpdHlDcmVhdG9yLnByb3RvdHlwZS5jcmVhdGVBc3Rlcm9pZCA9IGZ1bmN0aW9uKHJhZGl1cywgeCwgeSkge1xuICAgIHZhciBhc3Rlcm9pZCwgZGVhdGhWaWV3LCBmc207XG4gICAgYXN0ZXJvaWQgPSBuZXcgRW50aXR5KCk7XG4gICAgZnNtID0gbmV3IEVudGl0eVN0YXRlTWFjaGluZShhc3Rlcm9pZCk7XG4gICAgZnNtLmNyZWF0ZVN0YXRlKCdhbGl2ZScpLmFkZChNb3Rpb24pLndpdGhJbnN0YW5jZShuZXcgTW90aW9uKChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDQgKiAoNTAgLSByYWRpdXMpLCAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiA0ICogKDUwIC0gcmFkaXVzKSwgTWF0aC5yYW5kb20oKSAqIDIgLSAxLCAwKSkuYWRkKENvbGxpc2lvbikud2l0aEluc3RhbmNlKG5ldyBDb2xsaXNpb24ocmFkaXVzKSkuYWRkKERpc3BsYXkpLndpdGhJbnN0YW5jZShuZXcgRGlzcGxheShuZXcgQXN0ZXJvaWRWaWV3KHJhZGl1cykpKTtcbiAgICBkZWF0aFZpZXcgPSBuZXcgQXN0ZXJvaWREZWF0aFZpZXcocmFkaXVzKTtcbiAgICBmc20uY3JlYXRlU3RhdGUoJ2Rlc3Ryb3llZCcpLmFkZChEZWF0aFRocm9lcykud2l0aEluc3RhbmNlKG5ldyBEZWF0aFRocm9lcygzKSkuYWRkKERpc3BsYXkpLndpdGhJbnN0YW5jZShuZXcgRGlzcGxheShkZWF0aFZpZXcpKS5hZGQoQW5pbWF0aW9uKS53aXRoSW5zdGFuY2UobmV3IEFuaW1hdGlvbihkZWF0aFZpZXcpKTtcbiAgICBhc3Rlcm9pZC5hZGQobmV3IEFzdGVyb2lkKGZzbSkpLmFkZChuZXcgUG9zaXRpb24oeCwgeSwgMCkpLmFkZChuZXcgQXVkaW8oKSk7XG4gICAgZnNtLmNoYW5nZVN0YXRlKCdhbGl2ZScpO1xuICAgIHRoaXMuZW5naW5lLmFkZEVudGl0eShhc3Rlcm9pZCk7XG4gICAgcmV0dXJuIGFzdGVyb2lkO1xuICB9O1xuXG5cbiAgLypcbiAgICogQ3JlYXRlIFBsYXllciBTcGFjZXNoaXAgd2l0aCBGU00gQW5pbWF0aW9uXG4gICAqL1xuXG4gIEVudGl0eUNyZWF0b3IucHJvdG90eXBlLmNyZWF0ZVNwYWNlc2hpcCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZWF0aFZpZXcsIGZzbSwgc3BhY2VzaGlwO1xuICAgIHNwYWNlc2hpcCA9IG5ldyBFbnRpdHkoKTtcbiAgICBmc20gPSBuZXcgRW50aXR5U3RhdGVNYWNoaW5lKHNwYWNlc2hpcCk7XG4gICAgZnNtLmNyZWF0ZVN0YXRlKCdwbGF5aW5nJykuYWRkKE1vdGlvbikud2l0aEluc3RhbmNlKG5ldyBNb3Rpb24oMCwgMCwgMCwgMTUpKS5hZGQoTW90aW9uQ29udHJvbHMpLndpdGhJbnN0YW5jZShuZXcgTW90aW9uQ29udHJvbHMoS0VZX0xFRlQsIEtFWV9SSUdIVCwgS0VZX1VQLCAxMDAsIDMpKS5hZGQoR3VuKS53aXRoSW5zdGFuY2UobmV3IEd1big4LCAwLCAwLjMsIDIpKS5hZGQoR3VuQ29udHJvbHMpLndpdGhJbnN0YW5jZShuZXcgR3VuQ29udHJvbHMoS0VZX1opKS5hZGQoQ29sbGlzaW9uKS53aXRoSW5zdGFuY2UobmV3IENvbGxpc2lvbig5KSkuYWRkKERpc3BsYXkpLndpdGhJbnN0YW5jZShuZXcgRGlzcGxheShuZXcgU3BhY2VzaGlwVmlldygpKSk7XG4gICAgZGVhdGhWaWV3ID0gbmV3IFNwYWNlc2hpcERlYXRoVmlldygpO1xuICAgIGZzbS5jcmVhdGVTdGF0ZSgnZGVzdHJveWVkJykuYWRkKERlYXRoVGhyb2VzKS53aXRoSW5zdGFuY2UobmV3IERlYXRoVGhyb2VzKDUpKS5hZGQoRGlzcGxheSkud2l0aEluc3RhbmNlKG5ldyBEaXNwbGF5KGRlYXRoVmlldykpLmFkZChBbmltYXRpb24pLndpdGhJbnN0YW5jZShuZXcgQW5pbWF0aW9uKGRlYXRoVmlldykpO1xuICAgIHNwYWNlc2hpcC5hZGQobmV3IFNwYWNlc2hpcChmc20pKS5hZGQobmV3IFBvc2l0aW9uKDMwMCwgMjI1LCAwKSkuYWRkKG5ldyBBdWRpbygpKTtcbiAgICBmc20uY2hhbmdlU3RhdGUoJ3BsYXlpbmcnKTtcbiAgICB0aGlzLmVuZ2luZS5hZGRFbnRpdHkoc3BhY2VzaGlwKTtcbiAgICByZXR1cm4gc3BhY2VzaGlwO1xuICB9O1xuXG5cbiAgLypcbiAgICogQ3JlYXRlIGEgQnVsbGV0XG4gICAqL1xuXG4gIEVudGl0eUNyZWF0b3IucHJvdG90eXBlLmNyZWF0ZVVzZXJCdWxsZXQgPSBmdW5jdGlvbihndW4sIHBhcmVudFBvc2l0aW9uKSB7XG4gICAgdmFyIGJ1bGxldCwgY29zLCBzaW4sIHgsIHk7XG4gICAgY29zID0gTWF0aC5jb3MocGFyZW50UG9zaXRpb24ucm90YXRpb24pO1xuICAgIHNpbiA9IE1hdGguc2luKHBhcmVudFBvc2l0aW9uLnJvdGF0aW9uKTtcbiAgICB4ID0gY29zICogZ3VuLm9mZnNldEZyb21QYXJlbnQueCAtIHNpbiAqIGd1bi5vZmZzZXRGcm9tUGFyZW50LnkgKyBwYXJlbnRQb3NpdGlvbi5wb3NpdGlvbi54O1xuICAgIHkgPSBzaW4gKiBndW4ub2Zmc2V0RnJvbVBhcmVudC54ICsgY29zICogZ3VuLm9mZnNldEZyb21QYXJlbnQueSArIHBhcmVudFBvc2l0aW9uLnBvc2l0aW9uLnk7XG4gICAgYnVsbGV0ID0gbmV3IEVudGl0eSgpLmFkZChuZXcgQnVsbGV0KGd1bi5idWxsZXRMaWZldGltZSkpLmFkZChuZXcgUG9zaXRpb24oeCwgeSwgMCkpLmFkZChuZXcgQ29sbGlzaW9uKDApKS5hZGQobmV3IE1vdGlvbihjb3MgKiAxNTAsIHNpbiAqIDE1MCwgMCwgMCkpLmFkZChuZXcgRGlzcGxheShuZXcgQnVsbGV0VmlldygpKSk7XG4gICAgdGhpcy5lbmdpbmUuYWRkRW50aXR5KGJ1bGxldCk7XG4gICAgcmV0dXJuIGJ1bGxldDtcbiAgfTtcblxuICByZXR1cm4gRW50aXR5Q3JlYXRvcjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZW50aXR5X2NyZWF0b3IuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLkdhbWVDb25maWcgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEdhbWVDb25maWcoKSB7fVxuXG4gIEdhbWVDb25maWcucHJvdG90eXBlLndpZHRoID0gMDtcblxuICBHYW1lQ29uZmlnLnByb3RvdHlwZS5oZWlnaHQgPSAwO1xuXG4gIHJldHVybiBHYW1lQ29uZmlnO1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nYW1lX2NvbmZpZy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMuTWFpbiA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gTWFpbigpIHtcbiAgICB2YXIgY2FudmFzO1xuICAgIGNhbnZhcyA9IHRoaXMuY2FudmFzKCcjNkE1QUNEJyk7XG4gICAgYXN0ZXJvaWRzID0gbmV3IGFzdGVyb2lkcy5Bc3Rlcm9pZHMoY2FudmFzLmdldENvbnRleHQoJzJkJyksIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgYXN0ZXJvaWRzLnN0YXJ0KCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgTWFpbi5wcm90b3R5cGUuY2FudmFzID0gZnVuY3Rpb24oYmFja2dyb3VuZENvbG9yKSB7XG4gICAgdmFyIGNhbnZhcztcbiAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hdmlnYXRvci5pc0NvY29vbkpTID8gJ3NjcmVlbmNhbnZhcycgOiAnY2FudmFzJyk7XG4gICAgY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgY2FudmFzLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGJhY2tncm91bmRDb2xvcjtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgcmV0dXJuIGNhbnZhcztcbiAgfTtcblxuICByZXR1cm4gTWFpbjtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5BbmltYXRpb25Ob2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoQW5pbWF0aW9uTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBBbmltYXRpb25Ob2RlKCkge1xuICAgIHJldHVybiBBbmltYXRpb25Ob2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQW5pbWF0aW9uTm9kZS5jb21wb25lbnRzID0ge1xuICAgIGFuaW1hdGlvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQW5pbWF0aW9uXG4gIH07XG5cbiAgQW5pbWF0aW9uTm9kZS5wcm90b3R5cGUuYW5pbWF0aW9uID0gbnVsbDtcblxuICByZXR1cm4gQW5pbWF0aW9uTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFuaW1hdGlvbl9ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLm5vZGVzLkFzdGVyb2lkQ29sbGlzaW9uTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKEFzdGVyb2lkQ29sbGlzaW9uTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBBc3Rlcm9pZENvbGxpc2lvbk5vZGUoKSB7XG4gICAgcmV0dXJuIEFzdGVyb2lkQ29sbGlzaW9uTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEFzdGVyb2lkQ29sbGlzaW9uTm9kZS5jb21wb25lbnRzID0ge1xuICAgIGFzdGVyb2lkOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Bc3Rlcm9pZCxcbiAgICBwb3NpdGlvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb24sXG4gICAgY29sbGlzaW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Db2xsaXNpb24sXG4gICAgYXVkaW86IGFzdGVyb2lkcy5jb21wb25lbnRzLkF1ZGlvXG4gIH07XG5cbiAgQXN0ZXJvaWRDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5hc3Rlcm9pZCA9IG51bGw7XG5cbiAgQXN0ZXJvaWRDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5wb3NpdGlvbiA9IG51bGw7XG5cbiAgQXN0ZXJvaWRDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5jb2xsaXNpb24gPSBudWxsO1xuXG4gIEFzdGVyb2lkQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUuYXVkaW8gPSBudWxsO1xuXG4gIHJldHVybiBBc3Rlcm9pZENvbGxpc2lvbk5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hc3Rlcm9pZF9jb2xsaXNpb25fbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5BdWRpb05vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhBdWRpb05vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gQXVkaW9Ob2RlKCkge1xuICAgIHJldHVybiBBdWRpb05vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBBdWRpb05vZGUuY29tcG9uZW50cyA9IHtcbiAgICBhdWRpbzogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQXVkaW9cbiAgfTtcblxuICBBdWRpb05vZGUucHJvdG90eXBlLmF1ZGlvID0gbnVsbDtcblxuICByZXR1cm4gQXVkaW9Ob2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXVkaW9fbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5CdWxsZXRBZ2VOb2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoQnVsbGV0QWdlTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBCdWxsZXRBZ2VOb2RlKCkge1xuICAgIHJldHVybiBCdWxsZXRBZ2VOb2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQnVsbGV0QWdlTm9kZS5jb21wb25lbnRzID0ge1xuICAgIGJ1bGxldDogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQnVsbGV0XG4gIH07XG5cbiAgQnVsbGV0QWdlTm9kZS5wcm90b3R5cGUuYnVsbGV0ID0gbnVsbDtcblxuICByZXR1cm4gQnVsbGV0QWdlTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1bGxldF9hZ2Vfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5CdWxsZXRDb2xsaXNpb25Ob2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoQnVsbGV0Q29sbGlzaW9uTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBCdWxsZXRDb2xsaXNpb25Ob2RlKCkge1xuICAgIHJldHVybiBCdWxsZXRDb2xsaXNpb25Ob2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQnVsbGV0Q29sbGlzaW9uTm9kZS5jb21wb25lbnRzID0ge1xuICAgIGJ1bGxldDogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQnVsbGV0LFxuICAgIHBvc2l0aW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Qb3NpdGlvbixcbiAgICBjb2xsaXNpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLkNvbGxpc2lvblxuICB9O1xuXG4gIEJ1bGxldENvbGxpc2lvbk5vZGUucHJvdG90eXBlLmJ1bGxldCA9IG51bGw7XG5cbiAgQnVsbGV0Q29sbGlzaW9uTm9kZS5wcm90b3R5cGUucG9zaXRpb24gPSBudWxsO1xuXG4gIEJ1bGxldENvbGxpc2lvbk5vZGUucHJvdG90eXBlLmNvbGxpc2lvbiA9IG51bGw7XG5cbiAgcmV0dXJuIEJ1bGxldENvbGxpc2lvbk5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWxsZXRfY29sbGlzaW9uX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMubm9kZXMuRGVhdGhUaHJvZXNOb2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoRGVhdGhUaHJvZXNOb2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIERlYXRoVGhyb2VzTm9kZSgpIHtcbiAgICByZXR1cm4gRGVhdGhUaHJvZXNOb2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgRGVhdGhUaHJvZXNOb2RlLmNvbXBvbmVudHMgPSB7XG4gICAgZGVhdGg6IGFzdGVyb2lkcy5jb21wb25lbnRzLkRlYXRoVGhyb2VzXG4gIH07XG5cbiAgRGVhdGhUaHJvZXNOb2RlLnByb3RvdHlwZS5kZWF0aCA9IG51bGw7XG5cbiAgcmV0dXJuIERlYXRoVGhyb2VzTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlYXRoX3Rocm9lc19ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLm5vZGVzLkdhbWVOb2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoR2FtZU5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gR2FtZU5vZGUoKSB7XG4gICAgcmV0dXJuIEdhbWVOb2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgR2FtZU5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBzdGF0ZTogYXN0ZXJvaWRzLmNvbXBvbmVudHMuR2FtZVN0YXRlXG4gIH07XG5cbiAgR2FtZU5vZGUucHJvdG90eXBlLnN0YXRlID0gbnVsbDtcblxuICByZXR1cm4gR2FtZU5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nYW1lX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMubm9kZXMuR3VuQ29udHJvbE5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhHdW5Db250cm9sTm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBHdW5Db250cm9sTm9kZSgpIHtcbiAgICByZXR1cm4gR3VuQ29udHJvbE5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBHdW5Db250cm9sTm9kZS5jb21wb25lbnRzID0ge1xuICAgIGF1ZGlvOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5BdWRpbyxcbiAgICBjb250cm9sOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5HdW5Db250cm9scyxcbiAgICBndW46IGFzdGVyb2lkcy5jb21wb25lbnRzLkd1bixcbiAgICBwb3NpdGlvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb25cbiAgfTtcblxuICBHdW5Db250cm9sTm9kZS5wcm90b3R5cGUuY29udHJvbCA9IG51bGw7XG5cbiAgR3VuQ29udHJvbE5vZGUucHJvdG90eXBlLmd1biA9IG51bGw7XG5cbiAgR3VuQ29udHJvbE5vZGUucHJvdG90eXBlLnBvc2l0aW9uID0gbnVsbDtcblxuICBHdW5Db250cm9sTm9kZS5wcm90b3R5cGUuYXVkaW8gPSBudWxsO1xuXG4gIHJldHVybiBHdW5Db250cm9sTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWd1bl9jb250cm9sX25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMubm9kZXMuSHVkTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKEh1ZE5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gSHVkTm9kZSgpIHtcbiAgICByZXR1cm4gSHVkTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEh1ZE5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBzdGF0ZTogYXN0ZXJvaWRzLmNvbXBvbmVudHMuR2FtZVN0YXRlLFxuICAgIGh1ZDogYXN0ZXJvaWRzLmNvbXBvbmVudHMuSHVkXG4gIH07XG5cbiAgSHVkTm9kZS5wcm90b3R5cGUuc3RhdGUgPSBudWxsO1xuXG4gIEh1ZE5vZGUucHJvdG90eXBlLmh1ZCA9IG51bGw7XG5cbiAgcmV0dXJuIEh1ZE5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1odWRfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5Nb3Rpb25Db250cm9sTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKE1vdGlvbkNvbnRyb2xOb2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIE1vdGlvbkNvbnRyb2xOb2RlKCkge1xuICAgIHJldHVybiBNb3Rpb25Db250cm9sTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIE1vdGlvbkNvbnRyb2xOb2RlLmNvbXBvbmVudHMgPSB7XG4gICAgY29udHJvbDogYXN0ZXJvaWRzLmNvbXBvbmVudHMuTW90aW9uQ29udHJvbHMsXG4gICAgcG9zaXRpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uLFxuICAgIG1vdGlvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuTW90aW9uXG4gIH07XG5cbiAgTW90aW9uQ29udHJvbE5vZGUucHJvdG90eXBlLmNvbnRyb2wgPSBudWxsO1xuXG4gIE1vdGlvbkNvbnRyb2xOb2RlLnByb3RvdHlwZS5wb3NpdGlvbiA9IG51bGw7XG5cbiAgTW90aW9uQ29udHJvbE5vZGUucHJvdG90eXBlLm1vdGlvbiA9IG51bGw7XG5cbiAgcmV0dXJuIE1vdGlvbkNvbnRyb2xOb2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bW90aW9uX2NvbnRyb2xfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5Nb3ZlbWVudE5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhNb3ZlbWVudE5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gTW92ZW1lbnROb2RlKCkge1xuICAgIHJldHVybiBNb3ZlbWVudE5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBNb3ZlbWVudE5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBwb3NpdGlvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb24sXG4gICAgbW90aW9uOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5Nb3Rpb25cbiAgfTtcblxuICBNb3ZlbWVudE5vZGUucHJvdG90eXBlLnBvc2l0aW9uID0gbnVsbDtcblxuICBNb3ZlbWVudE5vZGUucHJvdG90eXBlLm1vdGlvbiA9IG51bGw7XG5cbiAgcmV0dXJuIE1vdmVtZW50Tm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1vdmVtZW50X25vZGUuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMubm9kZXMuUmVuZGVyTm9kZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKFJlbmRlck5vZGUsIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gUmVuZGVyTm9kZSgpIHtcbiAgICByZXR1cm4gUmVuZGVyTm9kZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFJlbmRlck5vZGUuY29tcG9uZW50cyA9IHtcbiAgICBwb3NpdGlvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuUG9zaXRpb24sXG4gICAgZGlzcGxheTogYXN0ZXJvaWRzLmNvbXBvbmVudHMuRGlzcGxheVxuICB9O1xuXG4gIFJlbmRlck5vZGUucHJvdG90eXBlLnBvc2l0aW9uID0gbnVsbDtcblxuICBSZW5kZXJOb2RlLnByb3RvdHlwZS5kaXNwbGF5ID0gbnVsbDtcblxuICByZXR1cm4gUmVuZGVyTm9kZTtcblxufSkoYXNoLmNvcmUuTm9kZSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlbmRlcl9ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLm5vZGVzLlNwYWNlc2hpcENvbGxpc2lvbk5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhTcGFjZXNoaXBDb2xsaXNpb25Ob2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIFNwYWNlc2hpcENvbGxpc2lvbk5vZGUoKSB7XG4gICAgcmV0dXJuIFNwYWNlc2hpcENvbGxpc2lvbk5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBTcGFjZXNoaXBDb2xsaXNpb25Ob2RlLmNvbXBvbmVudHMgPSB7XG4gICAgc3BhY2VzaGlwOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5TcGFjZXNoaXAsXG4gICAgcG9zaXRpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uLFxuICAgIGNvbGxpc2lvbjogYXN0ZXJvaWRzLmNvbXBvbmVudHMuQ29sbGlzaW9uLFxuICAgIGF1ZGlvOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5BdWRpb1xuICB9O1xuXG4gIFNwYWNlc2hpcENvbGxpc2lvbk5vZGUucHJvdG90eXBlLnNwYWNlc2hpcCA9IDA7XG5cbiAgU3BhY2VzaGlwQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUucG9zaXRpb24gPSAwO1xuXG4gIFNwYWNlc2hpcENvbGxpc2lvbk5vZGUucHJvdG90eXBlLmNvbGxpc2lvbiA9IG51bGw7XG5cbiAgU3BhY2VzaGlwQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUuYXVkaW8gPSBudWxsO1xuXG4gIHJldHVybiBTcGFjZXNoaXBDb2xsaXNpb25Ob2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3BhY2VzaGlwX2NvbGxpc2lvbl9ub2RlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcyxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLm5vZGVzLlNwYWNlc2hpcE5vZGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhTcGFjZXNoaXBOb2RlLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIFNwYWNlc2hpcE5vZGUoKSB7XG4gICAgcmV0dXJuIFNwYWNlc2hpcE5vZGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBTcGFjZXNoaXBOb2RlLmNvbXBvbmVudHMgPSB7XG4gICAgc3BhY2VzaGlwOiBhc3Rlcm9pZHMuY29tcG9uZW50cy5TcGFjZXNoaXAsXG4gICAgcG9zaXRpb246IGFzdGVyb2lkcy5jb21wb25lbnRzLlBvc2l0aW9uXG4gIH07XG5cbiAgU3BhY2VzaGlwTm9kZS5wcm90b3R5cGUuc3BhY2VzaGlwID0gMDtcblxuICBTcGFjZXNoaXBOb2RlLnByb3RvdHlwZS5wb3NpdGlvbiA9IDA7XG5cbiAgcmV0dXJuIFNwYWNlc2hpcE5vZGU7XG5cbn0pKGFzaC5jb3JlLk5vZGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcGFjZXNoaXBfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5ub2Rlcy5XYWl0Rm9yU3RhcnROb2RlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoV2FpdEZvclN0YXJ0Tm9kZSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBXYWl0Rm9yU3RhcnROb2RlKCkge1xuICAgIHJldHVybiBXYWl0Rm9yU3RhcnROb2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgV2FpdEZvclN0YXJ0Tm9kZS5jb21wb25lbnRzID0ge1xuICAgIHdhaXQ6IGFzdGVyb2lkcy5jb21wb25lbnRzLldhaXRGb3JTdGFydFxuICB9O1xuXG4gIFdhaXRGb3JTdGFydE5vZGUucHJvdG90eXBlLndhaXQgPSBudWxsO1xuXG4gIHJldHVybiBXYWl0Rm9yU3RhcnROb2RlO1xuXG59KShhc2guY29yZS5Ob2RlKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2FpdF9mb3Jfc3RhcnRfbm9kZS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBEb3QsIFBvaW50LCBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5Qb2ludCA9IGFzdGVyb2lkcy51aS5Qb2ludDtcblxuYXN0ZXJvaWRzLnNwcml0ZXMuQXN0ZXJvaWREZWF0aFZpZXcgPSAoZnVuY3Rpb24oKSB7XG4gIEFzdGVyb2lkRGVhdGhWaWV3LnByb3RvdHlwZS54ID0gMDtcblxuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUueSA9IDA7XG5cbiAgQXN0ZXJvaWREZWF0aFZpZXcucHJvdG90eXBlLnJvdGF0aW9uID0gMDtcblxuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUucmFkaXVzID0gMDtcblxuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUucG9pbnRzID0gbnVsbDtcblxuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUuZmlyc3QgPSB0cnVlO1xuXG4gIEFzdGVyb2lkRGVhdGhWaWV3LnByb3RvdHlwZS5kb3RzID0gbnVsbDtcblxuICBmdW5jdGlvbiBBc3Rlcm9pZERlYXRoVmlldyhyYWRpdXMpIHtcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICB0aGlzLmRyYXcgPSBfX2JpbmQodGhpcy5kcmF3LCB0aGlzKTtcbiAgICB0aGlzLmRvdHMgPSBbXTtcbiAgfVxuXG4gIEFzdGVyb2lkRGVhdGhWaWV3LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gICAgdmFyIGRvdCwgX2ksIF9sZW4sIF9yZWYsIF9yZXN1bHRzO1xuICAgIF9yZWYgPSB0aGlzLmRvdHM7XG4gICAgX3Jlc3VsdHMgPSBbXTtcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIGRvdCA9IF9yZWZbX2ldO1xuICAgICAgX3Jlc3VsdHMucHVzaChkb3QuZHJhdyhjdHgsIHRoaXMueCwgdGhpcy55KSk7XG4gICAgfVxuICAgIHJldHVybiBfcmVzdWx0cztcbiAgfTtcblxuICBBc3Rlcm9pZERlYXRoVmlldy5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgZG90LCBpLCBfaSwgX2osIF9sZW4sIF9yZWYsIF9yZXN1bHRzO1xuICAgIGlmICh0aGlzLmZpcnN0KSB7XG4gICAgICB0aGlzLmZpcnN0ID0gZmFsc2U7XG4gICAgICBmb3IgKGkgPSBfaSA9IDA7IF9pIDwgODsgaSA9ICsrX2kpIHtcbiAgICAgICAgZG90ID0gbmV3IERvdCh0aGlzLnJhZGl1cyk7XG4gICAgICAgIHRoaXMuZG90cy5wdXNoKGRvdCk7XG4gICAgICB9XG4gICAgfVxuICAgIF9yZWYgPSB0aGlzLmRvdHM7XG4gICAgX3Jlc3VsdHMgPSBbXTtcbiAgICBmb3IgKF9qID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaiA8IF9sZW47IF9qKyspIHtcbiAgICAgIGRvdCA9IF9yZWZbX2pdO1xuICAgICAgZG90LnggKz0gZG90LnZlbG9jaXR5LnggKiB0aW1lO1xuICAgICAgX3Jlc3VsdHMucHVzaChkb3QueSArPSBkb3QudmVsb2NpdHkueSAqIHRpbWUpO1xuICAgIH1cbiAgICByZXR1cm4gX3Jlc3VsdHM7XG4gIH07XG5cbiAgcmV0dXJuIEFzdGVyb2lkRGVhdGhWaWV3O1xuXG59KSgpO1xuXG5Eb3QgPSAoZnVuY3Rpb24oKSB7XG4gIERvdC5wcm90b3R5cGUudmVsb2NpdHkgPSBudWxsO1xuXG4gIERvdC5wcm90b3R5cGUueCA9IDA7XG5cbiAgRG90LnByb3RvdHlwZS55ID0gMDtcblxuICBmdW5jdGlvbiBEb3QobWF4RGlzdGFuY2UpIHtcbiAgICB2YXIgYW5nbGUsIGRpc3RhbmNlLCBzcGVlZDtcbiAgICBhbmdsZSA9IE1hdGgucmFuZG9tKCkgKiAyICogTWF0aC5QSTtcbiAgICBkaXN0YW5jZSA9IE1hdGgucmFuZG9tKCkgKiBtYXhEaXN0YW5jZTtcbiAgICB0aGlzLnggPSBNYXRoLmNvcyhhbmdsZSkgKiBkaXN0YW5jZTtcbiAgICB0aGlzLnkgPSBNYXRoLnNpbihhbmdsZSkgKiBkaXN0YW5jZTtcbiAgICBzcGVlZCA9IE1hdGgucmFuZG9tKCkgKiAxMCArIDEwO1xuICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgUG9pbnQoTWF0aC5jb3MoYW5nbGUpICogc3BlZWQsIE1hdGguc2luKGFuZ2xlKSAqIHNwZWVkKTtcbiAgfVxuXG4gIERvdC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCwgeCwgeSkge1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC50cmFuc2xhdGUoeCwgeSk7XG4gICAgY3R4LnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcbiAgICBjdHguZmlsbFN0eWxlID0gXCIjRkZGRkZGXCI7XG4gICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgMiwgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH07XG5cbiAgcmV0dXJuIERvdDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXN0ZXJvaWRfZGVhdGhfdmlldy5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMuc3ByaXRlcy5Bc3Rlcm9pZFZpZXcgPSAoZnVuY3Rpb24oKSB7XG4gIEFzdGVyb2lkVmlldy5wcm90b3R5cGUueCA9IDA7XG5cbiAgQXN0ZXJvaWRWaWV3LnByb3RvdHlwZS55ID0gMDtcblxuICBBc3Rlcm9pZFZpZXcucHJvdG90eXBlLnJvdGF0aW9uID0gMDtcblxuICBBc3Rlcm9pZFZpZXcucHJvdG90eXBlLnJhZGl1cyA9IDA7XG5cbiAgQXN0ZXJvaWRWaWV3LnByb3RvdHlwZS5wb2ludHMgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIEFzdGVyb2lkVmlldyhyYWRpdXMpIHtcbiAgICB2YXIgYW5nbGUsIGxlbmd0aCwgcG9zWCwgcG9zWTtcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICB0aGlzLmRyYXcgPSBfX2JpbmQodGhpcy5kcmF3LCB0aGlzKTtcbiAgICB0aGlzLndpZHRoID0gdGhpcy5yYWRpdXM7XG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLnJhZGl1cztcbiAgICB0aGlzLnBvaW50cyA9IFtdO1xuICAgIGFuZ2xlID0gMDtcbiAgICB3aGlsZSAoYW5nbGUgPCBNYXRoLlBJICogMikge1xuICAgICAgbGVuZ3RoID0gKDAuNzUgKyBNYXRoLnJhbmRvbSgpICogMC4yNSkgKiB0aGlzLnJhZGl1cztcbiAgICAgIHBvc1ggPSBNYXRoLmNvcyhhbmdsZSkgKiBsZW5ndGg7XG4gICAgICBwb3NZID0gTWF0aC5zaW4oYW5nbGUpICogbGVuZ3RoO1xuICAgICAgdGhpcy5wb2ludHMucHVzaCh7XG4gICAgICAgIHg6IHBvc1gsXG4gICAgICAgIHk6IHBvc1lcbiAgICAgIH0pO1xuICAgICAgYW5nbGUgKz0gTWF0aC5yYW5kb20oKSAqIDAuNTtcbiAgICB9XG4gIH1cblxuICBBc3Rlcm9pZFZpZXcucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgICB2YXIgaTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgudHJhbnNsYXRlKHRoaXMueCwgdGhpcy55KTtcbiAgICBjdHgucm90YXRlKHRoaXMucm90YXRpb24pO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcIiNGRkZGRkZcIjtcbiAgICBjdHgubW92ZVRvKHRoaXMucmFkaXVzLCAwKTtcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHRoaXMucG9pbnRzLmxlbmd0aCkge1xuICAgICAgY3R4LmxpbmVUbyh0aGlzLnBvaW50c1tpXS54LCB0aGlzLnBvaW50c1tpXS55KTtcbiAgICAgICsraTtcbiAgICB9XG4gICAgY3R4LmxpbmVUbyh0aGlzLnJhZGl1cywgMCk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9O1xuXG4gIHJldHVybiBBc3Rlcm9pZFZpZXc7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFzdGVyb2lkX3ZpZXcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLnNwcml0ZXMuQnVsbGV0VmlldyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQnVsbGV0VmlldygpIHtcbiAgICB0aGlzLmRyYXcgPSBfX2JpbmQodGhpcy5kcmF3LCB0aGlzKTtcbiAgfVxuXG4gIEJ1bGxldFZpZXcucHJvdG90eXBlLnggPSAwO1xuXG4gIEJ1bGxldFZpZXcucHJvdG90eXBlLnkgPSAwO1xuXG4gIEJ1bGxldFZpZXcucHJvdG90eXBlLnJvdGF0aW9uID0gMDtcblxuICBCdWxsZXRWaWV3LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcbiAgICBjdHguZmlsbFN0eWxlID0gXCIjRkZGRkZGXCI7XG4gICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgMiwgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH07XG5cbiAgcmV0dXJuIEJ1bGxldFZpZXc7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1bGxldF92aWV3LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy5zcHJpdGVzLkh1ZFZpZXcgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEh1ZFZpZXcoKSB7XG4gICAgdGhpcy5kcmF3ID0gX19iaW5kKHRoaXMuZHJhdywgdGhpcyk7XG4gICAgdGhpcy5zZXRTY29yZSA9IF9fYmluZCh0aGlzLnNldFNjb3JlLCB0aGlzKTtcbiAgICB0aGlzLnNldExpdmVzID0gX19iaW5kKHRoaXMuc2V0TGl2ZXMsIHRoaXMpO1xuICB9XG5cbiAgSHVkVmlldy5wcm90b3R5cGUueCA9IDA7XG5cbiAgSHVkVmlldy5wcm90b3R5cGUueSA9IDA7XG5cbiAgSHVkVmlldy5wcm90b3R5cGUucm90YXRpb24gPSAwO1xuXG4gIEh1ZFZpZXcucHJvdG90eXBlLnNjb3JlID0gMDtcblxuICBIdWRWaWV3LnByb3RvdHlwZS5saXZlcyA9IDM7XG5cbiAgSHVkVmlldy5wcm90b3R5cGUuc2V0TGl2ZXMgPSBmdW5jdGlvbihsaXZlcykge1xuICAgIHRoaXMubGl2ZXMgPSBsaXZlcztcbiAgfTtcblxuICBIdWRWaWV3LnByb3RvdHlwZS5zZXRTY29yZSA9IGZ1bmN0aW9uKHNjb3JlKSB7XG4gICAgdGhpcy5zY29yZSA9IHNjb3JlO1xuICB9O1xuXG4gIEh1ZFZpZXcucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgICB2YXIgbCwgcywgeCwgeTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZm9udCA9ICdib2xkIDE4cHggb3BlbmR5c2xleGljJztcbiAgICBjdHguZmlsbFN0eWxlID0gJyMwMEZGRkYnO1xuICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICBzID0gXCJMSVZFUzogXCIgKyB0aGlzLmxpdmVzO1xuICAgIGwgPSBjdHgubWVhc3VyZVRleHQocyk7XG4gICAgeCA9IGwud2lkdGg7XG4gICAgeSA9IDIwO1xuICAgIGN0eC5maWxsVGV4dChzLCB4LCB5KTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmZvbnQgPSAnYm9sZCAxOHB4IG9wZW5keXNsZXhpYyc7XG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjMDBGRkZGJztcbiAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgcyA9IFwiU0NPUkU6IFwiICsgdGhpcy5zY29yZTtcbiAgICBsID0gY3R4Lm1lYXN1cmVUZXh0KHMpO1xuICAgIHggPSAod2luZG93LndpbmRvdy5pbm5lcldpZHRoICogd2luZG93LmRldmljZVBpeGVsUmF0aW8pIC0gbC53aWR0aDtcbiAgICB5ID0gMjA7XG4gICAgY3R4LmZpbGxUZXh0KHMsIHgsIHkpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfTtcblxuICByZXR1cm4gSHVkVmlldztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aHVkX3ZpZXcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgUG9pbnQsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cblBvaW50ID0gYXN0ZXJvaWRzLnVpLlBvaW50O1xuXG5hc3Rlcm9pZHMuc3ByaXRlcy5TcGFjZXNoaXBEZWF0aFZpZXcgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFNwYWNlc2hpcERlYXRoVmlldygpIHtcbiAgICB0aGlzLmRyYXcgPSBfX2JpbmQodGhpcy5kcmF3LCB0aGlzKTtcbiAgfVxuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUueCA9IDA7XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS55ID0gMDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLnJvdGF0aW9uID0gMDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLnZlbDEgPSBudWxsO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUudmVsMiA9IG51bGw7XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS5yb3QxID0gbnVsbDtcblxuICBTcGFjZXNoaXBEZWF0aFZpZXcucHJvdG90eXBlLnJvdDIgPSBudWxsO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUueDEgPSAwO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUueTIgPSAwO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUueTEgPSAwO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUueTIgPSAwO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUuZmlyc3QgPSB0cnVlO1xuXG4gIFNwYWNlc2hpcERlYXRoVmlldy5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICBpZiAodGhpcy5maXJzdCkge1xuICAgICAgdGhpcy5maXJzdCA9IGZhbHNlO1xuICAgICAgdGhpcy52ZWwxID0gbmV3IFBvaW50KE1hdGgucmFuZG9tKCkgKiAxMCAtIDUsIE1hdGgucmFuZG9tKCkgKiAxMCArIDEwKTtcbiAgICAgIHRoaXMudmVsMiA9IG5ldyBQb2ludChNYXRoLnJhbmRvbSgpICogMTAgLSA1LCAtKE1hdGgucmFuZG9tKCkgKiAxMCArIDEwKSk7XG4gICAgICB0aGlzLnJvdDEgPSBNYXRoLnJhbmRvbSgpICogMzAwIC0gMTUwO1xuICAgICAgdGhpcy5yb3QyID0gTWF0aC5yYW5kb20oKSAqIDMwMCAtIDE1MDtcbiAgICAgIHRoaXMueDEgPSB0aGlzLngyID0gdGhpcy54O1xuICAgICAgdGhpcy55MSA9IHRoaXMueTIgPSB0aGlzLnk7XG4gICAgICB0aGlzLnIxID0gdGhpcy5yMiA9IHRoaXMucm90YXRpb247XG4gICAgfVxuICAgIHRoaXMueDEgKz0gdGhpcy52ZWwxLnggKiB0aW1lO1xuICAgIHRoaXMueTEgKz0gdGhpcy52ZWwxLnkgKiB0aW1lO1xuICAgIHRoaXMucjEgKz0gdGhpcy5yb3QxICogdGltZTtcbiAgICB0aGlzLngyICs9IHRoaXMudmVsMi54ICogdGltZTtcbiAgICB0aGlzLnkyICs9IHRoaXMudmVsMi55ICogdGltZTtcbiAgICB0aGlzLnIyICs9IHRoaXMucm90MiAqIHRpbWU7XG4gIH07XG5cbiAgU3BhY2VzaGlwRGVhdGhWaWV3LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh0aGlzLnggKyB0aGlzLngxLCB0aGlzLnkgKyB0aGlzLnkxKTtcbiAgICBjdHgucm90YXRlKHRoaXMucjEpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcIiNGRkZGRkZcIjtcbiAgICBjdHgubW92ZVRvKDEwLCAwKTtcbiAgICBjdHgubGluZVRvKC03LCA3KTtcbiAgICBjdHgubGluZVRvKC00LCAwKTtcbiAgICBjdHgubGluZVRvKDEwLCAwKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh0aGlzLnggKyB0aGlzLngyLCB0aGlzLnkgKyB0aGlzLnkyKTtcbiAgICBjdHgucm90YXRlKHRoaXMucjIpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcIiNGRkZGRkZcIjtcbiAgICBjdHgubW92ZVRvKDEwLCAwKTtcbiAgICBjdHgubGluZVRvKC03LCA3KTtcbiAgICBjdHgubGluZVRvKC00LCAwKTtcbiAgICBjdHgubGluZVRvKDEwLCAwKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFNwYWNlc2hpcERlYXRoVmlldztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3BhY2VzaGlwX2RlYXRoX3ZpZXcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLnNwcml0ZXMuU3BhY2VzaGlwVmlldyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gU3BhY2VzaGlwVmlldygpIHtcbiAgICB0aGlzLmRyYXcgPSBfX2JpbmQodGhpcy5kcmF3LCB0aGlzKTtcbiAgfVxuXG4gIFNwYWNlc2hpcFZpZXcucHJvdG90eXBlLnggPSAwO1xuXG4gIFNwYWNlc2hpcFZpZXcucHJvdG90eXBlLnkgPSAwO1xuXG4gIFNwYWNlc2hpcFZpZXcucHJvdG90eXBlLnJvdGF0aW9uID0gMDtcblxuICBTcGFjZXNoaXBWaWV3LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh0aGlzLngsIHRoaXMueSk7XG4gICAgY3R4LnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcbiAgICBjdHguZmlsbFN0eWxlID0gXCIjRkZGRkZGXCI7XG4gICAgY3R4Lm1vdmVUbygxMCwgMCk7XG4gICAgY3R4LmxpbmVUbygtNywgNyk7XG4gICAgY3R4LmxpbmVUbygtNCwgMCk7XG4gICAgY3R4LmxpbmVUbygtNywgLTcpO1xuICAgIGN0eC5saW5lVG8oMTAsIDApO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfTtcblxuICByZXR1cm4gU3BhY2VzaGlwVmlldztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3BhY2VzaGlwX3ZpZXcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgU2lnbmFsMCwgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuU2lnbmFsMCA9IGFzaC5zaWduYWxzLlNpZ25hbDA7XG5cbmFzdGVyb2lkcy5zcHJpdGVzLldhaXRGb3JTdGFydFZpZXcgPSAoZnVuY3Rpb24oKSB7XG4gIFdhaXRGb3JTdGFydFZpZXcucHJvdG90eXBlLnggPSAwO1xuXG4gIFdhaXRGb3JTdGFydFZpZXcucHJvdG90eXBlLnkgPSAwO1xuXG4gIFdhaXRGb3JTdGFydFZpZXcucHJvdG90eXBlLnJvdGF0aW9uID0gMDtcblxuICBXYWl0Rm9yU3RhcnRWaWV3LnByb3RvdHlwZS5maXJzdCA9IHRydWU7XG5cbiAgV2FpdEZvclN0YXJ0Vmlldy5wcm90b3R5cGUuY2xpY2sgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIFdhaXRGb3JTdGFydFZpZXcoKSB7XG4gICAgdGhpcy5kcmF3ID0gX19iaW5kKHRoaXMuZHJhdywgdGhpcyk7XG4gICAgdGhpcy5jbGljayA9IG5ldyBTaWduYWwwKCk7XG4gIH1cblxuICBXYWl0Rm9yU3RhcnRWaWV3LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gICAgdmFyIGwsIHMsIHgsIHk7XG4gICAgaWYgKHRoaXMuZmlyc3QpIHtcbiAgICAgIHRoaXMuZmlyc3QgPSBmYWxzZTtcbiAgICAgIGN0eC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmNsaWNrLmRpc3BhdGNoKCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgfVxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5mb250ID0gJ2JvbGQgNDBweCBvcGVuZHlzbGV4aWMnO1xuICAgIGN0eC5maWxsU3R5bGUgPSAnI0ZGRkZGRic7XG4gICAgcyA9ICdBU1RFUk9JRFMnO1xuICAgIGwgPSBjdHgubWVhc3VyZVRleHQocyk7XG4gICAgeCA9IE1hdGguZmxvb3IoKCh3aW5kb3cuaW5uZXJXaWR0aCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSAtIGwud2lkdGgpIC8gMik7XG4gICAgeSA9IDE3NTtcbiAgICBjdHguZmlsbFRleHQocywgeCwgeSk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5mb250ID0gJ2JvbGQgMThweCBvcGVuZHlzbGV4aWMnO1xuICAgIGN0eC5maWxsU3R5bGUgPSAnI0ZGRkZGRic7XG4gICAgcyA9ICdDTElDSyBUTyBTVEFSVCc7XG4gICAgbCA9IGN0eC5tZWFzdXJlVGV4dChzKTtcbiAgICB4ID0gTWF0aC5mbG9vcigoKHdpbmRvdy5pbm5lcldpZHRoICogd2luZG93LmRldmljZVBpeGVsUmF0aW8pIC0gbC53aWR0aCkgLyAyKTtcbiAgICB5ID0gMjI1O1xuICAgIGN0eC5maWxsVGV4dChzLCB4LCB5KTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmZvbnQgPSAnYm9sZCAxNHB4IG9wZW5keXNsZXhpYyc7XG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjRkZGRkZGJztcbiAgICBzID0gJ1ogdG8gRmlyZSAgfiAgQXJyb3cgS2V5cyB0byBNb3ZlJztcbiAgICBsID0gY3R4Lm1lYXN1cmVUZXh0KHMpO1xuICAgIHggPSAxMDtcbiAgICB5ID0gd2luZG93LmlubmVySGVpZ2h0ICogd2luZG93LmRldmljZVBpeGVsUmF0aW8gLSAyMDtcbiAgICBjdHguZmlsbFRleHQocywgeCwgeSk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9O1xuXG4gIHJldHVybiBXYWl0Rm9yU3RhcnRWaWV3O1xuXG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD13YWl0X2Zvcl9zdGFydF92aWV3LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEFuaW1hdGlvbk5vZGUsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuQW5pbWF0aW9uTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5BbmltYXRpb25Ob2RlO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5BbmltYXRpb25TeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhBbmltYXRpb25TeXN0ZW0sIF9zdXBlcik7XG5cbiAgZnVuY3Rpb24gQW5pbWF0aW9uU3lzdGVtKCkge1xuICAgIHRoaXMudXBkYXRlTm9kZSA9IF9fYmluZCh0aGlzLnVwZGF0ZU5vZGUsIHRoaXMpO1xuICAgIEFuaW1hdGlvblN5c3RlbS5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBBbmltYXRpb25Ob2RlLCB0aGlzLnVwZGF0ZU5vZGUpO1xuICB9XG5cbiAgQW5pbWF0aW9uU3lzdGVtLnByb3RvdHlwZS51cGRhdGVOb2RlID0gZnVuY3Rpb24obm9kZSwgdGltZSkge1xuICAgIG5vZGUuYW5pbWF0aW9uLmFuaW1hdGlvbi5hbmltYXRlKHRpbWUpO1xuICB9O1xuXG4gIHJldHVybiBBbmltYXRpb25TeXN0ZW07XG5cbn0pKGFzaC50b29scy5MaXN0SXRlcmF0aW5nU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YW5pbWF0aW9uX3N5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBBdWRpb05vZGUsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuQXVkaW9Ob2RlID0gYXN0ZXJvaWRzLm5vZGVzLkF1ZGlvTm9kZTtcblxuYXN0ZXJvaWRzLnN5c3RlbXMuQXVkaW9TeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhBdWRpb1N5c3RlbSwgX3N1cGVyKTtcblxuICBmdW5jdGlvbiBBdWRpb1N5c3RlbSgpIHtcbiAgICB0aGlzLnVwZGF0ZU5vZGUgPSBfX2JpbmQodGhpcy51cGRhdGVOb2RlLCB0aGlzKTtcbiAgICBBdWRpb1N5c3RlbS5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBBdWRpb05vZGUsIHRoaXMudXBkYXRlTm9kZSk7XG4gIH1cblxuICBBdWRpb1N5c3RlbS5wcm90b3R5cGUudXBkYXRlTm9kZSA9IGZ1bmN0aW9uKG5vZGUsIHRpbWUpIHtcbiAgICB2YXIgZWFjaCwgc291bmQsIHR5cGUsIF9yZWY7XG4gICAgX3JlZiA9IG5vZGUuYXVkaW8udG9QbGF5O1xuICAgIGZvciAoZWFjaCBpbiBfcmVmKSB7XG4gICAgICB0eXBlID0gX3JlZltlYWNoXTtcbiAgICAgIHNvdW5kID0gbmV3IHR5cGUoKTtcbiAgICAgIHNvdW5kLnBsYXkoMCwgMSk7XG4gICAgfVxuICAgIG5vZGUuYXVkaW8udG9QbGF5Lmxlbmd0aCA9IDA7XG4gIH07XG5cbiAgcmV0dXJuIEF1ZGlvU3lzdGVtO1xuXG59KShhc2gudG9vbHMuTGlzdEl0ZXJhdGluZ1N5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWF1ZGlvX3N5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBCdWxsZXRBZ2VOb2RlLCBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbkJ1bGxldEFnZU5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuQnVsbGV0QWdlTm9kZTtcblxuYXN0ZXJvaWRzLnN5c3RlbXMuQnVsbGV0QWdlU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoQnVsbGV0QWdlU3lzdGVtLCBfc3VwZXIpO1xuXG4gIEJ1bGxldEFnZVN5c3RlbS5wcm90b3R5cGUuY3JlYXRvciA9IG51bGw7XG5cbiAgZnVuY3Rpb24gQnVsbGV0QWdlU3lzdGVtKGNyZWF0b3IpIHtcbiAgICB0aGlzLmNyZWF0b3IgPSBjcmVhdG9yO1xuICAgIHRoaXMudXBkYXRlTm9kZSA9IF9fYmluZCh0aGlzLnVwZGF0ZU5vZGUsIHRoaXMpO1xuICAgIEJ1bGxldEFnZVN5c3RlbS5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBCdWxsZXRBZ2VOb2RlLCB0aGlzLnVwZGF0ZU5vZGUpO1xuICB9XG5cbiAgQnVsbGV0QWdlU3lzdGVtLnByb3RvdHlwZS51cGRhdGVOb2RlID0gZnVuY3Rpb24obm9kZSwgdGltZSkge1xuICAgIHZhciBidWxsZXQ7XG4gICAgYnVsbGV0ID0gbm9kZS5idWxsZXQ7XG4gICAgYnVsbGV0LmxpZmVSZW1haW5pbmcgLT0gdGltZTtcbiAgICBpZiAoYnVsbGV0LmxpZmVSZW1haW5pbmcgPD0gMCkge1xuICAgICAgdGhpcy5jcmVhdG9yLmRlc3Ryb3lFbnRpdHkobm9kZS5lbnRpdHkpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gQnVsbGV0QWdlU3lzdGVtO1xuXG59KShhc2gudG9vbHMuTGlzdEl0ZXJhdGluZ1N5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1bGxldF9hZ2Vfc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEFuaW1hdGlvbiwgQXN0ZXJvaWQsIEFzdGVyb2lkQ29sbGlzaW9uTm9kZSwgQXVkaW8sIEJ1bGxldCwgQnVsbGV0Q29sbGlzaW9uTm9kZSwgQ29sbGlzaW9uLCBEZWF0aFRocm9lcywgRGlzcGxheSwgR2FtZU5vZGUsIEdhbWVTdGF0ZSwgR3VuLCBHdW5Db250cm9scywgSHVkLCBNb3Rpb24sIE1vdGlvbkNvbnRyb2xzLCBQaHlzaWNzLCBQb3NpdGlvbiwgU3BhY2VzaGlwLCBTcGFjZXNoaXBDb2xsaXNpb25Ob2RlLCBXYWl0Rm9yU3RhcnQsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuU3BhY2VzaGlwQ29sbGlzaW9uTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5TcGFjZXNoaXBDb2xsaXNpb25Ob2RlO1xuXG5Bc3Rlcm9pZENvbGxpc2lvbk5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuQXN0ZXJvaWRDb2xsaXNpb25Ob2RlO1xuXG5CdWxsZXRDb2xsaXNpb25Ob2RlID0gYXN0ZXJvaWRzLm5vZGVzLkJ1bGxldENvbGxpc2lvbk5vZGU7XG5cbkdhbWVOb2RlID0gYXN0ZXJvaWRzLm5vZGVzLkdhbWVOb2RlO1xuXG5BbmltYXRpb24gPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5BbmltYXRpb247XG5cbkFzdGVyb2lkID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuQXN0ZXJvaWQ7XG5cbkF1ZGlvID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuQXVkaW87XG5cbkJ1bGxldCA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkJ1bGxldDtcblxuQ29sbGlzaW9uID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuQ29sbGlzaW9uO1xuXG5EZWF0aFRocm9lcyA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkRlYXRoVGhyb2VzO1xuXG5EaXNwbGF5ID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuRGlzcGxheTtcblxuR2FtZVN0YXRlID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuR2FtZVN0YXRlO1xuXG5HdW4gPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5HdW47XG5cbkd1bkNvbnRyb2xzID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuR3VuQ29udHJvbHM7XG5cbkh1ZCA9IGFzdGVyb2lkcy5jb21wb25lbnRzLkh1ZDtcblxuTW90aW9uID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuTW90aW9uO1xuXG5Nb3Rpb25Db250cm9scyA9IGFzdGVyb2lkcy5jb21wb25lbnRzLk1vdGlvbkNvbnRyb2xzO1xuXG5QaHlzaWNzID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuUGh5c2ljcztcblxuUG9zaXRpb24gPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5Qb3NpdGlvbjtcblxuU3BhY2VzaGlwID0gYXN0ZXJvaWRzLmNvbXBvbmVudHMuU3BhY2VzaGlwO1xuXG5XYWl0Rm9yU3RhcnQgPSBhc3Rlcm9pZHMuY29tcG9uZW50cy5XYWl0Rm9yU3RhcnQ7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLkNvbGxpc2lvblN5c3RlbSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKENvbGxpc2lvblN5c3RlbSwgX3N1cGVyKTtcblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLmNyZWF0b3IgPSBudWxsO1xuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUuZ2FtZXMgPSBudWxsO1xuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUuc3BhY2VzaGlwcyA9IG51bGw7XG5cbiAgQ29sbGlzaW9uU3lzdGVtLnByb3RvdHlwZS5hc3Rlcm9pZHMgPSBudWxsO1xuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUuYnVsbGV0cyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gQ29sbGlzaW9uU3lzdGVtKGNyZWF0b3IpIHtcbiAgICB0aGlzLmNyZWF0b3IgPSBjcmVhdG9yO1xuICAgIHRoaXMudXBkYXRlID0gX19iaW5kKHRoaXMudXBkYXRlLCB0aGlzKTtcbiAgfVxuXG4gIENvbGxpc2lvblN5c3RlbS5wcm90b3R5cGUuYWRkVG9FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB0aGlzLmdhbWVzID0gZW5naW5lLmdldE5vZGVMaXN0KEdhbWVOb2RlKTtcbiAgICB0aGlzLnNwYWNlc2hpcHMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoU3BhY2VzaGlwQ29sbGlzaW9uTm9kZSk7XG4gICAgdGhpcy5hc3Rlcm9pZHMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoQXN0ZXJvaWRDb2xsaXNpb25Ob2RlKTtcbiAgICB0aGlzLmJ1bGxldHMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoQnVsbGV0Q29sbGlzaW9uTm9kZSk7XG4gIH07XG5cbiAgQ29sbGlzaW9uU3lzdGVtLnByb3RvdHlwZS5yZW1vdmVGcm9tRW5naW5lID0gZnVuY3Rpb24oZW5naW5lKSB7XG4gICAgdGhpcy5nYW1lcyA9IG51bGw7XG4gICAgdGhpcy5zcGFjZXNoaXBzID0gbnVsbDtcbiAgICB0aGlzLmFzdGVyb2lkcyA9IG51bGw7XG4gICAgdGhpcy5idWxsZXRzID0gbnVsbDtcbiAgfTtcblxuICBDb2xsaXNpb25TeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgYXN0ZXJvaWQsIGJ1bGxldCwgc3BhY2VzaGlwO1xuICAgIGJ1bGxldCA9IHRoaXMuYnVsbGV0cy5oZWFkO1xuICAgIHdoaWxlIChidWxsZXQpIHtcbiAgICAgIGFzdGVyb2lkID0gdGhpcy5hc3Rlcm9pZHMuaGVhZDtcbiAgICAgIHdoaWxlIChhc3Rlcm9pZCkge1xuICAgICAgICBpZiAoYXN0ZXJvaWQucG9zaXRpb24ucG9zaXRpb24uZGlzdGFuY2VUbyhidWxsZXQucG9zaXRpb24ucG9zaXRpb24pIDw9IGFzdGVyb2lkLmNvbGxpc2lvbi5yYWRpdXMpIHtcblxuICAgICAgICAgIC8qXG4gICAgICAgICAgIFlvdSBoaXQgYW4gYXN0ZXJvaWRcbiAgICAgICAgICAgKi9cbiAgICAgICAgICB0aGlzLmNyZWF0b3IuZGVzdHJveUVudGl0eShidWxsZXQuZW50aXR5KTtcbiAgICAgICAgICBpZiAoYXN0ZXJvaWQuY29sbGlzaW9uLnJhZGl1cyA+IDEwKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0b3IuY3JlYXRlQXN0ZXJvaWQoYXN0ZXJvaWQuY29sbGlzaW9uLnJhZGl1cyAtIDEwLCBhc3Rlcm9pZC5wb3NpdGlvbi5wb3NpdGlvbi54ICsgTWF0aC5yYW5kb20oKSAqIDEwIC0gNSwgYXN0ZXJvaWQucG9zaXRpb24ucG9zaXRpb24ueSArIE1hdGgucmFuZG9tKCkgKiAxMCAtIDUpO1xuICAgICAgICAgICAgdGhpcy5jcmVhdG9yLmNyZWF0ZUFzdGVyb2lkKGFzdGVyb2lkLmNvbGxpc2lvbi5yYWRpdXMgLSAxMCwgYXN0ZXJvaWQucG9zaXRpb24ucG9zaXRpb24ueCArIE1hdGgucmFuZG9tKCkgKiAxMCAtIDUsIGFzdGVyb2lkLnBvc2l0aW9uLnBvc2l0aW9uLnkgKyBNYXRoLnJhbmRvbSgpICogMTAgLSA1KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYXN0ZXJvaWQuYXN0ZXJvaWQuZnNtLmNoYW5nZVN0YXRlKCdkZXN0cm95ZWQnKTtcbiAgICAgICAgICBpZiAodGhpcy5nYW1lcy5oZWFkKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWVzLmhlYWQuc3RhdGUuaGl0cysrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBhc3Rlcm9pZCA9IGFzdGVyb2lkLm5leHQ7XG4gICAgICB9XG4gICAgICBidWxsZXQgPSBidWxsZXQubmV4dDtcbiAgICB9XG4gICAgc3BhY2VzaGlwID0gdGhpcy5zcGFjZXNoaXBzLmhlYWQ7XG4gICAgd2hpbGUgKHNwYWNlc2hpcCkge1xuICAgICAgYXN0ZXJvaWQgPSB0aGlzLmFzdGVyb2lkcy5oZWFkO1xuICAgICAgd2hpbGUgKGFzdGVyb2lkKSB7XG4gICAgICAgIGlmIChhc3Rlcm9pZC5wb3NpdGlvbi5wb3NpdGlvbi5kaXN0YW5jZVRvKHNwYWNlc2hpcC5wb3NpdGlvbi5wb3NpdGlvbikgPD0gYXN0ZXJvaWQuY29sbGlzaW9uLnJhZGl1cyArIHNwYWNlc2hpcC5jb2xsaXNpb24ucmFkaXVzKSB7XG5cbiAgICAgICAgICAvKlxuICAgICAgICAgICBZb3Ugd2VyZSBoaXRcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBzcGFjZXNoaXAuc3BhY2VzaGlwLmZzbS5jaGFuZ2VTdGF0ZSgnZGVzdHJveWVkJyk7XG4gICAgICAgICAgaWYgKHRoaXMuZ2FtZXMuaGVhZCkge1xuICAgICAgICAgICAgdGhpcy5nYW1lcy5oZWFkLnN0YXRlLmxpdmVzKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGFzdGVyb2lkID0gYXN0ZXJvaWQubmV4dDtcbiAgICAgIH1cbiAgICAgIHNwYWNlc2hpcCA9IHNwYWNlc2hpcC5uZXh0O1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gQ29sbGlzaW9uU3lzdGVtO1xuXG59KShhc2guY29yZS5TeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb2xsaXNpb25fc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIERlYXRoVGhyb2VzTm9kZSwgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5EZWF0aFRocm9lc05vZGUgPSBhc3Rlcm9pZHMubm9kZXMuRGVhdGhUaHJvZXNOb2RlO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5EZWF0aFRocm9lc1N5c3RlbSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgX19leHRlbmRzKERlYXRoVGhyb2VzU3lzdGVtLCBfc3VwZXIpO1xuXG4gIERlYXRoVGhyb2VzU3lzdGVtLnByb3RvdHlwZS5jcmVhdG9yID0gbnVsbDtcblxuICBmdW5jdGlvbiBEZWF0aFRocm9lc1N5c3RlbShjcmVhdG9yKSB7XG4gICAgdGhpcy5jcmVhdG9yID0gY3JlYXRvcjtcbiAgICB0aGlzLnVwZGF0ZU5vZGUgPSBfX2JpbmQodGhpcy51cGRhdGVOb2RlLCB0aGlzKTtcbiAgICBEZWF0aFRocm9lc1N5c3RlbS5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBEZWF0aFRocm9lc05vZGUsIHRoaXMudXBkYXRlTm9kZSk7XG4gIH1cblxuICBEZWF0aFRocm9lc1N5c3RlbS5wcm90b3R5cGUudXBkYXRlTm9kZSA9IGZ1bmN0aW9uKG5vZGUsIHRpbWUpIHtcbiAgICBub2RlLmRlYXRoLmNvdW50ZG93biAtPSB0aW1lO1xuICAgIGlmIChub2RlLmRlYXRoLmNvdW50ZG93biA8PSAwKSB7XG4gICAgICB0aGlzLmNyZWF0b3IuZGVzdHJveUVudGl0eShub2RlLmVudGl0eSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBEZWF0aFRocm9lc1N5c3RlbTtcblxufSkoYXNoLnRvb2xzLkxpc3RJdGVyYXRpbmdTeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kZWF0aF90aHJvZXNfc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEFzdGVyb2lkQ29sbGlzaW9uTm9kZSwgQnVsbGV0Q29sbGlzaW9uTm9kZSwgR2FtZU5vZGUsIFBvaW50LCBTcGFjZXNoaXBOb2RlLCBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbkdhbWVOb2RlID0gYXN0ZXJvaWRzLm5vZGVzLkdhbWVOb2RlO1xuXG5TcGFjZXNoaXBOb2RlID0gYXN0ZXJvaWRzLm5vZGVzLlNwYWNlc2hpcE5vZGU7XG5cbkFzdGVyb2lkQ29sbGlzaW9uTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5Bc3Rlcm9pZENvbGxpc2lvbk5vZGU7XG5cbkJ1bGxldENvbGxpc2lvbk5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuQnVsbGV0Q29sbGlzaW9uTm9kZTtcblxuUG9pbnQgPSBhc3Rlcm9pZHMudWkuUG9pbnQ7XG5cbmFzdGVyb2lkcy5zeXN0ZW1zLkdhbWVNYW5hZ2VyID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoR2FtZU1hbmFnZXIsIF9zdXBlcik7XG5cbiAgR2FtZU1hbmFnZXIucHJvdG90eXBlLmNvbmZpZyA9IG51bGw7XG5cbiAgR2FtZU1hbmFnZXIucHJvdG90eXBlLmNyZWF0b3IgPSBudWxsO1xuXG4gIEdhbWVNYW5hZ2VyLnByb3RvdHlwZS5nYW1lTm9kZXMgPSBudWxsO1xuXG4gIEdhbWVNYW5hZ2VyLnByb3RvdHlwZS5zcGFjZXNoaXBzID0gbnVsbDtcblxuICBHYW1lTWFuYWdlci5wcm90b3R5cGUuYXN0ZXJvaWRzID0gbnVsbDtcblxuICBHYW1lTWFuYWdlci5wcm90b3R5cGUuYnVsbGV0cyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gR2FtZU1hbmFnZXIoY3JlYXRvciwgY29uZmlnKSB7XG4gICAgdGhpcy5jcmVhdG9yID0gY3JlYXRvcjtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLnVwZGF0ZSA9IF9fYmluZCh0aGlzLnVwZGF0ZSwgdGhpcyk7XG4gIH1cblxuICBHYW1lTWFuYWdlci5wcm90b3R5cGUuYWRkVG9FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB0aGlzLmdhbWVOb2RlcyA9IGVuZ2luZS5nZXROb2RlTGlzdChHYW1lTm9kZSk7XG4gICAgdGhpcy5zcGFjZXNoaXBzID0gZW5naW5lLmdldE5vZGVMaXN0KFNwYWNlc2hpcE5vZGUpO1xuICAgIHRoaXMuYXN0ZXJvaWRzID0gZW5naW5lLmdldE5vZGVMaXN0KEFzdGVyb2lkQ29sbGlzaW9uTm9kZSk7XG4gICAgdGhpcy5idWxsZXRzID0gZW5naW5lLmdldE5vZGVMaXN0KEJ1bGxldENvbGxpc2lvbk5vZGUpO1xuICB9O1xuXG4gIEdhbWVNYW5hZ2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gICAgdmFyIGFzdGVyb2lkLCBhc3Rlcm9pZENvdW50LCBjbGVhclRvQWRkU3BhY2VzaGlwLCBpLCBuZXdTcGFjZXNoaXBQb3NpdGlvbiwgbm9kZSwgcG9zaXRpb24sIHNwYWNlc2hpcDtcbiAgICBub2RlID0gdGhpcy5nYW1lTm9kZXMuaGVhZDtcbiAgICBpZiAobm9kZSAmJiBub2RlLnN0YXRlLnBsYXlpbmcpIHtcbiAgICAgIGlmICh0aGlzLnNwYWNlc2hpcHMuZW1wdHkpIHtcbiAgICAgICAgaWYgKG5vZGUuc3RhdGUubGl2ZXMgPiAwKSB7XG4gICAgICAgICAgbmV3U3BhY2VzaGlwUG9zaXRpb24gPSBuZXcgUG9pbnQodGhpcy5jb25maWcud2lkdGggKiAwLjUsIHRoaXMuY29uZmlnLmhlaWdodCAqIDAuNSk7XG4gICAgICAgICAgY2xlYXJUb0FkZFNwYWNlc2hpcCA9IHRydWU7XG4gICAgICAgICAgYXN0ZXJvaWQgPSB0aGlzLmFzdGVyb2lkcy5oZWFkO1xuICAgICAgICAgIHdoaWxlIChhc3Rlcm9pZCkge1xuICAgICAgICAgICAgaWYgKFBvaW50LmRpc3RhbmNlKGFzdGVyb2lkLnBvc2l0aW9uLnBvc2l0aW9uLCBuZXdTcGFjZXNoaXBQb3NpdGlvbikgPD0gYXN0ZXJvaWQuY29sbGlzaW9uLnJhZGl1cyArIDUwKSB7XG4gICAgICAgICAgICAgIGNsZWFyVG9BZGRTcGFjZXNoaXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhc3Rlcm9pZCA9IGFzdGVyb2lkLm5leHQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjbGVhclRvQWRkU3BhY2VzaGlwKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0b3IuY3JlYXRlU3BhY2VzaGlwKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGUuc3RhdGUucGxheWluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuY3JlYXRvci5jcmVhdGVXYWl0Rm9yQ2xpY2soKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuYXN0ZXJvaWRzLmVtcHR5ICYmIHRoaXMuYnVsbGV0cy5lbXB0eSAmJiAhdGhpcy5zcGFjZXNoaXBzLmVtcHR5KSB7XG4gICAgICAgIHNwYWNlc2hpcCA9IHRoaXMuc3BhY2VzaGlwcy5oZWFkO1xuICAgICAgICBub2RlLnN0YXRlLmxldmVsKys7XG4gICAgICAgIGFzdGVyb2lkQ291bnQgPSAyICsgbm9kZS5zdGF0ZS5sZXZlbDtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgYXN0ZXJvaWRDb3VudCkge1xuICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IG5ldyBQb2ludChNYXRoLnJhbmRvbSgpICogdGhpcy5jb25maWcud2lkdGgsIE1hdGgucmFuZG9tKCkgKiB0aGlzLmNvbmZpZy5oZWlnaHQpO1xuICAgICAgICAgICAgaWYgKCEoUG9pbnQuZGlzdGFuY2UocG9zaXRpb24sIHNwYWNlc2hpcC5wb3NpdGlvbi5wb3NpdGlvbikgPD0gODApKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmNyZWF0b3IuY3JlYXRlQXN0ZXJvaWQoMzAsIHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpO1xuICAgICAgICAgICsraTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBHYW1lTWFuYWdlci5wcm90b3R5cGUucmVtb3ZlRnJvbUVuZ2luZSA9IGZ1bmN0aW9uKGVuZ2luZSkge1xuICAgIHRoaXMuZ2FtZU5vZGVzID0gbnVsbDtcbiAgICB0aGlzLnNwYWNlc2hpcHMgPSBudWxsO1xuICAgIHRoaXMuYXN0ZXJvaWRzID0gbnVsbDtcbiAgICB0aGlzLmJ1bGxldHMgPSBudWxsO1xuICB9O1xuXG4gIHJldHVybiBHYW1lTWFuYWdlcjtcblxufSkoYXNoLmNvcmUuU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2FtZV9tYW5hZ2VyLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEd1bkNvbnRyb2xOb2RlLCBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbkd1bkNvbnRyb2xOb2RlID0gYXN0ZXJvaWRzLm5vZGVzLkd1bkNvbnRyb2xOb2RlO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5HdW5Db250cm9sU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoR3VuQ29udHJvbFN5c3RlbSwgX3N1cGVyKTtcblxuICBHdW5Db250cm9sU3lzdGVtLnByb3RvdHlwZS5rZXlQb2xsID0gbnVsbDtcblxuICBHdW5Db250cm9sU3lzdGVtLnByb3RvdHlwZS5jcmVhdG9yID0gbnVsbDtcblxuICBmdW5jdGlvbiBHdW5Db250cm9sU3lzdGVtKGtleVBvbGwsIGNyZWF0b3IpIHtcbiAgICB0aGlzLmtleVBvbGwgPSBrZXlQb2xsO1xuICAgIHRoaXMuY3JlYXRvciA9IGNyZWF0b3I7XG4gICAgdGhpcy51cGRhdGVOb2RlID0gX19iaW5kKHRoaXMudXBkYXRlTm9kZSwgdGhpcyk7XG4gICAgR3VuQ29udHJvbFN5c3RlbS5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBHdW5Db250cm9sTm9kZSwgdGhpcy51cGRhdGVOb2RlKTtcbiAgfVxuXG4gIEd1bkNvbnRyb2xTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZU5vZGUgPSBmdW5jdGlvbihub2RlLCB0aW1lKSB7XG4gICAgdmFyIGNvbnRyb2wsIGd1biwgcG9zaXRpb247XG4gICAgY29udHJvbCA9IG5vZGUuY29udHJvbDtcbiAgICBwb3NpdGlvbiA9IG5vZGUucG9zaXRpb247XG4gICAgZ3VuID0gbm9kZS5ndW47XG4gICAgZ3VuLnNob290aW5nID0gdGhpcy5rZXlQb2xsLmlzRG93bihjb250cm9sLnRyaWdnZXIpO1xuICAgIGd1bi50aW1lU2luY2VMYXN0U2hvdCArPSB0aW1lO1xuICAgIGlmIChndW4uc2hvb3RpbmcgJiYgZ3VuLnRpbWVTaW5jZUxhc3RTaG90ID49IGd1bi5taW5pbXVtU2hvdEludGVydmFsKSB7XG4gICAgICB0aGlzLmNyZWF0b3IuY3JlYXRlVXNlckJ1bGxldChndW4sIHBvc2l0aW9uKTtcbiAgICAgIGd1bi50aW1lU2luY2VMYXN0U2hvdCA9IDA7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBHdW5Db250cm9sU3lzdGVtO1xuXG59KShhc2gudG9vbHMuTGlzdEl0ZXJhdGluZ1N5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWd1bl9jb250cm9sX3N5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBIdWROb2RlLCBhc3Rlcm9pZHMsXG4gIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbkh1ZE5vZGUgPSBhc3Rlcm9pZHMubm9kZXMuSHVkTm9kZTtcblxuYXN0ZXJvaWRzLnN5c3RlbXMuSHVkU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoSHVkU3lzdGVtLCBfc3VwZXIpO1xuXG4gIGZ1bmN0aW9uIEh1ZFN5c3RlbSgpIHtcbiAgICB0aGlzLnVwZGF0ZU5vZGUgPSBfX2JpbmQodGhpcy51cGRhdGVOb2RlLCB0aGlzKTtcbiAgICBIdWRTeXN0ZW0uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgSHVkTm9kZSwgdGhpcy51cGRhdGVOb2RlKTtcbiAgfVxuXG4gIEh1ZFN5c3RlbS5wcm90b3R5cGUudXBkYXRlTm9kZSA9IGZ1bmN0aW9uKG5vZGUsIHRpbWUpIHtcbiAgICBub2RlLmh1ZC52aWV3LnNldExpdmVzKG5vZGUuc3RhdGUubGl2ZXMpO1xuICAgIG5vZGUuaHVkLnZpZXcuc2V0U2NvcmUobm9kZS5zdGF0ZS5oaXRzKTtcbiAgfTtcblxuICByZXR1cm4gSHVkU3lzdGVtO1xuXG59KShhc2gudG9vbHMuTGlzdEl0ZXJhdGluZ1N5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWh1ZF9zeXN0ZW0uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgTW90aW9uQ29udHJvbE5vZGUsIGFzdGVyb2lkcywgYjJWZWMyLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5Nb3Rpb25Db250cm9sTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5Nb3Rpb25Db250cm9sTm9kZTtcblxuYjJWZWMyID0gQm94MkQuQ29tbW9uLk1hdGguYjJWZWMyO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5Nb3Rpb25Db250cm9sU3lzdGVtID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICBfX2V4dGVuZHMoTW90aW9uQ29udHJvbFN5c3RlbSwgX3N1cGVyKTtcblxuICBNb3Rpb25Db250cm9sU3lzdGVtLnByb3RvdHlwZS5rZXlQb2xsID0gbnVsbDtcblxuICBmdW5jdGlvbiBNb3Rpb25Db250cm9sU3lzdGVtKGtleVBvbGwpIHtcbiAgICB0aGlzLmtleVBvbGwgPSBrZXlQb2xsO1xuICAgIHRoaXMudXBkYXRlTm9kZSA9IF9fYmluZCh0aGlzLnVwZGF0ZU5vZGUsIHRoaXMpO1xuICAgIE1vdGlvbkNvbnRyb2xTeXN0ZW0uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgTW90aW9uQ29udHJvbE5vZGUsIHRoaXMudXBkYXRlTm9kZSk7XG4gIH1cblxuICBNb3Rpb25Db250cm9sU3lzdGVtLnByb3RvdHlwZS51cGRhdGVOb2RlID0gZnVuY3Rpb24obm9kZSwgdGltZSkge1xuICAgIHZhciBjb250cm9sLCBsZWZ0LCBtb3Rpb24sIHBvc2l0aW9uLCByaWdodDtcbiAgICBjb250cm9sID0gbm9kZS5jb250cm9sO1xuICAgIHBvc2l0aW9uID0gbm9kZS5wb3NpdGlvbjtcbiAgICBtb3Rpb24gPSBub2RlLm1vdGlvbjtcbiAgICBsZWZ0ID0gdGhpcy5rZXlQb2xsLmlzRG93bihjb250cm9sLmxlZnQpO1xuICAgIHJpZ2h0ID0gdGhpcy5rZXlQb2xsLmlzRG93bihjb250cm9sLnJpZ2h0KTtcbiAgICBpZiAobGVmdCkge1xuICAgICAgcG9zaXRpb24ucm90YXRpb24gLT0gY29udHJvbC5yb3RhdGlvblJhdGUgKiB0aW1lO1xuICAgIH1cbiAgICBpZiAocmlnaHQpIHtcbiAgICAgIHBvc2l0aW9uLnJvdGF0aW9uICs9IGNvbnRyb2wucm90YXRpb25SYXRlICogdGltZTtcbiAgICB9XG4gICAgaWYgKHRoaXMua2V5UG9sbC5pc0Rvd24oY29udHJvbC5hY2NlbGVyYXRlKSkge1xuICAgICAgbW90aW9uLnZlbG9jaXR5LnggKz0gTWF0aC5jb3MocG9zaXRpb24ucm90YXRpb24pICogY29udHJvbC5hY2NlbGVyYXRpb25SYXRlICogdGltZTtcbiAgICAgIG1vdGlvbi52ZWxvY2l0eS55ICs9IE1hdGguc2luKHBvc2l0aW9uLnJvdGF0aW9uKSAqIGNvbnRyb2wuYWNjZWxlcmF0aW9uUmF0ZSAqIHRpbWU7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBNb3Rpb25Db250cm9sU3lzdGVtO1xuXG59KShhc2gudG9vbHMuTGlzdEl0ZXJhdGluZ1N5c3RlbSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1vdGlvbl9jb250cm9sX3N5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBNb3ZlbWVudE5vZGUsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuTW92ZW1lbnROb2RlID0gYXN0ZXJvaWRzLm5vZGVzLk1vdmVtZW50Tm9kZTtcblxuYXN0ZXJvaWRzLnN5c3RlbXMuTW92ZW1lbnRTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhNb3ZlbWVudFN5c3RlbSwgX3N1cGVyKTtcblxuICBNb3ZlbWVudFN5c3RlbS5wcm90b3R5cGUuY29uZmlnID0gbnVsbDtcblxuICBmdW5jdGlvbiBNb3ZlbWVudFN5c3RlbShjb25maWcpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLnVwZGF0ZU5vZGUgPSBfX2JpbmQodGhpcy51cGRhdGVOb2RlLCB0aGlzKTtcbiAgICBNb3ZlbWVudFN5c3RlbS5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBNb3ZlbWVudE5vZGUsIHRoaXMudXBkYXRlTm9kZSk7XG4gIH1cblxuICBNb3ZlbWVudFN5c3RlbS5wcm90b3R5cGUudXBkYXRlTm9kZSA9IGZ1bmN0aW9uKG5vZGUsIHRpbWUpIHtcbiAgICB2YXIgbW90aW9uLCBwb3NpdGlvbiwgeERhbXAsIHlEYW1wO1xuICAgIHBvc2l0aW9uID0gbm9kZS5wb3NpdGlvbjtcbiAgICBtb3Rpb24gPSBub2RlLm1vdGlvbjtcbiAgICBwb3NpdGlvbi5wb3NpdGlvbi54ICs9IG1vdGlvbi52ZWxvY2l0eS54ICogdGltZTtcbiAgICBwb3NpdGlvbi5wb3NpdGlvbi55ICs9IG1vdGlvbi52ZWxvY2l0eS55ICogdGltZTtcbiAgICBpZiAocG9zaXRpb24ucG9zaXRpb24ueCA8IDApIHtcbiAgICAgIHBvc2l0aW9uLnBvc2l0aW9uLnggKz0gdGhpcy5jb25maWcud2lkdGg7XG4gICAgfVxuICAgIGlmIChwb3NpdGlvbi5wb3NpdGlvbi54ID4gdGhpcy5jb25maWcud2lkdGgpIHtcbiAgICAgIHBvc2l0aW9uLnBvc2l0aW9uLnggLT0gdGhpcy5jb25maWcud2lkdGg7XG4gICAgfVxuICAgIGlmIChwb3NpdGlvbi5wb3NpdGlvbi55IDwgMCkge1xuICAgICAgcG9zaXRpb24ucG9zaXRpb24ueSArPSB0aGlzLmNvbmZpZy5oZWlnaHQ7XG4gICAgfVxuICAgIGlmIChwb3NpdGlvbi5wb3NpdGlvbi55ID4gdGhpcy5jb25maWcuaGVpZ2h0KSB7XG4gICAgICBwb3NpdGlvbi5wb3NpdGlvbi55IC09IHRoaXMuY29uZmlnLmhlaWdodDtcbiAgICB9XG4gICAgcG9zaXRpb24ucm90YXRpb24gKz0gbW90aW9uLmFuZ3VsYXJWZWxvY2l0eSAqIHRpbWU7XG4gICAgaWYgKG1vdGlvbi5kYW1waW5nID4gMCkge1xuICAgICAgeERhbXAgPSBNYXRoLmFicyhNYXRoLmNvcyhwb3NpdGlvbi5yb3RhdGlvbikgKiBtb3Rpb24uZGFtcGluZyAqIHRpbWUpO1xuICAgICAgeURhbXAgPSBNYXRoLmFicyhNYXRoLnNpbihwb3NpdGlvbi5yb3RhdGlvbikgKiBtb3Rpb24uZGFtcGluZyAqIHRpbWUpO1xuICAgICAgaWYgKG1vdGlvbi52ZWxvY2l0eS54ID4geERhbXApIHtcbiAgICAgICAgbW90aW9uLnZlbG9jaXR5LnggLT0geERhbXA7XG4gICAgICB9IGVsc2UgaWYgKG1vdGlvbi52ZWxvY2l0eS54IDwgLXhEYW1wKSB7XG4gICAgICAgIG1vdGlvbi52ZWxvY2l0eS54ICs9IHhEYW1wO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbW90aW9uLnZlbG9jaXR5LnggPSAwO1xuICAgICAgfVxuICAgICAgaWYgKG1vdGlvbi52ZWxvY2l0eS55ID4geURhbXApIHtcbiAgICAgICAgbW90aW9uLnZlbG9jaXR5LnkgLT0geURhbXA7XG4gICAgICB9IGVsc2UgaWYgKG1vdGlvbi52ZWxvY2l0eS55IDwgLXlEYW1wKSB7XG4gICAgICAgIG1vdGlvbi52ZWxvY2l0eS55ICs9IHlEYW1wO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbW90aW9uLnZlbG9jaXR5LnkgPSAwO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gTW92ZW1lbnRTeXN0ZW07XG5cbn0pKGFzaC50b29scy5MaXN0SXRlcmF0aW5nU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bW92ZW1lbnRfc3lzdGVtLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFJlbmRlck5vZGUsIGFzdGVyb2lkcyxcbiAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuUmVuZGVyTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5SZW5kZXJOb2RlO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5SZW5kZXJTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhSZW5kZXJTeXN0ZW0sIF9zdXBlcik7XG5cbiAgUmVuZGVyU3lzdGVtLnByb3RvdHlwZS5ncmFwaGljID0gbnVsbDtcblxuICBSZW5kZXJTeXN0ZW0ucHJvdG90eXBlLm5vZGVzID0gbnVsbDtcblxuICBmdW5jdGlvbiBSZW5kZXJTeXN0ZW0oY3R4KSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy51cGRhdGUgPSBfX2JpbmQodGhpcy51cGRhdGUsIHRoaXMpO1xuICB9XG5cbiAgUmVuZGVyU3lzdGVtLnByb3RvdHlwZS5hZGRUb0VuZ2luZSA9IGZ1bmN0aW9uKGVuZ2luZSkge1xuICAgIHZhciBub2RlO1xuICAgIHRoaXMubm9kZXMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoUmVuZGVyTm9kZSk7XG4gICAgbm9kZSA9IHRoaXMubm9kZXMuaGVhZDtcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgdGhpcy5hZGRUb0Rpc3BsYXkobm9kZSk7XG4gICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgIH1cbiAgfTtcblxuICBSZW5kZXJTeXN0ZW0ucHJvdG90eXBlLmFkZFRvRGlzcGxheSA9IGZ1bmN0aW9uKG5vZGUpIHt9O1xuXG4gIFJlbmRlclN5c3RlbS5wcm90b3R5cGUucmVtb3ZlRnJvbURpc3BsYXkgPSBmdW5jdGlvbihub2RlKSB7fTtcblxuICBSZW5kZXJTeXN0ZW0ucHJvdG90eXBlLnJlbW92ZUZyb21FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB0aGlzLm5vZGVzID0gbnVsbDtcbiAgfTtcblxuICBSZW5kZXJTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgZGlzcGxheSwgZ3JhcGhpYywgbm9kZSwgcG9zaXRpb247XG4gICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgwLCAwKTtcbiAgICB0aGlzLmN0eC5yb3RhdGUoMCk7XG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY3R4LmNhbnZhcy53aWR0aCwgdGhpcy5jdHguY2FudmFzLmhlaWdodCk7XG4gICAgbm9kZSA9IHRoaXMubm9kZXMuaGVhZDtcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgZGlzcGxheSA9IG5vZGUuZGlzcGxheTtcbiAgICAgIGdyYXBoaWMgPSBkaXNwbGF5LmdyYXBoaWM7XG4gICAgICBwb3NpdGlvbiA9IG5vZGUucG9zaXRpb247XG4gICAgICBncmFwaGljLnggPSBwb3NpdGlvbi5wb3NpdGlvbi54O1xuICAgICAgZ3JhcGhpYy55ID0gcG9zaXRpb24ucG9zaXRpb24ueTtcbiAgICAgIGdyYXBoaWMucm90YXRpb24gPSBwb3NpdGlvbi5yb3RhdGlvbjtcbiAgICAgIGdyYXBoaWMuZHJhdyh0aGlzLmN0eCk7XG4gICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgIH1cbiAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFJlbmRlclN5c3RlbTtcblxufSkoYXNoLmNvcmUuU3lzdGVtKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVuZGVyX3N5c3RlbS5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3Rlcm9pZHM7XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5TeXN0ZW1Qcmlvcml0aWVzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBTeXN0ZW1Qcmlvcml0aWVzKCkge31cblxuICBTeXN0ZW1Qcmlvcml0aWVzLnByZVVwZGF0ZSA9IDE7XG5cbiAgU3lzdGVtUHJpb3JpdGllcy51cGRhdGUgPSAyO1xuXG4gIFN5c3RlbVByaW9yaXRpZXMubW92ZSA9IDM7XG5cbiAgU3lzdGVtUHJpb3JpdGllcy5yZXNvbHZlQ29sbGlzaW9ucyA9IDQ7XG5cbiAgU3lzdGVtUHJpb3JpdGllcy5zdGF0ZU1hY2hpbmVzID0gNTtcblxuICBTeXN0ZW1Qcmlvcml0aWVzLmFuaW1hdGUgPSA2O1xuXG4gIFN5c3RlbVByaW9yaXRpZXMucmVuZGVyID0gNztcblxuICByZXR1cm4gU3lzdGVtUHJpb3JpdGllcztcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3lzdGVtX3ByaW9yaXRpZXMuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgQXN0ZXJvaWRDb2xsaXNpb25Ob2RlLCBHYW1lTm9kZSwgV2FpdEZvclN0YXJ0Tm9kZSwgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG5cbmFzdGVyb2lkcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYicpO1xuXG5XYWl0Rm9yU3RhcnROb2RlID0gYXN0ZXJvaWRzLm5vZGVzLldhaXRGb3JTdGFydE5vZGU7XG5cbkFzdGVyb2lkQ29sbGlzaW9uTm9kZSA9IGFzdGVyb2lkcy5ub2Rlcy5Bc3Rlcm9pZENvbGxpc2lvbk5vZGU7XG5cbkdhbWVOb2RlID0gYXN0ZXJvaWRzLm5vZGVzLkdhbWVOb2RlO1xuXG5hc3Rlcm9pZHMuc3lzdGVtcy5XYWl0Rm9yU3RhcnRTeXN0ZW0gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gIF9fZXh0ZW5kcyhXYWl0Rm9yU3RhcnRTeXN0ZW0sIF9zdXBlcik7XG5cbiAgV2FpdEZvclN0YXJ0U3lzdGVtLnByb3RvdHlwZS5lbmdpbmUgPSBudWxsO1xuXG4gIFdhaXRGb3JTdGFydFN5c3RlbS5wcm90b3R5cGUuY3JlYXRvciA9IG51bGw7XG5cbiAgV2FpdEZvclN0YXJ0U3lzdGVtLnByb3RvdHlwZS5nYW1lTm9kZXMgPSBudWxsO1xuXG4gIFdhaXRGb3JTdGFydFN5c3RlbS5wcm90b3R5cGUud2FpdE5vZGVzID0gbnVsbDtcblxuICBXYWl0Rm9yU3RhcnRTeXN0ZW0ucHJvdG90eXBlLmFzdGVyb2lkcyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gV2FpdEZvclN0YXJ0U3lzdGVtKGNyZWF0b3IpIHtcbiAgICB0aGlzLmNyZWF0b3IgPSBjcmVhdG9yO1xuICAgIHRoaXMudXBkYXRlID0gX19iaW5kKHRoaXMudXBkYXRlLCB0aGlzKTtcbiAgfVxuXG4gIFdhaXRGb3JTdGFydFN5c3RlbS5wcm90b3R5cGUuYWRkVG9FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTtcbiAgICB0aGlzLndhaXROb2RlcyA9IGVuZ2luZS5nZXROb2RlTGlzdChXYWl0Rm9yU3RhcnROb2RlKTtcbiAgICB0aGlzLmdhbWVOb2RlcyA9IGVuZ2luZS5nZXROb2RlTGlzdChHYW1lTm9kZSk7XG4gICAgdGhpcy5hc3Rlcm9pZHMgPSBlbmdpbmUuZ2V0Tm9kZUxpc3QoQXN0ZXJvaWRDb2xsaXNpb25Ob2RlKTtcbiAgfTtcblxuICBXYWl0Rm9yU3RhcnRTeXN0ZW0ucHJvdG90eXBlLnJlbW92ZUZyb21FbmdpbmUgPSBmdW5jdGlvbihlbmdpbmUpIHtcbiAgICB0aGlzLndhaXROb2RlcyA9IG51bGw7XG4gICAgdGhpcy5nYW1lTm9kZXMgPSBudWxsO1xuICB9O1xuXG4gIFdhaXRGb3JTdGFydFN5c3RlbS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICAgIHZhciBhc3Rlcm9pZCwgZ2FtZSwgbm9kZTtcbiAgICBub2RlID0gdGhpcy53YWl0Tm9kZXMuaGVhZDtcbiAgICBnYW1lID0gdGhpcy5nYW1lTm9kZXMuaGVhZDtcbiAgICBpZiAobm9kZSAmJiBub2RlLndhaXQuc3RhcnRHYW1lICYmIGdhbWUpIHtcbiAgICAgIGFzdGVyb2lkID0gdGhpcy5hc3Rlcm9pZHMuaGVhZDtcbiAgICAgIHdoaWxlIChhc3Rlcm9pZCkge1xuICAgICAgICB0aGlzLmNyZWF0b3IuZGVzdHJveUVudGl0eShhc3Rlcm9pZC5lbnRpdHkpO1xuICAgICAgICBhc3Rlcm9pZCA9IGFzdGVyb2lkLm5leHQ7XG4gICAgICB9XG4gICAgICBnYW1lLnN0YXRlLnNldEZvclN0YXJ0KCk7XG4gICAgICBub2RlLndhaXQuc3RhcnRHYW1lID0gZmFsc2U7XG4gICAgICB0aGlzLmVuZ2luZS5yZW1vdmVFbnRpdHkobm9kZS5lbnRpdHkpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gV2FpdEZvclN0YXJ0U3lzdGVtO1xuXG59KShhc2guY29yZS5TeXN0ZW0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD13YWl0X2Zvcl9zdGFydF9zeXN0ZW0uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzLFxuICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5hc3Rlcm9pZHMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWInKTtcblxuYXN0ZXJvaWRzLnVpLktleVBvbGwgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBkaXNwbGF5T2JqLCBzdGF0ZXM7XG5cbiAgc3RhdGVzID0gbnVsbDtcblxuICBkaXNwbGF5T2JqID0gbnVsbDtcblxuICBmdW5jdGlvbiBLZXlQb2xsKGRpc3BsYXlPYmopIHtcbiAgICB0aGlzLmRpc3BsYXlPYmogPSBkaXNwbGF5T2JqO1xuICAgIHRoaXMuaXNVcCA9IF9fYmluZCh0aGlzLmlzVXAsIHRoaXMpO1xuICAgIHRoaXMuaXNEb3duID0gX19iaW5kKHRoaXMuaXNEb3duLCB0aGlzKTtcbiAgICB0aGlzLmtleVVwTGlzdGVuZXIgPSBfX2JpbmQodGhpcy5rZXlVcExpc3RlbmVyLCB0aGlzKTtcbiAgICB0aGlzLmtleURvd25MaXN0ZW5lciA9IF9fYmluZCh0aGlzLmtleURvd25MaXN0ZW5lciwgdGhpcyk7XG4gICAgdGhpcy5zdGF0ZXMgPSB7fTtcbiAgICB0aGlzLmRpc3BsYXlPYmouYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5rZXlEb3duTGlzdGVuZXIpO1xuICAgIHRoaXMuZGlzcGxheU9iai5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5rZXlVcExpc3RlbmVyKTtcbiAgfVxuXG4gIEtleVBvbGwucHJvdG90eXBlLmtleURvd25MaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5zdGF0ZXNbZXZlbnQua2V5Q29kZV0gPSB0cnVlO1xuICB9O1xuXG4gIEtleVBvbGwucHJvdG90eXBlLmtleVVwTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGlmICh0aGlzLnN0YXRlc1tldmVudC5rZXlDb2RlXSkge1xuICAgICAgdGhpcy5zdGF0ZXNbZXZlbnQua2V5Q29kZV0gPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgS2V5UG9sbC5wcm90b3R5cGUuaXNEb3duID0gZnVuY3Rpb24oa2V5Q29kZSkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlc1trZXlDb2RlXTtcbiAgfTtcblxuICBLZXlQb2xsLnByb3RvdHlwZS5pc1VwID0gZnVuY3Rpb24oa2V5Q29kZSkge1xuICAgIHJldHVybiAhdGhpcy5zdGF0ZXNba2V5Q29kZV07XG4gIH07XG5cbiAgcmV0dXJuIEtleVBvbGw7XG5cbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWtleV9wb2xsLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFzdGVyb2lkcztcblxuYXN0ZXJvaWRzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliJyk7XG5cbmFzdGVyb2lkcy51aS5Qb2ludCA9IChmdW5jdGlvbigpIHtcbiAgUG9pbnQucHJvdG90eXBlLnggPSAwO1xuXG4gIFBvaW50LnByb3RvdHlwZS55ID0gMDtcblxuICBmdW5jdGlvbiBQb2ludCh4LCB5KSB7XG4gICAgdGhpcy54ID0geCAhPSBudWxsID8geCA6IDA7XG4gICAgdGhpcy55ID0geSAhPSBudWxsID8geSA6IDA7XG4gIH1cblxuICBQb2ludC5kaXN0YW5jZSA9IGZ1bmN0aW9uKHBvaW50MSwgcG9pbnQyKSB7XG4gICAgdmFyIGR4LCBkeTtcbiAgICBkeCA9IHBvaW50MS54IC0gcG9pbnQyLng7XG4gICAgZHkgPSBwb2ludDEueSAtIHBvaW50Mi55O1xuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICB9O1xuXG4gIFBvaW50LnByb3RvdHlwZS5kaXN0YW5jZVNxdWFyZWRUbyA9IGZ1bmN0aW9uKHRhcmdldFBvaW50KSB7XG4gICAgdmFyIGR4LCBkeTtcbiAgICBkeCA9IHRoaXMueCAtIHRhcmdldFBvaW50Lng7XG4gICAgZHkgPSB0aGlzLnkgLSB0YXJnZXRQb2ludC55O1xuICAgIHJldHVybiBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgfTtcblxuICBQb2ludC5wcm90b3R5cGUuZGlzdGFuY2VUbyA9IGZ1bmN0aW9uKHRhcmdldFBvaW50KSB7XG4gICAgdmFyIGR4LCBkeTtcbiAgICBkeCA9IHRoaXMueCAtIHRhcmdldFBvaW50Lng7XG4gICAgZHkgPSB0aGlzLnkgLSB0YXJnZXRQb2ludC55O1xuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICB9O1xuXG4gIHJldHVybiBQb2ludDtcblxufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cG9pbnQuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXN0ZXJvaWRzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzdGVyb2lkcyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gYXN0ZXJvaWRzKCkge31cblxuICByZXR1cm4gYXN0ZXJvaWRzO1xuXG59KSgpO1xuXG5hc3Rlcm9pZHMudWkgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHVpKCkge31cblxuICByZXR1cm4gdWk7XG5cbn0pKCk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3VpL3BvaW50Jyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3VpL2tleV9wb2xsJyk7XG5cbmFzdGVyb2lkcy5zcHJpdGVzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBzcHJpdGVzKCkge31cblxuICByZXR1cm4gc3ByaXRlcztcblxufSkoKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3ByaXRlcy9hc3Rlcm9pZF92aWV3Jyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3Nwcml0ZXMvYXN0ZXJvaWRfZGVhdGhfdmlldycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zcHJpdGVzL2J1bGxldF92aWV3Jyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3Nwcml0ZXMvaHVkX3ZpZXcnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3ByaXRlcy9zcGFjZXNoaXBfZGVhdGhfdmlldycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zcHJpdGVzL3NwYWNlc2hpcF92aWV3Jyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3Nwcml0ZXMvd2FpdF9mb3Jfc3RhcnRfdmlldycpO1xuXG5hc3Rlcm9pZHMuY29tcG9uZW50cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gY29tcG9uZW50cygpIHt9XG5cbiAgcmV0dXJuIGNvbXBvbmVudHM7XG5cbn0pKCk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvYW5pbWF0aW9uJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvYXN0ZXJvaWQnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvY29tcG9uZW50cy9hdWRpbycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL2J1bGxldCcpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL2NvbGxpc2lvbicpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL2RlYXRoX3Rocm9lcycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9jb21wb25lbnRzL2Rpc3BsYXknKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvY29tcG9uZW50cy9nYW1lX3N0YXRlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvZ3VuJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvZ3VuX2NvbnRyb2xzJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvaHVkJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvbW90aW9uJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvbW90aW9uX2NvbnRyb2xzJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL2NvbXBvbmVudHMvcG9zaXRpb24nKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvY29tcG9uZW50cy9zcGFjZXNoaXAnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvY29tcG9uZW50cy93YWl0X2Zvcl9zdGFydCcpO1xuXG5hc3Rlcm9pZHMubm9kZXMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIG5vZGVzKCkge31cblxuICByZXR1cm4gbm9kZXM7XG5cbn0pKCk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL2FuaW1hdGlvbl9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL2FzdGVyb2lkX2NvbGxpc2lvbl9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL2F1ZGlvX25vZGUnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvYnVsbGV0X2FnZV9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL2J1bGxldF9jb2xsaXNpb25fbm9kZScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9ub2Rlcy9kZWF0aF90aHJvZXNfbm9kZScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9ub2Rlcy9nYW1lX25vZGUnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvZ3VuX2NvbnRyb2xfbm9kZScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9ub2Rlcy9odWRfbm9kZScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9ub2Rlcy9tb3Rpb25fY29udHJvbF9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL21vdmVtZW50X25vZGUnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvcmVuZGVyX25vZGUnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbm9kZXMvc3BhY2VzaGlwX2NvbGxpc2lvbl9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL3NwYWNlc2hpcF9ub2RlJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL25vZGVzL3dhaXRfZm9yX3N0YXJ0X25vZGUnKTtcblxuYXN0ZXJvaWRzLnN5c3RlbXMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHN5c3RlbXMoKSB7fVxuXG4gIHJldHVybiBzeXN0ZW1zO1xuXG59KSgpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL2FuaW1hdGlvbl9zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3lzdGVtcy9hdWRpb19zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3lzdGVtcy9idWxsZXRfYWdlX3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL2NvbGxpc2lvbl9zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3lzdGVtcy9kZWF0aF90aHJvZXNfc3lzdGVtJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3N5c3RlbXMvZ2FtZV9tYW5hZ2VyJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3N5c3RlbXMvZ3VuX2NvbnRyb2xfc3lzdGVtJyk7XG5cbnJlcXVpcmUoJy4vYXN0ZXJvaWRzL3N5c3RlbXMvaHVkX3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL21vdGlvbl9jb250cm9sX3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL21vdmVtZW50X3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL3JlbmRlcl9zeXN0ZW0nKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvc3lzdGVtcy9zeXN0ZW1fcHJpb3JpdGllcycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9zeXN0ZW1zL3dhaXRfZm9yX3N0YXJ0X3N5c3RlbScpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9lbnRpdHlfY3JlYXRvcicpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9nYW1lX2NvbmZpZycpO1xuXG5yZXF1aXJlKCcuL2FzdGVyb2lkcy9hc3Rlcm9pZHMnKTtcblxucmVxdWlyZSgnLi9hc3Rlcm9pZHMvbWFpbicpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXBcbiJdfQ==
