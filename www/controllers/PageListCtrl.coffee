angular.module('gyazzapp.controllers.pagelist', [])

.controller 'PagelistCtrl', ($scope, $timeout, $ionicPopup, $cordovaToast, $ionicLoading, Pages) ->

  # 変数定義
  $scope.isLoading = true
  $scope.pages = []
  $scope.noMoreItemsAvailable = true

  # RSSからページリストを読み込む
  $scope.getPagesFromRss = ->
    $cordovaToast.show 'RSSから読み込みます', 'short', 'center'
    Pages.getPagesFromRss().then (pages) ->
      $scope.pages = pages
      $scope.isLoading = false
      $scope.noMoreItemsAvailable = true
      $scope.$apply()
      $scope.$broadcast 'scroll.refreshComplete'

  # ページリストを読み込む
  Pages.getPages().then ((pages) ->
    $scope.pages = pages
    $scope.isLoading = false
    $scope.noMoreItemsAvailable = false
    $scope.$apply()
  ), (data) ->
    # 主にタイムアウトしたときに呼ばれる
    $scope.getPagesFromRss()

  # 無限スクロールのときの追加読み込み
  $scope.loadMore = ->
    $scope.pages = $scope.pages.concat(Pages.getMorePages($scope.pages.length))
    $scope.$broadcast 'scroll.infiniteScrollComplete'

  # PullToRefreshでリロード
  $scope.doRefresh = ->
    Pages.getPages().then ((pages) ->
      $scope.pages = pages
      $scope.isLoading = false
      $scope.noMoreItemsAvailable = false
      $scope.$apply()
      $scope.$broadcast 'scroll.refreshComplete'
    ), (data) ->
      $scope.getPagesFromRss()