angular.module('gyazzapp.controllers.account', [])
.controller 'AccountCtrl', ($scope, $timeout, $ionicLoading, Pages, PushNotifications) ->

  # 設定データを反映
  unless localStorage.getItem 'setting'
    setting = {
      all_push: true
    }
    localStorage.setItem 'setting', JSON.stringify setting
    $scope.setting = setting
  else
    $scope.setting = JSON.parse localStorage.getItem 'setting'

  # updateSetting
  updateSetting = ->
    localStorage.setItem 'setting', JSON.stringify $scope.setting


  # プッシュ通知設定変更
  $scope.changeAllPushStatus = ->
    $ionicLoading.show()
    $timeout ->
      if $scope.setting.all_push
        # プッシュを有効に設定
        PushNotifications.changeAllPushStatus true
        .then ->
          $ionicLoading.hide()
        console.log 'プッシュを有効に設定しました'
      else
        # プッシュを無効に設定
        PushNotifications.changeAllPushStatus false
        .then ->
          $ionicLoading.hide()
        console.log 'プッシュを無効に設定しました'

      updateSetting()
    , 10

  # テスト用のログアウトメソッド
  $scope.logout = ->
    localStorage.clear()
    alert 'localStorageを全消去しました'
