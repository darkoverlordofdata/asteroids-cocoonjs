#+--------------------------------------------------------------------+
#| index.coffee
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2015
#+--------------------------------------------------------------------+
#|
#| This file is a part of ash.coffee
#|
#| ash.coffee is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
#
# Example
#
'use strict'
module.exports =
class asteroids

class asteroids.ui
require './asteroids/ui/point'
require './asteroids/ui/key_poll'

class asteroids.sprites
require './asteroids/sprites/asteroid_view'
require './asteroids/sprites/asteroid_death_view'
require './asteroids/sprites/bullet_view'
require './asteroids/sprites/hud_view'
require './asteroids/sprites/spaceship_death_view'
require './asteroids/sprites/spaceship_view'
require './asteroids/sprites/wait_for_start_view'

class asteroids.components
require './asteroids/components/animation'
require './asteroids/components/asteroid'
require './asteroids/components/audio'
require './asteroids/components/bullet'
require './asteroids/components/collision'
require './asteroids/components/death_throes'
require './asteroids/components/display'
require './asteroids/components/game_state'
require './asteroids/components/gun'
require './asteroids/components/gun_controls'
require './asteroids/components/hud'
require './asteroids/components/motion_controls'
require './asteroids/components/physics'
require './asteroids/components/position'
require './asteroids/components/spaceship'
require './asteroids/components/wait_for_start'

class asteroids.nodes
require './asteroids/nodes/animation_node'
require './asteroids/nodes/asteroid_collision_node'
require './asteroids/nodes/audio_node'
require './asteroids/nodes/bullet_age_node'
require './asteroids/nodes/bullet_collision_node'
require './asteroids/nodes/death_throes_node'
require './asteroids/nodes/game_node'
require './asteroids/nodes/gun_control_node'
require './asteroids/nodes/hud_node'
require './asteroids/nodes/movement_node'
require './asteroids/nodes/physics_control_node'
require './asteroids/nodes/physics_node'
require './asteroids/nodes/render_node'
require './asteroids/nodes/spaceship_collision_node'
require './asteroids/nodes/spaceship_node'
require './asteroids/nodes/wait_for_start_node'


class asteroids.systems
require './asteroids/systems/animation_system'
require './asteroids/systems/audio_system'
require './asteroids/systems/bullet_age_system'
require './asteroids/systems/collision_system'
require './asteroids/systems/death_throes_system'
require './asteroids/systems/game_manager'
require './asteroids/systems/gun_control_system'
require './asteroids/systems/hud_system'
require './asteroids/systems/movement_system'
require './asteroids/systems/physics_control_system'
require './asteroids/systems/physics_system'
require './asteroids/systems/render_system'
require './asteroids/systems/system_priorities'
require './asteroids/systems/wait_for_start_system'


require './asteroids/entity_creator'
require './asteroids/game_config'
require './asteroids/asteroids'
require './asteroids/main'

