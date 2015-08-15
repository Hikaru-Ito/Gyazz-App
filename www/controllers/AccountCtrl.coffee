angular.module('gyazzapp.controllers.account', [])
.controller 'AccountCtrl', ($scope, $timeout, Pages) ->

  # テスト用のログアウトメソッド
  $scope.logout = ->
    localStorage.removeItem 'logined'
    alert 'ログアウトしました'