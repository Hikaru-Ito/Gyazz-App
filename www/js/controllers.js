angular.module('starter.controllers', [])


.controller('PageCtrl', function($scope, $state, $stateParams, Pages) {
  $scope.page = Pages.getPage($stateParams.pageId);
  // ページ本文を読み込む
  Pages.getPageDetail($scope.page.title).then(function(detail) {
  	$scope.pageDetail = detail
  });

})

.controller('PagelistCtrl', function($scope, $timeout, $ionicLoading, Pages) {

	// ページ一覧を読み込む
	Pages.getPages().then(function(pages) {
        $scope.pages = pages;
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
