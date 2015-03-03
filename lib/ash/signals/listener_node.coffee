#+--------------------------------------------------------------------+
#| listener_node.coffee
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
# Listener Node
#
'use strict'
ash = require('../../../lib')

###
 * A node in the list of listeners in a signal.
###
class ash.signals.ListenerNode

  previous: null
  next: null
  listener: null
  once: false
