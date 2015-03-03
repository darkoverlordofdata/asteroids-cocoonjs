#
#	test_helper - Set up the test environment
#
#
#
do(ash  = require("../lib")) ->

  class MockComponent
    x: 0
    y: 0
    constructor:(@x, @y) ->


  class MockNode extends ash.core.Node

    @components:
      pos : MockComponent

    pos : null



  Object.defineProperties @,

    # Use chai 'should' semantics
    should: value: require('chai').should()

    # The ash framework
    ash: value: ash

    MockComponent: value: MockComponent

    MockNode: value: MockNode