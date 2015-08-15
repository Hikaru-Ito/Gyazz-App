angular.module('gyazzapp.controllers.search', [])
.controller 'SearchCtrl', ($scope, $location, $cordovaGoogleAnalytics, $timeout, Pages) ->

  $scope.isLoading = false
  $scope.noMoreItemsAvailable = true
  $scope.results = []
  $scope.noData = false

  # ページ検索メソッド
  $scope.searchPage = (query) ->
    $scope.results = []
    $scope.isLoading = true
    $scope.noData = false
    Pages.searchPage(query).then (results) ->
      if results.length is 0
        $scope.noData = true
      $scope.results = results
      $scope.isLoading = false
      $scope.noMoreItemsAvailable = false
      $scope.$apply()
    $cordovaGoogleAnalytics.trackView '[Search]' + query

  # 検索ページを表示
  $scope.showPage = ->
    this_page = $location.path()
    tab_name = this_page.split('/')
    $location.path '/tab/' + tab_name[2] + '/search'
    $timeout ->
      $('.search_text_input').focus()
    , 800

  # 単体ページ遷移
  $scope.goNextPage = (title) ->
    this_page = $location.path()
    tab_name = this_page.split('/')
    $location.path '/tab/' + tab_name[2] + '/pages/' + title

  # 無限スクロール追加読み込み
  $scope.loadMore = ->
    $scope.results = $scope.results.concat(Pages.getMoreSearch($scope.results.length))
    $scope.$broadcast 'scroll.infiniteScrollComplete'

