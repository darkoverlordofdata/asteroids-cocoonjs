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

class asteroids.input
require './src/input/key_poll'

class asteroids.ui
require './src/ui/point'

class asteroids.graphics
require './src/graphics/asteroid_view'
require './src/graphics/asteroid_death_view'
require './src/graphics/bullet_view'
require './src/graphics/hud_view'
require './src/graphics/spaceship_death_view'
require './src/graphics/spaceship_view'
require './src/graphics/wait_for_start_view'

class asteroids.components
require './src/components/animation'
require './src/components/asteroid'
require './src/components/audio'
require './src/components/bullet'
require './src/components/collision'
require './src/components/death_throes'
require './src/components/display'
require './src/components/game_state'
require './src/components/gun'
require './src/components/gun_controls'
require './src/components/hud'
require './src/components/motion'
require './src/components/motion_controls'
require './src/components/position'
require './src/components/spaceship'
require './src/components/wait_for_start'

class asteroids.nodes
require './src/nodes/animation_node'
require './src/nodes/asteroid_collision_node'
require './src/nodes/audio_node'
require './src/nodes/bullet_age_node'
require './src/nodes/bullet_collision_node'
require './src/nodes/death_throes_node'
require './src/nodes/game_node'
require './src/nodes/gun_control_node'
require './src/nodes/hud_node'
require './src/nodes/motion_control_node'
require './src/nodes/movement_node'
require './src/nodes/render_node'
require './src/nodes/spaceship_collision_node'
require './src/nodes/spaceship_node'
require './src/nodes/wait_for_start_node'


class asteroids.systems
require './src/systems/animation_system'
require './src/systems/audio_system'
require './src/systems/bullet_age_system'
require './src/systems/collision_system'
require './src/systems/death_throes_system'
require './src/systems/game_manager'
require './src/systems/gun_control_system'
require './src/systems/hud_system'
require './src/systems/motion_control_system'
require './src/systems/movement_system'
require './src/systems/render_system'
require './src/systems/system_priorities'
require './src/systems/wait_for_start_system'


require './src/entity_creator'
require './src/game_config'
require './src/asteroids'
require './src/main'

