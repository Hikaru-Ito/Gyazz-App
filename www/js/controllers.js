angular.module('starter.controllers', [])


.controller('PageCtrl', function($scope, $state, $stateParams, $sce, $cordovaInAppBrowser, Pages) {
  $scope.page = Pages.getPage($stateParams.pageId);
  $scope.isLoading = true;
  // ページ本文を読み込む
  Pages.getPageDetail($scope.page.title).then(function(detail) {
  	$scope.pageDetail = detail
    $scope.isLoading = false;
  });
  // htmlを埋め込むための変換関数
  $scope.getTag = function(txt) {
        return $sce.trustAsHtml(txt);
  }
  // InAppBrowser
  $scope.openWebPage = function(url) {
   var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'no'
      };
    $cordovaInAppBrowser.open(url, '_blank', options)
      .then(function(event) {}).catch(function(event) {});
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
