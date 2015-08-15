angular.module('gyazzapp.controllers.random', [])
.controller 'RandomCtrl', ($scope, $http, $cordovaGoogleAnalytics, $controller, Pages) ->

  # コントローラを継承
  $controller 'PageCtrl', $scope: $scope

  # デフォルトタイトル
  $scope.page.title = 'Loading...'

  # ランダムページ取得
  Pages.getRandomPageDetail().then (detail) ->
    $scope.page.title = detail
    Pages.getPageDetail($scope.page.title).then (detail) ->
      $scope.pageDetail = detail
      $scope.isLoading = false
      $scope.$apply()
    $cordovaGoogleAnalytics.trackView '[Random]' + $scope.page.title

  # PTRでリロード
  $scope.doRefresh = ->
    Pages.getRandomPageDetail().then (detail) ->
      $scope.page.title = detail
      console.log $scope.page.title
      Pages.getPageDetail($scope.page.title).then (detail) ->
        $scope.pageDetail = detail
        $scope.$broadcast 'scroll.refreshComplete'
      $cordovaGoogleAnalytics.trackView '[Random]' + $scope.page.title
