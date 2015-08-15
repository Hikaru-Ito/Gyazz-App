angular.module('gyazzapp.controllers.todos', [])
.controller 'TodosCtrl', ($scope, $state, $stateParams, $cordovaInAppBrowser, $cordovaGoogleAnalytics, $timeout, $location, Todos) ->

  # LoadingStatus
  $scope.isLoading = true

  # Google Analyctis
  $cordovaGoogleAnalytics.trackView '[増井研ToDo]'

  # todoの読み込み
  Todos.getTodos().then (todos) ->
    $scope.todos = todos
    $scope.isLoading = false
    $scope.$apply()

  # InAppBrowser
  $scope.openWebPage = (url) ->
    options =
      location: 'yes'
      clearcache: 'yes'
      toolbar: 'yes'
    $cordovaInAppBrowser.open url, '_blank', options