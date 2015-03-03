describe 'Signal test: ' , ->

  describe 'verify signals', ->

    signal = null

    beforeEach () ->
      signal = new ash.signals.Signal0()

    afterEach () ->
      signal = null

    it "newSignalHasNullHead", ->

      (signal.head is null).should.be.true

    it "newSignalHasListenersCountZero", ->

      signal.numListeners.should.equal 0

    it "addListenerThenDispatchShouldCallIt", (done) ->

      signal.add ->
        signal.numListeners.should.equal 1
        done()

      signal.dispatch()

    it "should expect 1 param", (done) ->

      value = 0xd16a

      signal1 = new ash.signals.Signal1()
      signal1.add ($1) ->
        $1.should.equal value
        done()

      signal1.dispatch(value)
      signal1 = null

#    it "addListenerThenRemoveThenDispatchShouldNotCallListener", (done) ->
#
#      listener = ->
#        signal.numListeners.should.equal 1
#        done()
#
#      signal.add(listener)
#      signal.remove(listener)
#      signal.dispatch()
