class Physics

  body: null

  # previous Values for temporal anti-aliasing
  # @see http://blog.allanbishop.com/box-2d-2-1a-tutorial-part-10-fixed-time-step/
  previousX: 0
  previousY: 0
  previousAngle: 0

  constructor: (@body) ->
