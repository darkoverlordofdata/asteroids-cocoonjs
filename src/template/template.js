
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
var Components, Entities, Game, Nodes, RenderSystem, SystemPriorities, res,
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
  square: 'res/images/square48.png'
};


/*
 * Components
 */

Components = (function() {
  var Display, Gravity, Hud, Player, TileMap, Transform;
  return {
    Display: Display = (function() {
      Display.prototype.sprite = null;

      function Display(sprite) {
        this.sprite = sprite;
      }

      return Display;

    })(),
    Gravity: Gravity = (function() {
      Gravity.prototype.x = 0;

      Gravity.prototype.y = 0;

      function Gravity(x, y) {
        this.x = x;
        this.y = y;
      }

      return Gravity;

    })(),
    Hud: Hud = (function() {
      Hud.prototype.coins = 0;

      Hud.prototype.meter = 0;

      Hud.prototype.lives = 3;

      Hud.prototype.labelCoin = null;

      Hud.prototype.labelMeter = null;

      function Hud(coins, meter, lives, labelCoin, labelMeter) {
        this.coins = coins;
        this.meter = meter;
        this.lives = lives;
        this.labelCoin = labelCoin;
        this.labelMeter = labelMeter;
      }

      return Hud;

    })(),
    Player: Player = (function() {
      Player.prototype.sprite = null;

      Player.prototype.body = null;

      Player.prototype.runningAction = null;

      Player.prototype.jumpUpAction = null;

      Player.prototype.jumpDownAction = null;

      function Player(sprite, body, runningAction, jumpUpAction, jumpDownAction) {
        this.sprite = sprite;
        this.body = body;
        this.runningAction = runningAction;
        this.jumpUpAction = jumpUpAction;
        this.jumpDownAction = jumpDownAction;
      }

      return Player;

    })(),
    TileMap: TileMap = (function() {
      TileMap.prototype.mapWidth = 0;

      TileMap.prototype.spriteSheet = null;

      TileMap.prototype.map00 = null;

      TileMap.prototype.map01 = null;

      function TileMap(mapWidth, spriteSheet, map00, map01) {
        this.mapWidth = mapWidth;
        this.spriteSheet = spriteSheet;
        this.map00 = map00;
        this.map01 = map01;
      }

      return TileMap;

    })(),
    Transform: Transform = (function() {
      Transform.prototype.x = 0;

      Transform.prototype.y = 0;

      Transform.prototype.alpha = 0;

      function Transform(x, y, alpha) {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
        this.alpha = alpha != null ? alpha : 1;
      }

      return Transform;

    })()
  };
})();


/*
 * Node templates
 */

Nodes = (function() {
  var HudNode, PhysicsNode, PlayerNode, RenderNode, TileMapNode;
  return {
    HudNode: HudNode = (function() {
      function HudNode() {}

      HudNode.prototype.hud = Components.Hud;

      return HudNode;

    })(),
    RenderNode: RenderNode = (function() {
      function RenderNode() {}

      RenderNode.prototype.display = Components.Display;

      RenderNode.prototype.transform = Components.Transform;

      return RenderNode;

    })(),
    PhysicsNode: PhysicsNode = (function() {
      function PhysicsNode() {}

      PhysicsNode.prototype.physics = Components.Gravity;

      return PhysicsNode;

    })(),
    PlayerNode: PlayerNode = (function() {
      function PlayerNode() {}

      PlayerNode.prototype.player = Components.Player;

      return PlayerNode;

    })(),
    TileMapNode: TileMapNode = (function() {
      function TileMapNode() {}

      TileMapNode.prototype.tilemap = Components.TileMap;

      return TileMapNode;

    })()
  };
})();

Entities = (function() {

  /*
   * Imports
   */
  var Display, Entity, Gravity, Hud, Player, TileMap, Transform;

  Display = Components.Display;

  Gravity = Components.Gravity;

  Hud = Components.Hud;

  Player = Components.Player;

  TileMap = Components.TileMap;

  Transform = Components.Transform;

  Entity = ash.core.Entity;

  Entities.prototype.ash = null;

  Entities.prototype.game = null;

  Entities.prototype.world = null;

  function Entities(game) {
    this.game = game;
    this.ash = this.game.ash;
    this.world = this.game.world;
  }

  Entities.prototype.destroyEntity = function(entity) {
    this.ash.removeEntity(entity);
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
    var image, sprite;
    if (alpha == null) {
      alpha = 1;
    }
    sprite = new cc.Sprite(path);
    this.game.addChild(sprite);
    image = new Entity();
    image.add(new Display(sprite));
    image.add(new Transform(x, y, alpha));
    this.ash.addEntity(image);
    return image;
  };


  /*
   * TileMap
   *
   * @param tmx00 even map
   * @param tmx01 odd map
   * @param plist map to packed png
   * @param png plist data
   * @return tilemap
   */

  Entities.prototype.createTileMap = function(tmx00, tmx01, plist, png) {
    var map00, map01, mapWidth, spriteSheet, tilemap;
    map00 = new cc.TMXTiledMap(tmx00);
    this.game.addChild(map00);
    mapWidth = map00.getContentSize().width;
    map01 = new cc.TMXTiledMap(tmx01);
    map01.setPosition(cc.p(mapWidth, 0));
    this.game.addChild(map01);
    cc.spriteFrameCache.addSpriteFrames(plist);
    spriteSheet = new cc.SpriteBatchNode(png);
    this.game.addChild(spriteSheet);
    tilemap = new Entity();
    tilemap.add(new TileMap(mapWidth, spriteSheet, map00, map01));
    this.ash.addEntity(tilemap);
    return tilemap;
  };


  /*
   * Physics
   *
   * @param x - gravity
   * @param y - gravity
   * @return physics
   */

  Entities.prototype.createPhysics = function(gravityX, gravityY) {
    var physics, wallBottom;
    this.world.gravity = cp.v(gravityX, gravityY);
    wallBottom = new cp.SegmentShape(this.world.staticBody, cp.v(0, groundHeight), cp.v(4294967295, groundHeight), 0);
    this.world.addStaticShape(wallBottom);
    physics = new Entity();
    physics.add(new Gravity(gravityX, gravityY));
    this.ash.addEntity(physics);
    return physics;
  };


  /*
   * Runner
   *
   * @param plist map to packed png
   * @param png image data
   * @return runner
   */

  Entities.prototype.createRunner = function(plist, png) {
    var animFrames, animation, body, contentSize, i, jumpDownAction, jumpUpAction, runner, runningAction, shape, sprite, spriteSheet;
    cc.spriteFrameCache.addSpriteFrames(plist);
    spriteSheet = new cc.SpriteBatchNode(png);
    this.game.addChild(spriteSheet);
    animFrames = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; _i < 8; i = ++_i) {
        _results.push(cc.spriteFrameCache.getSpriteFrame("runner" + i + ".png"));
      }
      return _results;
    })();
    animation = new cc.Animation(animFrames, 0.1);
    runningAction = new cc.RepeatForever(new cc.Animate(animation));
    runningAction.retain();
    animFrames = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; _i < 4; i = ++_i) {
        _results.push(cc.spriteFrameCache.getSpriteFrame("runnerJumpUp" + i + ".png"));
      }
      return _results;
    })();
    animation = new cc.Animation(animFrames, 0.2);
    jumpUpAction = new cc.RepeatForever(new cc.Animate(animation));
    jumpUpAction.retain();
    animFrames = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; _i < 2; i = ++_i) {
        _results.push(cc.spriteFrameCache.getSpriteFrame("runnerJumpDown" + i + ".png"));
      }
      return _results;
    })();
    animation = new cc.Animation(animFrames, 0.3);
    jumpDownAction = new cc.RepeatForever(new cc.Animate(animation));
    jumpDownAction.retain();
    sprite = new cc.PhysicsSprite("#runner0.png");
    contentSize = sprite.getContentSize();
    body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
    body.p = cc.p(runnerStartX, groundHeight + contentSize.height / 2);
    body.applyImpulse(cp.v(150, 0), cp.v(0, 0));
    this.world.addBody(body);
    shape = new cp.BoxShape(body, contentSize.width - 14, contentSize.height);
    this.world.addShape(shape);
    sprite.setBody(body);
    sprite.runAction(runningAction);
    spriteSheet.addChild(sprite);
    runner = new Entity();
    runner.add(new Player(sprite, body, runningAction, jumpUpAction, jumpDownAction));
    this.ash.addEntity(runner);
    return runner;
  };


  /*
   * Hud
   *
   * @param score
   * @param lives
   * @return hud
   */

  Entities.prototype.createHud = function(coins, meter, lives) {
    var hud, labelCoin, labelMeter, winsize;
    winsize = cc.director.getWinSize();
    labelCoin = new cc.LabelTTF("Coins:0", "Helvetica", 20);
    labelCoin.setColor(cc.color(0, 0, 0));
    labelCoin.setPosition(cc.p(70, winsize.height - 20));
    this.game.addChild(labelCoin);
    labelMeter = new cc.LabelTTF("0M", "Helvetica", 20);
    labelMeter.setPosition(cc.p(winsize.width - 70, winsize.height - 20));
    this.game.addChild(labelMeter);
    hud = new Entity();
    hud.add(new Hud(coins, meter, lives, labelCoin, labelMeter));
    this.ash.addEntity(hud);
    return hud;
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
  __extends(RenderSystem, _super);

  function RenderSystem(level) {
    this.level = level;
    this.updateNode = __bind(this.updateNode, this);
    RenderSystem.__super__.constructor.call(this, this.level.reg.nodes.RenderNode, this.updateNode);
  }

  RenderSystem.prototype.updateNode = function(node, time) {
    var size, x, y;
    size = cc.director.getWinSize();
    x = node.transform.x + (size.width / 2);
    y = node.transform.y + (size.height / 2);
    node.display.sprite.setPosition(cc.p(x, y));
  };

  return RenderSystem;

})(ash.tools.ListIteratingSystem);

Game = cc.Layer.extend({
  ash: null,
  reg: null,
  entities: null,
  world: null,
  player: null,
  hud: null,
  ctor: function() {
    this._super();
    this.ash = new ash.core.Engine();
    this.reg = new ash.ext.Helper(Components, Nodes);
    this.world = new cp.Space();
    this.entities = new Entities(this);
    this.entities.createImage(0, 0, res.background);
    this.ash.addSystem(new RenderSystem(this), SystemPriorities.render);
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

//# sourceMappingURL=template.js.map
