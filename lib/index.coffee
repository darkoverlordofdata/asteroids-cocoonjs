###

   _       _
  /_\  ___| |__
 //_\\/ __| '_ \
/  _  \__ \ | | |
\_/ \_/___/_| |_|

              __  __
    ___ ___  / _|/ _| ___  ___
   / __/ _ \| |_| |_ / _ \/ _ \
  | (_| (_) |  _|  _|  __/  __/
 (_)___\___/|_| |_|  \___|\___|


Copyright (c) 2015 Bruce Davidson &lt;darkoverlordofdata@gmail.com&gt;

Author: Richard Lord
Copyright (c) Richard Lord 2011-2012
http://www.richardlord.net


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

###
'use strict'
module.exports = class ash

class ash.signals

require './ash/signals/listener_node'
require './ash/signals/listener_node_pool'
require './ash/signals/signal_base'
require './ash/signals/signal0'
require './ash/signals/signal1'
require './ash/signals/signal2'
require './ash/signals/signal3'

class ash.core

require './ash/core/entity'
require './ash/core/entity_list'
require './ash/core/node'
require './ash/core/node_list'
require './ash/core/node_pool'
require './ash/core/system'
require './ash/core/system_list'
require './ash/core/family'
require './ash/core/component_matching_family'
require './ash/core/engine'

class ash.fsm
require './ash/fsm/component_instance_provider'
require './ash/fsm/component_singleton_provider'
require './ash/fsm/component_type_provider'
require './ash/fsm/dynamic_component_provider'
require './ash/fsm/dynamic_system_provider'
require './ash/fsm/engine_state'
require './ash/fsm/state_component_mapping'
require './ash/fsm/engine_state_machine'
require './ash/fsm/entity_state'
require './ash/fsm/entity_state_machine'
require './ash/fsm/state_system_mapping'
require './ash/fsm/system_instance_provider'
require './ash/fsm/system_singleton_provider'

class ash.tick
require './ash/tick/frame_tick_provider'

class ash.tools
require './ash/tools/component_pool'
require './ash/tools/list_iterating_system'
