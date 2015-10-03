angular.module('gyazzapp.controllers.login', [])
.controller 'LoginCtrl', ($scope, $ionicModal, $location, $state, $ionicHistory) ->

  $scope.errorMessage = false

  # ログイン処理
  $scope.signIn = (user) ->
    # バリデーションをする
    # この実装はまずいのであとで変更
    if user.username is 'pitecan' and user.pass is 'masu1lab'
      $ionicHistory.clearHistory()
      $state.go 'tab.pagelist'
      localStorage.setItem 'logined', 'logined'
      console.log 'ログイン成功'
    else
      $scope.errorMessage = true
      console.log 'ログイン失敗'
