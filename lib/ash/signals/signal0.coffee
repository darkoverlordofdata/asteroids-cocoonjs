#+--------------------------------------------------------------------+
#| signal0.coffee
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
# Signal 0
#
'use strict'
ash = require('../../../lib')


class ash.signals.Signal0 extends ash.signals.SignalBase

  dispatch: () ->
    @startDispatch()
    node = @head
    while (node isnt null)
      node.listener()
      if (node.once)
        @remove(node.listener)
      node = node.next
    @endDispatch()