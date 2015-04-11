###
 * Node templates
###
Nodes = do ->

  AnimationNode: class AnimationNode
    animation   : Components.Animation

  AsteroidCollisionNode: class AsteroidCollisionNode
    asteroid    : Components.Asteroid
    position    : Components.Position
    collision   : Components.Collision
    audio       : Components.Audio
    physics     : Components.Physics

  AudioNode: class AudioNode
    audio       : Components.Audio

  BulletAgeNode: class BulletAgeNode
    bullet      : Components.Bullet
    physics     : Components.Physics
    display     : Components.Display

  BulletCollisionNode: class BulletCollisionNode
    bullet      : Components.Bullet
    position    : Components.Position
    physics     : Components.Physics

  DeathThroesNode: class DeathThroesNode
    dead        : Components.DeathThroes
    display     : Components.Display

  GameNode: class GameNode
    state       : Components.GameState

  GunControlNode: class GunControlNode
    audio       : Components.Audio
    control     : Components.GunControls
    gun         : Components.Gun
    position    : Components.Position

  HudNode: class HudNode
    state       : Components.GameState
    hud         : Components.Hud

  MovementNode: class MovementNode
    position    : Components.Position

  PhysicsControlNode: class PhysicsControlNode
    control     : Components.MotionControls
    physics     : Components.Physics
    display     : Components.Display

  PhysicsNode: class PhysicsNode
    position    : Components.Position
    physics     : Components.Physics

  RenderNode: class RenderNode
    position    : Components.Position
    display     : Components.Display

  SpaceshipNode: class SpaceshipNode
    spaceship   : Components.Spaceship
    position    : Components.Position

  WaitForStartNode: class WaitForStartNode
    wait        : Components.WaitForStart



