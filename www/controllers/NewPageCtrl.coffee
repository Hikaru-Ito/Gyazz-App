angular.module('gyazzapp.controllers.newpage', [])
.controller 'NewpageCtrl', ($scope, $ionicPopup, $location, $timeout) ->

  # 新しいページを生成
  $scope.goNewPage = (title) ->
    this_page = $location.path()
    # 現在のタブのstateを取得
    tab_name = this_page.split('/')
    $location.path '/tab/' + tab_name[2] + '/pages/' + title

  # 新規ページ作成モーダル表示
  $scope.showPopup = ->
    $scope.data = {}
    myPopup = $ionicPopup.show(
      template: '<input type="text" ng-model="data.title">'
      title: '新規作成するページ名を入力'
      subTitle: 'スラッシュは使用禁止'
      scope: $scope
      buttons: [
        { text: 'キャンセル' }
        {
          text: '<b>作成</b>'
          type: 'button-assertive'
          onTap: (e) ->
            unless $scope.data.title
              e.preventDefault()
            else
              return $scope.data.title
        }
      ])
    myPopup.then (res) ->
      if res != undefined
        $scope.goNewPage res
