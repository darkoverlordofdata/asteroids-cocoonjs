describe 'core test: ' , ->

  describe 'verify nodes', ->

    nodes = null

    beforeEach () ->
      nodes = new ash.core.NodeList()

    afterEach () ->
      nodes = null

    it "addingNodeTriggersAddedSignal", (done) ->

      node = new MockNode()
      nodes.nodeAdded.add ->
        nodes.head.should.equal(node)
        done()

      nodes.add(node)


    it "removingNodeTriggersRemovedSignal", (done) ->

      node = new MockNode()
      nodes.nodeRemoved.add ->
        (nodes.head is null).should.equal(true)
        done()

      nodes.add(node)
      nodes.remove(node)

    it "AllNodesAreCoveredDuringIteration", () ->

      array1 = []
      array2 = []
      x = 0
      for i in [0...5]
        node = new MockNode()
        nodes.add(node)
        array1.push(node)

      node = nodes.head
      while node
        array2.push node
        x++
        node = node.next

      x.should.equal(array1.length)

      for i in [0...x]
        array1[i].should.equal(array2[i])




