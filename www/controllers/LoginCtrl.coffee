angular.module('gyazzapp.controllers.login', [])
.controller 'LoginCtrl', ($scope, $ionicModal, $location, $state, $ionicHistory, $ionicLoading, User) ->

  $scope.errorMessage = false

  # ログイン処理
  $scope.signIn = (user) ->
    # バリデーションをする
    # この実装はまずいのであとで変更
    # ログイン認証
    $ionicLoading.show()
    $.ajax
      url:"http://gyazz.masuilab.org/増井研"
      username: user.username,
      password: user.pass,
      timeout: 10000
    .done (data) ->

      goTopPage = ->

        # トップページに遷移
        $state.go 'tab.pagelist'

        # ログイン状態を保持する
        localStorage.setItem 'logined', 'logined'

      # ユーザー登録
      if ionic.Platform.isIOS()
        User.register('ios').then ->
          goTopPage()
          $ionicLoading.hide()
      else if ionic.Platform.isAndroid()
        User.register('android').then ->
          goTopPage()
          $ionicLoading.hide()

    .fail (error) ->

      console.log JSON.stringify error
      $scope.errorMessage = true
      console.log 'ログイン失敗'
      $ionicLoading.hide()
