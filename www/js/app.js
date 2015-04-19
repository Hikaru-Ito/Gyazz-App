// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

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
    url: '/pagelist/pages/:pageTitle',
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
    url: '/stars/pages/:pageTitle',
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
    url: '/random/pages/:pageTitle',
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
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/pagelist');

});
