angular.module('gyazzapp.controllers.stars', [])
.controller 'StarsCtrl', ($scope, Stars) ->

  # Loadingステータス
  $scope.isLoading = true

  # スター覧を読み込む
  Stars.getStars().then (stars) ->
    $scope.stars = stars
    $scope.isLoading = false
    $scope.$apply()

  # PTRでリロード
  $scope.doRefresh = ->
    Stars.getStars().then (stars) ->
      $scope.stars = stars
      $scope.$broadcast 'scroll.refreshComplete'