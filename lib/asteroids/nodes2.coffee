###
 * Nodes
###
ash.node class AnimationNode,
  animation : Animation

ash.node class AsteroidCollisionNode,
  asteroid  : Asteroid
  position  : Position
  collision : Collision
  audio     : Audio
  physics   : Physics

ash.node class AudioNode,
  audio     : Audio

ash.node class BulletAgeNode,
  bullet    : Bullet
  physics   : Physics
  display   : Display

ash.node class BulletCollisionNode,
  bullet    : Bullet
  position  : Position
  physics   : Physics

ash.node class DeathThroesNode,
  dead      : DeathThroes
  display   : Display

ash.node class GameNode,
  state     : GameState

ash.node class GunControlNode,
  audio     : Audio
  control   : GunControls
  gun       : Gun
  position  : Position

ash.node class HudNode,
  state     : GameState
  hud       : Hud

ash.node class MovementNode,
  position  : Position

ash.node class PhysicsControlNode,
  control   : MotionControls
  physics   : Physics
  display   : Display

ash.node class PhysicsNode,
  position  : Position
  physics   : Physics

ash.node class RenderNode,
  position  : Position
  display   : Display

ash.node class SpaceshipNode,
  spaceship : Spaceship
  position  : Position

ash.node class WaitForStartNode,
  wait      : WaitForStart



