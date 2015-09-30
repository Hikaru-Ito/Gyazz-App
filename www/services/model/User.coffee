angular.module('gyazzapp.model.user', [])
.factory 'User', ($http, $rootScope, $cordovaToast, GYAZZ_APP_BACKEND_URL) ->

  # ユーザー登録
  return register: (platform) ->

    # ユーザー名生成
    name = 'UserID' + Math.floor(Math.random() * (999999 - 100000))

    # Backendへ送信
    $.ajax(
      url: GYAZZ_APP_BACKEND_URL + '/users'
      type: 'POST'
      data:
        name: name
        platform: platform).then (data) ->
      $cordovaToast.show 'ユーザー登録完了', 'short', 'center'

      # localStorageに格納しておく
      localStorage.setItem 'user_id', data._id
      localStorage.setItem 'session_key', data.session_key

      # プッシュ通知初期設定をする
      $rootScope.PushNotificationInit()

      data
