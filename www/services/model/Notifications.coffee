angular.module('gyazzapp.model.notifications', [])
.factory 'Notifications', ($http, GYAZZ_APP_BACKEND_URL) ->

  return {

    # Gyazzページの更新履歴一覧を取得
    getLists: ->
      $.ajax
        url: GYAZZ_APP_BACKEND_URL + '/notifications'
      .then (data) ->
        return data
      .fail (error) ->
        console.log JSON.stringify error
 }
