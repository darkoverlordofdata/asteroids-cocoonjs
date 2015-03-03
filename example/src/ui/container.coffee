'use strict'
asteroids = require('../../index')

class asteroids.ui.Container

  graphic: null
  children: null

  constructor: (@graphic) ->
    @children = []

  addChild: (child) ->
    @children.push(child)


  draw: () ->
    for child in children
      child.draw()
