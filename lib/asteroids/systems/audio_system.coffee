class AudioSystem extends ash.tools.ListIteratingSystem

  constructor: () ->

    super(AudioNode, @updateNode)

  updateNode: (node, time) =>

    for each, type of node.audio.toPlay
      sound = new type()
      sound.play(0, 1)

    node.audio.toPlay.length = 0
    return # Void