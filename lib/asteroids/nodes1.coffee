game.nodes =

  AnimationNode: class AnimationNode extends ash.core.Node
    @components:
      animation : Animation
    animation : null

  AsteroidCollisionNode: class AsteroidCollisionNode extends ash.core.Node
    @components:
      asteroid  : Asteroid
      position  : Position
      collision : Collision
      audio     : Audio
      physics   : Physics
    asteroid  : null
    position  : null
    collision : null
    audio     : null
    physics   : null

  AudioNode: class AudioNode extends ash.core.Node
    @components:
      audio : Audio
    audio : null

  BulletAgeNode: class BulletAgeNode extends ash.core.Node
    @components:
      bullet : Bullet
      physics : Physics
      display: Display
    bullet : null
    physics : null
    display: null

  BulletCollisionNode: class BulletCollisionNode extends ash.core.Node
    @components:
      bullet    : Bullet
      position  : Position
      physics   : Physics

    bullet    : null
    position  : null
    physics   : null

  DeathThroesNode: class DeathThroesNode extends ash.core.Node
    @components:
      dead      : DeathThroes
      display   : Display
    dead      : null
    display   : null

  GameNode: class GameNode extends ash.core.Node
    @components:
      state : GameState
    state : null

  GunControlNode: class GunControlNode extends ash.core.Node
    @components:
      audio     : Audio
      control   : GunControls
      gun       : Gun
      position  : Position
    control   : null
    gun       : null
    position  : null
    audio     : null

  HudNode: class HudNode extends ash.core.Node
    @components:
      state : GameState
      hud   : Hud
    state : null
    hud   : null

  MovementNode: class MovementNode extends ash.core.Node
    @components:
      position : Position
    #motion : Motion
    position : null
  #motion : null

  PhysicsControlNode: class PhysicsControlNode extends ash.core.Node
    @components:
      control   : MotionControls
      physics   : Physics
      display   : Display
    control   : null
    physics   : null
    display   : null

  PhysicsNode: class PhysicsNode extends ash.core.Node
    @components:
      position : Position
      physics : Physics
    position : null
    physics : null

  RenderNode: class RenderNode extends ash.core.Node
    @components:
      position  : Position
      display   : Display
    position  : null
    display   : null

  SpaceshipNode: class SpaceshipNode extends ash.core.Node
    @components:
      spaceship : Spaceship
      position  : Position
    spaceship : null
    position  : null

  WaitForStartNode: class WaitForStartNode extends ash.core.Node
    @components:
      wait : WaitForStart
    wait : null



