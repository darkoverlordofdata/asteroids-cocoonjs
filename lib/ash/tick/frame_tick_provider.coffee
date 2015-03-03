#+--------------------------------------------------------------------+
#| frame_tick_provider.coffee
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
# FrameTickProvider
#
'use strict'
ash = require('../../../lib')

Signal1 = ash.signals.Signal1

###
 * Uses the enter frame event to provide a frame tick where the frame duration is the time since the previous frame.
 * There is a maximum frame time parameter in the constructor that can be used to limit
 * the longest period a frame can be.
###
class ash.tick.FrameTickProvider extends Signal1

  displayObject: null
  previousTime: 0
  maximumFrameTime: 0
  isPlaying: false
  request: null

  ###
   * Applies a time adjustement factor to the tick, so you can slow down or speed up the entire engine.
   * The update tick time is multiplied by this value, so a value of 1 will run the engine at the normal rate.
  ###
  timeAdjustment: 1

  constructor: (@displayObject, @maximumFrameTime) ->
    super

  Object.defineProperties FrameTickProvider::,
    playing: get: -> @isPlaying

  start: ->
    @request = requestAnimationFrame(@dispatchTick)
    @isPlaying = true
    return # Void

  stop: ->
    cancelRequestAnimationFrame(@request)
    @isPlaying = false
    return # Void

  dispatchTick: (timestamp = Date.now()) =>
    @displayObject.begin()  if @displayObject
    temp = @previousTime or timestamp
    @previousTime = timestamp
    frameTime = (timestamp - temp) * 0.001
#    @dispatch(frameTime * @timeAdjustment)
    @dispatch(frameTime)
    requestAnimationFrame(@dispatchTick)
    @displayObject.end()  if @displayObject
    return # Void

