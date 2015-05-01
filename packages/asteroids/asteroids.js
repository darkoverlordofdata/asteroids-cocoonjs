
/* <==================================================


      ____ ______/ /____  _____(_)___  ____/ /____
     / __ `/ ___/ __/ _ \/ ___/ / __ \/ __  / ___/
    / /_/ (__  ) /_/  __/ /  / / /_/ / /_/ (__  )
    \__,_/____/\__/\___/_/  /_/\____/\__,_/____/


'Back on Arcturus, we used this for our flight simulator'
  - Dark Overlord of Data

==================================================>
 */

(function() {
  'use strict';

  /*
   */
  var AnimationSystem, AsteroidDeathView, AsteroidView, Asteroids, AudioSystem, BulletAgeSystem, BulletView, CollisionSystem, Components, DeathThroesSystem, Dot, Entities, ExplodeAsteroid, ExplodeShip, FixedPhysicsSystem, GameManager, GunControlSystem, HudSystem, HudView, KeyPoll, MersenneTwister, Nodes, Point, RenderSystem, ShipControlSystem, ShootGun, SmoothPhysicsSystem, Sound, SpaceshipDeathView, SpaceshipView, SystemPriorities, WaitForStartSystem, WaitForStartView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MersenneTwister = (function() {
    var LOWER_MASK, M, MATRIX_A, N, UPPER_MASK;

    N = 624;

    M = 397;

    MATRIX_A = 0x9908b0df;

    UPPER_MASK = 0x80000000;

    LOWER_MASK = 0x7fffffff;

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
      this.mt[0] = s & 0xffffffff;
      this.mti = 1;
      while (this.mti < N) {
        this.mt[this.mti] = 1812433253 * (this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >> 30)) + this.mti;

        /*
         * See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. #
         * In the previous versions, MSBs of the seed affect   #
         * only MSBs of the array mt[].                        #
         * 2002/01/09 modified by Makoto Matsumoto             #
         */
        this.mt[this.mti] &= 0xffffffff;

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
        this.mt[i] = (this.mt[i] ^ ((this.mt[i - 1] ^ (this.mt[i - 1] >> 30)) * 1664525)) + init_key[j] + j;
        this.mt[i] &= 0xffffffff;
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
        this.mt[i] = (this.mt[i] ^ ((this.mt[i - 1] ^ (this.mt[i - 1] >> 30)) * 1566083941)) - i;
        this.mt[i] &= 0xffffffff;
        i++;
        if (i >= N) {
          this.mt[0] = this.mt[N - 1];
          i = 1;
        }
        k--;
      }
      this.mt[0] = 0x80000000;
    };


    /*
     * generates a random number on [0,0xffffffff]-interval
     */

    MersenneTwister.prototype.genrand_int32 = function() {
      var kk, mag01, y;
      mag01 = [0x0, MATRIX_A];
      if (this.mti >= N) {
        if (this.mti === N + 1) {
          this.init_genrand(5489);
        }
        kk = 0;
        while (kk < N - M) {
          y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
          this.mt[kk] = this.mt[kk + M] ^ (y >> 1) ^ mag01[y & 0x1];
          kk++;
        }
        while (kk < N - 1) {
          y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
          this.mt[kk] = this.mt[kk + (M - N)] ^ (y >> 1) ^ mag01[y & 0x1];
          kk++;
        }
        y = (this.mt[N - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK);
        this.mt[N - 1] = this.mt[M - 1] ^ (y >> 1) ^ mag01[y & 0x1];
        this.mti = 0;
      }
      y = this.mt[this.mti++];
      y ^= y >> 11;
      y ^= (y << 7) & 0x9d2c5680;
      y ^= (y << 15) & 0xefc60000;
      y ^= y >> 18;
      return y >> 0;
    };


    /*
    * generates a random number on [0,0x7fffffff]-interval
     */

    MersenneTwister.prototype.genrand_int31 = function() {
      return this.genrand_int32() >> 1;
    };


    /*
     * generates a random number on [0,1]-real-interval
     */

    MersenneTwister.prototype.genrand_real1 = function() {
      return this.genrand_int32() * (1.0 / 4294967296.0);
    };


    /*
     * generates a random number on [0,1)-real-interval
     */

    MersenneTwister.prototype.genrand_real2 = function() {
      return this.genrand_int32() * (1.0 / 4294967296.0);
    };


    /*
     * generates a random number on (0,1)-real-interval
     */

    MersenneTwister.prototype.genrand_real3 = function() {
      return (this.genrand_int32() + 0.5) * (1.0 / 4294967296.0);
    };


    /*
     * generates a random number on [0,1) with 53-bit resolution
     */

    MersenneTwister.prototype.genrand_res53 = function() {
      var a, b;
      a = this.genrand_int32() >> 5;
      b = this.genrand_int32() >> 6;
      return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    };

    return MersenneTwister;

  })();


  /*
   * These real versions are due to Isaku Wada, 2002/01/09 added
   */

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

    function KeyPoll(parent) {
      this.parent = parent;
      this.isUp = __bind(this.isUp, this);
      this.isDown = __bind(this.isDown, this);
      this.keyUpListener = __bind(this.keyUpListener, this);
      this.keyDownListener = __bind(this.keyDownListener, this);
      this.states = {};
      window.addEventListener('keydown', this.keyDownListener);
      window.addEventListener('keyup', this.keyUpListener);
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


    /*
     * Build a virtual game pad for touch devices
     */

    KeyPoll.prototype.buttons = function(game, config) {
      var btn2, btn4;
      btn2 = game.add.button(config.width - 100, config.height - 50, 'round');
      btn2.onInputDown.add((function(_this) {
        return function() {
          _this.states[_this.keys[2]] = true;
        };
      })(this));
      btn2.onInputUp.add((function(_this) {
        return function() {
          _this.states[_this.keys[2]] = false;
        };
      })(this));
      btn4 = game.add.button(config.width / 2, config.height - 50, 'square');
      btn4.anchor.x = 0.5;
      btn4.onInputDown.add((function(_this) {
        return function() {
          _this.states[_this.keys[4]] = true;
        };
      })(this));
      return btn4.onInputUp.add((function(_this) {
        return function() {
          _this.states[_this.keys[4]] = false;
        };
      })(this));
    };

    return KeyPoll;

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

  ExplodeAsteroid = (function() {
    function ExplodeAsteroid() {}

    ExplodeAsteroid.prototype.src = Sound.preload('res/sounds/asteroid.wav');

    ExplodeAsteroid.prototype.play = function() {
      return ExplodeAsteroid.audio.play('', 0, Sound.volume / Sound.FACTOR);
    };

    return ExplodeAsteroid;

  })();

  ExplodeShip = (function() {
    function ExplodeShip() {}

    ExplodeShip.prototype.src = Sound.preload('res/sounds/ship.wav');

    ExplodeShip.prototype.play = function() {
      return ExplodeShip.audio.play('', 0, Sound.volume / Sound.FACTOR);
    };

    return ExplodeShip;

  })();

  ShootGun = (function() {
    function ShootGun() {}

    ShootGun.prototype.src = Sound.preload('res/sounds/shoot.wav');

    ShootGun.prototype.play = function() {
      return ShootGun.audio.play('', 0, Sound.volume / Sound.FACTOR);
    };

    return ShootGun;

  })();

  AsteroidView = (function() {
    AsteroidView.prototype.graphics = null;

    Object.defineProperties(AsteroidView.prototype, {
      x: {
        get: function() {
          return this.graphics.x;
        },
        set: function(x) {
          return this.graphics.x = x;
        }
      },
      y: {
        get: function() {
          return this.graphics.x;
        },
        set: function(y) {
          return this.graphics.y = y;
        }
      },
      rotation: {
        get: function() {
          return this.graphics.rotation;
        },
        set: function(rotation) {
          return this.graphics.rotation = rotation;
        }
      }
    });

    function AsteroidView(parent, radius) {
      var angle, game, length, posX, posY, rnd;
      game = parent.game;
      rnd = parent.rnd;
      this.graphics = game.add.graphics(0, 0);
      this.graphics.clear();
      angle = 0;
      this.graphics.beginFill(0xffffff);
      this.graphics.moveTo(radius, 0);
      while (angle < Math.PI * 2) {
        length = (0.75 + rnd.nextDouble() * 0.25) * radius;
        posX = Math.cos(angle) * length;
        posY = Math.sin(angle) * length;
        this.graphics.lineTo(posX, posY);
        angle += rnd.nextDouble() * 0.5;
      }
      this.graphics.moveTo(radius, 0);
      this.graphics.endFill();
    }

    AsteroidView.prototype.dispose = function() {
      return this.graphics.destroy();
    };

    return AsteroidView;

  })();

  AsteroidDeathView = (function() {
    AsteroidDeathView.prototype.dots = null;

    AsteroidDeathView.prototype.x = 0;

    AsteroidDeathView.prototype.y = 0;

    AsteroidDeathView.prototype.rotation = 0;

    AsteroidDeathView.prototype.stage = null;

    AsteroidDeathView.prototype.first = true;

    function AsteroidDeathView(parent, radius) {
      this.animate = __bind(this.animate, this);
      var dot, i, _i;
      this.dots = [];
      for (i = _i = 0; _i < 8; i = ++_i) {
        dot = new Dot(parent.game, parent.rnd, radius);
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
        _results.push(dot.graphics.destroy());
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
      var angle, distance, speed;
      this.graphics = game.add.graphics(0, 0);
      this.graphics.beginFill(0xffffff);
      this.graphics.drawCircle(0, 0, 1);
      this.graphics.endFill();
      angle = rnd.nextDouble() * 2 * Math.PI;
      distance = rnd.nextDouble() * maxDistance;
      this.graphics.x = Math.cos(angle) * distance;
      this.graphics.y = Math.sin(angle) * distance;
      speed = rnd.nextDouble() * 10 + 10;
      this.velocity = new Point(Math.cos(angle) * speed, Math.sin(angle) * speed);
    }

    return Dot;

  })();

  BulletView = (function() {
    BulletView.prototype.graphics = null;

    Object.defineProperties(BulletView.prototype, {
      x: {
        get: function() {
          return this.graphics.x;
        },
        set: function(x) {
          return this.graphics.x = x;
        }
      },
      y: {
        get: function() {
          return this.graphics.x;
        },
        set: function(y) {
          return this.graphics.y = y;
        }
      },
      rotation: {
        get: function() {
          return this.graphics.rotation;
        },
        set: function(rotation) {
          return this.graphics.rotation = rotation;
        }
      }
    });

    function BulletView(game) {
      this.graphics = game.add.graphics(0, 0);
      this.graphics.beginFill(0xffffff);
      this.graphics.drawCircle(0, 0, 2);
      this.graphics.endFill();
    }

    BulletView.prototype.dispose = function() {
      return this.graphics.destroy();
    };

    return BulletView;

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
      this.graphics = game.add.graphics(0, 100);
      this.graphics.beginFill(0xc0c0c0);
      this.graphics.drawRect(0, 0, 30, 40);
      this.graphics.endFill();
      this.graphics.alpha = 0.5;
      this.score = game.add.text(window.innerWidth - 130, 20, '', {
        font: 'bold 18px opendyslexic',
        fill: 'white'
      });
      this.setScore(0);
      this.setLives(3);
    }

    HudView.prototype.dispose = function() {
      this.graphics.destroy();
      return this.score.destroy();
    };

    HudView.prototype.setLives = function(lives) {
      var c, i, _i;
      this.graphics.clear();
      this.graphics.beginFill(0xc0c0c0);
      this.graphics.drawRect(0, 0, 30, 40);
      this.graphics.endFill();
      this.graphics.beginFill(0x000000);
      for (i = _i = 0; 0 <= lives ? _i < lives : _i > lives; i = 0 <= lives ? ++_i : --_i) {
        c = i * 10 + 10;
        this.graphics.moveTo(10 + 10, c);
        this.graphics.lineTo(-7 + 10, 7 + c);
        this.graphics.lineTo(-4 + 10, c);
        this.graphics.lineTo(-7 + 10, -7 + c);
        this.graphics.lineTo(10 + 10, c);
      }
      this.graphics.endFill();
      this.graphics.alpha = 0.5;
    };

    HudView.prototype.setScore = function(score) {
      this.score.setText("SCORE: " + score);
    };

    return HudView;

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

    function SpaceshipDeathView(parent) {
      this.animate = __bind(this.animate, this);
      var game, rnd;
      game = parent.game;
      rnd = parent.rnd;
      this.shape1 = game.add.graphics(0, 0);
      this.shape1.clear();
      this.shape1.beginFill(0xFFFFFF);
      this.shape1.moveTo(10, 0);
      this.shape1.lineTo(-7, 7);
      this.shape1.lineTo(-4, 0);
      this.shape1.lineTo(10, 0);
      this.shape1.endFill();
      this.shape2 = game.add.graphics(0, 0);
      this.shape2.clear();
      this.shape2.beginFill(0xFFFFFF);
      this.shape2.moveTo(10, 0);
      this.shape2.lineTo(-7, -7);
      this.shape2.lineTo(-4, 0);
      this.shape2.lineTo(10, 0);
      this.shape2.endFill();
      this.vel1 = new Point(rnd.nextDouble() * 10 - 5, rnd.nextDouble() * 10 + 10);
      this.vel2 = new Point(rnd.nextDouble() * 10 - 5, -(rnd.nextDouble() * 10 + 10));
      this.rot1 = rnd.nextDouble() * 300 - 150;
      this.rot2 = rnd.nextDouble() * 300 - 150;
    }

    SpaceshipDeathView.prototype.dispose = function() {
      this.shape1.destroy();
      return this.shape2.destroy();
    };

    SpaceshipDeathView.prototype.animate = function(time) {
      if (this.first) {
        this.first = false;
        this.shape1.x = this.shape2.x = this.x;
        this.shape1.y = this.shape2.y = this.y;
        this.shape1.rotation = this.shape2.rotation = this.rotation;
      }
      this.shape1.x += this.vel1.x * time;
      this.shape1.y += this.vel1.y * time;
      this.shape1.rotation += this.rot1 * time;
      this.shape2.x += this.vel2.x * time;
      this.shape2.y += this.vel2.y * time;
      this.shape2.rotation += this.rot2 * time;
    };

    return SpaceshipDeathView;

  })();

  SpaceshipView = (function() {
    SpaceshipView.prototype.graphics = null;

    Object.defineProperties(SpaceshipView.prototype, {
      x: {
        get: function() {
          return this.graphics.x;
        },
        set: function(x) {
          return this.graphics.x = x;
        }
      },
      y: {
        get: function() {
          return this.graphics.x;
        },
        set: function(y) {
          return this.graphics.y = y;
        }
      },
      rotation: {
        get: function() {
          return this.graphics.rotation;
        },
        set: function(rotation) {
          return this.graphics.rotation = rotation;
        }
      }
    });

    function SpaceshipView(game) {
      this.graphics = game.add.graphics(0, 0);
      this.draw(0xFFFFFF);
    }

    SpaceshipView.prototype.dispose = function() {
      return this.graphics.destroy();
    };

    SpaceshipView.prototype.draw = function(color) {
      this.graphics.clear();
      this.graphics.beginFill(color);
      this.graphics.moveTo(10, 0);
      this.graphics.lineTo(-7, 7);
      this.graphics.lineTo(-4, 0);
      this.graphics.lineTo(-7, -7);
      this.graphics.lineTo(10, 0);
      return this.graphics.endFill();
    };

    return SpaceshipView;

  })();

  WaitForStartView = (function() {
    var Signal0;

    WaitForStartView.count = 0;

    Signal0 = ash.signals.Signal0;

    WaitForStartView.prototype.x = 0;

    WaitForStartView.prototype.y = 0;

    WaitForStartView.prototype.rotation = 0;

    WaitForStartView.prototype.text1 = null;

    WaitForStartView.prototype.text2 = null;

    WaitForStartView.prototype.text3 = null;

    WaitForStartView.prototype.click = null;

    function WaitForStartView(game, parent) {
      var x, y;
      this.game = game;
      this.parent = parent;
      this.start1 = __bind(this.start1, this);
      this.start = __bind(this.start, this);
      this.click = new Signal0();
      x = Math.floor(window.innerWidth / 2);
      y = window.innerHeight - 40;
      if ((WaitForStartView.count++) === 1) {
        this.text1 = this.game.add.text(x, 85, 'GAME OVER', {
          font: 'bold 60px opendyslexic',
          fill: 'white',
          stroke: "black",
          strokeThickness: 30
        });
      } else {
        this.text1 = this.game.add.text(x, 85, 'ASTEROIDS', {
          font: 'bold 60px opendyslexic',
          fill: 'white',
          stroke: "black",
          strokeThickness: 30
        });
      }
      if (this.game.device.touch) {
        this.text2 = this.game.add.text(x, 175, 'TOUCH TO START', {
          font: 'bold 12px opendyslexic',
          fill: 'white'
        });
      } else {
        this.text2 = this.game.add.text(x, 175, 'CLICK TO START', {
          font: 'bold 12px opendyslexic',
          fill: 'white'
        });
      }
      this.text1.anchor.x = 0.5;
      this.text2.anchor.x = 0.5;
      if (this.game.device.desktop) {
        this.text3 = this.game.add.text(x, y, 'Z ~ Fire  |  SPACE ~ Warp  |  Left/Right ~ Turn  |  Up ~ Accelerate', {
          font: 'bold 10px opendyslexic',
          fill: 'white'
        });
        this.text3.anchor.x = 0.5;
      }
      this.text1.inputEnabled = true;
      this.text2.inputEnabled = true;
      this.text1.events.onInputDown.add(this.start);
      this.text2.events.onInputDown.add(this.start);
    }

    WaitForStartView.prototype.start = function(data) {
      var fader;
      this.faderBitmap = this.game.make.bitmapData(this.game.width, this.game.height);
      this.faderBitmap.rect(0, 0, this.game.width, this.game.height, 'rgb(0,0,0)');
      this.faderSprite = this.game.add.sprite(0, 0, this.faderBitmap);
      this.faderSprite.alpha = 0;
      fader = this.game.add.tween(this.faderSprite);
      fader.to({
        alpha: 1
      }, 1000);
      fader.onComplete.add(this.start1);
      return fader.start();
    };

    WaitForStartView.prototype.start1 = function() {
      var fader, _ref, _ref1;
      this.text1.destroy();
      this.text2.destroy();
      if ((_ref = this.text3) != null) {
        _ref.destroy();
      }
      fader = this.game.add.tween(this.faderSprite);
      fader.to({
        alpha: 0
      }, 1000);
      fader.onComplete.add((function(_this) {
        return function() {
          return _this.click.dispatch();
        };
      })(this));
      fader.start();
      return (_ref1 = this.parent.controller) != null ? _ref1.start() : void 0;
    };

    return WaitForStartView;

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

        function Physics(body) {
          this.body = body;
        }

        return Physics;

      })(),
      Position: Position = (function() {
        Position.prototype.position = null;

        Position.prototype.rotation = 0;

        function Position(x, y, rotation) {
          this.rotation = rotation;
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


  /*
   * Fixed Step Physics System
   *
   * Run the physics step every 1/60 second.
   * Used with CocoonJS Canvas+ Box2d plugin
   *
   */

  FixedPhysicsSystem = (function(_super) {
    var POSITION_ITERATIONS, TIME_STEP, VELOCITY_ITERATIONS, b2Body, b2Vec2;

    __extends(FixedPhysicsSystem, _super);

    b2Body = Box2D.Dynamics.b2Body;

    b2Vec2 = Box2D.Common.Math.b2Vec2;

    TIME_STEP = 1 / 60;

    VELOCITY_ITERATIONS = 8;

    POSITION_ITERATIONS = 3;

    FixedPhysicsSystem.prototype.handle = 0;

    FixedPhysicsSystem.prototype.config = null;

    FixedPhysicsSystem.prototype.world = null;

    FixedPhysicsSystem.prototype.entities = null;

    FixedPhysicsSystem.prototype.nodes = null;

    FixedPhysicsSystem.prototype.enabled = true;

    FixedPhysicsSystem.prototype.game = null;

    FixedPhysicsSystem.prototype.width = 0;

    FixedPhysicsSystem.prototype.height = 0;

    FixedPhysicsSystem.deadPool = [];

    function FixedPhysicsSystem(parent) {
      this.updateNode = __bind(this.updateNode, this);
      this.update = __bind(this.update, this);
      this.process = __bind(this.process, this);
      this.world = parent.world;
      this.game = parent.game;
      this.width = parent.width;
      this.height = parent.height;
      this.nodes = parent.ash.nodes;
    }

    FixedPhysicsSystem.prototype.addToEngine = function(engine) {
      this.nodes = engine.getNodeList(this.nodes.PhysicsNode);
      this.handle = setInterval(this.process, TIME_STEP);
    };

    FixedPhysicsSystem.prototype.removeFromEngine = function(engine) {
      if (this.handle !== 0) {
        clearInterval(this.handle);
      }
      this.handle = 0;
      this.nodes = null;
    };

    FixedPhysicsSystem.prototype.process = function() {
      if (this.game.paused) {
        return;
      }
      if (!this.enabled) {
        return;
      }
      this.world.Step(TIME_STEP, VELOCITY_ITERATIONS, POSITION_ITERATIONS);
      this.world.ClearForces();
    };

    FixedPhysicsSystem.prototype.update = function(time) {
      var body, node, ud;
      if (this.game.paused) {
        return;
      }
      if (!this.enabled) {
        return;
      }
      node = this.nodes.head;
      while (node) {
        this.updateNode(node, time);
        node = node.next;
      }

      /*
       * Clean up the dead bodies
       */
      while ((body = FixedPhysicsSystem.deadPool.pop())) {
        ud = body.GetUserData();
        if (ud.entity != null) {
          delete ud.entity;
        }
        body.SetUserData(ud);
        this.world.DestroyBody(body);
      }
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
      _ref = body.GetPosition(), x = _ref.x, y = _ref.y;
      x1 = x > this.width ? 0 : x < 0 ? this.width : x;
      y1 = y > this.height ? 0 : y < 0 ? this.height : y;
      if (x1 !== x || y1 !== y) {
        body.SetPosition(new b2Vec2(x1, y1));
      }
      position.position.x = x1;
      position.position.y = y1;
      position.rotation = body.GetAngularVelocity();
    };

    return FixedPhysicsSystem;

  })(ash.core.System);


  /*
   * Smooth Step Physics System
   *
   * Smooth the physics and align step
   * with frame rate
   *
   * @see http://blog.allanbishop.com/box-2d-2-1a-tutorial-part-10-fixed-time-step/
   *
   */

  SmoothPhysicsSystem = (function(_super) {
    var FIXED_TIMESTEP, MAX_STEPS, b2Body, b2Vec2, positionIterations, velocityIterations;

    __extends(SmoothPhysicsSystem, _super);

    b2Body = Box2D.Dynamics.b2Body;

    b2Vec2 = Box2D.Common.Math.b2Vec2;

    FIXED_TIMESTEP = 1 / 60;

    MAX_STEPS = 5;

    velocityIterations = 8;

    positionIterations = 1;

    SmoothPhysicsSystem.prototype.fixedTimestepAccumulator = 0;

    SmoothPhysicsSystem.prototype.fixedTimestepAccumulatorRatio = 0;

    SmoothPhysicsSystem.prototype.config = null;

    SmoothPhysicsSystem.prototype.world = null;

    SmoothPhysicsSystem.prototype.entities = null;

    SmoothPhysicsSystem.prototype.nodes = null;

    SmoothPhysicsSystem.prototype.enabled = true;

    SmoothPhysicsSystem.prototype.game = null;

    SmoothPhysicsSystem.prototype.width = 0;

    SmoothPhysicsSystem.prototype.height = 0;

    SmoothPhysicsSystem.deadPool = [];

    function SmoothPhysicsSystem(parent) {
      this.smoothStates = __bind(this.smoothStates, this);
      this.resetSmoothStates = __bind(this.resetSmoothStates, this);
      this.update = __bind(this.update, this);
      this.width = parent.width;
      this.height = parent.height;
      this.world = parent.world;
      this.game = parent.game;
      this.nodes = parent.ash.nodes;
    }

    SmoothPhysicsSystem.prototype.addToEngine = function(engine) {
      this.nodes = engine.getNodeList(this.nodes.PhysicsNode);
    };

    SmoothPhysicsSystem.prototype.removeFromEngine = function(engine) {
      this.nodes = null;
    };

    SmoothPhysicsSystem.prototype.update = function(dt) {
      var body, i, nSteps, nStepsClamped, ud;
      if (this.game.paused) {
        return;
      }
      if (!this.enabled) {
        return;
      }
      this.fixedTimestepAccumulator += dt;
      nSteps = Math.floor(this.fixedTimestepAccumulator / FIXED_TIMESTEP);
      if (nSteps > 0) {
        this.fixedTimestepAccumulator -= nSteps * FIXED_TIMESTEP;
      }
      this.fixedTimestepAccumulatorRatio = this.fixedTimestepAccumulator / FIXED_TIMESTEP;
      nStepsClamped = Math.min(nSteps, MAX_STEPS);
      i = 0;
      while (i < nStepsClamped) {
        this.resetSmoothStates();
        this.world.Step(dt, velocityIterations, positionIterations);
        i++;
      }
      this.world.ClearForces();
      this.smoothStates();

      /*
       * Clean up the dead bodies
       */
      while ((body = SmoothPhysicsSystem.deadPool.pop())) {
        ud = body.GetUserData();
        if (ud.entity != null) {
          delete ud.entity;
        }
        body.SetUserData(ud);
        this.world.DestroyBody(body);
      }
    };

    SmoothPhysicsSystem.prototype.resetSmoothStates = function() {
      var body, node, physics, position, x, x1, y, y1, _ref;
      node = this.nodes.head;
      while (node) {
        position = node.position;
        physics = node.physics;
        body = physics.body;
        _ref = body.GetPosition(), x = _ref.x, y = _ref.y;
        position.position.x = physics.previousX = x;
        position.position.y = physics.previousY = y;
        position.rotation = physics.previousAngle = body.GetAngularVelocity();

        /*
         * Update the position component from Box2D model
         * Asteroids uses wraparound space coordinates
         */
        x1 = x > this.width ? 0 : x < 0 ? this.width : x;
        y1 = y > this.height ? 0 : y < 0 ? this.height : y;
        if (x1 !== x || y1 !== y) {
          body.SetPosition(new b2Vec2(x1, y1));
        }
        node = node.next;
      }
    };

    SmoothPhysicsSystem.prototype.smoothStates = function() {
      var body, node, oneMinusRatio, physics, position, x, x1, y, y1, _ref;
      oneMinusRatio = 1.0 - this.fixedTimestepAccumulatorRatio;
      node = this.nodes.head;
      while (node) {
        position = node.position;
        physics = node.physics;
        body = physics.body;
        _ref = body.GetPosition(), x = _ref.x, y = _ref.y;
        position.position.x = this.fixedTimestepAccumulatorRatio * x + (oneMinusRatio * physics.previousX);
        position.position.y = this.fixedTimestepAccumulatorRatio * y + (oneMinusRatio * physics.previousY);
        position.rotation = body.GetAngularVelocity() * this.fixedTimestepAccumulatorRatio + oneMinusRatio * physics.previousAngle;

        /*
         * Update the position component from Box2D model
         * Asteroids uses wraparound space coordinates
         */
        x1 = x > this.width ? 0 : x < 0 ? this.width : x;
        y1 = y > this.height ? 0 : y < 0 ? this.height : y;
        if (x1 !== x || y1 !== y) {
          body.SetPosition(new b2Vec2(x1, y1));
        }
        node = node.next;
      }
    };

    return SmoothPhysicsSystem;

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

    BulletAgeSystem.prototype.PhysicsSystem = null;

    function BulletAgeSystem(parent, PhysicsSystem) {
      this.PhysicsSystem = PhysicsSystem;
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
        this.PhysicsSystem.deadPool.push(node.physics.body);
        this.entities.destroyEntity(node.entity);
      }
    };

    return BulletAgeSystem;

  })(ash.tools.ListIteratingSystem);

  CollisionSystem = (function(_super) {

    /*
     * Imports
     */
    var Asteroid, AsteroidHitShip, Audio, BulletHitAsteroid, Collision, DeathThroes, Display, Physics, Position, Spaceship, b2ContactListener;

    __extends(CollisionSystem, _super);

    Asteroid = Components.Asteroid;

    Audio = Components.Audio;

    Collision = Components.Collision;

    DeathThroes = Components.DeathThroes;

    Display = Components.Display;

    Physics = Components.Physics;

    Position = Components.Position;

    Spaceship = Components.Spaceship;

    b2ContactListener = Box2D.Dynamics.b2ContactListener;

    BulletHitAsteroid = 1;

    AsteroidHitShip = 2;

    CollisionSystem.prototype.world = null;

    CollisionSystem.prototype.entities = null;

    CollisionSystem.prototype.games = null;

    CollisionSystem.prototype.rnd = null;

    CollisionSystem.prototype.collisions = null;

    CollisionSystem.prototype.PhysicsSystem = null;

    function CollisionSystem(parent, PhysicsSystem) {
      this.PhysicsSystem = PhysicsSystem;
      this.PostSolve = __bind(this.PostSolve, this);
      this.PreSolve = __bind(this.PreSolve, this);
      this.EndContact = __bind(this.EndContact, this);
      this.BeginContact = __bind(this.BeginContact, this);
      this.update = __bind(this.update, this);
      this.world = parent.world;
      this.entities = parent.entities;
      this.rnd = parent.rnd;
      this.components = parent.ash.components;
      this.collisions = [];
      this.world.SetContactListener(this);
    }

    CollisionSystem.prototype.update = function(time) {
      var a, b, body, position, radius, type, _ref;
      while (this.collisions.length) {
        _ref = this.collisions.pop(), type = _ref.type, a = _ref.a, b = _ref.b;
        if (type === BulletHitAsteroid) {
          if ((a.get(Physics) != null)) {
            this.entities.destroyEntity(a);
            a.get(Display).graphic.dispose();
            this.PhysicsSystem.deadPool.push(a.get(Physics).body);
          }
          if ((b.get(Physics) != null)) {
            radius = b.get(Collision).radius;
            position = b.get(Position).position;
            if (radius > 10) {
              this.entities.createAsteroid(radius - 10, position.x + this.rnd.nextDouble() * 10 - 5, position.y + this.rnd.nextDouble() * 10 - 5);
              this.entities.createAsteroid(radius - 10, position.x + this.rnd.nextDouble() * 10 - 5, position.y + this.rnd.nextDouble() * 10 - 5);
            }
            body = b.get(Physics).body;
            b.get(Display).graphic.dispose();
            b.get(Asteroid).fsm.changeState('destroyed');
            b.get(DeathThroes).body = body;
            b.get(Audio).play(ExplodeAsteroid);
            if (this.games.head) {
              this.games.head.state.hits++;
            }
          }
        } else if (type === AsteroidHitShip) {
          if ((b.get(Physics) != null)) {
            body = b.get(Physics).body;
            b.get(Display).graphic.dispose();
            b.get(Spaceship).fsm.changeState('destroyed');
            b.get(DeathThroes).body = body;
            b.get(Audio).play(ExplodeShip);
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
     * b2ContactListener Interface
     *
     * filter/reduce the events and que them up
     */

    CollisionSystem.prototype.BeginContact = function(contact) {
      var a, b;
      a = contact.GetFixtureA().GetBody().GetUserData();
      b = contact.GetFixtureB().GetBody().GetUserData();
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

      /*
       * type:
       * 1 - bullet hits asteroid
       * 2 - asteroid hits spaceship
       */
    };

    CollisionSystem.prototype.EndContact = function(contact) {};

    CollisionSystem.prototype.PreSolve = function(contact, oldManifold) {};

    CollisionSystem.prototype.PostSolve = function(contact, impulse) {};

    return CollisionSystem;

  })(ash.core.System);

  DeathThroesSystem = (function(_super) {
    __extends(DeathThroesSystem, _super);

    DeathThroesSystem.prototype.entities = null;

    DeathThroesSystem.prototype.PhysicsSystem = null;

    function DeathThroesSystem(parent, PhysicsSystem) {
      this.PhysicsSystem = PhysicsSystem;
      this.updateNode = __bind(this.updateNode, this);
      DeathThroesSystem.__super__.constructor.call(this, parent.ash.nodes.DeathThroesNode, this.updateNode);
      this.entities = parent.entities;
    }

    DeathThroesSystem.prototype.updateNode = function(node, time) {
      var dead;
      dead = node.dead;
      dead.countdown -= time;
      if (dead.countdown <= 0) {
        this.entities.destroyEntity(node.entity);
        node.display.graphic.dispose();
        this.PhysicsSystem.deadPool.push(dead.body);
      }
    };

    return DeathThroesSystem;

  })(ash.tools.ListIteratingSystem);

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

    function GameManager(parent) {
      this.parent = parent;
      this.update = __bind(this.update, this);
      this.entities = this.parent.entities;
      this.rnd = this.parent.rnd;
      this.width = this.parent.width;
      this.height = this.parent.height;
      this.nodes = this.parent.ash.nodes;
    }

    GameManager.prototype.addToEngine = function(engine) {
      this.gameNodes = engine.getNodeList(this.nodes.GameNode);
      this.spaceships = engine.getNodeList(this.nodes.SpaceshipNode);
      this.asteroids = engine.getNodeList(this.nodes.AsteroidCollisionNode);
      this.bullets = engine.getNodeList(this.nodes.BulletCollisionNode);
    };

    GameManager.prototype.update = function(time) {
      var asteroid, asteroidCount, clearToAddSpaceship, dd, i, mm, newSpaceshipPosition, node, position, request, score, spaceship, today, yyyy, yyyymmdd;
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
             * Save the highest score for today
             */
            today = new Date();
            mm = (today.getMonth() + 1).toString();
            if (mm.length === 1) {
              mm = '0' + mm;
            }
            dd = today.getDate().toString();
            if (dd.length === 1) {
              dd = '0' + dd;
            }
            yyyy = today.getFullYear().toString();
            yyyymmdd = yyyy + mm + dd;
            if (this.parent.fbStatus === 1) {

              /*
               * Post to Facebook via Opa!
               */
              score = {
                appId: this.parent.fbAppId,
                userId: this.parent.fbUserID,
                date: yyyymmdd,
                score: node.state.hits
              };
              request = new XMLHttpRequest();
              request.open('POST', '/score/asteroids');
              request.setRequestHeader('Content-Type', 'application/json');
              request.send(JSON.stringify(score));
            } else {

              /*
               * Save in browser storage
               */
              if (0 === Db.queryAll('leaderboard', {
                query: {
                  date: yyyymmdd
                }
              }).length) {
                Db.insert('leaderboard', {
                  date: yyyymmdd,
                  score: node.state.hits
                });
              } else {
                Db.update('leaderboard', {
                  date: yyyymmdd
                }, function(row) {
                  if (node.state.hits > row.score) {
                    row.score = node.state.hits;
                  }
                  return row;
                });
              }
              Db.commit();
            }

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
    __extends(GunControlSystem, _super);

    GunControlSystem.prototype.keyPoll = null;

    GunControlSystem.prototype.entities = null;

    GunControlSystem.prototype.buttons = null;

    function GunControlSystem(parent) {
      var _ref;
      this.parent = parent;
      this.updateNode = __bind(this.updateNode, this);
      GunControlSystem.__super__.constructor.call(this, this.parent.ash.nodes.GunControlNode, this.updateNode);
      this.keyPoll = this.parent.keyPoll;
      this.entities = this.parent.entities;
      this.buttons = (_ref = this.parent.controller) != null ? _ref.buttons : void 0;
    }

    GunControlSystem.prototype.updateNode = function(node, time) {
      var control, gun, position, _ref;
      control = node.control;
      position = node.position;
      gun = node.gun;
      gun.shooting = this.keyPoll.isDown(control.trigger) || ((_ref = this.buttons) != null ? _ref.fire : void 0);
      gun.timeSinceLastShot += time;
      if (gun.shooting && gun.timeSinceLastShot >= gun.minimumShotInterval) {
        this.entities.createUserBullet(gun, position);
        node.audio.play(ShootGun);
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
    var IDTK, R, b2Vec2, colors, _ref;

    __extends(ShipControlSystem, _super);

    R = window.devicePixelRatio;

    IDTK = ((_ref = window.ext) != null ? _ref.IDTK_SRV_BOX2D : void 0) != null;

    b2Vec2 = Box2D.Common.Math.b2Vec2;

    colors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0x00ffff, 0xffff00];

    ShipControlSystem.prototype.keyPoll = null;

    ShipControlSystem.prototype.rnd = null;

    ShipControlSystem.prototype.warping = 0;

    ShipControlSystem.prototype.kount = 0;

    ShipControlSystem.prototype.width = 0;

    ShipControlSystem.prototype.height = 0;

    function ShipControlSystem(parent) {
      this.updateNode = __bind(this.updateNode, this);
      ShipControlSystem.__super__.constructor.call(this, parent.ash.nodes.PhysicsControlNode, this.updateNode);
      this.keyPoll = parent.keyPoll;
      this.rnd = parent.rnd;
      this.width = parent.width;
      this.height = parent.height;
      this.game = parent.game;
      this.controller = parent.controller;
    }

    ShipControlSystem.prototype.updateNode = function(node, time) {
      var a1, angle, body, control, dpad, joystick, rotation, speed, v, x, y, _ref1, _ref2, _ref3, _ref4;
      control = node.control;
      body = node.physics.body;
      if (this.warping) {
        this.warping--;
        x = this.rnd.nextInt(this.width);
        y = this.rnd.nextInt(this.height);
        body.SetPosition({
          x: x,
          y: y
        });
        if (this.warping === 0) {
          node.display.graphic.draw(0xFFFFFF);
        } else {
          node.display.graphic.draw(colors[this.rnd.nextInt(6)]);
        }
        return;
      }
      if (this.keyPoll.isDown(control.warp) || ((_ref1 = this.controller) != null ? (_ref2 = _ref1.buttons) != null ? _ref2.warp : void 0 : void 0)) {
        this.controller.warp = false;
        this.warping = this.rnd.nextInt(30) + 30;
        return;
      }
      dpad = (_ref3 = this.controller) != null ? _ref3.dpad : void 0;
      if (dpad != null) {
        if (dpad.left) {
          rotation = body.GetAngularVelocity();
          body.SetAngularVelocity(rotation - control.rotationRate * time);
        }
        if (dpad.right) {
          rotation = rotation || body.GetAngularVelocity();
          body.SetAngularVelocity(rotation + control.rotationRate * time);
        }
        if (dpad.up) {
          rotation = rotation || body.GetAngularVelocity();
          v = body.GetLinearVelocity();
          v.x += Math.cos(rotation) * control.accelerationRate * time * R;
          v.y += Math.sin(rotation) * control.accelerationRate * time * R;
          if (!IDTK) {
            body.SetAwake(true);
          }
          body.SetLinearVelocity(v);
        }
      }
      joystick = (_ref4 = this.controller) != null ? _ref4.joystick : void 0;
      if (joystick != null) {
        angle = Math.atan2(joystick.normalizedY, joystick.normalizedX) / Math.PI * 180;
        a1 = Math.abs(angle);
        rotation = body.GetAngularVelocity();
        if (a1 > 135 && a1 < 179) {
          body.SetAngularVelocity(rotation - control.rotationRate * time);
        } else if (a1 > 1 && a1 < 45) {
          body.SetAngularVelocity(rotation + control.rotationRate * time);
        } else if (angle > 45 && angle < 135) {
          speed = 127 / Math.sqrt(joystick.normalizedX * joystick.normalizedX + joystick.normalizedY * joystick.normalizedY);
          v = body.GetLinearVelocity();
          v.x += Math.cos(rotation) * speed * time * R;
          v.y += Math.sin(rotation) * speed * time * R;
          if (!IDTK) {
            body.SetAwake(true);
          }
          body.SetLinearVelocity(v);
        }
      }
      if (this.keyPoll.isDown(control.left)) {
        rotation = body.GetAngularVelocity();
        body.SetAngularVelocity(rotation - control.rotationRate * time);
      }
      if (this.keyPoll.isDown(control.right)) {
        rotation = rotation || body.GetAngularVelocity();
        body.SetAngularVelocity(rotation + control.rotationRate * time);
      }
      if (this.keyPoll.isDown(control.accelerate)) {
        rotation = rotation || body.GetAngularVelocity();
        v = body.GetLinearVelocity();
        v.x += Math.cos(rotation) * control.accelerationRate * time * R;
        v.y += Math.sin(rotation) * control.accelerationRate * time * R;
        if (!IDTK) {
          body.SetAwake(true);
        }
        body.SetLinearVelocity(v);
      }
    };

    return ShipControlSystem;

  })(ash.tools.ListIteratingSystem);

  RenderSystem = (function(_super) {
    __extends(RenderSystem, _super);

    RenderSystem.prototype.stage = null;

    RenderSystem.prototype.renderer = null;

    RenderSystem.prototype.nodes = null;

    function RenderSystem(parent) {
      this.update = __bind(this.update, this);
      this.nodes = parent.ash.nodes;
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
      var display, graphic, node, position;
      node = this.nodes.head;
      while (node) {
        display = node.display;
        graphic = display.graphic;
        position = node.position;
        graphic.x = position.position.x;
        graphic.y = position.position.y;
        graphic.rotation = position.rotation;
        node = node.next;
      }
    };

    return RenderSystem;

  })(ash.core.System);

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

  WaitForStartSystem = (function(_super) {
    __extends(WaitForStartSystem, _super);

    WaitForStartSystem.prototype.engine = null;

    WaitForStartSystem.prototype.entities = null;

    WaitForStartSystem.prototype.gameNodes = null;

    WaitForStartSystem.prototype.waitNodes = null;

    WaitForStartSystem.prototype.asteroids = null;

    function WaitForStartSystem(parent) {
      this.update = __bind(this.update, this);
      this.entities = parent.entities;
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
          graphic = asteroid.entity.get(Display).graphic;
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

  Entities = (function() {

    /*
     * Imports
     */
    var Animation, Asteroid, Audio, Bullet, Collision, DeathThroes, Display, Entity, EntityStateMachine, GameState, Gun, GunControls, Hud, MotionControls, Physics, Position, Spaceship, WaitForStart, b2Body, b2BodyDef, b2CircleShape, b2FixtureDef, b2PolygonShape, b2Vec2, get;

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
      return parseFloat(asteroids.get(prop));
    };


    /*
     * Box2D classes
     */

    b2Body = Box2D.Dynamics.b2Body;

    b2BodyDef = Box2D.Dynamics.b2BodyDef;

    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

    b2FixtureDef = Box2D.Dynamics.b2FixtureDef;

    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

    b2Vec2 = Box2D.Common.Math.b2Vec2;

    Entities.prototype.game = null;

    Entities.prototype.ash = null;

    Entities.prototype.world = null;

    Entities.prototype.waitEntity = null;

    Entities.prototype.rnd = null;

    Entities.prototype.bulletId = 0;

    Entities.prototype.asteroidId = 0;

    Entities.prototype.spaceshipId = 0;

    function Entities(parent) {
      this.parent = parent;
      this.createUserBullet = __bind(this.createUserBullet, this);
      this.createSpaceship = __bind(this.createSpaceship, this);
      this.game = this.parent.game;
      this.ash = this.parent.ash;
      this.world = this.parent.world;
      this.rnd = this.parent.rnd;
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
      gameEntity = new Entity('game').add(new GameState()).add(new Hud(hud)).add(new Display(hud)).add(new Position(0, 0, 0, 0));
      this.ash.addEntity(gameEntity);
      return gameEntity;
    };


    /*
     * Start...
     */

    Entities.prototype.createWaitForClick = function() {
      var waitView;
      waitView = new WaitForStartView(this.game, this.parent);
      this.waitEntity = new Entity('wait').add(new WaitForStart(waitView)).add(new Display(waitView)).add(new Position(0, 0, 0, 0));
      this.waitEntity.get(WaitForStart).startGame = false;
      this.ash.addEntity(this.waitEntity);
      return this.waitEntity;
    };


    /*
     * Create an Asteroid with FSM Animation
     */

    Entities.prototype.createAsteroid = function(radius, x, y) {

      /*
       * Asteroid simulation - box2d
       */
      var asteroid, body, bodyDef, deathView, fixDef, fsm, liveView, v1, v2;
      bodyDef = new b2BodyDef();
      bodyDef.type = b2Body.b2_dynamicBody;
      bodyDef.fixedRotation = true;
      bodyDef.position.x = x;
      bodyDef.position.y = y;
      v1 = (this.rnd.nextDouble() - 0.5) * get('asteroidLinearVelocity') * (50 - radius);
      v2 = (this.rnd.nextDouble() - 0.5) * get('asteroidLinearVelocity') * (50 - radius);
      bodyDef.linearVelocity.Set(v1, v2);
      bodyDef.angularVelocity = this.rnd.nextDouble() * get('asteroidAngularVelocity') - 1;
      bodyDef.linearDamping = get('asteroidDamping');
      fixDef = new b2FixtureDef();
      fixDef.density = get('asteroidDensity');
      fixDef.friction = get('asteroidFriction');
      fixDef.restitution = get('asteroidRestitution');
      fixDef.shape = new b2CircleShape(radius);
      body = this.world.CreateBody(bodyDef);
      body.CreateFixture(fixDef);

      /*
       * Asteroid entity
       */
      asteroid = new Entity();
      fsm = new EntityStateMachine(asteroid);
      liveView = new AsteroidView(this.parent, radius);
      fsm.createState('alive').add(Physics).withInstance(new Physics(body)).add(Collision).withInstance(new Collision(radius)).add(Display).withInstance(new Display(liveView));
      deathView = new AsteroidDeathView(this.parent, radius);
      fsm.createState('destroyed').add(DeathThroes).withInstance(new DeathThroes(3)).add(Display).withInstance(new Display(deathView)).add(Animation).withInstance(new Animation(deathView));
      asteroid.add(new Asteroid(fsm)).add(new Position(x, y, 0)).add(new Audio());
      body.SetUserData({
        type: Entities.ASTEROID,
        entity: asteroid
      });
      fsm.changeState('alive');
      this.ash.addEntity(asteroid);
      return asteroid;
    };


    /*
     * Create Player Spaceship with FSM Animation
     */

    Entities.prototype.createSpaceship = function() {
      var body, bodyDef, deathView, fixDef, fsm, liveView, spaceship, x, y;
      x = this.rnd.nextInt(this.parent.width);
      y = this.rnd.nextInt(this.parent.height);

      /*
       * Spaceship simulation
       */
      bodyDef = new b2BodyDef();
      bodyDef.type = b2Body.b2_dynamicBody;
      bodyDef.fixedRotation = false;
      bodyDef.position.x = x;
      bodyDef.position.y = y;
      bodyDef.linearVelocity.Set(0, 0);
      bodyDef.angularVelocity = 0;
      bodyDef.linearDamping = get('spaceshipDamping');
      fixDef = new b2FixtureDef();
      fixDef.density = get('spaceshipDensity');
      fixDef.friction = get('spaceshipFriction');
      fixDef.restitution = get('spaceshipRestitution');
      fixDef.shape = new b2PolygonShape();
      fixDef.shape.SetAsArray([new b2Vec2(0.45, 0), new b2Vec2(-0.25, 0.25), new b2Vec2(-0.25, -0.25)], 3);
      body = this.world.CreateBody(bodyDef);
      body.CreateFixture(fixDef);

      /*
       * Spaceship entity
       */
      spaceship = new Entity();
      fsm = new EntityStateMachine(spaceship);
      liveView = new SpaceshipView(this.game);
      fsm.createState('playing').add(Physics).withInstance(new Physics(body)).add(MotionControls).withInstance(new MotionControls(this.LEFT, this.RIGHT, this.THRUST, this.WARP, 100, 3)).add(Gun).withInstance(new Gun(8, 0, 0.3, 2)).add(GunControls).withInstance(new GunControls(this.FIRE)).add(Collision).withInstance(new Collision(9)).add(Display).withInstance(new Display(liveView));
      deathView = new SpaceshipDeathView(this.parent);
      fsm.createState('destroyed').add(DeathThroes).withInstance(new DeathThroes(5)).add(Display).withInstance(new Display(deathView)).add(Animation).withInstance(new Animation(deathView));
      spaceship.add(new Spaceship(fsm)).add(new Position(x, y, 0)).add(new Audio());
      body.SetUserData({
        type: Entities.SPACESHIP,
        entity: spaceship
      });
      fsm.changeState('playing');
      this.ash.addEntity(spaceship);
      console.log(spaceship);
      return spaceship;
    };


    /*
     * Create a Bullet
     */

    Entities.prototype.createUserBullet = function(gun, parentPosition) {
      var body, bodyDef, bullet, bulletView, cos, fixDef, sin, x, y;
      cos = Math.cos(parentPosition.rotation);
      sin = Math.sin(parentPosition.rotation);
      x = cos * gun.offsetFromParent.x - sin * gun.offsetFromParent.y + parentPosition.position.x;
      y = sin * gun.offsetFromParent.x + cos * gun.offsetFromParent.y + parentPosition.position.y;

      /*
       * Bullet simulation
       */
      bodyDef = new b2BodyDef();
      bodyDef.type = b2Body.b2_dynamicBody;
      bodyDef.fixedRotation = true;
      bodyDef.bullet = true;
      bodyDef.position.x = x;
      bodyDef.position.y = y;
      bodyDef.linearVelocity.Set(cos * get('bulletLinearVelocity'), sin * get('bulletLinearVelocity'));
      bodyDef.angularVelocity = 0;
      bodyDef.linearDamping = get('bulletDamping');
      fixDef = new b2FixtureDef();
      fixDef.density = get('bulletDensity');
      fixDef.friction = get('bulletFriction');
      fixDef.restitution = get('bulletRestitution');
      fixDef.shape = new b2CircleShape(0);
      body = this.world.CreateBody(bodyDef);
      body.CreateFixture(fixDef);

      /*
       * Bullet entity
       */
      bulletView = new BulletView(this.game);
      bullet = new Entity().add(new Bullet(gun.bulletLifetime)).add(new Position(x, y, 0)).add(new Collision(0)).add(new Physics(body)).add(new Display(bulletView));
      body.SetUserData({
        type: Entities.BULLET,
        entity: bullet
      });
      this.ash.addEntity(bullet);
      return bullet;
    };

    return Entities;

  })();

  Asteroids = (function() {
    var b2Vec2, b2World, ucfirst;

    b2Vec2 = Box2D.Common.Math.b2Vec2;

    b2World = Box2D.Dynamics.b2World;

    ucfirst = function(s) {
      return s.charAt(0).toUpperCase() + s.substr(1);
    };

    Asteroids.prototype.game = null;

    Asteroids.prototype.pad = null;

    Asteroids.prototype.profiler = null;

    Asteroids.prototype.engine = null;

    Asteroids.prototype.entities = null;

    Asteroids.prototype.keyPoll = null;

    Asteroids.prototype.config = null;

    Asteroids.prototype.world = null;

    Asteroids.prototype.background = null;

    Asteroids.prototype.physics = null;

    Asteroids.prototype.faderBitmap = null;

    Asteroids.prototype.faderSprite = null;

    Asteroids.prototype.fbAppId = '887669707958104';

    Asteroids.prototype.fbUserID = '';

    Asteroids.prototype.fbButton = null;

    Asteroids.prototype.fbStatus = 0;

    Asteroids.prototype.bgdColor = 0x6A5ACD;

    Asteroids.prototype.height = window.innerHeight;

    Asteroids.prototype.width = window.innerWidth;

    Asteroids.prototype.scale = window.devicePixelRatio;

    Asteroids.prototype.playMusic = localStorage.playMusic;

    Asteroids.prototype.playSfx = localStorage.playSfx;

    Asteroids.prototype.optBgd = localStorage.background || 'blue';


    /*
     * Create the phaser game component
     */

    function Asteroids() {
      this.initializeDb = __bind(this.initializeDb, this);
      this.setPlaySfx = __bind(this.setPlaySfx, this);
      this.setPlayMusic = __bind(this.setPlayMusic, this);
      this.setBackground = __bind(this.setBackground, this);
      this.getBackground = __bind(this.getBackground, this);
      this.set = __bind(this.set, this);
      this.get = __bind(this.get, this);
      this.onLogin = __bind(this.onLogin, this);
      this.onLeaderboard = __bind(this.onLeaderboard, this);
      this.onSettings = __bind(this.onSettings, this);
      this.leaderboardImpl = __bind(this.leaderboardImpl, this);
      this.showLeaderboard = __bind(this.showLeaderboard, this);
      this.pause = __bind(this.pause, this);
      this.fade = __bind(this.fade, this);
      this.getFaderSprite = __bind(this.getFaderSprite, this);
      this.create = __bind(this.create, this);
      this.preload = __bind(this.preload, this);
      this.init = __bind(this.init, this);
      this.game = new Phaser.Game(this.width * this.scale, this.height * this.scale, Phaser.CANVAS, '', {
        init: this.init,
        preload: this.preload,
        create: this.create
      });
      this.rnd = new MersenneTwister();
      this.initializeDb();
      Cocoon.App.WebView.on("load", {
        success: (function(_this) {
          return function() {
            return Cocoon.App.showTheWebView();
          };
        })(this),
        error: (function(_this) {
          return function() {
            return console.log("Cannot show the Webview: " + (JSON.stringify(arguments)));
          };
        })(this)
      });
    }


    /*
     * Configure Phaser scaling
     */

    Asteroids.prototype.init = function() {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.minWidth = this.width * this.scale;
      this.game.scale.minHeight = this.height * this.scale;
      this.game.scale.maxWidth = this.width * this.scale;
      this.game.scale.maxHeight = this.height * this.scale;
      this.game.scale.pageAlignVertically = true;
      this.game.scale.pageAlignHorizontally = true;
    };


    /*
     * Load assets
     */

    Asteroids.prototype.preload = function() {
      this.game.load.image('fb-login', 'res/fb-login.png');
      this.game.load.image('dialog-blue', 'res/dialog-box.png');
      this.game.load.image('dialog-star', 'res/black-dialog.png');
      this.game.load.image('button-blue', 'res/standard-button-on.png');
      this.game.load.image('button-star', 'res/black-button-on.png');
      this.game.load.image('background', 'res/BackdropBlackLittleSparkBlack.png');
      this.game.load.image('leaderboard', 'res/icons/b_Leaderboard.png');
      this.game.load.image('settings', 'res/icons/b_Parameters.png');
      this.game.load.image('round', 'res/round48.png');
      this.game.load.image('square', 'res/square48.png');
      this.game.load.audio('asteroid', [ExplodeAsteroid.prototype.src]);
      this.game.load.audio('ship', [ExplodeShip.prototype.src]);
      this.game.load.audio('shoot', [ShootGun.prototype.src]);
    };


    /*
     * Start the game
     */

    Asteroids.prototype.create = function() {
      var PhysicsSystem, useBox2dPlugin;
      this.profiler = this.game.plugins.add(Phaser.Plugin.PerformanceMonitor, {
        profiler: this.get('profiler')
      });
      this.optBgd = Db.queryAll('settings', {
        query: {
          name: 'background'
        }
      })[0].value;
      this.game.stage.backgroundColor = this.bgdColor;
      this.background = this.game.add.sprite(0, 0, 'background');
      this.background.width = this.width;
      this.background.height = this.height;
      this.background.alpha = this.optBgd === 'blue' ? 0 : 1;
      this.game.add.button(this.width - 50, 50, 'settings', this.onSettings);
      this.game.add.button(this.width - 50, 125, 'leaderboard', this.onLeaderboard);
      FB.init({
        appId: this.fbAppId,
        status: true,
        xfbml: true,
        version: 'v2.3'
      });
      FB.getLoginStatus((function(_this) {
        return function(response) {
          _this.fbUserID = response.userID;
          if (response.status === 'connected') {
            return _this.fbStatus = 1;
          } else {
            _this.fbStatus = 0;
            return _this.fbButton = _this.game.add.button((_this.width - 195) / 2, 50, 'fb-login', _this.onLogin);
          }
        };
      })(this));
      ExplodeAsteroid.audio = this.game.add.audio('asteroid');
      ExplodeAsteroid.audio.play('', 0, 0);
      ExplodeShip.audio = this.game.add.audio('ship');
      ExplodeShip.audio.play('', 0, 0);
      ShootGun.audio = this.game.add.audio('shoot');
      ShootGun.audio.play('', 0, 0);
      this.keyPoll = new KeyPoll(this);
      this.world = new b2World(new b2Vec2(0, 0), true);
      this.world.SetContinuousPhysics(true);
      this.ash = this.game.plugins.add(ash.core.PhaserEngine, Nodes, Components);
      this.entities = new Entities(this);
      this.controller = this.game.plugins.add(Phaser.Plugin.GameControllerPlugin, {
        force: false
      });
      this.controller.addDPad('left', 60, this.height - 60, {
        up: {
          width: '10%',
          height: '7%'
        },
        left: {
          width: '7%',
          height: '10%'
        },
        right: {
          width: '7%',
          height: '10%'
        },
        down: false
      });
      this.controller.addButtons('right', this.width - 180, this.height - 80, {
        1: {
          title: 'warp',
          color: 'yellow'
        },
        3: {
          title: 'FIRE',
          color: 'red'
        }
      });
      useBox2dPlugin = !(!window.ext || typeof window.ext.IDTK_SRV_BOX2D === 'undefined');
      PhysicsSystem = useBox2dPlugin ? FixedPhysicsSystem : SmoothPhysicsSystem;
      this.physics = new PhysicsSystem(this);
      this.ash.addSystem(this.physics, SystemPriorities.move);
      this.ash.addSystem(new BulletAgeSystem(this, PhysicsSystem), SystemPriorities.update);
      this.ash.addSystem(new DeathThroesSystem(this, PhysicsSystem), SystemPriorities.update);
      this.ash.addSystem(new CollisionSystem(this, PhysicsSystem), SystemPriorities.resolveCollisions);
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
    };


    /*
     * Get Fader Sprite
     *
     * A screen sized black rectangle used for full screen fades
     */

    Asteroids.prototype.getFaderSprite = function() {
      if (this.faderSprite == null) {
        this.faderBitmap = this.game.make.bitmapData(this.game.width, this.game.height);
        this.faderBitmap.rect(0, 0, this.game.width, this.game.height, 'rgb(0,0,0)');
        this.faderSprite = this.game.add.sprite(0, 0, this.faderBitmap);
        this.faderSprite.alpha = 0;
      }
      return this.faderSprite.bringToTop();
    };


    /*
     * Fade
     */

    Asteroids.prototype.fade = function(next) {
      var fader, sprite;
      sprite = this.getFaderSprite();
      fader = this.game.add.tween(sprite);
      if (sprite.alpha === 0) {
        fader.to({
          alpha: 1
        }, 500);
        fader.onComplete.add(next, this);
        fader.start();
      } else {
        this.game.paused = false;
        fader.to({
          alpha: 0
        }, 500);
        fader.onComplete.add(next, this);
        fader.start();
      }
    };


    /*
     * Pause
     *
     * If there is a callback, fadeout and run callback
     * Otherwise we fade in and restore
     */

    Asteroids.prototype.pause = function(next) {
      if (next != null) {
        this.faderSprite = null;
        this.physics.enabled = false;
        this.fade(next);
      } else {
        this.fade((function(_this) {
          return function() {
            return _this.physics.enabled = true;
          };
        })(this));
      }
    };


    /*
     * Create and display a leaderboard
     */

    Asteroids.prototype.showLeaderboard = function() {
      if (this.fbStatus === 1) {
        FB.api('me/scores', (function(_this) {
          return function(response) {
            return _this.leaderboardImpl(response);
          };
        })(this));
      } else {
        this.leaderboardImpl(Db.queryAll('leaderboard', {
          limit: 10,
          sort: [['score', 'DESC']]
        }));
      }
    };

    Asteroids.prototype.leaderboardImpl = function(data) {
      var big, board, button, dialog, label, mmddyyyy, normal, row, title, y, _i, _len;
      board = this.game.add.group();
      dialog = new Phaser.Sprite(this.game, 0, 0, "dialog-" + this.optBgd);
      dialog.width = this.width;
      dialog.height = this.height;
      board.add(dialog);
      big = {
        font: 'bold 30px opendyslexic',
        fill: '#ffffff'
      };
      normal = {
        font: 'bold 20px opendyslexic',
        fill: '#ffffff'
      };
      title = new Phaser.Text(this.game, this.width / 2, 20, 'Asteroids', big);
      title.anchor.x = 0.5;
      board.add(title);
      board.add(new Phaser.Text(this.game, 200, 80, 'Date', normal));
      board.add(new Phaser.Text(this.game, 400, 80, 'Score', normal));
      board.add(new Phaser.Text(this.game, 200, 100, '--------', normal));
      board.add(new Phaser.Text(this.game, 400, 100, '--------', normal));
      y = 120;
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        row = data[_i];
        mmddyyyy = row.date.substr(4, 2) + '/' + row.date.substr(6, 2) + '/' + row.date.substr(0, 4);
        board.add(new Phaser.Text(this.game, 200, y, mmddyyyy, normal));
        board.add(new Phaser.Text(this.game, 400, y, row.score, normal));
        y += 20;
      }
      button = new Phaser.Button(this.game, this.width / 2, this.height - 64, "button-" + this.optBgd, (function(_this) {
        return function() {
          board.destroy();
          board = null;
          _this.pause();
        };
      })(this));
      button.anchor.x = 0.5;
      board.add(button);
      label = new Phaser.Text(this.game, 0, button.height / 2, 'continue', big);
      label.anchor.x = 0.5;
      label.anchor.y = 0.5;
      button.addChild(label);
    };


    /* ============================================================>
        B U T T O N  E V E N T S
    <============================================================
     */

    Asteroids.prototype.onSettings = function() {
      this.pause((function(_this) {
        return function() {
          return Cocoon.App.loadInTheWebView("settings.html");
        };
      })(this));
    };

    Asteroids.prototype.onLeaderboard = function() {
      this.pause((function(_this) {
        return function() {
          return _this.showLeaderboard();
        };
      })(this));
    };

    Asteroids.prototype.onLogin = function() {
      return this.pause((function(_this) {
        return function() {
          return FB.login(function(response) {
            if (response.authResponse) {
              return FB.api('/me', function(response) {
                _this.pause();
                if (response.error) {
                  return console.error("login error: " + response.error.message);
                } else {
                  console.log("login succeeded");
                  _this.fbButton.input.enabled = false;
                  _this.fbButton.alpha = 0;
                  _this.fbStatus = 1;
                  return _this.fbUserID = response.id;
                }
              });
            }
          });
        };
      })(this));
    };


    /* ============================================================>
        A S T E R O I D  S E T T I N G S
    <============================================================
     */


    /*
     * Get Asteroid Property
     */

    Asteroids.prototype.get = function(prop) {
      var n;
      n = 'get' + ucfirst(prop);
      if (this[n] != null) {
        return this[n]();
      } else {
        return Db.queryAll('settings', {
          query: {
            name: prop
          }
        })[0].value;
      }
    };


    /*
     * Set Asteroid Property
     */

    Asteroids.prototype.set = function(prop, value) {
      var n;
      n = 'set' + ucfirst(prop);
      if (this[n] != null) {
        this[n](value);
      } else {
        Db.update('settings', {
          name: prop
        }, function(row) {
          row.value = value;
          return row;
        });
        Db.commit();
      }
    };


    /*
     * Sgt Asteroid Background
     */

    Asteroids.prototype.getBackground = function() {
      if ('blue' === Db.queryAll('settings', {
        query: {
          name: 'background'
        }
      })[0].value) {
        return 0;
      } else {
        return 1;
      }
    };


    /*
     * Set Asteroid Background
     */

    Asteroids.prototype.setBackground = function(value) {
      var background;
      background = ['blue', 'star'];
      this.background.alpha = value;
      this.optBgd = background[value];
      Db.update('settings', {
        name: 'background'
      }, function(row) {
        row.value = background[value];
        return row;
      });
      Db.commit();
    };


    /*
     * Set Asteroid Play Music
     */

    Asteroids.prototype.setPlayMusic = function(value) {
      Db.update('settings', {
        name: 'playMusic'
      }, function(row) {
        row.value = value;
        return row;
      });
      Db.commit();
      this.playMusic = value;
    };


    /*
     * Set Asteroid Play Sfx
     */

    Asteroids.prototype.setPlaySfx = function(value) {
      Db.update('settings', {
        name: 'playSfx'
      }, function(row) {
        row.value = value;
        return row;
      });
      Db.commit();
      this.playSfx = value;
      Sound.volume = value / 100;
    };


    /*
     * Initialize Asteroid Database
     */

    Asteroids.prototype.initializeDb = function() {
      window.Db = new localStorageDB('asteroids', localStorage);
      if (Db.isNew()) {
        Db.createTable('leaderboard', ['date', 'score']);
        Db.createTable('settings', ['name', 'value']);

        /*
         * Default Property Settings:
         */
        Db.insert('settings', {
          name: 'profiler',
          value: 'on'
        });
        Db.insert('settings', {
          name: 'background',
          value: 'blue'
        });
        Db.insert('settings', {
          name: 'playMusic',
          value: '50'
        });
        Db.insert('settings', {
          name: 'playSfx',
          value: '50'
        });
        Db.insert('settings', {
          name: 'asteroidDensity',
          value: '1.0'
        });
        Db.insert('settings', {
          name: 'asteroidFriction',
          value: '1.0'
        });
        Db.insert('settings', {
          name: 'asteroidRestitution',
          value: '0.2'
        });
        Db.insert('settings', {
          name: 'asteroidDamping',
          value: '0.0'
        });
        Db.insert('settings', {
          name: 'asteroidLinearVelocity',
          value: '4.0'
        });
        Db.insert('settings', {
          name: 'asteroidAngularVelocity',
          value: '2.0'
        });
        Db.insert('settings', {
          name: 'spaceshipDensity',
          value: '1.0'
        });
        Db.insert('settings', {
          name: 'spaceshipFriction',
          value: '1.0'
        });
        Db.insert('settings', {
          name: 'spaceshipRestitution',
          value: '0.2'
        });
        Db.insert('settings', {
          name: 'spaceshipDamping',
          value: '0.75'
        });
        Db.insert('settings', {
          name: 'bulletDensity',
          value: '1.0'
        });
        Db.insert('settings', {
          name: 'bulletFriction',
          value: '0.0'
        });
        Db.insert('settings', {
          name: 'bulletRestitution',
          value: '0.0'
        });
        Db.insert('settings', {
          name: 'bulletDamping',
          value: '0.0'
        });
        Db.insert('settings', {
          name: 'bulletLinearVelocity',
          value: '150'
        });
        Db.commit();
      }

      /*
       * check upgrade
       */
      if (Db.queryAll('settings', {
        query: {
          name: 'profiler'
        }
      }).length === 0) {
        Db.insert('settings', {
          name: 'profiler',
          value: 'off'
        });
      }
    };

    return Asteroids;

  })();


  /*
   *
   * JavaScript Performance Monitor Plugin
   *
   * @see https://github.com/mrdoob/stats.js
   *
   *  @game.plugins.add(Phaser.Plugin.PerformanceMonitor, x: 100, y: 100, mode: 1)
   *
   */

  Phaser.Plugin.PerformanceMonitor = (function(_super) {
    __extends(PerformanceMonitor, _super);

    PerformanceMonitor.prototype.stats = null;

    PerformanceMonitor.prototype.visible = false;

    PerformanceMonitor.prototype.active = false;

    PerformanceMonitor.prototype.hasPreUpdate = false;

    PerformanceMonitor.prototype.hasPostRender = false;


    /*
     * @param   game    current phaser game context
     * @param   parent  current phaser state context
     */

    function PerformanceMonitor(game, parent) {
      PerformanceMonitor.__super__.constructor.call(this, game, parent);
    }


    /*
     * @param   options:
     *            x           position.x
     *            y           position.y
     *            container   DOM Element
     *            mode        initial stats mode
     */

    PerformanceMonitor.prototype.init = function(options) {
      var container, x, y, _ref, _ref1, _ref2;
      if (navigator.isCocoonJS || options.profiler === 'off') {
        this.preUpdate = this.nop;
        return this.postRender = this.nop;
      } else {
        if (typeof Stats !== "undefined" && Stats !== null) {
          if (options.container != null) {
            container = options.container;
          } else {
            container = document.createElement('div');
            document.body.appendChild(container);
          }
          this.stats = new Stats();
          container.appendChild(this.stats.domElement);
          this.stats.domElement.style.position = 'absolute';
          x = (_ref = options.x) != null ? _ref : 0;
          y = (_ref1 = options.y) != null ? _ref1 : 0;
          this.stats.setMode((_ref2 = options.mode) != null ? _ref2 : 0);
          this.stats.domElement.style.position = "absolute";
          this.stats.domElement.style.left = "" + x + "px";
          this.stats.domElement.style.top = "" + y + "px";
          this.active = true;
          this.visible = true;
          this.hasPreUpdate = true;
          return this.hasPostRender = true;
        } else {
          this.preUpdate = this.nop;
          return this.postRender = this.nop;
        }
      }
    };


    /*
     * The beginning of the game loop
     */

    PerformanceMonitor.prototype.preUpdate = function() {
      this.stats.begin();
    };


    /*
     * The end of the game loop
     */

    PerformanceMonitor.prototype.postRender = function() {
      this.stats.end();
    };


    /*
     * Null routine
     */

    PerformanceMonitor.prototype.nop = function() {};

    return PerformanceMonitor;

  })(Phaser.Plugin);


  /*
   * Das Boot
   */

  (function() {
    return window.addEventListener('load', function() {
      return window.asteroids = new Asteroids();
    });
  })();

}).call(this);

//# sourceMappingURL=asteroids.js.map
