angular.module('starter.controllers', [])


.controller('PageCtrl', function($scope, $state, $stateParams, $cordovaInAppBrowser, Pages) {
  $scope.page = Pages.getPage($stateParams.pageTitle);
  $scope.isLoading = true;
  // ページ本文を読み込む
  Pages.getPageDetail($scope.page.title).then(function(detail) {
  	$scope.pageDetail = detail
    $scope.isLoading = false;
  });
  // InAppBrowser
  $scope.openWebPage = function(url) {
   var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'yes'
      };
    $cordovaInAppBrowser.open(url, '_blank', options)
      .then(function(event) {}).catch(function(event) {});
  }
  // ページを編集モードに切り替え
  $scope.editMode = function(event) {
    var _this = $(event.currentTarget);
    // テキストを一旦非表示
    _this.find('.conversion_text').hide();
    // フォームを表示
    _this.find('.raw-textarea').show();
    // フォームにフォーカスを当てる
    setTimeout(function(){
         _this.find('textarea').focus();
    }, 0);
  }
  // 編集モード終了（全要素に適応）
  $scope.endEditMode = function() {
    // ******ここに内容を反映させるスクリプトをかく***********
    var texts_area = $('.htmlData');
    // テキストを一旦非表示
    texts_area.find('.conversion_text').show();
    // フォームを表示
    texts_area.find('.raw-textarea').hide();
    // フォームのフォーカスを外す
    setTimeout(function(){
         texts_area.find('textarea').blur();
    }, 0);
  }


})

.controller('PagelistCtrl', function($scope, $timeout, $ionicLoading, Pages) {
  $scope.isLoading = true;
	// ページ一覧を読み込む
	Pages.getPages().then(function(pages) {
        $scope.pages = pages;
        $scope.isLoading = false;
    });
})

.controller('StarsCtrl', function($scope, Pages) {
	$scope.pages = Pages.all();
})

.controller('RandomCtrl', function($scope, $http) {})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
