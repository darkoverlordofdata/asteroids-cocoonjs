class Point

  x: 0
  y: 0

  constructor: (@x = 0, @y = 0) ->

  @distance: (point1, point2) ->
    dx = point1.x - point2.x
    dy = point1.y - point2.y
    return Math.sqrt( dx * dx + dy * dy )

  distanceSquaredTo: (targetPoint) ->
    dx = this.x - targetPoint.x
    dy = this.y - targetPoint.y
    return dx * dx + dy * dy

  distanceTo: (targetPoint) ->
    dx = this.x - targetPoint.x
    dy = this.y - targetPoint.y
    return Math.sqrt( dx * dx + dy * dy )