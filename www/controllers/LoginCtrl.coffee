angular.module('gyazzapp.controllers.login', [])
.controller 'LoginCtrl', ($scope, $ionicModal, $location) ->

  $scope.errorMessage = false

  # モーダル定義
  $ionicModal.fromTemplateUrl('templates/modal-editpage.html',
    scope: $scope
    animation: 'slide-in-up').then (modal) ->
    $scope.modal = modal
    $scope.modal.show()

  # ログイン処理
  $scope.signIn = (user) ->
    # バリデーションをする
    # この実装はまずいのであとで変更
    if user.username is 'pitecan' and user.pass is 'masu1lab'
      $location.path '/tab/pagelist'
      localStorage.setItem 'logined', 'logined'
      $scope.modal.hide()
    else
      $scope.errorMessage = true