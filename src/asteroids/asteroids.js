
/* <==================================================

              __                  _     _______ _
  ____ ______/ /____  _________  (_)___/ / ___/(_)___ ___
 / __ `/ ___/ __/ _ \/ ___/ __ \/ / __  /\__ \/ / __ `__ \
/ /_/ (__  ) /_/  __/ /  / /_/ / / /_/ /___/ / / / / / / /
\__,_/____/\__/\___/_/   \____/_/\__,_//____/_/_/ /_/ /_/

'Back on Arcturus, this doubled as our flight simulator'
  - Dark Overlord of Data

==================================================>
 */
'use strict';
var AnimationSystem, AsteroidDeathView, AsteroidView, AudioSystem, BackgroundView, BulletAgeSystem, BulletView, CollisionSystem, Components, DeathThroesSystem, Dot, DpadController, Entities, FireButton, FixedPhysicsSystem, Game, GameController, GameManager, GunControlSystem, HudSystem, HudView, KeyPoll, MersenneTwister, Nodes, Point, Properties, RenderSystem, ShipControlSystem, Sound, SpaceshipDeathView, SpaceshipView, SpriteAsteroid, SpriteBullet, SpriteSpaceship, SystemPriorities, TouchableArea, TouchableButton, TouchableCircle, TouchableDirection, TouchableJoystick, WaitForStartSystem, WaitForStartView, WarpButton, res,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

res = {
  fb_login: 'res/images/fb-login.png',
  dialog_blue: 'res/images/dialog-box.png',
  dialog_star: 'res/images/black-dialog.png',
  button_blue: 'res/images/standard-button-on.png',
  button_star: 'res/images/black-button-on.png',
  background: 'res/images/BackdropBlackLittleSparkBlack.png',
  leaderboard: 'res/icons/b_Leaderboard.png',
  settings: 'res/icons/b_Parameters.png',
  round: 'res/images/round48.png',
  square: 'res/images/square48.png',
  touchorigin: 'res/images/touchorigin.png',
  touchend: 'res/images/touchend.png',
  fire: 'res/fire.png',
  warp: 'res/warp.png'
};

SpriteBullet = 1;

SpriteAsteroid = 2;

SpriteSpaceship = 3;


/*
 *
 * Modified Html5 Virtual Game Controller
 *
 * @see https://github.com/austinhallock/html5-virtual-game-controller
 *
 */

GameController = (function() {
  var extend;
  extend = function(target, src) {
    var clone, copy, copyIsArray, deep, name, options;
    deep = true;
    if (typeof target === 'boolean') {
      deep = target;
    }
    if (typeof target !== 'object' && typeof target !== 'function') {
      target = {};
    }
    if (options = src) {
      for (name in options) {
        src = target[name];
        copy = options[name];
        if (target !== copy) {
          if (deep && (typeof copy === 'object' || (copyIsArray = Object.prototype.toString.call(copy) === '[object Array]'))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = (src && Object.prototype.toString.call(src) === '[object Array]' ? src : []);
            } else {
              clone = (src && typeof src === 'object' ? src : {});
            }
            target[name] = extend(clone, copy);
          } else {
            if (typeof copy !== 'undefined') {
              target[name] = copy;
            }
          }
        }
      }
    }
    return target;
  };
  return GameController = {
    options: {
      left: {
        type: 'dpad',
        position: {
          left: '13%',
          bottom: '22%'
        },
        dpad: {
          up: {
            width: '7%',
            height: '15%',
            stroke: 2,
            touchStart: function() {
              GameController.simulateKeyEvent('press', 38);
              GameController.simulateKeyEvent('down', 38);
            },
            touchEnd: function() {
              GameController.simulateKeyEvent('up', 38);
            }
          },
          left: {
            width: '15%',
            height: '7%',
            stroke: 2,
            touchStart: function() {
              GameController.simulateKeyEvent('press', 37);
              GameController.simulateKeyEvent('down', 37);
            },
            touchEnd: function() {
              GameController.simulateKeyEvent('up', 37);
            }
          },
          down: {
            width: '7%',
            height: '15%',
            stroke: 2,
            touchStart: function() {
              GameController.simulateKeyEvent('press', 40);
              GameController.simulateKeyEvent('down', 40);
            },
            touchEnd: function() {
              GameController.simulateKeyEvent('up', 40);
            }
          },
          right: {
            width: '15%',
            height: '7%',
            stroke: 2,
            touchStart: function() {
              GameController.simulateKeyEvent('press', 39);
              GameController.simulateKeyEvent('down', 39);
            },
            touchEnd: function() {
              GameController.simulateKeyEvent('up', 39);
            }
          }
        },
        joystick: {
          radius: 60,
          touchMove: function(e) {
            console.log(e);
          }
        }
      },
      right: {
        type: 'buttons',
        position: {
          right: '17%',
          bottom: '28%'
        },
        buttons: [
          {
            offset: {
              x: '-13%',
              y: 0
            },
            label: 'X',
            radius: '7%',
            stroke: 2,
            backgroundColor: 'blue',
            fontColor: '#fff',
            touchStart: function() {
              GameController.simulateKeyEvent('press', 88);
              GameController.simulateKeyEvent('down', 88);
            },
            touchEnd: function() {
              GameController.simulateKeyEvent('up', 88);
            }
          }, {
            offset: {
              x: 0,
              y: '-11%'
            },
            label: 'Y',
            radius: '7%',
            stroke: 2,
            backgroundColor: 'yellow',
            fontColor: '#fff',
            touchStart: function() {
              GameController.simulateKeyEvent('press', 70);
              GameController.simulateKeyEvent('down', 70);
            },
            touchEnd: function() {
              GameController.simulateKeyEvent('up', 70);
            }
          }, {
            offset: {
              x: '13%',
              y: 0
            },
            label: 'B',
            radius: '7%',
            stroke: 2,
            backgroundColor: 'red',
            fontColor: '#fff',
            touchStart: function() {
              GameController.simulateKeyEvent('press', 90);
              GameController.simulateKeyEvent('down', 90);
            },
            touchEnd: function() {
              GameController.simulateKeyEvent('up', 90);
            }
          }, {
            offset: {
              x: 0,
              y: '11%'
            },
            label: 'A',
            radius: '7%',
            stroke: 2,
            backgroundColor: 'green',
            fontColor: '#fff',
            touchStart: function() {
              GameController.simulateKeyEvent('press', 67);
              GameController.simulateKeyEvent('down', 67);
            },
            touchEnd: function() {
              GameController.simulateKeyEvent('up', 67);
            }
          }
        ],
        dpad: {
          up: {
            width: '7%',
            height: '15%',
            stroke: 2
          },
          left: {
            width: '15%',
            height: '7%',
            stroke: 2
          },
          down: {
            width: '7%',
            height: '15%',
            stroke: 2
          },
          right: {
            width: '15%',
            height: '7%',
            stroke: 2
          }
        },
        joystick: {
          radius: 60,
          touchMove: function(e) {
            console.log(e);
          }
        }
      },
      touchRadius: 45
    },
    touchableAreas: [],
    touchableAreasCount: 0,
    touches: [],
    offsetX: 0,
    offsetY: 0,
    bound: {
      left: false,
      right: false,
      top: false,
      bottom: false
    },
    cachedSprites: {},
    paused: false,
    game: null,
    init: function(game, options) {
      var userAgent;
      if (options == null) {
        options = {};
      }
      if (!('ontouchstart' in document.documentElement)) {
        return;
      }
      this.game = game;
      extend(this.options, options);
      userAgent = navigator.userAgent.toLowerCase();
      this.performanceFriendly = userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('android') !== -1 || this.options.forcePerformanceFriendly;
      this.createOverlayCanvas();
    },

    /*
    Finds the actual 4 corners of canvas that are being used (so we don't have to clear the entire canvas each render)
    Called when each new touchableArea is added in
    @param {object} options - x, y, width, height
     */
    boundingSet: function(options) {
      var bottom, height, left, radius, right, top, width;
      if (options.width) {
        width = this.getPixels(options.width);
        height = this.getPixels(options.height);
        left = this.getPixels(options.x);
        top = this.getPixels(options.y);
      } else {
        if (this.options.touchRadius) {
          radius = this.getPixels(options.radius) * 2 + (this.getPixels(this.options.touchRadius) / 2);
        } else {
          radius = options.radius;
        }
        width = height = (radius + this.getPixels(options.stroke)) * 2;
        left = this.getPixels(options.x) - (width / 2);
        top = this.getPixels(options.y) - (height / 2);
      }
      right = left + width;
      bottom = top + height;
      if (this.bound.left === false || left < this.bound.left) {
        this.bound.left = left;
      }
      if (this.bound.right === false || right > this.bound.right) {
        this.bound.right = right;
      }
      if (this.bound.top === false || top < this.bound.top) {
        this.bound.top = top;
      }
      if (this.bound.bottom === false || bottom > this.bound.bottom) {
        this.bound.bottom = bottom;
      }
    },

    /*
    Creates the game controls
     */
    createOverlayCanvas: function() {
      this.setTouchEvents();
      this.loadSide('left');
      this.loadSide('right');
      this.render();
      if (!this.touches || this.touches.length === 0) {
        this.paused = true;
      }
    },
    pixelRatio: 1,

    /*
    Returns the scaled pixels. Given the value passed
    @param {int/string} value - either an integer for # of pixels, or 'x%' for relative
    @param {char} axis - x, y
     */
    getPixels: function(value, axis) {
      if (typeof value === 'undefined') {
        return 0;
      } else if (typeof value === 'number') {
        return value;
      } else {
        if (axis === 'x') {
          return (parseInt(value) / 100) * this.game.width;
        } else {
          return (parseInt(value) / 100) * this.game.height;
        }
      }
    },

    /*
    Simulates a key press
    @param {string} eventName - 'down', 'up'
    @param {char} character
     */
    simulateKeyEvent: function(eventName, keyCode) {
      var oEvent;
      if (typeof window.onkeydown === 'undefined') {
        return false;
      }
      oEvent = document.createEvent('KeyboardEvent');
      if (oEvent.initKeyboardEvent != null) {
        oEvent.initKeyboardEvent('key' + eventName, true, true, document.defaultView, false, false, false, false, keyCode, keyCode);
      } else {
        oEvent.initKeyEvent('key' + eventName, true, true, document.defaultView, false, false, false, false, keyCode, keyCode);
      }
      oEvent.keyCodeVal = keyCode;
    },
    setTouchEvents: function() {},

    /*
    Adds the area to a list of touchable areas, draws
    @param {object} options with properties: x, y, width, height, touchStart, touchEnd, touchMove
     */
    addTouchableDirection: function(options) {
      var direction;
      direction = new TouchableDirection(this, options);
      direction.id = this.touchableAreas.push(direction);
      this.touchableAreasCount++;
      this.boundingSet(options);
    },

    /*
    Adds the circular area to a list of touchable areas, draws
    @param {object} options with properties: x, y, width, height, touchStart, touchEnd, touchMove
     */
    addJoystick: function(options) {
      var joystick;
      joystick = new TouchableJoystick(this, options);
      joystick.id = this.touchableAreas.push(joystick);
      this.touchableAreasCount++;
      this.boundingSet(options);
    },

    /*
    Adds the circular area to a list of touchable areas, draws
    @param {object} options with properties: x, y, width, height, touchStart, touchEnd, touchMove
     */
    addButton: function(options) {
      var button;
      button = new TouchableButton(this, options);
      button.id = this.touchableAreas.push(button);
      this.touchableAreasCount++;
      this.boundingSet(options);
    },
    addTouchableArea: function(check, callback) {},
    loadButtons: function(side) {
      var buttons, i, j, posX, posY;
      buttons = this.options[side].buttons;
      i = 0;
      j = buttons.length;
      while (i < j) {
        if (typeof buttons[i] === 'undefined' || typeof buttons[i].offset === 'undefined') {

        } else {
          posX = this.getPositionX(side);
          posY = this.getPositionY(side);
          buttons[i].x = posX + this.getPixels(buttons[i].offset.x, 'y');
          buttons[i].y = posY + this.getPixels(buttons[i].offset.y, 'y');
          this.addButton(buttons[i]);
        }
        i++;
      }
    },
    loadDPad: function(side) {
      var center, dpad, options, posX, posY;
      dpad = this.options[side].dpad || {};
      posX = this.getPositionX(side);
      posY = this.getPositionY(side);
      if ((dpad.up && dpad.left && dpad.down && dpad.right) || dpad.background) {
        options = {
          x: posX,
          y: posY,
          radius: dpad.right.height
        };
        center = new TouchableCircle(this, options);
        this.touchableAreas.push(center);
        this.touchableAreasCount++;
      }
      if (dpad.up !== false) {
        dpad.up.x = posX - this.getPixels(dpad.up.width, 'y') / 2;
        dpad.up.y = posY - (this.getPixels(dpad.up.height, 'y') + this.getPixels(dpad.left.height, 'y') / 2);
        dpad.up.direction = 'up';
        this.addTouchableDirection(dpad.up);
      }
      if (dpad.left !== false) {
        dpad.left.x = posX - (this.getPixels(dpad.left.width, 'y') + this.getPixels(dpad.up.width, 'y') / 2);
        dpad.left.y = posY - (this.getPixels(dpad.left.height, 'y') / 2);
        dpad.left.direction = 'left';
        this.addTouchableDirection(dpad.left);
      }
      if (dpad.down !== false) {
        dpad.down.x = posX - this.getPixels(dpad.down.width, 'y') / 2;
        dpad.down.y = posY + (this.getPixels(dpad.left.height, 'y') / 2);
        dpad.down.direction = 'down';
        this.addTouchableDirection(dpad.down);
      }
      if (dpad.right !== false) {
        dpad.right.x = posX + (this.getPixels(dpad.up.width, 'y') / 2);
        dpad.right.y = posY - this.getPixels(dpad.right.height, 'y') / 2;
        dpad.right.direction = 'right';
        this.addTouchableDirection(dpad.right);
      }
    },
    loadJoystick: function(side) {
      var joystick;
      joystick = this.options[side].joystick;
      joystick.x = this.getPositionX(side);
      joystick.y = this.getPositionY(side);
      this.addJoystick(joystick);
    },

    /*
    Used for resizing. Currently is just an alias for loadSide
     */
    reloadSide: function(side) {
      this.loadSide(side);
    },
    loadSide: function(side) {
      if (this.options[side].type === 'dpad') {
        this.loadDPad(side);
      } else if (this.options[side].type === 'joystick') {
        this.loadJoystick(side);
      } else {
        if (this.options[side].type === 'buttons') {
          this.loadButtons(side);
        }
      }
    },

    /*
    Normalize touch positions by the left and top offsets
    @param {int} x
     */
    normalizeTouchPositionX: function(x) {
      return (x - this.offsetX) * this.pixelRatio;
    },

    /*
    Normalize touch positions by the left and top offsets
    @param {int} y
     */
    normalizeTouchPositionY: function(y) {
      return (y - this.offsetY) * this.pixelRatio;
    },

    /*
    Returns the x position when given # of pixels from right (based on canvas size)
    @param {int} right
     */
    getXFromRight: function(right) {
      return this.game.width - right;
    },

    /*
    Returns the y position when given # of pixels from bottom (based on canvas size)
    @param {int} right
     */
    getYFromBottom: function(bottom) {
      return this.game.height - bottom;
    },

    /*
    Grabs the x position of either the left or right side/controls
    @param {string} side - 'left', 'right'
     */
    getPositionX: function(side) {
      if (typeof this.options[side].position.left !== 'undefined') {
        return this.getPixels(this.options[side].position.left, 'x');
      } else {
        return this.getXFromRight(this.getPixels(this.options[side].position.right, 'x'));
      }
    },

    /*
    Grabs the y position of either the left or right side/controls
    @param {string} side - 'left', 'right'
     */
    getPositionY: function(side) {
      if (typeof this.options[side].position.top !== 'undefined') {
        return this.getPixels(this.options[side].position.top, 'y');
      } else {
        return this.getYFromBottom(this.getPixels(this.options[side].position.bottom, 'y'));
      }
    },

    /*
    Processes the info for each touchableArea
     */
    renderAreas: function() {
      var area, i, j, k, l, touch, touched, x, y;
      i = 0;
      j = this.touchableAreasCount;
      while (i < j) {
        area = this.touchableAreas[i];
        if (typeof area !== 'undefined') {
          area.draw();
          touched = false;
          k = 0;
          l = this.touches.length;
          while (k < l) {
            touch = this.touches[k];
            if (typeof touch !== 'undefined') {
              x = this.normalizeTouchPositionX(touch.clientX);
              y = this.normalizeTouchPositionY(touch.clientY);
              if ((area.check(x, y)) !== false) {
                if (!touched) {
                  touched = this.touches[k];
                }
              }
              k++;
            }
          }
          if (touched) {
            if (!area.active) {
              area.touchStartWrapper(touched);
            }
            area.touchMoveWrapper(touched);
          } else {
            if (area.active) {
              area.touchEndWrapper(touched);
            }
          }
          i++;
        }
      }
    },
    render: function() {
      if (!this.paused || !this.performanceFriendly) {
        this.renderAreas();
      }
      this.ready = true;
    },

    /*
    So we can keep scope, and don't have to create a new obj every requestAnimationFrame (bad for garbage collection)
     */
    renderWrapper: function() {
      GameController.render();
    }
  };
})();


/*
Superclass for touchable stuff
 */

TouchableArea = (function() {
  TouchableArea.prototype.touchStart = null;

  TouchableArea.prototype.touchMove = null;

  TouchableArea.prototype.touchEnd = null;

  TouchableArea.prototype.type = 'area';

  TouchableArea.prototype.id = false;

  TouchableArea.prototype.active = false;

  function TouchableArea(controller) {
    this.controller = controller;
  }


  /*
  Sets the user-specified callback for this direction being touched
  @param {function} callback
   */

  TouchableArea.prototype.setTouchStart = function(callback) {
    this.touchStart = callback;
  };


  /*
  Called when this direction is no longer touched
   */

  TouchableArea.prototype.touchStartWrapper = function(e) {
    if (this.touchStart) {
      this.touchStart();
    }
    if (typeof this.setActive === "function") {
      this.setActive(true);
    }
    this.active = true;
  };


  /*
  Sets the user-specified callback for this direction no longer being touched
  @param {function} callback
   */

  TouchableArea.prototype.setTouchMove = function(callback) {
    this.touchMove = callback;
  };


  /*
  Called when this direction is moved. Make sure it's actually changed before passing to developer
   */

  TouchableArea.prototype.lastPosX = 0;

  TouchableArea.prototype.lastPosY = 0;

  TouchableArea.prototype.touchMoveWrapper = function(touch, event) {
    var pos;
    pos = touch.getLocation();
    if (this.touchMove && (pos.x !== TouchableArea.prototype.lastPosX || pos.y !== TouchableArea.prototype.lastPosY)) {
      this.touchMove();
      this.lastPosX = pos.x;
      this.lastPosY = pos.y;
    }
    this.active = true;
    if (typeof this.setActive === "function") {
      this.setActive(true);
    }
  };


  /*
  Sets the user-specified callback for this direction no longer being touched
  @param {function} callback
   */

  TouchableArea.prototype.setTouchEnd = function(callback) {
    this.touchEnd = callback;
  };


  /*
  Called when this direction is first touched
   */

  TouchableArea.prototype.touchEndWrapper = function(e) {
    if (this.touchEnd) {
      this.touchEnd();
    }
    this.active = false;
    if (typeof this.setActive === "function") {
      this.setActive(false);
    }
    this.controller.render();
  };

  return TouchableArea;

})();

TouchableButton = (function(_super) {
  var uniqueId;

  __extends(TouchableButton, _super);

  uniqueId = 0;

  function TouchableButton(controller, options) {
    this.setActive = __bind(this.setActive, this);
    var property, value;
    for (property in options) {
      value = options[property];
      if (property === 'x') {
        this[property] = controller.getPixels(value, 'x');
      } else if (property === 'x' || property === 'radius') {
        this[property] = controller.getPixels(value, 'y');
      } else {
        this[property] = value;
      }
    }
    TouchableButton.__super__.constructor.call(this, controller);
    this.sprite = this.createSprite(controller.game);
  }

  TouchableButton.prototype.sprite = null;

  TouchableButton.prototype.type = 'button';

  TouchableButton.prototype.fontFamily = 'opendyslexic';

  TouchableButton.prototype.id = -1;


  /*
  Checks if the touch is within the bounds of this direction
   */

  TouchableButton.prototype.check = function(touchX, touchY) {
    if ((Math.abs(touchX - this.x) < this.radius + (this.controller.options.touchRadius / 2)) && (Math.abs(touchY - this.y) < this.radius + (this.controller.options.touchRadius / 2))) {
      return true;
    }
    return false;
  };

  TouchableButton.prototype.draw = function() {};

  TouchableButton.prototype.setActive = function(active) {
    this.sprite.alpha = active ? 1.0 : 0.8;
  };

  TouchableButton.prototype.createSprite = function(game) {
    var bitmap, ctx, gradient, sprite, textShadowColor;
    bitmap = game.add.bitmapData(2 * (this.radius + this.stroke), 2 * (this.radius + this.stroke));
    ctx = bitmap.context;
    ctx.lineWidth = this.stroke;
    gradient = ctx.createRadialGradient(this.radius, this.radius, 1, this.radius, this.radius, this.radius);
    textShadowColor = void 0;
    switch (this.backgroundColor || 'white') {
      case 'blue':
        gradient.addColorStop(0, 'rgba(123, 181, 197, 0.6)');
        gradient.addColorStop(1, '#105a78');
        textShadowColor = '#0A4861';
        break;
      case 'green':
        gradient.addColorStop(0, 'rgba(29, 201, 36, 0.6)');
        gradient.addColorStop(1, '#107814');
        textShadowColor = '#085C0B';
        break;
      case 'red':
        gradient.addColorStop(0, 'rgba(165, 34, 34, 0.6)');
        gradient.addColorStop(1, '#520101');
        textShadowColor = '#330000';
        break;
      case 'yellow':
        gradient.addColorStop(0, 'rgba(219, 217, 59, 0.6)');
        gradient.addColorStop(1, '#E8E10E');
        textShadowColor = '#BDB600';
        break;
      case 'white':
        gradient.addColorStop(0, 'rgba( 255,255,255,.3 )');
        gradient.addColorStop(1, '#eee');
    }
    ctx.fillStyle = gradient;
    ctx.strokeStyle = textShadowColor;
    ctx.beginPath();
    ctx.arc(bitmap.width / 2, bitmap.width / 2, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
    if (this.label) {
      ctx.fillStyle = textShadowColor;
      ctx.font = 'bold ' + (this.fontSize || bitmap.height * 0.35) + 'px ' + this.fontFamily;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.label, bitmap.height / 2 + 2, bitmap.height / 2 + 2);
      ctx.fillStyle = this.fontColor;
      ctx.font = 'bold ' + (this.fontSize || bitmap.height * 0.35) + 'px ' + this.fontFamily;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.label, bitmap.height / 2, bitmap.height / 2);
    }
    sprite = game.add.sprite(this.x, this.y, bitmap);
    sprite.alpha = 0.8;
    sprite.inputEnabled = true;
    sprite.events.onInputDown.add(this.touchStartWrapper, this);
    sprite.events.onInputUp.add(this.touchEndWrapper, this);
    return sprite;
  };

  return TouchableButton;

})(TouchableArea);

TouchableCircle = (function(_super) {
  __extends(TouchableCircle, _super);

  function TouchableCircle(controller, options) {
    var property, value;
    this.controller = controller;
    for (property in options) {
      value = options[property];
      if (property === 'x') {
        this[property] = this.controller.getPixels(value, 'x');
      } else if (property === 'x' || property === 'radius') {
        this[property] = this.controller.getPixels(value, 'y');
      } else {
        this[property] = value;
      }
    }
    this.sprite = this.createSprite(this.controller.game);
    TouchableCircle.__super__.constructor.call(this, this.controller);
  }


  /*
  No touch for this fella
   */

  TouchableCircle.prototype.check = function(touchX, touchY) {
    return false;
  };

  TouchableCircle.prototype.draw = function() {};

  TouchableCircle.prototype.createSprite = function(game) {
    var bitmap, ctx, gradient, hw, sprite;
    this.stroke = this.stroke || 2;
    hw = 2 * (this.radius + this.controller.options.touchRadius + this.stroke);
    bitmap = game.add.bitmapData(hw, hw);
    ctx = bitmap.context;
    gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.radius);
    gradient.addColorStop(0, 'rgba( 200,200,200,.2 )');
    gradient.addColorStop(1, 'rgba( 200,200,200,.4 )');
    ctx.strokeStyle = 'rgba( 0,0,0,.4 )';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
    sprite = game.add.sprite(this.x - this.radius, this.y - this.radius, bitmap);
    return sprite;
  };

  return TouchableCircle;

})(TouchableArea);

TouchableDirection = (function(_super) {
  __extends(TouchableDirection, _super);

  function TouchableDirection(controller, options) {
    var property, value;
    this.controller = controller;
    this.setActive = __bind(this.setActive, this);
    for (property in options) {
      value = options[property];
      if (property === 'x') {
        this[property] = this.controller.getPixels(value, 'x');
      } else if (property === 'y' || property === 'height' || property === 'width') {
        this[property] = this.controller.getPixels(value, 'y');
      } else {
        this[property] = value;
      }
    }
    this.sprite = this.createSprite(this.controller.game);
    TouchableDirection.__super__.constructor.call(this, this.controller);
  }

  TouchableDirection.prototype.bitmap = null;

  TouchableDirection.prototype.type = 'direction';


  /*
  Checks if the touch is within the bounds of this direction
   */

  TouchableDirection.prototype.check = function(touchX, touchY) {
    if ((Math.abs(touchX - this.x) < (this.controller.options.touchRadius / 2) || (touchX > this.x)) && (Math.abs(touchX - (this.x + this.width)) < (this.controller.options.touchRadius / 2) || (touchX < this.x + this.width)) && (Math.abs(touchY - this.y) < (this.controller.options.touchRadius / 2) || (touchY > this.y)) && (Math.abs(touchY - (this.y + this.height)) < (this.controller.options.touchRadius / 2) || (touchY < this.y + this.height))) {
      return true;
    }
    return false;
  };

  TouchableDirection.prototype.draw = function() {};

  TouchableDirection.prototype.setActive = function(active) {
    this.sprite.alpha = active ? 0.9 : 0.45;
  };

  TouchableDirection.prototype.createSprite = function(game) {
    var bitmap, ctx, gradient, sprite;
    gradient = null;
    bitmap = this.controller.game.add.bitmapData(this.width * 2 + this.stroke, this.height * 2 + this.stroke);
    ctx = bitmap.context;
    switch (this.direction || 'down') {
      case 'up':
        gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, 'rgba( 0, 0, 0, 0.45)');
        gradient.addColorStop(1, 'rgba( 0, 0, 0, 0.90)');
        break;
      case 'left':
        gradient = ctx.createLinearGradient(0, 0, this.width, 0);
        gradient.addColorStop(0, 'rgba( 0, 0, 0, 0.45)');
        gradient.addColorStop(1, 'rgba( 0, 0, 0, 0.90)');
        break;
      case 'right':
        gradient = ctx.createLinearGradient(0, 0, this.width, 0);
        gradient.addColorStop(0, 'rgba( 0, 0, 0, 0.45)');
        gradient.addColorStop(1, 'rgba( 0, 0, 0, 0.90)');
        break;
      case 'down':
        gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, 'rgba( 0, 0, 0, 0.45)');
        gradient.addColorStop(1, 'rgba( 0, 0, 0, 0.90)');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.lineWidth = this.stroke;
    ctx.strokeStyle = 'rgba( 255, 255, 255, 0.1 )';
    ctx.strokeRect(0, 0, this.width, this.height);
    sprite = game.add.sprite(this.x, this.y, bitmap);
    sprite.alpha = 0.45;
    sprite.inputEnabled = true;
    sprite.events.onInputDown.add(this.touchStartWrapper, this);
    sprite.events.onInputUp.add(this.touchEndWrapper, this);
    return sprite;
  };

  return TouchableDirection;

})(TouchableArea);

TouchableJoystick = (function(_super) {
  __extends(TouchableJoystick, _super);

  function TouchableJoystick(controller, options) {
    var property, value;
    this.controller = controller;
    this.setActive = __bind(this.setActive, this);
    for (property in options) {
      value = options[property];
      this[property] = value;
    }
    this.originX = this.currentX = this.currentX || this.x;
    this.originY = this.currentY = this.currentY || this.y;
    this.base = this.createBase(this.controller.game);
    this.sprite = this.createSprite(this.controller.game);
    TouchableJoystick.__super__.constructor.call(this, this.controller);
  }

  TouchableJoystick.prototype.type = 'joystick';


  /*
  Checks if the touch is within the bounds of this direction
   */

  TouchableJoystick.prototype.check = function(touchX, touchY) {
    if ((Math.abs(touchX - this.x) < this.radius + (this.controller.getPixels(this.controller.options.touchRadius) / 2)) && (Math.abs(touchY - this.y) < this.radius + (this.controller.getPixels(this.controller.options.touchRadius) / 2))) {
      return true;
    }
    return false;
  };

  TouchableJoystick.prototype.setActive = function(active) {
    this.sprite.alpha = active ? 0.8 : 0.4;
  };


  /*
  details for the joystick move event, stored here so we're not constantly creating new objs for garbage. The object has params:
  dx - the number of pixels the current joystick center is from the base center in x direction
  dy - the number of pixels the current joystick center is from the base center in y direction
  max - the maximum number of pixels dx or dy can be
  normalizedX - a number between -1 and 1 relating to how far left or right the joystick is
  normalizedY - a number between -1 and 1 relating to how far up or down the joystick is
   */

  TouchableJoystick.prototype.moveDetails = {};


  /*
  Called when this joystick is moved
   */

  TouchableJoystick.prototype.touchMoveWrapper = function(pointer, x, y) {
    if (!this.active) {
      return;
    }
    this.currentX = this.controller.normalizeTouchPositionX(x);
    this.currentY = this.controller.normalizeTouchPositionY(y);
    if (this.touchMove) {
      if (this.moveDetails.dx !== this.currentX - this.x && this.moveDetails.dy !== this.y - this.currentY) {
        x = this.currentX - this.radius;
        y = this.currentY - this.radius;
        this.sprite.x = x;
        this.sprite.y = y;
        this.moveDetails.dx = this.currentX - this.x;
        this.moveDetails.dy = this.y - this.currentY;
        this.moveDetails.max = this.radius + (this.controller.options.touchRadius / 2);
        this.moveDetails.normalizedX = this.moveDetails.dx / this.moveDetails.max;
        this.moveDetails.normalizedY = this.moveDetails.dy / this.moveDetails.max;
        this.touchMove(this.moveDetails);
      }
    }
  };

  TouchableJoystick.prototype.touchEndWrapper = function(e) {
    this.sprite.x = this.originX - this.radius * 0.7;
    this.sprite.y = this.originY - this.radius * 0.7;
    return TouchableJoystick.__super__.touchEndWrapper.call(this, e);
  };

  TouchableJoystick.prototype.draw = function() {};

  TouchableJoystick.prototype.createSprite = function(game) {
    var bitmap, hw, sprite;
    this.stroke = this.stroke || 2;
    hw = 2 * (this.radius + this.controller.options.touchRadius + this.stroke);
    bitmap = game.add.bitmapData(hw, hw);
    bitmap.context.fillStyle = '#444';
    bitmap.context.beginPath();
    bitmap.context.arc(this.radius * 0.7, this.radius * 0.7, this.radius * 0.7, 0, 2 * Math.PI, false);
    bitmap.context.fill();
    bitmap.context.stroke();
    sprite = game.add.sprite(this.currentX - this.radius * 0.7, this.currentY - this.radius * 0.7, bitmap);
    sprite.alpha = 0.8;
    sprite.inputEnabled = true;
    sprite.events.onInputDown.add(this.touchStartWrapper, this);
    sprite.events.onInputUp.add(this.touchEndWrapper, this);
    game.input.addMoveCallback(this.touchMoveWrapper, this);
    return sprite;
  };

  TouchableJoystick.prototype.createBase = function(game) {
    var bitmap, ctx, gradient, hw, sprite;
    this.stroke = this.stroke || 2;
    hw = 2 * (this.radius + this.controller.options.touchRadius + this.stroke);
    bitmap = game.add.bitmapData(hw, hw);
    ctx = bitmap.context;
    gradient = null;
    ctx.lineWidth = this.stroke;
    gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.radius);
    gradient.addColorStop(0, 'rgba( 200,200,200,.2 )');
    gradient.addColorStop(1, 'rgba( 200,200,200,.4 )');
    ctx.strokeStyle = 'rgba( 0,0,0,.4 )';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
    sprite = game.add.sprite(this.currentX - this.radius, this.currentY - this.radius, bitmap);
    sprite.alpha = 0.4;
    return sprite;
  };

  return TouchableJoystick;

})(TouchableArea);

MersenneTwister = (function() {
  var LOWER_MASK, M, MATRIX_A, N, UPPER_MASK;

  N = 624;

  M = 397;

  MATRIX_A = -1727483681;

  UPPER_MASK = -2147483648;

  LOWER_MASK = 2147483647;

  MersenneTwister.prototype.mt = null;

  MersenneTwister.prototype.mti = N + 1;

  function MersenneTwister(seed) {
    var _i, _results;
    this.mt = (function() {
      _results = [];
      for (var _i = 0; 0 <= N ? _i < N : _i > N; 0 <= N ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this);
    switch (typeof seed) {
      case 'number':
        this.init_genrand(seed);
        break;
      case 'object':
        this.init_genrand(seed, seed.length);
        break;
      default:
        this.init_genrand(Date.now() % LOWER_MASK);
    }
  }


  /*
   * Generates a random boolean value.
   */

  MersenneTwister.prototype.nextBool = function() {
    return (this.genrand_int32() & 1) === 1;
  };


  /*
   * Generates a random real value from 0.0, inclusive, to 1.0, exclusive.
   */

  MersenneTwister.prototype.nextDouble = function() {
    return this.genrand_res53();
  };


  /*
   * Generates a random int value from 0, inclusive, to max, exclusive.
   */

  MersenneTwister.prototype.nextInt = function(max) {
    return ~~(this.genrand_res53() * max);
  };


  /*
   * initializes mt[N] with a seed
   */

  MersenneTwister.prototype.init_genrand = function(s) {
    this.mt[0] = s & -1;
    this.mti = 1;
    while (this.mti < N) {
      this.mt[this.mti] = 1812433253 * (this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30)) + this.mti;

      /*
       * See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. #
       * In the previous versions, MSBs of the seed affect   #
       * only MSBs of the array mt[].                        #
       * 2002/01/09 modified by Makoto Matsumoto             #
       */
      this.mt[this.mti] = (this.mt[this.mti] & -1) >>> 0;

      /*
       * for >32 bit machines #
       */
      this.mti++;
    }
  };

  MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
    var i, j, k;
    this.init_genrand(19650218);
    i = 1;
    j = 0;
    k = N > key_length ? N : key_length;
    while (k > 0) {
      this.mt[i] = (this.mt[i] ^ ((this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)) * 1664525)) + init_key[j] + j;
      this.mt[i] &= -1;
      i++;
      j++;
      if (i >= N) {
        this.mt[0] = this.mt[N - 1];
        i = 1;
      }
      if (j >= key_length) {
        j = 0;
      }
      k--;
    }
    k = N - 1;
    while (k > 0) {
      this.mt[i] = (this.mt[i] ^ ((this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)) * 1566083941)) - i;
      this.mt[i] &= -1;
      i++;
      if (i >= N) {
        this.mt[0] = this.mt[N - 1];
        i = 1;
      }
      k--;
    }
    this.mt[0] = UPPER_MASK;
  };


  /*
   * generates a random number on [0,0xffffffff]-interval
   */

  MersenneTwister.prototype.genrand_int32 = function() {
    var kk, mag01, y;
    mag01 = [0, MATRIX_A];
    if (this.mti >= N) {
      if (this.mti === N + 1) {
        this.init_genrand(5489);
      }
      kk = 0;
      while (kk < N - M) {
        y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
        this.mt[kk] = this.mt[kk + M] ^ (y >>> 1) ^ mag01[y & 1];
        kk++;
      }
      while (kk < N - 1) {
        y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
        this.mt[kk] = this.mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 1];
        kk++;
      }
      y = (this.mt[N - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK);
      this.mt[N - 1] = this.mt[M - 1] ^ (y >>> 1) ^ mag01[y & 1];
      this.mti = 0;
    }
    y = this.mt[this.mti++];
    y ^= y >>> 11;
    y ^= (y << 7) & -1658038656;
    y ^= (y << 15) & -272236544;
    y ^= y >>> 18;
    return y >>> 0;
  };


  /*
  * generates a random number on [0,0x7fffffff]-interval
   */

  MersenneTwister.prototype.genrand_int31 = function() {
    return this.genrand_int32() >>> 1;
  };


  /*
   * generates a random number on [0,1]-real-interval
   */

  MersenneTwister.prototype.genrand_real1 = function() {
    return this.genrand_int32() * 2.32830643653869629e-10;
  };


  /*
   * generates a random number on [0,1)-real-interval
   */

  MersenneTwister.prototype.genrand_real2 = function() {
    return this.genrand_int32() * 2.32830643653869629e-10;
  };


  /*
   * generates a random number on (0,1)-real-interval
   */

  MersenneTwister.prototype.genrand_real3 = function() {
    return (this.genrand_int32() + 0.5) * 2.32830643653869629e-10;
  };


  /*
   * generates a random number on [0,1) with 53-bit resolution
   */

  MersenneTwister.prototype.genrand_res53 = function() {
    var a, b;
    a = this.genrand_int32() >>> 5;
    b = this.genrand_int32() >>> 6;
    return (a * 67108864.0 + b) * 1.11022302462515654e-16;
  };

  return MersenneTwister;

})();


/*
 * These real versions are due to Isaku Wada, 2002/01/09 added
 */

Properties = (function() {
  var _db, _name, _properties;

  function Properties() {}

  _db = null;

  _name = '';

  _properties = null;

  Properties.init = function(name, properties) {
    var isNew, key, val;
    _name = name;
    _properties = properties;
    _db = new localStorageDB(_name, cc.sys.localStorage);
    isNew = _db.isNew();
    if (isNew) {
      _db.createTable('settings', ['name', 'value']);
      _db.createTable('leaderboard', ['date', 'score']);
      for (key in _properties) {
        val = _properties[key];
        _db.insert('settings', {
          name: key,
          value: val
        });
      }
      return _db.commit();
    }
  };


  /*
   * Get Game Property from local storage
   *
   * @param property name
   * @return property value
   */

  Properties.get = function(prop) {
    return _db.queryAll('settings', {
      query: {
        name: prop
      }
    })[0].value;
  };


  /*
   * Set Game Property in local storage
   *
   * @param property name
   * @param property value
   * @return nothing
   */

  Properties.set = function(prop, value) {
    _db.update('settings', {
      name: prop
    }, function(row) {
      row.value = value;
      return row;
    });
    _db.commit();
  };

  return Properties;

})();

AsteroidDeathView = (function() {
  AsteroidDeathView.prototype.dots = null;

  AsteroidDeathView.prototype.x = 0;

  AsteroidDeathView.prototype.y = 0;

  AsteroidDeathView.prototype.rotation = 0;

  AsteroidDeathView.prototype.stage = null;

  AsteroidDeathView.prototype.first = true;

  function AsteroidDeathView(game, radius) {
    this.animate = __bind(this.animate, this);
    var dot, i, _i;
    this.dots = [];
    for (i = _i = 0; _i < 8; i = ++_i) {
      dot = new Dot(game, game.rnd, radius);
      this.dots.push(dot);
    }
  }

  AsteroidDeathView.prototype.animate = function(time) {
    var dot, _i, _j, _len, _len1, _ref, _ref1, _results;
    if (this.first) {
      this.first = false;
      _ref = this.dots;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dot = _ref[_i];
        dot.graphics.x = this.x;
        dot.graphics.y = this.y;
      }
    }
    _ref1 = this.dots;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      dot = _ref1[_j];
      dot.graphics.x += dot.velocity.x * time;
      _results.push(dot.graphics.y += dot.velocity.y * time);
    }
    return _results;
  };

  AsteroidDeathView.prototype.dispose = function() {
    var dot, _i, _len, _ref, _results;
    _ref = this.dots;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dot = _ref[_i];
      _results.push(dot.graphics.removeFromParent(true));
    }
    return _results;
  };

  return AsteroidDeathView;

})();

Dot = (function() {
  Dot.prototype.velocity = null;

  Dot.prototype.graphics = null;

  Dot.prototype.x = 0;

  Dot.prototype.y = 0;

  function Dot(game, rnd, maxDistance) {
    var angle, color, distance, speed, x, y;
    this.graphics = new cc.DrawNode();
    game.addChild(this.graphics);
    color = cc.color(255, 255, 255, 255);
    angle = rnd.nextDouble() * 2 * Math.PI;
    distance = rnd.nextDouble() * maxDistance;
    x = Math.cos(angle) * distance;
    y = Math.sin(angle) * distance;
    this.graphics.drawDot(cc.p(x, y), 1, color);
    speed = rnd.nextDouble() * 10 + 10;
    this.velocity = new Point(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  return Dot;

})();

AsteroidView = (function() {
  AsteroidView.prototype.graphics = null;

  function AsteroidView(game, radius) {
    var angle, color, length, posX, posY, rnd, v;
    rnd = game.rnd;
    this.graphics = new cc.DrawNode();
    game.addChild(this.graphics);
    color = cc.color(255, 255, 255, 255);
    angle = 0;
    v = [cc.p(radius, 0)];
    while (angle < Math.PI * 2) {
      length = (0.75 + rnd.nextDouble() * 0.25) * radius;
      posX = Math.cos(angle) * length;
      posY = Math.sin(angle) * length;
      v.push(cc.p(posX, posY));
      angle += rnd.nextDouble() * 0.5;
    }
    v.push(cc.p(radius, 0));
    this.graphics.drawPoly(v, color, 1, color);
  }

  AsteroidView.prototype.dispose = function() {
    return this.graphics.removeFromParent(true);
  };

  return AsteroidView;

})();

BackgroundView = (function() {
  BackgroundView.prototype.graphics = null;

  function BackgroundView(game, path) {
    this.graphics = new cc.Sprite(path);
    game.addChild(this.graphics);
  }

  BackgroundView.prototype.dispose = function() {
    return this.graphics.removeFromParent(true);
  };

  return BackgroundView;

})();

BulletView = (function() {
  BulletView.prototype.graphics = null;

  function BulletView(game) {
    var color;
    this.graphics = new cc.DrawNode();
    game.addChild(this.graphics);
    color = cc.color(255, 255, 255, 255);
    this.graphics.drawDot(cc.p(0, 0), 2, color);
  }

  BulletView.prototype.dispose = function() {
    return this.graphics.removeFromParent(true);
  };

  return BulletView;

})();

DpadController = (function() {
  DpadController.prototype.graphics = null;

  function DpadController(game) {
    var color;
    this.graphics = new cc.DrawNode();
    game.addChild(this.graphics);
    color = cc.color(255, 255, 255, 255);
    this.graphics.drawDot(cc.p(0, 0), 2, color);
  }

  DpadController.prototype.dispose = function() {
    return this.graphics.removeFromParent(true);
  };

  return DpadController;

})();

FireButton = (function() {
  FireButton.prototype.graphics = null;

  function FireButton(game) {
    var color;
    this.graphics = new cc.DrawNode();
    game.addChild(this.graphics);
    color = cc.color(255, 255, 255, 255);
    this.graphics.drawDot(cc.p(0, 0), 2, color);
  }

  FireButton.prototype.dispose = function() {
    return this.graphics.removeFromParent(true);
  };

  return FireButton;

})();

HudView = (function() {
  HudView.prototype.graphics = null;

  HudView.prototype.score = null;

  HudView.prototype.lives = null;

  HudView.prototype.x = 0;

  HudView.prototype.y = 0;

  HudView.prototype.rotation = 0;

  function HudView(game, stage) {
    this.setScore = __bind(this.setScore, this);
    this.setLives = __bind(this.setLives, this);
    var size;
    size = cc.director.getWinSize();
    this.graphics = new cc.DrawNode();
    this.graphics.drawRect(cc.p(0, size.height / 2 + 40), cc.p(30, size.height / 2 - 40), cc.color(0xc0, 0xc0, 0xc0, 127));
    game.addChild(this.graphics);
    this.score = cc.LabelTTF.create('SCORE: 0', 'opendyslexic', 18);
    this.score.setPosition(cc.p(size.width - 130, size.height - 20));
    game.addChild(this.score);
    this.setScore(0);
    this.setLives(3);
  }

  HudView.prototype.dispose = function() {
    this.graphics.removeFromParent(true);
    return this.score.removeFromParent(true);
  };

  HudView.prototype.setLives = function(lives) {};

  HudView.prototype.setScore = function(score) {
    this.score.setString("SCORE: " + score);
  };

  return HudView;

})();


/*
 * Provide user input
 */

KeyPoll = (function() {
  KeyPoll.KEY_LEFT = 37;

  KeyPoll.KEY_UP = 38;

  KeyPoll.KEY_RIGHT = 39;

  KeyPoll.KEY_Z = 90;

  KeyPoll.KEY_W = 87;

  KeyPoll.KEY_SPACE = 32;

  KeyPoll.prototype.states = null;

  KeyPoll.prototype.keys = [KeyPoll.KEY_LEFT, KeyPoll.KEY_RIGHT, KeyPoll.KEY_Z, KeyPoll.KEY_UP, KeyPoll.KEY_SPACE];

  function KeyPoll(game) {
    this.game = game;
    this.isUp = __bind(this.isUp, this);
    this.isDown = __bind(this.isDown, this);
    this.states = {};
    cc.eventManager.addListener({
      event: cc.EventListener.KEYBOARD,
      onKeyPressed: (function(_this) {
        return function(keyCode, event) {
          _this.states[keyCode] = true;
        };
      })(this),
      onKeyReleased: (function(_this) {
        return function(keyCode, event) {
          if (_this.states[keyCode]) {
            _this.states[keyCode] = false;
          }
        };
      })(this)
    }, this.game);
  }

  KeyPoll.prototype.isDown = function(keyCode) {
    return this.states[keyCode];
  };

  KeyPoll.prototype.isUp = function(keyCode) {
    return !this.states[keyCode];
  };

  return KeyPoll;

})();

Point = (function() {
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

SpaceshipDeathView = (function() {
  SpaceshipDeathView.prototype.shape1 = null;

  SpaceshipDeathView.prototype.shape2 = null;

  SpaceshipDeathView.prototype.vel1 = null;

  SpaceshipDeathView.prototype.vel2 = null;

  SpaceshipDeathView.prototype.rot1 = null;

  SpaceshipDeathView.prototype.rot2 = null;

  SpaceshipDeathView.prototype.first = true;

  SpaceshipDeathView.prototype.x = 0;

  SpaceshipDeathView.prototype.y = 0;

  SpaceshipDeathView.prototype.rotation = 0;

  SpaceshipDeathView.prototype.check = true;

  function SpaceshipDeathView(game) {
    this.animate = __bind(this.animate, this);
    var color, rnd, v;
    rnd = game.rnd;
    color = cc.color(255, 255, 255, 255);
    this.shape1 = new cc.DrawNode();
    game.addChild(this.shape1);
    v = [cc.p(10, 0), cc.p(-7, 7), cc.p(-4, 0), cc.p(10, 0)];
    this.shape1.drawPoly(v, color, 1, color);
    this.shape2 = new cc.DrawNode();
    game.addChild(this.shape2);
    v = [cc.p(10, 0), cc.p(-7, -7), cc.p(-4, 0), cc.p(10, 0)];
    this.shape2.drawPoly(v, color, 1, color);
    this.vel1 = new Point(rnd.nextDouble() * 10 - 5, rnd.nextDouble() * 10 + 10);
    this.vel2 = new Point(rnd.nextDouble() * 10 - 5, -(rnd.nextDouble() * 10 + 10));
    this.rot1 = rnd.nextDouble() * 300 - 150;
    this.rot2 = rnd.nextDouble() * 300 - 150;
  }

  SpaceshipDeathView.prototype.dispose = function() {
    this.shape1.removeFromParent(true);
    return this.shape2.removeFromParent(true);
  };

  SpaceshipDeathView.prototype.animate = function(time) {
    if (this.first) {
      this.first = false;
      this.shape1.setPosition(cc.p(this.x, this.y));
      this.shape2.setPosition(cc.p(this.x, this.y));
      this.shape1.setRotation(this.rotation);
      this.shape2.setRotation(this.rotation);
    }
    this.shape1.setPositionX(this.shape1.getPositionX() + this.vel1.x * time);
    this.shape1.setPositionY(this.shape1.getPositionY() + this.vel1.y * time);
    this.shape1.setRotation(this.shape1.getRotation() + this.rot1 * time);
    this.shape2.setPositionX(this.shape2.getPositionX() + this.vel2.x * time);
    this.shape2.setPositionY(this.shape2.getPositionY() + this.vel2.y * time);
    this.shape2.setRotation(this.shape2.getRotation() + this.rot2 * time);
  };

  return SpaceshipDeathView;

})();

SpaceshipView = (function() {
  SpaceshipView.prototype.graphics = null;

  function SpaceshipView(game) {
    this.game = game;
    this.graphics = new cc.DrawNode();
    this.game.addChild(this.graphics);
    this.draw(cc.color(255, 255, 255, 255));
  }

  SpaceshipView.prototype.dispose = function() {
    return this.graphics.removeFromParent(true);
  };

  SpaceshipView.prototype.draw = function(color) {
    var v;
    v = [cc.p(10, 0), cc.p(-7, 7), cc.p(-4, 0), cc.p(-7, -7), cc.p(10, 0)];
    return this.graphics.drawPoly(v, color, 1, color);
  };

  return SpaceshipView;

})();

Sound = (function() {
  Sound.volume = 0.5;

  Sound.enabled = true;

  Sound.FACTOR = 2;

  Sound.preload = function(src) {
    var audio;
    audio = new window.Audio();
    audio.src = src;
    audio.volume = 0;
    audio.play();
    return src;
  };

  Sound.prototype.src = '';

  Sound.prototype.audio = null;

  function Sound() {
    this.audio = new window.Audio();
    this.audio.src = this.src;
    this.audio.load();
  }

  Sound.prototype.loop = function() {
    return this;
  };

  Sound.prototype.play = function() {
    if (Sound.enabled) {
      this.audio.volume = Sound.volume;
      this.audio.play();
    }
    return this;
  };

  Sound.prototype.pause = function() {
    this.audio.pause();
    return this;
  };

  return Sound;

})();

WaitForStartView = (function() {
  var Signal0, isDesktop, isTouch;

  WaitForStartView.count = 0;

  Signal0 = ash.signals.Signal0;

  WaitForStartView.prototype.x = 0;

  WaitForStartView.prototype.y = 0;

  WaitForStartView.prototype.rotation = 0;

  WaitForStartView.prototype.text1 = null;

  WaitForStartView.prototype.text2 = null;

  WaitForStartView.prototype.text3 = null;

  WaitForStartView.prototype.click = null;

  isTouch = cc.sys.isMobile;

  isDesktop = !cc.sys.isMobile;

  function WaitForStartView(game) {
    var size, x;
    this.game = game;
    this.onTouchEnded = __bind(this.onTouchEnded, this);
    this.onTouchMoved = __bind(this.onTouchMoved, this);
    this.onTouchBegan = __bind(this.onTouchBegan, this);
    this.start = __bind(this.start, this);
    this.click = new Signal0();
    size = cc.director.getWinSize();
    x = Math.floor(size.width / 2);
    if ((WaitForStartView.count++) === 1) {
      this.text1 = cc.LabelTTF.create('GAME OVER', 'opendyslexic', 40);
      this.text1.setPosition(cc.p(x, 200));
    } else {
      this.text1 = cc.LabelTTF.create('ASTEROIDS', 'opendyslexic', 40);
      this.text1.setPosition(cc.p(x, 200));
    }
    this.game.addChild(this.text1);
    if (isTouch) {
      this.text2 = cc.LabelTTF.create('TOUCH TO START', 'opendyslexic', 12);
      this.text2.setPosition(cc.p(x, 175));
    } else {
      this.text2 = cc.LabelTTF.create('CLICK TO START', 'opendyslexic', 12);
      this.text2.setPosition(cc.p(x, 175));
    }
    this.game.addChild(this.text2);
    if (isDesktop) {
      this.text3 = cc.LabelTTF.create('Z ~ Fire  |  SPACE ~ Warp  |  Left/Right ~ Turn  |  Up ~ Accelerate', 'opendyslexic', 10);
      this.text3.setPosition(cc.p(x, 40));
      this.game.addChild(this.text3);
    }
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: this.onTouchBegan,
      onTouchMoved: this.onTouchMoved,
      onTouchEnded: this.onTouchEnded
    }, this.text1);
  }

  WaitForStartView.prototype.start = function(data) {};

  WaitForStartView.prototype.onTouchBegan = function(touch, event) {
    this.game.removeChild(this.text1);
    this.game.removeChild(this.text2);
    if (this.text3 != null) {
      this.game.removeChild(this.text3);
    }
    return this.click.dispatch();
  };

  WaitForStartView.prototype.onTouchMoved = function(touch, event) {};

  WaitForStartView.prototype.onTouchEnded = function(touch, event) {};

  return WaitForStartView;

})();

WarpButton = (function() {
  WarpButton.prototype.graphics = null;

  function WarpButton(game) {
    var color;
    this.graphics = new cc.DrawNode();
    game.addChild(this.graphics);
    color = cc.color(255, 255, 255, 255);
    this.graphics.drawDot(cc.p(0, 0), 2, color);
  }

  WarpButton.prototype.dispose = function() {
    return this.graphics.removeFromParent(true);
  };

  return WarpButton;

})();


/*
 * Components
 */

Components = (function() {
  var Animation, Asteroid, Audio, Bullet, Collision, DeathThroes, Display, GameState, Gun, GunControls, Hud, MotionControls, Physics, Position, Spaceship, WaitForStart;
  return {
    Animation: Animation = (function() {
      Animation.prototype.animation = null;

      function Animation(animation) {
        this.animation = animation;
      }

      return Animation;

    })(),
    Asteroid: Asteroid = (function() {
      Asteroid.prototype.fsm = null;

      function Asteroid(fsm) {
        this.fsm = fsm;
      }

      return Asteroid;

    })(),
    Audio: Audio = (function() {
      Audio.prototype.toPlay = null;

      function Audio() {
        this.toPlay = [];
      }

      Audio.prototype.play = function(sound) {
        return this.toPlay.push(sound);
      };

      return Audio;

    })(),
    Bullet: Bullet = (function() {
      Bullet.prototype.lifeRemaining = 0;

      function Bullet(lifeRemaining) {
        this.lifeRemaining = lifeRemaining;
      }

      return Bullet;

    })(),
    Collision: Collision = (function() {
      Collision.prototype.radius = 0;

      function Collision(radius) {
        this.radius = radius;
      }

      return Collision;

    })(),
    DeathThroes: DeathThroes = (function() {
      DeathThroes.prototype.countdown = 0;

      DeathThroes.prototype.body = null;

      function DeathThroes(duration) {
        this.countdown = duration;
      }

      return DeathThroes;

    })(),
    Display: Display = (function() {
      Display.prototype.graphic = 0;

      function Display(graphic) {
        this.graphic = graphic;
      }

      return Display;

    })(),
    GameState: GameState = (function() {
      function GameState() {}

      GameState.prototype.lives = 3;

      GameState.prototype.level = 0;

      GameState.prototype.hits = 0;

      GameState.prototype.bonus = 0;

      GameState.prototype.playing = false;

      GameState.prototype.setForStart = function() {
        this.lives = 3;
        this.level = 0;
        this.hits = 0;
        this.playing = true;
      };

      return GameState;

    })(),
    Gun: Gun = (function() {
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

    })(),
    GunControls: GunControls = (function() {
      GunControls.prototype.trigger = 0;

      function GunControls(trigger) {
        this.trigger = trigger;
      }

      return GunControls;

    })(),
    Hud: Hud = (function() {
      Hud.prototype.view = null;

      Hud.prototype.leaderboard = false;

      function Hud(view) {
        this.view = view;
      }

      return Hud;

    })(),
    MotionControls: MotionControls = (function() {
      MotionControls.prototype.left = 0;

      MotionControls.prototype.right = 0;

      MotionControls.prototype.accelerate = 0;

      MotionControls.prototype.warp = 0;

      MotionControls.prototype.accelerationRate = 0;

      MotionControls.prototype.rotationRate = 0;

      function MotionControls(left, right, accelerate, warp, accelerationRate, rotationRate) {
        this.left = left;
        this.right = right;
        this.accelerate = accelerate;
        this.warp = warp;
        this.accelerationRate = accelerationRate;
        this.rotationRate = rotationRate;
      }

      return MotionControls;

    })(),
    Physics: Physics = (function() {
      Physics.prototype.body = null;

      Physics.prototype.previousX = 0;

      Physics.prototype.previousY = 0;

      Physics.prototype.previousAngle = 0;

      Physics.prototype.type = 0;

      Physics.prototype.entity = null;

      function Physics(body, type, entity) {
        this.body = body;
        this.type = type;
        this.entity = entity;
      }

      return Physics;

    })(),
    Position: Position = (function() {
      Position.prototype.position = null;

      Position.prototype.rotation = 0;

      function Position(x, y, rotation) {
        this.rotation = rotation != null ? rotation : 0;
        this.position = new Point(x, y);
      }

      return Position;

    })(),
    Spaceship: Spaceship = (function() {
      Spaceship.prototype.fsm = null;

      function Spaceship(fsm) {
        this.fsm = fsm;
      }

      return Spaceship;

    })(),
    WaitForStart: WaitForStart = (function() {
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

    })()
  };
})();


/*
 * Node templates
 */

Nodes = (function() {
  var AnimationNode, AsteroidCollisionNode, AudioNode, BulletAgeNode, BulletCollisionNode, DeathThroesNode, GameNode, GunControlNode, HudNode, MovementNode, PhysicsControlNode, PhysicsNode, RenderNode, SpaceshipNode, WaitForStartNode;
  return {
    AnimationNode: AnimationNode = (function() {
      function AnimationNode() {}

      AnimationNode.prototype.animation = Components.Animation;

      return AnimationNode;

    })(),
    AsteroidCollisionNode: AsteroidCollisionNode = (function() {
      function AsteroidCollisionNode() {}

      AsteroidCollisionNode.prototype.asteroid = Components.Asteroid;

      AsteroidCollisionNode.prototype.position = Components.Position;

      AsteroidCollisionNode.prototype.collision = Components.Collision;

      AsteroidCollisionNode.prototype.audio = Components.Audio;

      AsteroidCollisionNode.prototype.physics = Components.Physics;

      return AsteroidCollisionNode;

    })(),
    AudioNode: AudioNode = (function() {
      function AudioNode() {}

      AudioNode.prototype.audio = Components.Audio;

      return AudioNode;

    })(),
    BulletAgeNode: BulletAgeNode = (function() {
      function BulletAgeNode() {}

      BulletAgeNode.prototype.bullet = Components.Bullet;

      BulletAgeNode.prototype.physics = Components.Physics;

      BulletAgeNode.prototype.display = Components.Display;

      return BulletAgeNode;

    })(),
    BulletCollisionNode: BulletCollisionNode = (function() {
      function BulletCollisionNode() {}

      BulletCollisionNode.prototype.bullet = Components.Bullet;

      BulletCollisionNode.prototype.position = Components.Position;

      BulletCollisionNode.prototype.physics = Components.Physics;

      return BulletCollisionNode;

    })(),
    DeathThroesNode: DeathThroesNode = (function() {
      function DeathThroesNode() {}

      DeathThroesNode.prototype.dead = Components.DeathThroes;

      DeathThroesNode.prototype.display = Components.Display;

      return DeathThroesNode;

    })(),
    GameNode: GameNode = (function() {
      function GameNode() {}

      GameNode.prototype.state = Components.GameState;

      return GameNode;

    })(),
    GunControlNode: GunControlNode = (function() {
      function GunControlNode() {}

      GunControlNode.prototype.audio = Components.Audio;

      GunControlNode.prototype.control = Components.GunControls;

      GunControlNode.prototype.gun = Components.Gun;

      GunControlNode.prototype.position = Components.Position;

      return GunControlNode;

    })(),
    HudNode: HudNode = (function() {
      function HudNode() {}

      HudNode.prototype.state = Components.GameState;

      HudNode.prototype.hud = Components.Hud;

      return HudNode;

    })(),
    MovementNode: MovementNode = (function() {
      function MovementNode() {}

      MovementNode.prototype.position = Components.Position;

      return MovementNode;

    })(),
    PhysicsControlNode: PhysicsControlNode = (function() {
      function PhysicsControlNode() {}

      PhysicsControlNode.prototype.control = Components.MotionControls;

      PhysicsControlNode.prototype.physics = Components.Physics;

      PhysicsControlNode.prototype.display = Components.Display;

      return PhysicsControlNode;

    })(),
    PhysicsNode: PhysicsNode = (function() {
      function PhysicsNode() {}

      PhysicsNode.prototype.position = Components.Position;

      PhysicsNode.prototype.physics = Components.Physics;

      return PhysicsNode;

    })(),
    RenderNode: RenderNode = (function() {
      function RenderNode() {}

      RenderNode.prototype.position = Components.Position;

      RenderNode.prototype.display = Components.Display;

      return RenderNode;

    })(),
    SpaceshipNode: SpaceshipNode = (function() {
      function SpaceshipNode() {}

      SpaceshipNode.prototype.spaceship = Components.Spaceship;

      SpaceshipNode.prototype.position = Components.Position;

      return SpaceshipNode;

    })(),
    WaitForStartNode: WaitForStartNode = (function() {
      function WaitForStartNode() {}

      WaitForStartNode.prototype.wait = Components.WaitForStart;

      return WaitForStartNode;

    })()
  };
})();

Entities = (function() {

  /*
   * Imports
   */
  var Animation, Asteroid, Audio, Bullet, Collision, DeathThroes, Display, Entity, EntityStateMachine, GameState, Gun, GunControls, Hud, MotionControls, Physics, Position, Spaceship, WaitForStart, get;

  Animation = Components.Animation;

  Asteroid = Components.Asteroid;

  Audio = Components.Audio;

  Bullet = Components.Bullet;

  Collision = Components.Collision;

  DeathThroes = Components.DeathThroes;

  Display = Components.Display;

  GameState = Components.GameState;

  Gun = Components.Gun;

  GunControls = Components.GunControls;

  Hud = Components.Hud;

  MotionControls = Components.MotionControls;

  Physics = Components.Physics;

  Position = Components.Position;

  Spaceship = Components.Spaceship;

  WaitForStart = Components.WaitForStart;

  Entity = ash.core.Entity;

  EntityStateMachine = ash.fsm.EntityStateMachine;

  Entities.ASTEROID = 1;

  Entities.SPACESHIP = 2;

  Entities.BULLET = 3;

  Entities.prototype.LEFT = KeyPoll.KEY_LEFT;

  Entities.prototype.RIGHT = KeyPoll.KEY_RIGHT;

  Entities.prototype.THRUST = KeyPoll.KEY_UP;

  Entities.prototype.FIRE = KeyPoll.KEY_Z;

  Entities.prototype.WARP = KeyPoll.KEY_SPACE;

  get = function(prop) {
    return parseFloat(Properties.get(prop));
  };

  Entities.prototype.game = null;

  Entities.prototype.ash = null;

  Entities.prototype.world = null;

  Entities.prototype.waitEntity = null;

  Entities.prototype.rnd = null;

  Entities.prototype.bulletId = 0;

  Entities.prototype.asteroidId = 0;

  Entities.prototype.spaceshipId = 0;

  function Entities(game) {
    this.game = game;
    this.createUserBullet = __bind(this.createUserBullet, this);
    this.createSpaceship = __bind(this.createSpaceship, this);
    this.ash = this.game.ash;
    this.rnd = this.game.rnd;
    this.world = this.game.world;
  }

  Entities.prototype.destroyEntity = function(entity) {
    this.ash.removeEntity(entity);
  };


  /*
   * Game State
   */

  Entities.prototype.createGame = function() {
    var gameEntity, hud;
    hud = new HudView(this.game);
    gameEntity = new Entity('game').add(new GameState()).add(new Hud(hud));
    this.ash.addEntity(gameEntity);
    return gameEntity;
  };


  /*
   * Start...
   */

  Entities.prototype.createWaitForClick = function() {
    var waitView;
    waitView = new WaitForStartView(this.game);
    this.waitEntity = new Entity('wait').add(new WaitForStart(waitView));
    this.waitEntity.get(WaitForStart).startGame = false;
    this.ash.addEntity(this.waitEntity);
    return this.waitEntity;
  };


  /*
   * Create an Asteroid with FSM Animation
   */

  Entities.prototype.createAsteroid = function(radius, x, y) {

    /*
     * Asteroid simulation - chipmunk
     */
    var asteroid, body, deathView, fsm, liveView, shape, v1, v2;
    body = new cp.Body(1, cp.momentForCircle(1, 0, radius, cp.v(0, 0)));
    body.p = cc.p(x, y);
    v1 = (this.rnd.nextDouble() - 0.5) * get('asteroidLinearVelocity') * (50 - radius);
    v2 = (this.rnd.nextDouble() - 0.5) * get('asteroidLinearVelocity') * (50 - radius);
    body.applyImpulse(cp.v(v1, v2), cp.v(0, 0));
    this.world.addBody(body);
    shape = new cp.CircleShape(body, radius, cp.v(0, 0));
    shape.setCollisionType(SpriteAsteroid);
    shape.setSensor(true);
    this.world.addShape(shape);

    /*
     * Asteroid entity
     */
    asteroid = new Entity();
    fsm = new EntityStateMachine(asteroid);
    liveView = new AsteroidView(this.game, radius);
    fsm.createState('alive').add(Physics).withInstance(new Physics(body, Entities.ASTEROID, asteroid)).add(Collision).withInstance(new Collision(radius)).add(Display).withInstance(new Display(liveView));
    deathView = new AsteroidDeathView(this.game, radius);
    fsm.createState('destroyed').add(DeathThroes).withInstance(new DeathThroes(3)).add(Display).withInstance(new Display(deathView)).add(Animation).withInstance(new Animation(deathView));
    asteroid.add(new Asteroid(fsm)).add(new Position(x, y, 0)).add(new Audio());
    fsm.changeState('alive');
    body.userData = {
      type: Entities.ASTEROID,
      entity: asteroid
    };
    this.ash.addEntity(asteroid);
    return asteroid;
  };


  /*
   * Create Player Spaceship with FSM Animation
   */

  Entities.prototype.createSpaceship = function() {
    var body, deathView, fsm, liveView, shape, size, spaceship, verts, x, y;
    size = cc.director.getWinSize();
    x = this.rnd.nextInt(size.width);
    y = this.rnd.nextInt(size.height);
    verts = [10.0, 0.0, -7.0, -7.0, -7.0, 7.0];

    /*
     * Spaceship simulation
     */
    body = new cp.Body(1, cp.momentForPoly(1, verts, cp.v(0, 0)));
    body.p = cc.p(x, y);
    body.applyImpulse(cp.v(0, 0), cp.v(0, 0));
    this.world.addBody(body);
    shape = new cp.PolyShape(body, verts, cp.v(0, 0));
    shape.u = 0.1;
    shape.setCollisionType(SpriteSpaceship);
    shape.setSensor(true);
    this.world.addShape(shape);

    /*
     * Spaceship entity
     */
    spaceship = new Entity();
    fsm = new EntityStateMachine(spaceship);
    liveView = new SpaceshipView(this.game);
    fsm.createState('playing').add(Physics).withInstance(new Physics(body, Entities.SPACESHIP, spaceship)).add(MotionControls).withInstance(new MotionControls(this.LEFT, this.RIGHT, this.THRUST, this.WARP, 100, 3)).add(Gun).withInstance(new Gun(8, 0, 0.3, 2)).add(GunControls).withInstance(new GunControls(this.FIRE)).add(Collision).withInstance(new Collision(9)).add(Display).withInstance(new Display(liveView));
    deathView = new SpaceshipDeathView(this.game);
    fsm.createState('destroyed').add(DeathThroes).withInstance(new DeathThroes(5)).add(Display).withInstance(new Display(deathView)).add(Animation).withInstance(new Animation(deathView));
    spaceship.add(new Spaceship(fsm)).add(new Position(x, y, 0)).add(new Audio());
    fsm.changeState('playing');
    body.userData = {
      type: Entities.SPACESHIP,
      entity: spaceship
    };
    this.ash.addEntity(spaceship);
    return spaceship;
  };


  /*
   * Create a Bullet
   */

  Entities.prototype.createUserBullet = function(gun, parentPosition) {
    var body, bullet, bulletView, cos, shape, sin, size, v1, v2, x, y;
    cos = Math.cos(parentPosition.rotation);
    sin = Math.sin(parentPosition.rotation);
    x = cos * gun.offsetFromParent.x - sin * gun.offsetFromParent.y + parentPosition.position.x;
    y = sin * gun.offsetFromParent.x + cos * gun.offsetFromParent.y + parentPosition.position.y;
    size = cc.director.getWinSize();
    x += size.width / 2;
    y += size.height / 2;

    /*
     * Bullet simulation
     */
    body = new cp.Body(1, cp.momentForCircle(1, 0, 1, cp.v(0, 0)));
    body.p = cc.p(x, y);
    v1 = cos * get('bulletLinearVelocity');
    v2 = sin * get('bulletLinearVelocity');
    body.applyImpulse(cp.v(v1, v2), cp.v(0, 0));
    this.world.addBody(body);
    shape = new cp.CircleShape(body, 1, cp.v(0, 0));
    shape.setCollisionType(SpriteBullet);
    shape.setSensor(true);
    this.world.addShape(shape);

    /*
     * Bullet entity
     */
    bulletView = new BulletView(this.game);
    bullet = new Entity().add(new Bullet(gun.bulletLifetime)).add(new Position(x, y, 0)).add(new Collision(0)).add(new Physics(body, Entities.BULLET, bullet)).add(new Display(bulletView));
    body.userData = {
      type: Entities.BULLET,
      entity: bullet
    };
    this.ash.addEntity(bullet);
    return bullet;
  };


  /*
   * Image
   *
   * @param x
   * @param y
   * @param path
   * @return image
   */

  Entities.prototype.createImage = function(x, y, path, alpha) {
    var image;
    if (alpha == null) {
      alpha = 1;
    }
    image = new Entity();
    image.add(new Display(new BackgroundView(this.game, path)));
    image.add(new Position(x, y));
    this.ash.addEntity(image);
    return image;
  };

  Entities.prototype.createDpad = function(x, y) {
    var dpad;
    dpad = new Entity();
    dpad.add(new Display(new DpadController(this.game)));
    dpad.add(new Position(x, y));
    this.ash.addEntity(dpad);
    return dpad;
  };

  Entities.prototype.createWarp = function(x, y) {
    var warp;
    warp = new Entity();
    warp.add(new Display(new FireButton(this.game)));
    warp.add(new Position(x, y));
    this.ash.addEntity(warp);
    return warp;
  };

  Entities.prototype.createFire = function(x, y) {
    var fire;
    fire = new Entity();
    fire.add(new Display(new FireButton(this.game)));
    fire.add(new Position(x, y));
    this.ash.addEntity(fire);
    return fire;
  };

  return Entities;

})();

SystemPriorities = (function() {
  function SystemPriorities() {}

  SystemPriorities.preUpdate = 1;

  SystemPriorities.update = 2;

  SystemPriorities.move = 3;

  SystemPriorities.resolveCollisions = 4;

  SystemPriorities.stateMachines = 5;

  SystemPriorities.render = 6;

  SystemPriorities.animate = 7;

  return SystemPriorities;

})();

RenderSystem = (function(_super) {
  var Tau, j, k;

  __extends(RenderSystem, _super);

  RenderSystem.prototype.stage = null;

  RenderSystem.prototype.renderer = null;

  RenderSystem.prototype.nodes = null;

  k = 0;

  j = 0;

  Tau = Math.PI * 2;

  function RenderSystem(game) {
    this.update = __bind(this.update, this);
    this.nodes = game.ash.nodes;
  }

  RenderSystem.prototype.addToEngine = function(engine) {
    var node;
    this.nodes = engine.getNodeList(this.nodes.RenderNode);
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
    var g, node, offsetX, offsetY, pos, size;
    size = cc.director.getWinSize();
    offsetX = ~~size.width / 2;
    offsetY = ~~size.height / 2;
    node = this.nodes.head;
    while (node) {
      if ((g = node.display.graphic.graphics) != null) {
        pos = node.position.position;
        g.setPosition(cc.p(pos.x + offsetX, pos.y + offsetY));
        g.setRotation(cc.radiansToDegrees(Tau - node.position.rotation));
      }
      node = node.next;
    }
  };

  return RenderSystem;

})(ash.core.System);

AnimationSystem = (function(_super) {
  __extends(AnimationSystem, _super);

  function AnimationSystem(parent) {
    this.updateNode = __bind(this.updateNode, this);
    AnimationSystem.__super__.constructor.call(this, parent.ash.nodes.AnimationNode, this.updateNode);
  }

  AnimationSystem.prototype.updateNode = function(node, time) {
    node.animation.animation.animate(time);
  };

  return AnimationSystem;

})(ash.tools.ListIteratingSystem);

AudioSystem = (function(_super) {
  __extends(AudioSystem, _super);

  function AudioSystem(parent) {
    this.updateNode = __bind(this.updateNode, this);
    AudioSystem.__super__.constructor.call(this, parent.ash.nodes.AudioNode, this.updateNode);
  }

  AudioSystem.prototype.updateNode = function(node, time) {
    var each, sound, type, _ref;
    _ref = node.audio.toPlay;
    for (each in _ref) {
      type = _ref[each];
      sound = new type();
      sound.play(0, 1);
    }
    node.audio.toPlay = [];
  };

  return AudioSystem;

})(ash.tools.ListIteratingSystem);

BulletAgeSystem = (function(_super) {
  __extends(BulletAgeSystem, _super);

  BulletAgeSystem.prototype.entities = null;

  function BulletAgeSystem(parent) {
    this.updateNode = __bind(this.updateNode, this);
    BulletAgeSystem.__super__.constructor.call(this, parent.ash.nodes.BulletAgeNode, this.updateNode);
    this.entities = parent.entities;
  }

  BulletAgeSystem.prototype.updateNode = function(node, time) {
    var bullet;
    bullet = node.bullet;
    bullet.lifeRemaining -= time;
    if (bullet.lifeRemaining <= 0) {
      node.display.graphic.dispose();
      this.entities.destroyEntity(node.entity);
    }
  };

  return BulletAgeSystem;

})(ash.tools.ListIteratingSystem);

CollisionSystem = (function(_super) {

  /*
   * Imports
   */
  var Asteroid, AsteroidHitShip, Audio, BulletHitAsteroid, Collision, DeathThroes, Display, Physics, Position, Spaceship;

  __extends(CollisionSystem, _super);

  Asteroid = Components.Asteroid;

  Audio = Components.Audio;

  Collision = Components.Collision;

  DeathThroes = Components.DeathThroes;

  Display = Components.Display;

  Physics = Components.Physics;

  Position = Components.Position;

  Spaceship = Components.Spaceship;

  BulletHitAsteroid = 1;

  AsteroidHitShip = 2;

  CollisionSystem.prototype.world = null;

  CollisionSystem.prototype.entities = null;

  CollisionSystem.prototype.games = null;

  CollisionSystem.prototype.rnd = null;

  CollisionSystem.prototype.collisions = null;

  function CollisionSystem(game) {
    this.collisionHandler = __bind(this.collisionHandler, this);
    this.update = __bind(this.update, this);
    this.rnd = game.rnd;
    this.world = game.world;
    this.entities = game.entities;
    this.components = game.ash.components;
    this.collisions = [];
    this.world.addCollisionHandler(SpriteAsteroid, SpriteSpaceship, this.collisionHandler, null, null, null);
    this.world.addCollisionHandler(SpriteBullet, SpriteAsteroid, this.collisionHandler, null, null, null);
  }

  CollisionSystem.prototype.update = function(time) {
    var a, b, body, offsetX, offsetY, points, position, radius, size, type, x, y, _ref;
    while (this.collisions.length) {
      _ref = this.collisions.pop(), type = _ref.type, a = _ref.a, b = _ref.b;
      if (type === BulletHitAsteroid) {
        if ((a.get(Physics) != null)) {
          this.entities.destroyEntity(a);
          a.get(Display).graphic.dispose();
        }
        if ((b.get(Physics) != null)) {
          radius = b.get(Collision).radius;
          position = b.get(Position).position;
          points = (function() {
            switch (radius) {
              case 30:
                return 20;
              case 20:
                return 50;
              case 10:
                return 100;
              default:
                return 0;
            }
          })();
          if (radius > 10) {
            size = cc.director.getWinSize();
            offsetX = ~~size.width / 2;
            offsetY = ~~size.height / 2;
            x = position.x + offsetX;
            y = position.y + offsetY;
            this.entities.createAsteroid(radius - 10, x + this.rnd.nextDouble() * 10 - 5, y + this.rnd.nextDouble() * 10 - 5);
            this.entities.createAsteroid(radius - 10, x + this.rnd.nextDouble() * 10 - 5, y + this.rnd.nextDouble() * 10 - 5);
          }
          body = b.get(Physics).body;
          b.get(Display).graphic.dispose();
          b.get(Asteroid).fsm.changeState('destroyed');
          b.get(DeathThroes).body = body;
          if (this.games.head) {
            this.games.head.state.hits += points;
            this.games.head.state.bonus += points;
            while (this.games.head.state.bonus > 5000) {
              this.games.head.state.lives++;
              this.games.head.state.bonus -= 5000;
            }
          }
        }
      } else if (type === AsteroidHitShip) {
        if ((b.get(Physics) != null)) {
          body = b.get(Physics).body;
          b.get(Display).graphic.dispose();
          b.get(Spaceship).fsm.changeState('destroyed');
          b.get(DeathThroes).body = body;
          if (this.games.head) {
            this.games.head.state.lives--;
          }
        }
      }
    }
  };

  CollisionSystem.prototype.addToEngine = function(engine) {
    this.games = engine.getNodeList(Nodes.GameNode);
  };

  CollisionSystem.prototype.removeFromEngine = function(engine) {
    this.games = null;
  };


  /*
   * Collision Handler
   *
   * decode & que collisions
   */

  CollisionSystem.prototype.collisionHandler = function(arbiter, space) {
    var a, b;
    a = arbiter.a.body.userData;
    b = arbiter.b.body.userData;
    switch (a.type) {
      case Entities.ASTEROID:
        switch (b.type) {
          case Entities.BULLET:
            this.collisions.push({
              type: BulletHitAsteroid,
              a: b.entity,
              b: a.entity
            });
            break;
          case Entities.SPACESHIP:
            this.collisions.push({
              type: AsteroidHitShip,
              a: a.entity,
              b: b.entity
            });
        }
        break;
      case Entities.BULLET:
        if (b.type === Entities.ASTEROID) {
          this.collisions.push({
            type: BulletHitAsteroid,
            a: a.entity,
            b: b.entity
          });
        }
        break;
      case Entities.SPACESHIP:
        if (b.type === Entities.ASTEROID) {
          this.collisions.push({
            type: AsteroidHitShip,
            a: b.entity,
            b: a.entity
          });
        }
    }
  };

  return CollisionSystem;

})(ash.core.System);

DeathThroesSystem = (function(_super) {
  __extends(DeathThroesSystem, _super);

  DeathThroesSystem.prototype.entities = null;

  function DeathThroesSystem(game) {
    this.updateNode = __bind(this.updateNode, this);
    DeathThroesSystem.__super__.constructor.call(this, game.ash.nodes.DeathThroesNode, this.updateNode);
    this.entities = game.entities;
  }

  DeathThroesSystem.prototype.updateNode = function(node, time) {
    var dead;
    dead = node.dead;
    dead.countdown -= time;
    if (dead.countdown <= 0) {
      this.entities.destroyEntity(node.entity);
      node.display.graphic.dispose();
    }
  };

  return DeathThroesSystem;

})(ash.tools.ListIteratingSystem);


/*
 * Fixed Step Physics System
 *
 * Run the physics step every 1/60 second.
 * Used with CocoonJS Canvas+ Box2d plugin
 *
 */

FixedPhysicsSystem = (function(_super) {
  var TIME_STEP, k;

  __extends(FixedPhysicsSystem, _super);

  TIME_STEP = 1 / 60;

  FixedPhysicsSystem.prototype.handle = 0;

  FixedPhysicsSystem.prototype.config = null;

  FixedPhysicsSystem.prototype.world = null;

  FixedPhysicsSystem.prototype.entities = null;

  FixedPhysicsSystem.prototype.nodes = null;

  FixedPhysicsSystem.prototype.enabled = true;

  FixedPhysicsSystem.prototype.game = null;

  FixedPhysicsSystem.prototype.width = 0;

  FixedPhysicsSystem.prototype.height = 0;

  FixedPhysicsSystem.prototype.offsetX = 0;

  FixedPhysicsSystem.prototype.offsetY = 0;

  k = 0;

  function FixedPhysicsSystem(game) {
    this.updateNode = __bind(this.updateNode, this);
    this.update = __bind(this.update, this);
    var size;
    this.world = game.world;
    this.nodes = game.ash.nodes;
    size = cc.director.getWinSize();
    this.width = size.width;
    this.height = size.height;
    this.offsetX = ~~this.width / 2;
    this.offsetY = ~~this.height / 2;
  }

  FixedPhysicsSystem.prototype.addToEngine = function(engine) {
    this.nodes = engine.getNodeList(this.nodes.PhysicsNode);
  };

  FixedPhysicsSystem.prototype.removeFromEngine = function(engine) {
    if (this.handle !== 0) {
      clearInterval(this.handle);
    }
    this.nodes = null;
  };

  FixedPhysicsSystem.prototype.update = function(time) {
    var node;
    if (!this.enabled) {
      return;
    }
    this.world.step(time);
    node = this.nodes.head;
    while (node) {
      this.updateNode(node, time);
      node = node.next;
    }

    /*
     * Clean up the dead bodies
     */
  };


  /*
   * Process the physics for this node
   */

  FixedPhysicsSystem.prototype.updateNode = function(node, time) {
    var body, physics, position, x, x1, y, y1, _ref;
    position = node.position;
    physics = node.physics;
    body = physics.body;

    /*
     * Update the position component from Box2D model
     * Asteroids uses wraparound space coordinates
     */
    _ref = body.p, x = _ref.x, y = _ref.y;
    x1 = x > this.width ? 0 : x < 0 ? this.width : x;
    y1 = y > this.height ? 0 : y < 0 ? this.height : y;
    if (x1 !== x || y1 !== y) {
      body.p = cc.p(x1, y1);
    }
    position.position.x = x1 - this.offsetX;
    position.position.y = y1 - this.offsetY;
    position.rotation = body.getAngVel();
  };

  return FixedPhysicsSystem;

})(ash.core.System);

GameManager = (function(_super) {
  __extends(GameManager, _super);

  GameManager.prototype.parent = null;

  GameManager.prototype.config = null;

  GameManager.prototype.entities = null;

  GameManager.prototype.rnd = null;

  GameManager.prototype.gameNodes = null;

  GameManager.prototype.spaceships = null;

  GameManager.prototype.asteroids = null;

  GameManager.prototype.bullets = null;

  GameManager.prototype.width = 0;

  GameManager.prototype.height = 0;

  function GameManager(game) {
    var size;
    this.game = game;
    this.update = __bind(this.update, this);
    this.entities = this.game.entities;
    this.rnd = this.game.rnd;
    this.nodes = this.game.ash.nodes;
    size = cc.director.getWinSize();
    this.width = size.width;
    this.height = size.height;
  }

  GameManager.prototype.addToEngine = function(engine) {
    this.gameNodes = engine.getNodeList(this.nodes.GameNode);
    this.spaceships = engine.getNodeList(this.nodes.SpaceshipNode);
    this.asteroids = engine.getNodeList(this.nodes.AsteroidCollisionNode);
    this.bullets = engine.getNodeList(this.nodes.BulletCollisionNode);
  };

  GameManager.prototype.update = function(time) {
    var asteroid, asteroidCount, clearToAddSpaceship, i, newSpaceshipPosition, node, position, spaceship;
    node = this.gameNodes.head;
    if (node && node.state.playing) {
      if (this.spaceships.empty) {
        if (node.state.lives > 0) {
          newSpaceshipPosition = new Point(this.width * 0.5, this.height * 0.5);
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
            this.entities.createSpaceship();
          }
        } else {
          node.state.playing = false;

          /*
           * Start a new game?
           */
          this.entities.createWaitForClick();
        }
      }
      if (this.asteroids.empty && this.bullets.empty && !this.spaceships.empty) {
        spaceship = this.spaceships.head;
        node.state.level++;
        asteroidCount = 2 + node.state.level;
        i = 0;
        while (i < asteroidCount) {
          while (true) {
            position = new Point(this.rnd.nextDouble() * this.width, this.rnd.nextDouble() * this.height);
            if (!(Point.distance(position, spaceship.position.position) <= 80)) {
              break;
            }
          }
          this.entities.createAsteroid(30, position.x, position.y);
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

GunControlSystem = (function(_super) {
  var shooting;

  __extends(GunControlSystem, _super);

  shooting = false;

  GunControlSystem.prototype.keyPoll = null;

  GunControlSystem.prototype.entities = null;

  GunControlSystem.prototype.buttons = null;

  function GunControlSystem(game) {
    var sFire, size, _ref;
    this.game = game;
    this.updateNode = __bind(this.updateNode, this);
    GunControlSystem.__super__.constructor.call(this, this.game.ash.nodes.GunControlNode, this.updateNode);
    this.keyPoll = this.game.keyPoll;
    this.entities = this.game.entities;
    this.buttons = (_ref = this.game.controller) != null ? _ref.buttons : void 0;
    size = cc.director.getWinSize();
    sFire = new cc.Sprite(res.fire);
    sFire.x = size.width - 50;
    sFire.y = 50;
    game.addChild(sFire);
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: function(touch, event) {
        var x, y, _ref1;
        _ref1 = touch.getLocation(), x = _ref1.x, y = _ref1.y;
        if (x >= size.width - 100 && y <= 100) {
          shooting = true;
          return true;
        }
      },
      onTouchMoved: function(touch, event) {},
      onTouchEnded: function(touch, event) {
        shooting = false;
      }
    }, sFire);
  }

  GunControlSystem.prototype.updateNode = function(node, time) {
    var control, gun, position;
    control = node.control;
    position = node.position;
    gun = node.gun;
    gun.shooting = shooting || this.keyPoll.isDown(control.trigger);
    gun.timeSinceLastShot += time;
    if (gun.shooting && gun.timeSinceLastShot >= gun.minimumShotInterval) {
      this.entities.createUserBullet(gun, position);
      gun.timeSinceLastShot = 0;
    }
  };

  return GunControlSystem;

})(ash.tools.ListIteratingSystem);

HudSystem = (function(_super) {
  __extends(HudSystem, _super);

  function HudSystem(parent) {
    this.updateNode = __bind(this.updateNode, this);
    HudSystem.__super__.constructor.call(this, parent.ash.nodes.HudNode, this.updateNode);
  }

  HudSystem.prototype.updateNode = function(node, time) {
    node.hud.view.setLives(node.state.lives);
    node.hud.view.setScore(node.state.hits);
  };

  return HudSystem;

})(ash.tools.ListIteratingSystem);

ShipControlSystem = (function(_super) {
  var R, colors, k, touchEnd, touchOrigin, touching;

  __extends(ShipControlSystem, _super);

  touchOrigin = null;

  touching = false;

  touchEnd = null;

  R = 1;

  k = 0;

  colors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0x00ffff, 0xffff00];

  ShipControlSystem.prototype.keyPoll = null;

  ShipControlSystem.prototype.rnd = null;

  ShipControlSystem.prototype.warping = 0;

  ShipControlSystem.prototype.kount = 0;

  ShipControlSystem.prototype.width = 0;

  ShipControlSystem.prototype.height = 0;

  function ShipControlSystem(game) {
    this.updateNode = __bind(this.updateNode, this);
    var sWarp, size;
    ShipControlSystem.__super__.constructor.call(this, game.ash.nodes.PhysicsControlNode, this.updateNode);
    this.keyPoll = game.keyPoll;
    this.rnd = game.rnd;
    size = cc.director.getWinSize();
    this.width = size.width;
    this.height = size.height;
    this.controller = game.controller;
    sWarp = new cc.Sprite(res.warp);
    sWarp.x = size.width - 200;
    sWarp.y = 50;
    game.addChild(sWarp);
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: (function(_this) {
        return function(touch, event) {
          var x, y, _ref;
          _ref = touch.getLocation(), x = _ref.x, y = _ref.y;
          if (x < size.width / 2) {
            touchOrigin = cc.Sprite.create(res.touchorigin);
            game.addChild(touchOrigin, 0);
            touchOrigin.setPosition(x, y);
            touchEnd = cc.Sprite.create(res.touchend);
            game.addChild(touchEnd, 0);
            touchEnd.setPosition(x, y);
            touching = true;
            return true;
          } else if (x <= size.width - 150 && y <= 100) {
            _this.warping = _this.rnd.nextInt(30) + 30;
            return true;
          }
        };
      })(this),
      onTouchMoved: (function(_this) {
        return function(touch, event) {
          touchEnd.setPosition(touch.getLocation().x, touchEnd.getPosition().y);
        };
      })(this),
      onTouchEnded: (function(_this) {
        return function(touch, event) {
          touching = false;
          game.removeChild(touchOrigin);
          game.removeChild(touchEnd);
        };
      })(this)
    }, game);
  }

  ShipControlSystem.prototype.updateNode = function(node, time) {
    var body, control, deltaX, rotation, v, x, y, _ref, _ref1, _ref2;
    control = node.control;
    body = node.physics.body;
    if (this.warping) {
      this.warping--;
      x = this.rnd.nextInt(this.width);
      y = this.rnd.nextInt(this.height);
      body.p = cc.p(x, y);
      if (this.warping === 0) {
        node.display.graphic.draw(cc.color(255, 255, 255, 255));
      } else {
        node.display.graphic.draw(colors[this.rnd.nextInt(6)]);
      }
      return;
    }
    if (touching) {
      deltaX = touchEnd.getPosition().x - touchOrigin.getPosition().x;
      if (deltaX < -2) {
        rotation = body.getAngVel();
        body.setAngVel(rotation + control.rotationRate * time);
      } else if (deltaX > 2) {
        rotation = rotation || body.getAngVel();
        body.setAngVel(rotation - control.rotationRate * time);
      } else {
        rotation = rotation || body.getAngVel();
        v = body.getVel();
        v.x += Math.cos(rotation) * control.accelerationRate * time * R;
        v.y += Math.sin(rotation) * control.accelerationRate * time * R;
        body.setVel(v);
      }
    } else {
      if (this.keyPoll.isDown(control.warp) || ((_ref = this.controller) != null ? (_ref1 = _ref.buttons) != null ? _ref1.warp : void 0 : void 0)) {
        if ((_ref2 = this.controller) != null) {
          _ref2.warp = false;
        }
        this.warping = this.rnd.nextInt(30) + 30;
        return;
      }
      if (this.keyPoll.isDown(control.accelerate)) {
        rotation = rotation || body.getAngVel();
        v = body.getVel();
        v.x += Math.cos(rotation) * control.accelerationRate * time * R;
        v.y += Math.sin(rotation) * control.accelerationRate * time * R;
        body.setVel(v);
      }
      if (this.keyPoll.isDown(control.left)) {
        rotation = body.getAngVel();
        body.setAngVel(rotation - control.rotationRate * time);
      }
      if (this.keyPoll.isDown(control.right)) {
        rotation = rotation || body.getAngVel();
        body.setAngVel(rotation + control.rotationRate * time);
      }
    }
  };

  return ShipControlSystem;

})(ash.tools.ListIteratingSystem);

WaitForStartSystem = (function(_super) {
  __extends(WaitForStartSystem, _super);

  WaitForStartSystem.prototype.engine = null;

  WaitForStartSystem.prototype.entities = null;

  WaitForStartSystem.prototype.gameNodes = null;

  WaitForStartSystem.prototype.waitNodes = null;

  WaitForStartSystem.prototype.asteroids = null;

  function WaitForStartSystem(game) {
    this.update = __bind(this.update, this);
    this.entities = game.entities;
  }

  WaitForStartSystem.prototype.addToEngine = function(engine) {
    this.ash = engine;
    this.waitNodes = engine.getNodeList(Nodes.WaitForStartNode);
    this.gameNodes = engine.getNodeList(Nodes.GameNode);
    this.asteroids = engine.getNodeList(Nodes.AsteroidCollisionNode);
  };

  WaitForStartSystem.prototype.removeFromEngine = function(engine) {
    this.waitNodes = null;
    this.gameNodes = null;
    this.asteroids = null;
  };

  WaitForStartSystem.prototype.update = function(time) {
    var asteroid, game, graphic, node;
    node = this.waitNodes.head;
    game = this.gameNodes.head;
    if (node && node.wait.startGame && game) {
      asteroid = this.asteroids.head;
      while (asteroid) {

        /*
         * Clean up asteroids left from prior game
         */
        graphic = asteroid.entity.get(Components.Display).graphic;
        this.entities.destroyEntity(asteroid.entity);
        graphic.dispose();
        asteroid = asteroid.next;
      }
      game.state.setForStart();
      node.wait.startGame = false;
      this.ash.removeEntity(node.entity);
    }
  };

  return WaitForStartSystem;

})(ash.core.System);

Game = cc.Layer.extend({
  ash: null,
  rnd: null,
  reg: null,
  entities: null,
  world: null,
  player: null,
  hud: null,
  keyPoll: null,
  name: 'asteroids',
  properties: {
    profiler: 'on',
    leaderboard: 'off',
    player: '',
    userId: '',
    background: 'blue',
    playMusic: '50',
    playSfx: '50',
    asteroidDensity: '1.0',
    asteroidFriction: '1.0',
    asteroidRestitution: '0.2',
    asteroidDamping: '0.0',
    asteroidLinearVelocity: '4.0',
    asteroidAngularVelocity: '2.0',
    spaceshipDensity: '1.0',
    spaceshipFriction: '1.0',
    spaceshipRestitution: '0.2',
    spaceshipDamping: '0.75',
    bulletDensity: '1.0',
    bulletFriction: '0.0',
    bulletRestitution: '0.0',
    bulletDamping: '0.0',
    bulletLinearVelocity: '150'
  },
  ctor: function() {
    var n, p, _ref;
    this._super();
    Properties.init(this.name, this.properties);
    this.rnd = new MersenneTwister();
    this.ash = new ash.core.Engine();
    _ref = new ash.ext.Helper(Components, Nodes);
    for (n in _ref) {
      p = _ref[n];
      this.ash[n] = p;
    }
    this.keyPoll = new KeyPoll(this);
    this.world = new cp.Space();
    this.world.gravity = cp.v(0, 0);
    this.entities = new Entities(this);
    this.entities.createImage(0, 0, res.background);
    this.ash.addSystem(new FixedPhysicsSystem(this), SystemPriorities.move);
    this.ash.addSystem(new BulletAgeSystem(this), SystemPriorities.update);
    this.ash.addSystem(new DeathThroesSystem(this), SystemPriorities.update);
    this.ash.addSystem(new CollisionSystem(this), SystemPriorities.resolveCollisions);
    this.ash.addSystem(new AnimationSystem(this), SystemPriorities.animate);
    this.ash.addSystem(new HudSystem(this), SystemPriorities.animate);
    this.ash.addSystem(new RenderSystem(this), SystemPriorities.render);
    this.ash.addSystem(new AudioSystem(this), SystemPriorities.render);
    this.ash.addSystem(new WaitForStartSystem(this), SystemPriorities.preUpdate);
    this.ash.addSystem(new GameManager(this), SystemPriorities.preUpdate);
    this.ash.addSystem(new ShipControlSystem(this), SystemPriorities.update);
    this.ash.addSystem(new GunControlSystem(this), SystemPriorities.update);
    this.entities.createWaitForClick();
    this.entities.createGame();
    this.scheduleUpdate();
  },
  update: function(dt) {
    this.ash.update(dt);
  }
});

Game.scene = function() {
  var scene;
  scene = new cc.Scene();
  scene.addChild(new Game());
  return scene;
};

//# sourceMappingURL=asteroids.js.map
