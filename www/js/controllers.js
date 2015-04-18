angular.module('starter.controllers', [])


.controller('PageCtrl', function($scope, $state, $stateParams, $cordovaInAppBrowser, $ionicModal, Pages) {
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
  // Gyazz記法変換
  $scope.transParagraph = function(rawData) {
    return Pages.transParagraph(rawData);
  }
  // 編集Modal表示
  $scope.rawData = 'TestData[[Hikaru]]'
   $ionicModal.fromTemplateUrl('templates/modal-editpage.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
  // ページを編集モードに切り替え
  $scope.editMode = function(event) {
    // 現在編集モードの他の項目があれば終了させる
    $scope.endEditMode();

    var _this = $(event.currentTarget);
    // 編集中のボックスにクラスをつけておく
    _this.addClass('isEditing');
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
    var isEditing = $('.isEditing');
    var edit_data = isEditing.find('textarea').val();
        isEditing.removeClass('.isEditing');
    if(edit_data !== undefined) {
      // 変更があるか比較する
      if(edit_data !== $scope.beforeEditText) { // 最初のロングタップ時にも動作するため判別
        $scope.isWriting = true;
        // ページの内容を全取得して連結させる
        var page_all_data = '';
        $('.raw-textarea .original_data').each(function(i) {
              var pageDetailNumber = i;
              var text_data = $(this).val();
              // テキストエリアの中に改行がある場合、切り取って、HTML付加してpageDetail配列に追加
              if (text_data.match(/\r\n/) || text_data.match(/(\n|\r)/)) {
                  arr = text_data.split(/\r\n|\r|\n/);
                  for (i = 0; i < arr.length; i++) {
                    var insertNumber = pageDetailNumber + i;
                    var content_num = $scope.pageDetail.length;
                    var insertHtmlData = '<span class="conversion_text" ng-bind-html="transParagraph(gyazz'+content_num+')"></span><label class="item item-input raw-textarea" style="display:none;"><textarea class="original_data" ng-blur="endEditMode()" ng-model="gyazz'+content_num+'" ng-init="gyazz'+content_num+'=\''+arr[i]+'\'"></textarea></label>';
                    $scope.pageDetail.splice(insertNumber+1, 0, insertHtmlData);
                  }
                  // 編集前のパラグラフを削除
                  $scope.pageDetail.splice(pageDetailNumber, 1);
              }
              page_all_data += text_data;
              page_all_data += '\n';
        });
          console.log(page_all_data);

        Pages.writePage($scope.page.title, page_all_data).then(function(data) {
          console.log(data);
          $scope.isWriting = false;
        });
      } else {
        console.log('へんこうなし');
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
