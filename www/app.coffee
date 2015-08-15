angular.module 'gyazzapp', [
  'ionic'
  'gyazzapp.run'
  'gyazzapp.controllers.page'
  'gyazzapp.controllers.pagelist'
  'gyazzapp.controllers.newpage'
  'gyazzapp.controllers.stars'
  'gyazzapp.controllers.search'
  'gyazzapp.controllers.todos'
  'gyazzapp.controllers.notification'
  'gyazzapp.controllers.login'
  'gyazzapp.controllers.issues'
  'gyazzapp.controllers.random'
  'gyazzapp.controllers.account'
  'gyazzapp.services.values'
  'gyazzapp.filters.toago'
  'gyazzapp.directives.htmldata'
  'gyazzapp.model.user'
  'gyazzapp.model.pushnotification'
  'gyazzapp.model.db'
  'gyazzapp.model.issues'
  'gyazzapp.model.notifications'
  'gyazzapp.model.pages'
  'gyazzapp.model.stars'
  'gyazzapp.model.todos'
  'ngCordova'
]
.config ($stateProvider, $urlRouterProvider) ->

  # PushStateのルーティング
  $stateProvider

  .state('tab',
    url: "/tab"
    abstract: true
    templateUrl: "templates/tabs.html"
  )

  # タブごとに独立したViewを設けているので、ページ遷移に関するルーティング設定はすべてのViewに対して宣言しなければならない

  # ページリストタブ
  .state('tab.pagelist',
    url: '/pagelist',
    views:
      'tab-pagelist':
        templateUrl: 'templates/tab-pagelist.html'
        controller: 'PagelistCtrl'
  )

  .state('tab.pagelist-page',
    url: '/pagelist/pages/*pageTitle',
    views:
      'tab-pagelist':
        templateUrl: 'templates/page.html'
        controller: 'PageCtrl'
  )

  .state('tab.pagelist-search',
    url: '/pagelist/search',
    views:
      'tab-pagelist':
        templateUrl: 'templates/search.html'
        controller: 'SearchCtrl'
  )

  # スタータブ
  .state('tab.stars',
    url: '/stars',
    views:
      'tab-stars':
        templateUrl: 'templates/tab-stars.html'
        controller: 'StarsCtrl'
  )

  .state('tab.stars-page',
    url: '/stars/pages/*pageTitle',
    views:
      'tab-stars':
        templateUrl: 'templates/page.html'
        controller: 'PageCtrl'
  )

  .state('tab.stars-search',
    url: '/stars/search',
    views:
      'tab-stars':
        templateUrl: 'templates/search.html'
        controller: 'SearchCtrl'
  )


  # ランダムタブ
  .state('tab.random',
      url: '/random',
      views:
        'tab-random' :
          templateUrl : 'templates/page.html'
          controller: 'RandomCtrl'
  )

  .state('tab.random-page',
    url: '/random/pages/*pageTitle',
    views:
      'tab-random':
        templateUrl: 'templates/page.html'
        controller: 'PageCtrl'
  )


  # 更新通知一覧タブ
  .state('tab.notification',
    url: '/notification',
    views:
      'tab-notification':
        templateUrl: 'templates/tab-notification.html'
        controller: 'NotificationCtrl'
  )

  .state('tab.notification-page',
    url: '/notification/pages/*pageTitle',
    views:
      'tab-notification':
        templateUrl: 'templates/page.html'
        controller: 'PageCtrl'
  )

  # アカウントタブ
  .state('tab.account',
    url: '/account',
    views:
      'tab-account':
        templateUrl: 'templates/tab-account.html'
        controller: 'AccountCtrl'
  )

  .state('tab.account-page',
    url: '/account/pages/*pageTitle',
    views:
      'tab-account':
        templateUrl: 'templates/page.html'
        controller: 'PageCtrl'
  )

  .state('tab.account-issues',
    url: '/account/issues/*title',
    views:
      'tab-account':
        templateUrl: 'templates/issues.html'
        controller: 'IssuesCtrl'
  )

  .state('tab.account-todos',
    url: '/account/todos',
    views:
      'tab-account':
        templateUrl: 'templates/todos.html'
        controller: 'TodosCtrl'
  )

  # ログインモーダル
  .state('login',
    url: '/login',
    templateUrl: 'templates/modal-editpage.html',
    controller: 'LoginCtrl'
  )

  $urlRouterProvider.otherwise('/tab/pagelist')
