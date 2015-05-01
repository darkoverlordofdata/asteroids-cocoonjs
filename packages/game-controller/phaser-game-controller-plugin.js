
/* <==================================================

           __
     ___  / /  ___ ____ ___ ____
    / _ \/ _ \/ _ `(_-</ -_) __/
   / .__/_//_/\_,_/___/\__/_/
  /_/__ ____ ___ _  ___
   / _ `/ _ `/  ' \/ -_)
   \_, /\_,_/_/_/_/\__/        ____
  /___/___  ___  / /________  / / /__ ____
  / __/ _ \/ _ \/ __/ __/ _ \/ / / -_) __/
  \__/\___/_//_/\__/_/ _\___/_/_/\__/_/
     ___  / /_ _____ _(_)__
    / _ \/ / // / _ `/ / _ \
   / .__/_/\_,_/\_, /_/_//_/
  /_/          /___/


 * MIT License

Copyright (c) 2015 Bruce Davidson &lt;darkoverlordofdata@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

==================================================>
 */

(function() {
  'use strict';

  /*
   *
   * Modified Html5 Virtual Game Controller
   *
   * @see https://github.com/austinhallock/html5-virtual-game-controller
   *
   */
  var GameController, TouchableArea, TouchableButton, TouchableCircle, TouchableDirection, TouchableJoystick,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

    TouchableArea.prototype.touchMoveWrapper = function(e) {
      if (this.touchMove && (e.clientX !== TouchableArea.prototype.lastPosX || e.clientY !== TouchableArea.prototype.lastPosY)) {
        this.touchMove();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
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


  /*
   *
   * Html5 Virtual Game Controller
   *
   * @see https://github.com/austinhallock/html5-virtual-game-controller
   *
   *  @game.plugins.add(Phaser.Plugin.GameController)
   *
   */

  Phaser.Plugin.GameControllerPlugin = (function(_super) {
    __extends(GameControllerPlugin, _super);

    GameControllerPlugin.prototype.options = null;

    GameControllerPlugin.prototype.joystick = void 0;

    GameControllerPlugin.prototype.buttons = void 0;

    GameControllerPlugin.prototype.dpad = void 0;

    GameControllerPlugin.prototype.left = void 0;

    GameControllerPlugin.prototype.right = void 0;


    /*
     * @param   game    current phaser game context
     * @param   parent  current phaser state context
     */

    function GameControllerPlugin(game, parent) {
      this.init = __bind(this.init, this);
      GameControllerPlugin.__super__.constructor.call(this, game, parent);
      this.options = {};
    }


    /*
     * @param   extra    extra params passed to the plugin
     */

    GameControllerPlugin.prototype.init = function(extra) {
      if (extra == null) {
        extra = {};
      }
      if (extra.force) {

        /*
         * So the virtual pad will display on desktop
         */
        return document.documentElement['ontouchstart'] = function() {};
      }
    };


    /*
     * Start
     */

    GameControllerPlugin.prototype.start = function() {
      if ('ontouchstart' in document.documentElement) {
        GameController.init(this.game, this.options);
      }
    };


    /*
     * Add Side
     *
     * @param   side
     * @param   x
     * @param   y
     * @param   type
     * @param   data
     */

    GameControllerPlugin.prototype.addSide = function(side, x, y, type, data) {
      var _base;
      if (data == null) {
        data = {};
      }
      if ((_base = this.options)[side] == null) {
        _base[side] = {};
      }
      this.options[side].position = {
        left: x,
        top: y
      };
      this.options[side].type = type;
      this.options[side][type] = data;
    };


    /*
     * Add DPad
     *
     * @param   side
     * @param   x
     * @param   y
     * @param   options
     */

    GameControllerPlugin.prototype.addDPad = function(side, x, y, directions) {
      var direction, options, _fn, _ref, _ref1, _results, _results1;
      if ('string' === typeof side) {

        /*
         * Create 1 dpad
         */
        this.dpad = {
          up: false,
          down: false,
          left: false,
          right: false
        };
        this.addSide(side, x, y, 'dpad', {
          background: true
        });
        _results = [];
        for (direction in directions) {
          options = directions[direction];
          _results.push((function(_this) {
            return function(direction, options) {
              if (options === false) {
                return _this.options[side].dpad[direction] = false;
              } else {
                return _this.options[side].dpad[direction] = {
                  width: options.width,
                  height: options.height,
                  touchStart: function() {
                    _this.dpad[direction] = true;
                  },
                  touchEnd: function() {
                    _this.dpad[direction] = false;
                  }
                };
              }
            };
          })(this)(direction, options));
        }
        return _results;
      } else {

        /*
         * Create 2 dpads
         */
        this.left = {
          up: false,
          down: false,
          left: false,
          right: false
        };
        this.right = {
          up: false,
          down: false,
          left: false,
          right: false
        };
        options = side.left;
        this.addSide(options.side, options.x, options.y, 'dpad', {
          background: true
        });
        _ref = options.directions;
        _fn = (function(_this) {
          return function(direction, options) {
            if (options === false) {
              return _this.options[side].dpad[direction] = false;
            } else {
              return _this.options[side].dpad[direction] = {
                width: options.width,
                height: options.height,
                touchStart: function() {
                  _this.left[direction] = true;
                },
                touchEnd: function() {
                  _this.left[direction] = false;
                }
              };
            }
          };
        })(this);
        for (direction in _ref) {
          options = _ref[direction];
          _fn(direction, options);
        }
        options = side.right;
        this.addSide(options.side, options.x, options.y, 'dpad', {
          background: true
        });
        _ref1 = options.directions;
        _results1 = [];
        for (direction in _ref1) {
          options = _ref1[direction];
          _results1.push((function(_this) {
            return function(direction, options) {
              if (options === false) {
                return _this.options[side].dpad[direction] = false;
              } else {
                return _this.options[side].dpad[direction] = {
                  width: options.width,
                  height: options.height,
                  touchStart: function() {
                    _this.right[direction] = true;
                  },
                  touchEnd: function() {
                    _this.right[direction] = false;
                  }
                };
              }
            };
          })(this)(direction, options));
        }
        return _results1;
      }
    };


    /*
     * Add Joystick
     *
     * @param   side
     * @param   x
     * @param   y
     * @param   radius
     */

    GameControllerPlugin.prototype.addJoystick = function(side, x, y, radius) {
      var options;
      if (radius == null) {
        radius = x;
      }
      if ('string' === typeof side) {

        /*
         * Create 1 joystick
         */
        this.joystick = null;
        this.addSide(side, x, y, 'joystick', {
          touchStart: function() {},
          touchEnd: (function(_this) {
            return function() {
              _this.joystick = null;
            };
          })(this),
          touchMove: (function(_this) {
            return function(joystick) {
              _this.joystick = joystick;
            };
          })(this)
        });
        this.options[side].radius = radius;
      } else {

        /*
         * Create 2 joysticks
         */
        this.left = null;
        this.right = null;
        options = side.left;
        if (options.radius == null) {
          options.radius = 60;
        }
        this.addSide(options.side, options.x, options.y, 'joystick', {
          touchStart: function() {},
          touchEnd: (function(_this) {
            return function() {
              _this.left = null;
            };
          })(this),
          touchMove: (function(_this) {
            return function(joystick) {
              _this.left = joystick;
            };
          })(this)
        });
        this.options[side].radius = options.radius;
        options = side.right;
        if (options.radius == null) {
          options.radius = 60;
        }
        this.addSide(options.side, options.x, options.y, 'joystick', {
          touchStart: function() {},
          touchEnd: (function(_this) {
            return function() {
              _this.right = null;
            };
          })(this),
          touchMove: (function(_this) {
            return function(joystick) {
              _this.right = joystick;
            };
          })(this)
        });
        this.options[side].radius = options.radius;
      }
    };


    /*
     * Add DPad
     *
     * @param   side
     * @param   x
     * @param   y
     * @param   buttons
     */

    GameControllerPlugin.prototype.addButtons = function(side, x, y, buttons) {
      var index, options, _fn, _ref, _ref1, _results, _results1;
      if ('string' === typeof side) {

        /*
         * Create 1 set of buttons
         */
        this.buttons = {};
        this.addSide(side, x, y, 'buttons', [false, false, false, false]);
        _results = [];
        for (index in buttons) {
          options = buttons[index];
          _results.push((function(_this) {
            return function(index, options) {
              return _this.options[side].buttons[parseInt(index) - 1] = {
                label: options.title,
                radius: "" + (options.radius || 5) + "%",
                fontSize: options.fontSize,
                backgroundColor: options.color,
                touchStart: function() {
                  _this.buttons[options.title.toLowerCase()] = true;
                },
                touchEnd: function() {
                  _this.buttons[options.title.toLowerCase()] = false;
                }
              };
            };
          })(this)(index, options));
        }
        return _results;
      } else {

        /*
         * Create 2 sets of buttons
         */
        this.left = {};
        this.right = {};
        options = side.left;
        this.addSide(options.side, options.x, options.y, 'buttons', [false, false, false, false]);
        _ref = options.buttons;
        _fn = (function(_this) {
          return function(index, options) {
            return _this.options[side].buttons[parseInt(index) - 1] = {
              label: options.title,
              radius: "" + (options.radius || 5) + "%",
              fontSize: options.fontSize,
              backgroundColor: options.color,
              touchStart: function() {
                _this.left[options.title.toLowerCase()] = true;
              },
              touchEnd: function() {
                _this.right[options.title.toLowerCase()] = false;
              }
            };
          };
        })(this);
        for (index in _ref) {
          options = _ref[index];
          _fn(index, options);
        }
        options = side.right;
        this.addSide(options.side, options.x, options.y, 'buttons', [false, false, false, false]);
        _ref1 = options.buttons;
        _results1 = [];
        for (index in _ref1) {
          options = _ref1[index];
          _results1.push((function(_this) {
            return function(index, options) {
              return _this.options[side].buttons[parseInt(index) - 1] = {
                label: options.title,
                radius: "" + (options.radius || 5) + "%",
                fontSize: options.fontSize,
                backgroundColor: options.color,
                touchStart: function() {
                  _this.right[options.title.toLowerCase()] = true;
                },
                touchEnd: function() {
                  _this.right[options.title.toLowerCase()] = false;
                }
              };
            };
          })(this)(index, options));
        }
        return _results1;
      }
    };

    return GameControllerPlugin;

  })(Phaser.Plugin);

}).call(this);

//# sourceMappingURL=phaser-game-controller-plugin.js.map
