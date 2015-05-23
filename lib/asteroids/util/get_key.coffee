
getKey = (fbAppId, fbUserId) ->

  fbAppId = ''+fbAppId
  fbUserId = ''+fbUserId

  result = []
  for i in [0...Math.max(fbAppId.length, fbUserId.length)]
    result.push(fbAppId[i])
    result.push(fbUserId[i])

  return result.join('')