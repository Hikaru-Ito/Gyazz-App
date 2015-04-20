angular.module('starter.controllers', [])


.controller('PageCtrl', function($scope, $state, $stateParams, $cordovaInAppBrowser, $ionicModal, $timeout, $location, Pages, Stars) {
  $scope.page = Pages.getPage($stateParams.pageTitle);
  $scope.isLoading = true;
  $scope.isWriting = false;
  $scope.beforeEditText = null;
  $scope.isEditing = false;
  $scope.starAni = false;

  // ページ本文を読み込む
  Pages.getPageDetail($scope.page.title).then(function(detail) {
  	$scope.pageDetail = detail
    $scope.isLoading = false;
    $scope.$apply();
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
  // ページ遷移
  $scope.goNextPage = function(title) {
    var this_page = $location.path();
    // 現在のタブのstateを取得
    var tab_name = this_page.split('/');
    $location.path('/tab/'+tab_name[2]+'/pages/'+title);
  }
  // スターの確認
  $scope.checkStar = function() {
    return Stars.checkStar($scope.page.title)
  }
  // スターに追加
  $scope.addStar = function() {
    Stars.addStar($scope.page.title).then(function(detail) {
    });
      $scope.starAni = true;
    $timeout(function() {
      $scope.starAni = false;
    }, 1600);
  }
  $scope.removeStar = function() {
    Stars.removeStar($scope.page.title).then(function(detail) {
    });
  }
  $scope.changeStar = function() {
    $scope.checkStar()==true ? $scope.addStar() : $scope.removeStar()
  }
  // Gyazz記法変換
  $scope.transParagraph = function(rawData) {
    return Pages.transParagraph(rawData);
  }
  // PullToRefresh
  $scope.doRefresh = function() {
    Pages.getPageDetail($scope.page.title).then(function(detail) {
      $scope.pageDetail = detail
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  // 初めてのParagraph挿入
  $scope.insertFirstParagraph = function() {
    var insertHtmlData = '<span class="conversion_text htmlData" content="transParagraph(gyazzNew)"></span><label class="item item-input raw-textarea" style="display:none;"><textarea class="original_data new_gyazz_data" ng-blur="endEditMode()" ng-model="gyazzNew" ng-change="onInputText($eve)" ng-init="gyazzNew=\'\'"></textarea></label>';
    $scope.pageDetail.push(insertHtmlData);
    $timeout(function() {
      var _this = $('ion-view[nav-view="active"] .new_gyazz_data').closest('.paragraphWrapper');
      $scope.isEditing = true;
      // 現在編集中の要素のロングタップの場合はキャンセルする
      if(!_this.hasClass('isEditing')) {
        // 現在編集モードの他の項目があれば終了させる
        $scope.endEditMode();
        // 編集中のボックスにクラスをつけておく
        _this.addClass('isEditing');
        // テキストを一旦非表示
        _this.find('.conversion_text').hide();
        // フォームを表示
        _this.find('.raw-textarea').show();
        // 変更前内容を記憶
        $scope.beforeEditText = _this.find('textarea').val();
        // フォームにフォーカスを当てる
        $timeout(function(){
             _this.find('textarea').focus();
        }, 0);
      }

    }, 10);

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
  // スワイプでカーソル移動
  $scope.swipeRight = function() {
    if($scope.isEditing) {
      $scope.insertGyazzMark('[');
      // var target_area = $(':focus');
      //     target_area = target_area.get(0);
      // var o = target_area;
      // var p = o.selectionStart;
      // var np = p + 1;
      // o.setSelectionRange(np, np);
      // o.focus();
    }
  }
  $scope.swipeLeft = function() {
    if($scope.isEditing) {
      $scope.insertGyazzMark(']');
      // var target_area = $(':focus');
      //     target_area = target_area.get(0);
      // var o = target_area;
      // var p = o.selectionStart;
      // var np = p - 1;
      // o.setSelectionRange(np, np);
      // o.focus();
    }
  }
  // 記号挿入
  $scope.insertGyazzMark = function(mark) {
    // console.log(mark);
    // // フォーカスされているテキストエリアを指定
    var target_area = $(':focus');
        target_area = target_area.get(0);
    // //target_area.focus();
    var o = target_area;
    var s = o.value;
    var p = o.selectionStart;
    var np = p + mark.length;
    o.value = s.substr(0, p) + mark + s.substr(p);
    o.setSelectionRange(np, np);
    o.focus();
  }
  // テキストエリア自動可変
  $scope.onInputText = function(evt) {
    var _this = event;
    if(_this.currentTarget.scrollHeight > _this.currentTarget.offsetHeight){
        $(_this.currentTarget).height(_this.currentTarget.scrollHeight);
    }else{
      var lineHeight = Number($(_this.currentTarget).css("lineHeight").split("px")[0]);
      while (true){
        $(_this.currentTarget).height($(_this.currentTarget).height() - lineHeight);
        if(_this.currentTarget.scrollHeight > _this.currentTarget.offsetHeight){
            $(_this.currentTarget).height(_this.currentTarget.scrollHeight);
            break;
        }
      }
    }
  }
  // ページを編集モードに切り替え
  $scope.editMode = function(event) {
    $scope.isEditing = true;
    var _this = $(event.currentTarget);
    // 現在編集中の要素のロングタップの場合はキャンセルする
    if(!_this.hasClass('isEditing')) {
      // 現在編集モードの他の項目があれば終了させる
      $scope.endEditMode();
      // 編集中のボックスにクラスをつけておく
      _this.addClass('isEditing');
      // テキストを一旦非表示
      _this.find('.conversion_text').hide();
      // フォームを表示
      _this.find('.raw-textarea').show();
      // 変更前内容を記憶
      $scope.beforeEditText = _this.find('textarea').val();
      // フォームにフォーカスを当てる
      $timeout(function(){
           _this.find('textarea').focus();
      }, 0);
    }
  }
  // 編集モード終了（全要素に適応）
  $scope.endEditMode = function() {
    // 変更内容を書き込む
    var isEditing = $('.isEditing');
    var edit_data = isEditing.find('textarea').val();
    isEditing.removeClass('isEditing');
    if(edit_data !== undefined) {
      $scope.isEditing = false;
      // 変更があるか比較する
      if(edit_data !== $scope.beforeEditText) { // 最初のロングタップ時にも動作するため判別
        $scope.isWriting = true;
        // ページの内容を全取得して連結させる
        var page_all_data = '';
        $('ion-nav-view[nav-view="active"] ion-view[nav-view="active"] .raw-textarea .original_data').each(function(i) {
          var pageDetailNumber = i;
          var text_data = $(this).val();
          // テキストエリアの中に改行がある場合、切り取って、HTML付加してpageDetail配列に追加
          if (text_data.match(/\r\n/) || text_data.match(/(\n|\r)/)) {
            arr = text_data.split(/\r\n|\r|\n/);
            for (i = 0; i < arr.length; i++) {
              var insertNumber = pageDetailNumber + i;
              var content_num = $scope.pageDetail.length;
              var insertHtmlData = '<span class="conversion_text htmlData" content="transParagraph(gyazz'+content_num+')"></span><label class="item item-input raw-textarea" style="display:none;"><textarea class="original_data" ng-blur="endEditMode()" ng-model="gyazz'+content_num+'" ng-init="gyazz'+content_num+'=\''+arr[i]+'\'" ng-change="onInputText($eve)"></textarea></label>';
              $scope.pageDetail.splice(insertNumber+1, 0, insertHtmlData);
            }
            // 編集前のパラグラフを削除
            $scope.pageDetail.splice(pageDetailNumber, 1);
          }
          page_all_data += text_data;
          page_all_data += '\n';
        });
        Pages.writePage($scope.page.title, page_all_data).then(function(data) {
          $timeout(function() {
            $scope.isWriting = false;
          }, 100);
        });
      } else {
        $scope.isWriting = false;
      }
    }
    var texts_area = $('.paragraphWrapper');
    // テキストを一旦非表示
    texts_area.find('.conversion_text').show();
    // フォームを表示
    texts_area.find('.raw-textarea').hide();
    // フォームのフォーカスを外す
    $timeout(function(){
         texts_area.find('textarea').blur();
    }, 0);
  }


})

.controller('PagelistCtrl', function($scope, $timeout, $ionicPopup, $ionicLoading, Pages) {
  $scope.isLoading = true;
	// ページ一覧を読み込む
	Pages.getPages().then(function(pages) {
        $scope.pages = pages;
        $scope.isLoading = false;
        $scope.$apply();
    });
  // PullToRefresh
  $scope.doRefresh = function() {
    Pages.getPages().then(function(pages) {
      $scope.pages = pages;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
})
.controller('NewpageCtrl',function($scope, $ionicPopup, $location, $timeout) {
  // $scope.testFunc = function() {
  //   var this_page = $location.path();
  //   var tab_name = this_page.split('/');
  //   var title = 'Hikaru/test'
  //       title = title.replace(/[\n\r]/g,"%2F")
  //   var title = 'Hikaru%2Ftest'
  //   $location.path('/tab/'+tab_name[2]+'/pages/'+title);
  // }
  $scope.goNewPage = function(title) {
    var this_page = $location.path();
    // 現在のタブのstateを取得
    var tab_name = this_page.split('/');
    $location.path('/tab/'+tab_name[2]+'/pages/'+title);
  }
  $scope.showPopup = function() {
    $scope.data = {}
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.title">',
      title: '新規作成するページ名を入力',
      subTitle: 'スラッシュは使用禁止',
      scope: $scope,
      buttons: [
        { text: 'キャンセル' },
        {
          text: '<b>作成</b>',
          type: 'button-assertive',
          onTap: function(e) {
            if (!$scope.data.title) {
              e.preventDefault();
            } else {
              return $scope.data.title;
            }
          }
        }
      ]
    });
    myPopup.then(function(res) {
      if(res !== undefined) {
        if(res.match(/\//i)){
          console.log('error');
        } else {
          $scope.goNewPage(res)
        }
      } else {
        console.log('キャンセル');
      }
    });
   };
})
.controller('StarsCtrl', function($scope, Stars) {
  $scope.isLoading = true;
  // スター覧を読み込む
  Stars.getStars().then(function(stars) {
    $scope.stars = stars;
    $scope.isLoading = false;
    $scope.$apply();
    });
  //PullToRefresh
  $scope.doRefresh = function() {
    Stars.getStars().then(function(stars) {
      $scope.stars = stars;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
})

.controller('RandomCtrl', function($scope, $http, $controller, Pages) {
  // コントローラを継承
  $controller('PageCtrl', {$scope: $scope});
  var onShake = function () {
    Pages.getRandomPageDetail().then(function(detail) {
      $scope.page.title = detail
      Pages.getPageDetail($scope.page.title).then(function(detail) {
        $scope.pageDetail = detail
        $scope.isLoading = false;
        $scope.$apply();
      });
    });
  };

  // シェイクでページ遷移
  shake.startWatch(onShake, 30);

  // デフォルトタイトル
  $scope.page.title = 'Loading...';

  // ランダムページ取得
  Pages.getRandomPageDetail().then(function(detail) {
    $scope.page.title = detail
    Pages.getPageDetail($scope.page.title).then(function(detail) {
      $scope.pageDetail = detail
      $scope.isLoading = false;
      $scope.$apply();

    });
  });
  //
  $scope.doRefresh = function() {
    Pages.getRandomPageDetail().then(function(detail) {
      $scope.page.title = detail
      console.log($scope.page.title);
      Pages.getPageDetail($scope.page.title).then(function(detail) {
        $scope.pageDetail = detail
        $scope.$broadcast('scroll.refreshComplete');
      });
    });
  };
})
.controller('SearchCtrl', function($scope, $location, $timeout, Pages) {
  $scope.isLoading = false;
  $scope.showPage = function() {
    var this_page = $location.path();
    var tab_name = this_page.split('/');
    $location.path('/tab/'+tab_name[2]+'/search');
    $timeout(function() {
      $('.search_text_input').focus();
    }, 800);
  }
  $scope.searchPage = function(query) {
    $scope.isLoading = true;
    Pages.searchPage(query).then(function(results) {
      $scope.results = results
      $scope.isLoading = false;
      $scope.$apply();
    });
  }
  $scope.goNextPage = function(title) {
    var this_page = $location.path();
    // 現在のタブのstateを取得
    var tab_name = this_page.split('/');
    $location.path('/tab/'+tab_name[2]+'/pages/'+title);
  }
})
.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller('LoginCtrl', function($scope, $ionicModal, $location) {
    // モーダル定義
   $ionicModal.fromTemplateUrl('templates/modal-editpage.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
    $scope.errorMessage = false;
    $scope.signIn = function(user) {
      // バリデーションをする
      if(user.username == "pitecan" && user.pass == "masu1lab") {
        $location.path('/tab/pagelist');
        $scope.closeModal();
      } else {
        $scope.errorMessage = true;
      }
    }
});