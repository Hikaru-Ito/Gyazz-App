###
  UNIXスタンプを渡してあげることでhoge分前などという形式に変換してくれる
  AngularFilter
###
angular.module('gyazzapp.filters.toago', [])
.filter 'toAgo', ->
  (input) ->
    d = input
    nD = Math.floor((new Date).getTime() / 1000)
    diffTime = nD - d
    if diffTime > 31536000
      # 年前に変換
      diffTime = Math.floor(diffTime / 31536000)
      diffTime = diffTime + '年前'
    else if diffTime > 86400
      # 日前に変換
      diffTime = Math.floor(diffTime / 86400)
      diffTime = diffTime + '日前'
    else if diffTime > 3600
      # 時間前に変換
      diffTime = Math.floor(diffTime / 3600)
      diffTime = diffTime + '時間前'
    else if diffTime > 60
      # 分前に変換
      diffTime = Math.floor(diffTime / 60)
      diffTime = diffTime + '分前'
    else
      # 秒前に変換
      diffTime = diffTime + '秒前'
    diffTime