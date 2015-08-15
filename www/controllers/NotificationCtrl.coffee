angular.module('gyazzapp.controllers.notification', [])
.controller 'NotificationCtrl', ($scope, $location, Notifications) ->

  # LoadingStatus
  $scope.isLoading = true

  # ページ遷移
  $scope.goNextPage = (title) ->
    this_page = $location.path()
    tab_name = this_page.split('/')
    $location.path '/tab/' + tab_name[2] + '/pages/' + title

  # スター覧を読み込む
  Notifications.getLists().then (data) ->
    $scope.notifications = data
    $scope.isLoading = false
    $scope.$apply()

  # PTRでリロード
  $scope.doRefresh = ->
    Notifications.getLists().then (data) ->
      $scope.notifications = data
      $scope.$broadcast 'scroll.refreshComplete'

