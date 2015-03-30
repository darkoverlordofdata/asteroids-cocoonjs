class LeaderboardSystem extends ash.tools.ListIteratingSystem

  creator: null
  kount: 0

  constructor: (@game, @config) ->

    super(GameNode, @updateNode)

  updateNode: (node, time) =>

    leader = node.leader
    if leader.show
      if ++@kount is 1
        console.log node


    return # Void
