
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
  var Animation, AnimationNode, AnimationSystem, Asteroid, AsteroidCollisionNode, AsteroidDeathView, AsteroidView, Asteroids, Audio, AudioNode, AudioSystem, Bullet, BulletAgeNode, BulletAgeSystem, BulletCollisionNode, BulletView, Collision, CollisionSystem, DeathThroes, DeathThroesNode, DeathThroesSystem, Display, Dot, EntityCreator, ExplodeAsteroid, ExplodeShip, GameConfig, GameManager, GameNode, GameState, Gun, GunControlNode, GunControlSystem, GunControls, Hud, HudNode, HudSystem, HudView, KeyPoll, MersenneTwister, MotionControls, MovementNode, Physics, PhysicsControlNode, PhysicsControlSystem, PhysicsNode, PhysicsSystem, Point, Position, RenderNode, RenderSystem, ShootGun, Sound, Spaceship, SpaceshipDeathView, SpaceshipNode, SpaceshipView, SystemPriorities, WaitForStart, WaitForStartNode, WaitForStartSystem, WaitForStartView,
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

    KeyPoll.prototype.states = null;

    KeyPoll.prototype.keys = [KeyPoll.KEY_LEFT, KeyPoll.KEY_RIGHT, KeyPoll.KEY_Z, KeyPoll.KEY_UP];

    function KeyPoll(game, config) {
      this.isUp = __bind(this.isUp, this);
      this.isDown = __bind(this.isDown, this);
      this.keyUpListener = __bind(this.keyUpListener, this);
      this.keyDownListener = __bind(this.keyDownListener, this);
      this.states = {};
      window.addEventListener('keydown', this.keyDownListener);
      window.addEventListener('keyup', this.keyUpListener);
      this.gamePad(game, config);
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
     * Build a virtual game pad
     */

    KeyPoll.prototype.gamePad = function(game, config) {
      var btn0, btn1, btn2, btn3;
      btn0 = game.add.button(0, config.height - 80, 'round');
      btn0.onInputDown.add((function(_this) {
        return function() {
          _this.states[_this.keys[0]] = true;
        };
      })(this));
      btn0.onInputUp.add((function(_this) {
        return function() {
          _this.states[_this.keys[0]] = false;
        };
      })(this));
      btn1 = game.add.button(35, config.height - 45, 'round');
      btn1.onInputDown.add((function(_this) {
        return function() {
          _this.states[_this.keys[1]] = true;
        };
      })(this));
      btn1.onInputUp.add((function(_this) {
        return function() {
          _this.states[_this.keys[1]] = false;
        };
      })(this));
      btn2 = game.add.button(config.width - 80, config.height - 45, 'square');
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
      btn3 = game.add.button(config.width - 45, config.height - 80, 'round');
      btn3.onInputDown.add((function(_this) {
        return function() {
          _this.states[_this.keys[3]] = true;
        };
      })(this));
      return btn3.onInputUp.add((function(_this) {
        return function() {
          _this.states[_this.keys[3]] = false;
        };
      })(this));
    };

    return KeyPoll;

  })();

  Sound = (function() {
    Sound.volume = 0.5;

    Sound.enabled = true;

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

  ExplodeAsteroid = (function(_super) {
    __extends(ExplodeAsteroid, _super);

    function ExplodeAsteroid() {
      return ExplodeAsteroid.__super__.constructor.apply(this, arguments);
    }

    ExplodeAsteroid.prototype.src = Sound.preload('res/sounds/asteroid.wav');

    return ExplodeAsteroid;

  })(Sound);

  ExplodeShip = (function(_super) {
    __extends(ExplodeShip, _super);

    function ExplodeShip() {
      return ExplodeShip.__super__.constructor.apply(this, arguments);
    }

    ExplodeShip.prototype.src = Sound.preload('res/sounds/ship.wav');

    return ExplodeShip;

  })(Sound);

  ShootGun = (function(_super) {
    __extends(ShootGun, _super);

    function ShootGun() {
      return ShootGun.__super__.constructor.apply(this, arguments);
    }

    ShootGun.prototype.src = Sound.preload('res/sounds/shoot.wav');

    return ShootGun;

  })(Sound);

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

    function AsteroidView(game, radius) {
      var angle, length, posX, posY;
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

    function AsteroidDeathView(game, radius) {
      this.animate = __bind(this.animate, this);
      var dot, i, _i;
      this.dots = [];
      for (i = _i = 0; _i < 8; i = ++_i) {
        dot = new Dot(game, radius);
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

    function Dot(game, maxDistance) {
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
      this.score = game.add.text(window.innerWidth - 130, 20, '');
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
        this.graphics.moveTo(10 + 10, 0 + c);
        this.graphics.lineTo(-7 + 10, 7 + c);
        this.graphics.lineTo(-4 + 10, 0 + c);
        this.graphics.lineTo(-7 + 10, -7 + c);
        this.graphics.lineTo(10 + 10, 0 + c);
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

    function SpaceshipDeathView(game) {
      this.animate = __bind(this.animate, this);
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
      this.graphics.clear();
      this.graphics.beginFill(0xFFFFFF);
      this.graphics.moveTo(10, 0);
      this.graphics.lineTo(-7, 7);
      this.graphics.lineTo(-4, 0);
      this.graphics.lineTo(-7, -7);
      this.graphics.lineTo(10, 0);
      this.graphics.endFill();
    }

    SpaceshipView.prototype.dispose = function() {
      return this.graphics.destroy();
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

    function WaitForStartView(game) {
      this.start = __bind(this.start, this);
      this.click = new Signal0();
      this.createText(game, WaitForStartView.count++);
    }

    WaitForStartView.prototype.createText = function(game, first) {
      var x, y;
      x = Math.floor(window.innerWidth / 2);
      y = window.innerHeight - 40;
      if (first === 1) {
        this.text1 = game.add.text(x, 85, 'GAME OVER', {
          font: 'bold 60px opendyslexic',
          fill: 'white',
          stroke: "black",
          strokeThickness: 30
        });
      } else {
        this.text1 = game.add.text(x, 85, 'ASTEROIDS', {
          font: 'bold 60px opendyslexic',
          fill: 'white',
          stroke: "black",
          strokeThickness: 30
        });
      }
      this.text2 = game.add.text(x, 175, 'CLICK TO START', {
        font: 'bold 12px opendyslexic',
        fill: 'white'
      });
      this.text3 = game.add.text(x, y, 'Z to Fire  ~  Arrow Keys to Move', {
        font: 'bold 10px opendyslexic',
        fill: 'white'
      });
      this.text1.anchor.x = 0.5;
      this.text2.anchor.x = 0.5;
      this.text3.anchor.x = 0.5;
      this.text1.inputEnabled = true;
      this.text2.inputEnabled = true;
      this.text1.events.onInputDown.add(this.start);
      return this.text2.events.onInputDown.add(this.start);
    };

    WaitForStartView.prototype.start = function(data) {
      this.text1.destroy();
      this.text2.destroy();
      this.text3.destroy();
      return this.click.dispatch();
    };

    return WaitForStartView;

  })();

  Animation = (function() {
    Animation.prototype.animation = null;

    function Animation(animation) {
      this.animation = animation;
    }

    return Animation;

  })();

  Asteroid = (function() {
    Asteroid.prototype.fsm = null;

    function Asteroid(fsm) {
      this.fsm = fsm;
    }

    return Asteroid;

  })();

  Audio = (function() {
    Audio.prototype.toPlay = null;

    function Audio() {
      this.toPlay = [];
    }

    Audio.prototype.play = function(sound) {
      return this.toPlay.push(sound);
    };

    return Audio;

  })();

  Bullet = (function() {
    Bullet.prototype.lifeRemaining = 0;

    function Bullet(lifeRemaining) {
      this.lifeRemaining = lifeRemaining;
    }

    return Bullet;

  })();

  Collision = (function() {
    Collision.prototype.radius = 0;

    function Collision(radius) {
      this.radius = radius;
    }

    return Collision;

  })();

  DeathThroes = (function() {
    DeathThroes.prototype.countdown = 0;

    DeathThroes.prototype.body = null;

    function DeathThroes(duration) {
      this.countdown = duration;
    }

    return DeathThroes;

  })();

  Display = (function() {
    Display.prototype.graphic = 0;

    function Display(graphic) {
      this.graphic = graphic;
    }

    return Display;

  })();

  GameState = (function() {
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

  Gun = (function() {
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

  GunControls = (function() {
    GunControls.prototype.trigger = 0;

    function GunControls(trigger) {
      this.trigger = trigger;
    }

    return GunControls;

  })();

  Hud = (function() {
    Hud.prototype.view = null;

    function Hud(view) {
      this.view = view;
    }

    return Hud;

  })();

  MotionControls = (function() {
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

  Physics = (function() {
    Physics.prototype.body = null;

    function Physics(body) {
      this.body = body;
    }

    return Physics;

  })();

  Position = (function() {
    Position.prototype.position = null;

    Position.prototype.rotation = 0;

    function Position(x, y, rotation) {
      this.rotation = rotation;
      this.position = new Point(x, y);
    }

    return Position;

  })();

  Spaceship = (function() {
    Spaceship.prototype.fsm = null;

    function Spaceship(fsm) {
      this.fsm = fsm;
    }

    return Spaceship;

  })();

  WaitForStart = (function() {
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

  AnimationNode = (function(_super) {
    __extends(AnimationNode, _super);

    function AnimationNode() {
      return AnimationNode.__super__.constructor.apply(this, arguments);
    }

    AnimationNode.components = {
      animation: Animation
    };

    AnimationNode.prototype.animation = null;

    return AnimationNode;

  })(ash.core.Node);

  AsteroidCollisionNode = (function(_super) {
    __extends(AsteroidCollisionNode, _super);

    function AsteroidCollisionNode() {
      return AsteroidCollisionNode.__super__.constructor.apply(this, arguments);
    }

    AsteroidCollisionNode.components = {
      asteroid: Asteroid,
      position: Position,
      collision: Collision,
      audio: Audio,
      physics: Physics
    };

    AsteroidCollisionNode.prototype.asteroid = null;

    AsteroidCollisionNode.prototype.position = null;

    AsteroidCollisionNode.prototype.collision = null;

    AsteroidCollisionNode.prototype.audio = null;

    AsteroidCollisionNode.prototype.physics = null;

    return AsteroidCollisionNode;

  })(ash.core.Node);

  AudioNode = (function(_super) {
    __extends(AudioNode, _super);

    function AudioNode() {
      return AudioNode.__super__.constructor.apply(this, arguments);
    }

    AudioNode.components = {
      audio: Audio
    };

    AudioNode.prototype.audio = null;

    return AudioNode;

  })(ash.core.Node);

  BulletAgeNode = (function(_super) {
    __extends(BulletAgeNode, _super);

    function BulletAgeNode() {
      return BulletAgeNode.__super__.constructor.apply(this, arguments);
    }

    BulletAgeNode.components = {
      bullet: Bullet,
      physics: Physics,
      display: Display
    };

    BulletAgeNode.prototype.bullet = null;

    BulletAgeNode.prototype.physics = null;

    BulletAgeNode.prototype.display = null;

    return BulletAgeNode;

  })(ash.core.Node);

  BulletCollisionNode = (function(_super) {
    __extends(BulletCollisionNode, _super);

    function BulletCollisionNode() {
      return BulletCollisionNode.__super__.constructor.apply(this, arguments);
    }

    BulletCollisionNode.components = {
      bullet: Bullet,
      position: Position,
      physics: Physics
    };

    BulletCollisionNode.prototype.bullet = null;

    BulletCollisionNode.prototype.physics = null;

    return BulletCollisionNode;

  })(ash.core.Node);

  DeathThroesNode = (function(_super) {
    __extends(DeathThroesNode, _super);

    function DeathThroesNode() {
      return DeathThroesNode.__super__.constructor.apply(this, arguments);
    }

    DeathThroesNode.components = {
      dead: DeathThroes,
      display: Display
    };

    DeathThroesNode.prototype.dead = null;

    DeathThroesNode.prototype.display = null;

    return DeathThroesNode;

  })(ash.core.Node);

  GameNode = (function(_super) {
    __extends(GameNode, _super);

    function GameNode() {
      return GameNode.__super__.constructor.apply(this, arguments);
    }

    GameNode.components = {
      state: GameState
    };

    GameNode.prototype.state = null;

    return GameNode;

  })(ash.core.Node);

  GunControlNode = (function(_super) {
    __extends(GunControlNode, _super);

    function GunControlNode() {
      return GunControlNode.__super__.constructor.apply(this, arguments);
    }

    GunControlNode.components = {
      audio: Audio,
      control: GunControls,
      gun: Gun,
      position: Position
    };

    GunControlNode.prototype.control = null;

    GunControlNode.prototype.gun = null;

    GunControlNode.prototype.position = null;

    GunControlNode.prototype.audio = null;

    return GunControlNode;

  })(ash.core.Node);

  HudNode = (function(_super) {
    __extends(HudNode, _super);

    function HudNode() {
      return HudNode.__super__.constructor.apply(this, arguments);
    }

    HudNode.components = {
      state: GameState,
      hud: Hud
    };

    HudNode.prototype.state = null;

    HudNode.prototype.hud = null;

    return HudNode;

  })(ash.core.Node);

  MovementNode = (function(_super) {
    __extends(MovementNode, _super);

    function MovementNode() {
      return MovementNode.__super__.constructor.apply(this, arguments);
    }

    MovementNode.components = {
      position: Position
    };

    MovementNode.prototype.position = null;

    return MovementNode;

  })(ash.core.Node);

  PhysicsControlNode = (function(_super) {
    __extends(PhysicsControlNode, _super);

    function PhysicsControlNode() {
      return PhysicsControlNode.__super__.constructor.apply(this, arguments);
    }

    PhysicsControlNode.components = {
      control: MotionControls,
      physics: Physics
    };

    PhysicsControlNode.prototype.control = null;

    PhysicsControlNode.prototype.physics = null;

    return PhysicsControlNode;

  })(ash.core.Node);

  PhysicsNode = (function(_super) {
    __extends(PhysicsNode, _super);

    function PhysicsNode() {
      return PhysicsNode.__super__.constructor.apply(this, arguments);
    }

    PhysicsNode.components = {
      position: Position,
      physics: Physics
    };

    PhysicsNode.prototype.position = null;

    PhysicsNode.prototype.physics = null;

    return PhysicsNode;

  })(ash.core.Node);

  RenderNode = (function(_super) {
    __extends(RenderNode, _super);

    function RenderNode() {
      return RenderNode.__super__.constructor.apply(this, arguments);
    }

    RenderNode.components = {
      position: Position,
      display: Display
    };

    RenderNode.prototype.position = null;

    RenderNode.prototype.display = null;

    return RenderNode;

  })(ash.core.Node);

  SpaceshipNode = (function(_super) {
    __extends(SpaceshipNode, _super);

    function SpaceshipNode() {
      return SpaceshipNode.__super__.constructor.apply(this, arguments);
    }

    SpaceshipNode.components = {
      spaceship: Spaceship,
      position: Position
    };

    SpaceshipNode.prototype.spaceship = 0;

    SpaceshipNode.prototype.position = 0;

    return SpaceshipNode;

  })(ash.core.Node);

  WaitForStartNode = (function(_super) {
    __extends(WaitForStartNode, _super);

    function WaitForStartNode() {
      return WaitForStartNode.__super__.constructor.apply(this, arguments);
    }

    WaitForStartNode.components = {
      wait: WaitForStart
    };

    WaitForStartNode.prototype.wait = null;

    return WaitForStartNode;

  })(ash.core.Node);

  PhysicsSystem = (function(_super) {
    var b2Body, b2Vec2;

    __extends(PhysicsSystem, _super);

    b2Body = Box2D.Dynamics.b2Body;

    b2Vec2 = Box2D.Common.Math.b2Vec2;

    PhysicsSystem.prototype.config = null;

    PhysicsSystem.prototype.world = null;

    PhysicsSystem.prototype.stage = null;

    PhysicsSystem.prototype.creator = null;

    PhysicsSystem.prototype.nodes = null;

    PhysicsSystem.prototype.enabled = true;

    PhysicsSystem.deadPool = [];

    function PhysicsSystem(config, world, stage) {
      this.config = config;
      this.world = world;
      this.stage = stage;
      this.updateNode = __bind(this.updateNode, this);
      this.update = __bind(this.update, this);
    }

    PhysicsSystem.prototype.addToEngine = function(engine) {
      this.nodes = engine.getNodeList(PhysicsNode);
    };

    PhysicsSystem.prototype.removeFromEngine = function(engine) {
      this.nodes = null;
    };

    PhysicsSystem.prototype.update = function(time) {
      var body, node, ud;
      if (!this.enabled) {
        return;
      }
      this.world.Step(time, 10, 10);
      this.world.ClearForces();
      node = this.nodes.head;
      while (node) {
        this.updateNode(node, time);
        node = node.next;
      }

      /*
       * Clean up the dead bodies
       */
      while ((body = PhysicsSystem.deadPool.pop())) {
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

    PhysicsSystem.prototype.updateNode = function(node, time) {
      var body, physics, position, x, x1, y, y1, _ref;
      position = node.position;
      physics = node.physics;
      body = physics.body;

      /*
       * Update the position component from Box2D model
       * Asteroids uses wraparound space coordinates
       */
      _ref = body.GetPosition(), x = _ref.x, y = _ref.y;
      x1 = x > this.config.width ? 0 : x < 0 ? this.config.width : x;
      y1 = y > this.config.height ? 0 : y < 0 ? this.config.height : y;
      if (x1 !== x || y1 !== y) {
        body.SetPosition(new b2Vec2(x1, y1));
      }
      position.position.x = x1;
      position.position.y = y1;
      position.rotation = body.GetAngularVelocity();
    };

    return PhysicsSystem;

  })(ash.core.System);

  AnimationSystem = (function(_super) {
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

  AudioSystem = (function(_super) {
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
      node.audio.toPlay = [];
    };

    return AudioSystem;

  })(ash.tools.ListIteratingSystem);

  BulletAgeSystem = (function(_super) {
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
        node.display.graphic.dispose();
        PhysicsSystem.deadPool.push(node.physics.body);
        this.creator.destroyEntity(node.entity);
      }
    };

    return BulletAgeSystem;

  })(ash.tools.ListIteratingSystem);

  CollisionSystem = (function(_super) {
    var AsteroidHitShip, BulletHitAsteroid, b2ContactListener;

    __extends(CollisionSystem, _super);

    b2ContactListener = Box2D.Dynamics.b2ContactListener;

    BulletHitAsteroid = 1;

    AsteroidHitShip = 2;

    CollisionSystem.prototype.world = null;

    CollisionSystem.prototype.creator = null;

    CollisionSystem.prototype.games = null;

    CollisionSystem.prototype.collisions = null;

    function CollisionSystem(world, creator) {
      this.world = world;
      this.creator = creator;
      this.PostSolve = __bind(this.PostSolve, this);
      this.PreSolve = __bind(this.PreSolve, this);
      this.EndContact = __bind(this.EndContact, this);
      this.BeginContact = __bind(this.BeginContact, this);
      this.update = __bind(this.update, this);
      this.collisions = [];
      this.world.SetContactListener(this);
    }

    CollisionSystem.prototype.update = function(time) {
      var a, b, body, position, radius, type, _ref;
      while (this.collisions.length) {
        _ref = this.collisions.pop(), type = _ref.type, a = _ref.a, b = _ref.b;
        if (type === BulletHitAsteroid) {
          if ((a.get(Physics) != null)) {
            this.creator.destroyEntity(a);
            a.get(Display).graphic.dispose();
            PhysicsSystem.deadPool.push(a.get(Physics).body);
          }
          if ((b.get(Physics) != null)) {
            radius = b.get(Collision).radius;
            position = b.get(Position).position;
            if (radius > 10) {
              this.creator.createAsteroid(radius - 10, position.x + rnd.nextDouble() * 10 - 5, position.y + rnd.nextDouble() * 10 - 5);
              this.creator.createAsteroid(radius - 10, position.x + rnd.nextDouble() * 10 - 5, position.y + rnd.nextDouble() * 10 - 5);
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
      this.games = engine.getNodeList(GameNode);
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
        case 'asteroid':
          switch (b.type) {
            case 'bullet':
              this.collisions.push({
                type: BulletHitAsteroid,
                a: b.entity,
                b: a.entity
              });
              break;
            case 'spaceship':
              this.collisions.push({
                type: AsteroidHitShip,
                a: a.entity,
                b: b.entity
              });
          }
          break;
        case 'bullet':
          if (b.type === 'asteroid') {
            this.collisions.push({
              type: BulletHitAsteroid,
              a: a.entity,
              b: b.entity
            });
          }
          break;
        case 'spaceship':
          if (b.type === 'asteroid') {
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

    DeathThroesSystem.prototype.creator = null;

    function DeathThroesSystem(creator) {
      this.creator = creator;
      this.updateNode = __bind(this.updateNode, this);
      DeathThroesSystem.__super__.constructor.call(this, DeathThroesNode, this.updateNode);
    }

    DeathThroesSystem.prototype.updateNode = function(node, time) {
      var dead;
      dead = node.dead;
      dead.countdown -= time;
      if (dead.countdown <= 0) {
        this.creator.destroyEntity(node.entity);
        node.display.graphic.dispose();
        PhysicsSystem.deadPool.push(dead.body);
      }
    };

    return DeathThroesSystem;

  })(ash.tools.ListIteratingSystem);

  GameManager = (function(_super) {
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
              position = new Point(rnd.nextDouble() * this.config.width, rnd.nextDouble() * this.config.height);
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

  GunControlSystem = (function(_super) {
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
        node.audio.play(ShootGun);
        gun.timeSinceLastShot = 0;
      }
    };

    return GunControlSystem;

  })(ash.tools.ListIteratingSystem);

  HudSystem = (function(_super) {
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

  PhysicsControlSystem = (function(_super) {
    var IDTK, R, b2Vec2, _ref;

    __extends(PhysicsControlSystem, _super);

    R = window.devicePixelRatio;

    IDTK = ((_ref = window.ext) != null ? _ref.IDTK_SRV_BOX2D : void 0) != null;

    b2Vec2 = Box2D.Common.Math.b2Vec2;

    PhysicsControlSystem.prototype.keyPoll = null;

    function PhysicsControlSystem(keyPoll) {
      this.keyPoll = keyPoll;
      this.updateNode = __bind(this.updateNode, this);
      PhysicsControlSystem.__super__.constructor.call(this, PhysicsControlNode, this.updateNode);
    }

    PhysicsControlSystem.prototype.updateNode = function(node, time) {
      var body, control, rotation, v;
      control = node.control;
      body = node.physics.body;
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

    return PhysicsControlSystem;

  })(ash.tools.ListIteratingSystem);

  RenderSystem = (function(_super) {
    __extends(RenderSystem, _super);

    RenderSystem.prototype.stage = null;

    RenderSystem.prototype.renderer = null;

    RenderSystem.prototype.nodes = null;

    function RenderSystem(stage) {
      this.stage = stage;
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
      this.asteroids = null;
    };

    WaitForStartSystem.prototype.update = function(time) {
      var asteroid, game, graphic, node;
      node = this.waitNodes.head;
      game = this.gameNodes.head;
      if (node && node.wait.startGame && game) {
        asteroid = this.asteroids.head;
        while (asteroid) {
          graphic = asteroid.entity.get(Display).graphic;
          this.creator.destroyEntity(asteroid.entity);
          graphic.dispose();
          asteroid = asteroid.next;
        }
        game.state.setForStart();
        node.wait.startGame = false;
        this.engine.removeEntity(node.entity);
      }
    };

    return WaitForStartSystem;

  })(ash.core.System);

  EntityCreator = (function() {
    var Entity, EntityStateMachine, b2Body, b2BodyDef, b2CircleShape, b2FixtureDef, b2PolygonShape, b2Vec2;

    Entity = ash.core.Entity;

    EntityStateMachine = ash.fsm.EntityStateMachine;


    /*
     * Box2D classes
     */

    b2Body = Box2D.Dynamics.b2Body;

    b2BodyDef = Box2D.Dynamics.b2BodyDef;

    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

    b2FixtureDef = Box2D.Dynamics.b2FixtureDef;

    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

    b2Vec2 = Box2D.Common.Math.b2Vec2;

    EntityCreator.prototype.game = null;

    EntityCreator.prototype.engine = null;

    EntityCreator.prototype.world = null;

    EntityCreator.prototype.waitEntity = null;

    EntityCreator.prototype.bulletId = 0;

    EntityCreator.prototype.asteroidId = 0;

    EntityCreator.prototype.spaceshipId = 0;

    function EntityCreator(game, engine, world, config) {
      this.game = game;
      this.engine = engine;
      this.world = world;
      this.config = config;
    }

    EntityCreator.prototype.destroyEntity = function(entity) {
      this.engine.removeEntity(entity);
    };


    /*
     * Game State
     */

    EntityCreator.prototype.createGame = function() {
      var gameEntity, hud;
      hud = new HudView(this.game);
      gameEntity = new Entity('game').add(new GameState()).add(new Hud(hud)).add(new Display(hud)).add(new Position(0, 0, 0, 0));
      this.engine.addEntity(gameEntity);
      return gameEntity;
    };


    /*
     * Start...
     */

    EntityCreator.prototype.createWaitForClick = function() {
      var waitView;
      waitView = new WaitForStartView(this.game);
      this.waitEntity = new Entity('wait').add(new WaitForStart(waitView)).add(new Display(waitView)).add(new Position(0, 0, 0, 0));
      this.waitEntity.get(WaitForStart).startGame = false;
      this.engine.addEntity(this.waitEntity);
      return this.waitEntity;
    };


    /*
     * Create an Asteroid with FSM Animation
     */

    EntityCreator.prototype.createAsteroid = function(radius, x, y) {

      /*
       * Asteroid simulation - box2d
       */
      var asteroid, body, bodyDef, deathView, fixDef, fsm, liveView, v1, v2;
      bodyDef = new b2BodyDef();
      bodyDef.type = b2Body.b2_dynamicBody;
      bodyDef.fixedRotation = true;
      bodyDef.position.x = x;
      bodyDef.position.y = y;
      v1 = (rnd.nextDouble() - 0.5) * 4 * (50 - radius) * 2;
      v2 = (rnd.nextDouble() - 0.5) * 4 * (50 - radius) * 2;
      bodyDef.linearVelocity.Set(v1, v2);
      bodyDef.angularVelocity = rnd.nextDouble() * 2 - 1;
      fixDef = new b2FixtureDef();
      fixDef.density = 1.0;
      fixDef.friction = 1.0;
      fixDef.restitution = 0.2;
      fixDef.shape = new b2CircleShape(radius);
      body = this.world.CreateBody(bodyDef);
      body.CreateFixture(fixDef);

      /*
       * Asteroid entity
       */
      asteroid = new Entity();
      fsm = new EntityStateMachine(asteroid);
      liveView = new AsteroidView(this.game, radius);
      fsm.createState('alive').add(Physics).withInstance(new Physics(body)).add(Collision).withInstance(new Collision(radius)).add(Display).withInstance(new Display(liveView));
      deathView = new AsteroidDeathView(this.game, radius);
      fsm.createState('destroyed').add(DeathThroes).withInstance(new DeathThroes(3)).add(Display).withInstance(new Display(deathView)).add(Animation).withInstance(new Animation(deathView));
      asteroid.add(new Asteroid(fsm)).add(new Position(x, y, 0)).add(new Audio());
      body.SetUserData({
        type: 'asteroid',
        entity: asteroid
      });
      fsm.changeState('alive');
      this.engine.addEntity(asteroid);
      return asteroid;
    };


    /*
     * Create Player Spaceship with FSM Animation
     */

    EntityCreator.prototype.createSpaceship = function() {
      var body, bodyDef, deathView, fixDef, fsm, liveView, spaceship, x, y;
      x = rnd.nextInt(this.config.width);
      y = rnd.nextInt(this.config.height);

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
      bodyDef.linearDamping = 0.75;
      fixDef = new b2FixtureDef();
      fixDef.density = 1.0;
      fixDef.friction = 1.0;
      fixDef.restitution = 0.2;
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
      fsm.createState('playing').add(Physics).withInstance(new Physics(body)).add(MotionControls).withInstance(new MotionControls(KeyPoll.KEY_LEFT, KeyPoll.KEY_RIGHT, KeyPoll.KEY_UP, 100, 3)).add(Gun).withInstance(new Gun(8, 0, 0.3, 2)).add(GunControls).withInstance(new GunControls(KeyPoll.KEY_Z)).add(Collision).withInstance(new Collision(9)).add(Display).withInstance(new Display(liveView));
      deathView = new SpaceshipDeathView(this.game);
      fsm.createState('destroyed').add(DeathThroes).withInstance(new DeathThroes(5)).add(Display).withInstance(new Display(deathView)).add(Animation).withInstance(new Animation(deathView));
      spaceship.add(new Spaceship(fsm)).add(new Position(x, y, 0)).add(new Audio());
      body.SetUserData({
        type: 'spaceship',
        entity: spaceship
      });
      fsm.changeState('playing');
      this.engine.addEntity(spaceship);
      return spaceship;
    };


    /*
     * Create a Bullet
     */

    EntityCreator.prototype.createUserBullet = function(gun, parentPosition) {
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
      bodyDef.position.x = x;
      bodyDef.position.y = y;
      bodyDef.linearVelocity.Set(cos * 150, sin * 150);
      bodyDef.angularVelocity = 0;
      fixDef = new b2FixtureDef();
      fixDef.density = 1.0;
      fixDef.friction = 0.0;
      fixDef.restitution = 0.2;
      fixDef.shape = new b2CircleShape(0);
      body = this.world.CreateBody(bodyDef);
      body.CreateFixture(fixDef);

      /*
       * Bullet entity
       */
      bulletView = new BulletView(this.game);
      bullet = new Entity().add(new Bullet(gun.bulletLifetime)).add(new Position(x, y, 0)).add(new Collision(0)).add(new Physics(body)).add(new Display(bulletView));
      body.SetUserData({
        type: 'bullet',
        entity: bullet
      });
      this.engine.addEntity(bullet);
      return bullet;
    };

    return EntityCreator;

  })();

  GameConfig = (function() {
    function GameConfig() {}

    GameConfig.prototype.width = 0;

    GameConfig.prototype.height = 0;

    return GameConfig;

  })();

  Asteroids = (function() {
    var Engine, FrameTickProvider, b2DebugDraw, b2Vec2, b2World, height, scale, width;

    width = window.innerWidth;

    height = window.innerHeight;

    scale = window.devicePixelRatio;

    b2Vec2 = Box2D.Common.Math.b2Vec2;

    b2World = Box2D.Dynamics.b2World;

    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

    Engine = ash.core.Engine;

    FrameTickProvider = ash.tick.FrameTickProvider;

    Asteroids.prototype.game = null;

    Asteroids.prototype.engine = null;

    Asteroids.prototype.tickProvider = null;

    Asteroids.prototype.creator = null;

    Asteroids.prototype.keyPoll = null;

    Asteroids.prototype.config = null;

    Asteroids.prototype.world = null;

    Asteroids.prototype.background = null;

    Asteroids.prototype.physics = null;

    Asteroids.prototype.playMusic = localStorage.playMusic;

    Asteroids.prototype.playSfx = localStorage.playSfx;

    Asteroids.prototype.optBgd = localStorage.background || 'blue';

    Asteroids.prototype.bgdColor = 0x6A5ACD;

    function Asteroids(stats) {
      this.stats = stats;
      this.setPlaySfx = __bind(this.setPlaySfx, this);
      this.setPlayMusic = __bind(this.setPlayMusic, this);
      this.setBackground = __bind(this.setBackground, this);
      this.pause = __bind(this.pause, this);
      this.update = __bind(this.update, this);
      this.create = __bind(this.create, this);
      this.preload = __bind(this.preload, this);
      this.init = __bind(this.init, this);
      this.game = new Phaser.Game(width * scale, height * scale, Phaser.CANVAS, '', {
        init: this.init,
        preload: this.preload,
        create: this.create,
        update: this.update
      });
    }


    /*
     * Configure Phaser
     */

    Asteroids.prototype.init = function() {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.minWidth = width * scale;
      this.game.scale.minHeight = height * scale;
      this.game.scale.maxWidth = width * scale;
      this.game.scale.maxHeight = height * scale;
      this.game.scale.pageAlignVertically = true;
      this.game.scale.pageAlignHorizontally = true;
    };


    /*
     * Load assets
     */

    Asteroids.prototype.preload = function() {
      this.game.load.image('background', 'res/starfield.png');
      this.game.load.image('leaderboard', 'res/icons/b_Leaderboard.png');
      this.game.load.image('more', 'res/icons/b_More1.png');
      this.game.load.image('parameters', 'res/icons/b_Parameters.png');
      this.game.load.image('round', 'res/round.png');
      this.game.load.image('square', 'res/square.png');
    };


    /*
     * Start the game
     */

    Asteroids.prototype.create = function() {
      this.game.stage.backgroundColor = this.bgdColor;

      /*
       * Options:
       */
      this.game.add.button(width - 50, 50, 'parameters', (function(_this) {
        return function() {
          return Cocoon.App.loadInTheWebView("options.html");
        };
      })(this));
      this.game.add.button(width - 50, 125, 'leaderboard', (function(_this) {
        return function() {
          return Cocoon.App.loadInTheWebView("leaders.html");
        };
      })(this));
      this.game.add.button(width - 50, 200, 'more', (function(_this) {
        return function() {
          return Cocoon.App.loadInTheWebView("more.html");
        };
      })(this));
      Cocoon.App.WebView.on("load", {
        success: (function(_this) {
          return function() {
            _this.pause(true);
            return Cocoon.App.showTheWebView();
          };
        })(this),
        error: (function(_this) {
          return function() {
            console.log("Cannot show the Webview for some reason :/");
            return console.log(JSON.stringify(arguments));
          };
        })(this)
      });
      this.config = new GameConfig();
      this.config.height = height;
      this.config.width = width;
      this.world = new b2World(new b2Vec2(0, 0), true);
      this.engine = new Engine();
      this.creator = new EntityCreator(this.game, this.engine, this.world, this.config);
      this.keyPoll = new KeyPoll(this.game, this.config);
      this.engine.addSystem(new WaitForStartSystem(this.creator), SystemPriorities.preUpdate);
      this.engine.addSystem(new GameManager(this.creator, this.config), SystemPriorities.preUpdate);
      this.engine.addSystem(new PhysicsControlSystem(this.keyPoll), SystemPriorities.update);
      this.engine.addSystem(new GunControlSystem(this.keyPoll, this.creator), SystemPriorities.update);
      this.engine.addSystem(new BulletAgeSystem(this.creator), SystemPriorities.update);
      this.engine.addSystem(new DeathThroesSystem(this.creator), SystemPriorities.update);
      this.engine.addSystem(this.physics = new PhysicsSystem(this.config, this.world), SystemPriorities.move);
      this.engine.addSystem(new CollisionSystem(this.world, this.creator), SystemPriorities.resolveCollisions);
      this.engine.addSystem(new AnimationSystem(), SystemPriorities.animate);
      this.engine.addSystem(new HudSystem(), SystemPriorities.animate);
      this.engine.addSystem(new RenderSystem(), SystemPriorities.render);
      this.engine.addSystem(new AudioSystem(), SystemPriorities.render);
      this.creator.createWaitForClick();
      this.creator.createGame();
    };


    /*
     * Update loop
     */

    Asteroids.prototype.update = function() {
      var stats;
      stats = this.stats;
      if (stats != null) {
        stats.begin();
      }
      this.engine.update(this.game.time.elapsed / 1000);
      if (stats != null) {
        stats.end();
      }
    };

    Asteroids.prototype.pause = function(bValue) {
      this.physics.enabled = !bValue;
    };

    Asteroids.prototype.setBackground = function(value) {
      if (value === 1) {
        this.background.alpha = 1.0;
        this.optBgd = 'star';
        localStorage.background = 'star';
      } else {
        this.background.alpha = 0.0;
        this.optBgd = 'blue';
        localStorage.background = 'blue';
      }
    };

    Asteroids.prototype.setPlayMusic = function(value) {
      this.playMusic = value;
      localStorage.playMusic = value;
    };

    Asteroids.prototype.setPlaySfx = function(value) {
      this.playSfx = value;
      Sound.volume = value / 100;
      localStorage.playSfx = value;
    };

    return Asteroids;

  })();


  /*
   * Boot the game
   */

  (function() {

    /*
     * when the doc loads
     */
    return window.addEventListener('load', function() {

      /*
       * perf, mon
       */
      var container, stats, x, y;
      if (navigator.isCocoonJS) {
        stats = null;
      } else {
        stats = new Stats();
        container = document.createElement('div');
        document.body.appendChild(container);
        container.appendChild(stats.domElement);
        stats.domElement.style.position = 'absolute';
        x = 0;
        y = 0;
        stats.setMode(0);
        stats.domElement.style.position = "absolute";
        stats.domElement.style.left = "" + x + "px";
        stats.domElement.style.top = "" + y + "px";
        document.body.appendChild(stats.domElement);
      }

      /*
       * start the game
       */
      window.rnd = new MersenneTwister();
      window.asteroids = new Asteroids(stats);
    });
  })();

}).call(this);

//# sourceMappingURL=asteroids.js.map
