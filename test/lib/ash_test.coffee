describe 'Smoke test: ' , ->

  describe 'verify the api', ->

    it "class module", ->

      #Liquid.should.be.a 'function'
      ash.should.have.property 'core'
      ash.should.have.property 'fsm'
      ash.should.have.property 'signals'
      ash.should.have.property 'tools'

