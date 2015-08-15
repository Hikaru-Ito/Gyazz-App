angular.module('gyazzapp.controllers.issues', [])
.controller 'IssuesCtrl', ($scope, $state, $stateParams, $cordovaInAppBrowser, $cordovaGoogleAnalytics, $ionicModal, $timeout, $location, Issues) ->

  # LoadingStatus
  $scope.isLoading = true

  # ページタイトル判定（なぜかてきとー実装になってしまっている）
  $scope.label = $stateParams.title
  switch $scope.label
    when 'bug'
      $scope.title = '確認済みのバグ'
    when 'enhancement'
      $scope.title = '搭載予定の機能/リクエスト'
    when '愚痴'
      $scope.title = '愚痴'

  # Google Analyctis
  $cordovaGoogleAnalytics.trackView '[' + $scope.title + ']'

  # issuesの読み込み
  Issues.getIssues($scope.label).then (issues) ->
    $scope.issues = issues
    $scope.isLoading = false
    $scope.$apply()

  # InAppBrowser
  $scope.openWebPage = (url) ->
    options =
      location: 'yes'
      clearcache: 'yes'
      toolbar: 'yes'
    $cordovaInAppBrowser.open url, '_blank', options