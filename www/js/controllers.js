angular.module('starter.controllers', [])


.controller('PageCtrl', function($scope, $state, $stateParams, $cordovaInAppBrowser, Pages) {
  $scope.page = Pages.getPage($stateParams.pageTitle);
  $scope.isLoading = true;
  $scope.isWriting = false;
  $scope.beforeEditText = null;
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
    // 現在編集モードの他の項目があれば終了させる
    $scope.endEditMode();

    var _this = $(event.currentTarget);
    // テキストを一旦非表示
    _this.find('.conversion_text').hide();
    // フォームを表示
    _this.find('.raw-textarea').show();
    // 変更前内容を記憶
    $scope.beforeEditText = _this.find('textarea').val();
    // フォームにフォーカスを当てる
    setTimeout(function(){
         _this.find('textarea').focus();
    }, 100);
  }
  // 編集モード終了（全要素に適応）
  $scope.endEditMode = function() {
    // 変更内容を書き込む
    var edit_data = $(':focus').val();
    if(edit_data !== undefined) {
      // 変更があるか比較する
      if(edit_data !== $scope.beforeEditText) {
        $scope.isWriting = true;
        // ページの内容を全取得して連結させる
        var page_all_data = '';
        $('.raw-textarea .original_data').each(function() {
              page_all_data += $(this).val();
              page_all_data += '\n';
        });
          console.log(page_all_data);

        Pages.writePage($scope.page.title, page_all_data).then(function(data) {
          console.log(data);
          $scope.isWriting = false;
        });
      } else {
        $scope.isWriting = false;
      }
    }
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
