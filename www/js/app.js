angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, $location, $cordovaGoogleAnalytics, $ionicScrollDelegate, $cordovaClipboard, $rootScope, $cordovaToast, GYAZZ_URL, GYAZZ_WIKI_NAME) {
  $ionicPlatform.ready(function() {

    // Google Analytics
    $cordovaGoogleAnalytics.startTrackerWithId('UA-62257533-1');
    $cordovaGoogleAnalytics.trackView('Start v1.1.0');

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
    // iOSのみ、ステータスバーでスクロールを戻す
    if (window.cordova && ionic.Platform.isIOS()) {
      window.addEventListener("statusTap", function() {
        $ionicScrollDelegate.scrollTop(true);
      });
    }

    $rootScope.checkClipboardURL = function() {
      $cordovaClipboard.paste().then(function (result) {
        // GyazzページへのURLかどうかを確認する
        var abc = GYAZZ_URL+GYAZZ_WIKI_NAME;
        reg = new RegExp(abc);
        if(result.match(reg)) {
          var title = result.replace(GYAZZ_URL+GYAZZ_WIKI_NAME+'/', '');
          $cordovaToast.show('URLコピーされたページに移動しました', 'short', 'center');
          var this_page = $location.path();
          var tab_name = this_page.split('/');
          $location.path('/tab/'+tab_name[2]+'/pages/'+title);
          // クリップボードの中身消す
          $cordovaClipboard.copy('').then(function () {
          }, function () {
          });
        } else {
        }
      }, function() {
      });
    }
    document.addEventListener("resume", function() {
      $rootScope.checkClipboardURL();
    }, false);
    // ログインを確認する
    // localStorageを使用する
    if(!localStorage.getItem('logined')) {
      $location.path('/login');
    } else {
      // URLコピーを確認
      $rootScope.checkClipboardURL();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  .state('tab.pagelist', {
    url: '/pagelist',
    views: {
      'tab-pagelist': {
        templateUrl: 'templates/tab-pagelist.html',
        controller: 'PagelistCtrl'
      }
    }
  })
  .state('tab.pagelist-page', {
    url: '/pagelist/pages/*pageTitle',
    views: {
      'tab-pagelist': {
        templateUrl: 'templates/page.html',
        controller: 'PageCtrl'
      }
    }
  })
  .state('tab.pagelist-search', {
    url: '/pagelist/search',
    views: {
      'tab-pagelist': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('tab.stars', {
      url: '/stars',
      views: {
        'tab-stars': {
          templateUrl: 'templates/tab-stars.html',
          controller: 'StarsCtrl'
        }
      }
    })
  .state('tab.stars-page', {
    url: '/stars/pages/*pageTitle',
    views: {
      'tab-stars': {
        templateUrl: 'templates/page.html',
        controller: 'PageCtrl'
      }
    }
  })
  .state('tab.stars-search', {
    url: '/stars/search',
    views: {
      'tab-stars': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  })
  .state('tab.random', {
      url: '/random',
      views: {
        'tab-random' : {
            templateUrl : 'templates/page.html',
            controller: 'RandomCtrl'
        }
      }
  })
  .state('tab.random-page', {
    url: '/random/pages/*pageTitle',
    views: {
      'tab-random': {
        templateUrl: 'templates/page.html',
        controller: 'PageCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.account-page', {
    url: '/account/pages/*pageTitle',
    views: {
      'tab-account': {
        templateUrl: 'templates/page.html',
        controller: 'PageCtrl'
      }
    }
  })
  .state('tab.account-issues', {
    url: '/account/issues/*title',
    views: {
      'tab-account': {
        templateUrl: 'templates/issues.html',
        controller: 'IssuesCtrl'
      }
    }
  })
  .state('tab.account-todos', {
    url: '/account/todos',
    views: {
      'tab-account': {
        templateUrl: 'templates/todos.html',
        controller: 'TodosCtrl'
      }
    }
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/modal-editpage.html',
    controller: 'LoginCtrl'
  });

  $urlRouterProvider.otherwise('/tab/pagelist');

});
