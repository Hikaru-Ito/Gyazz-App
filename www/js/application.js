angular.module('gyazzapp', ['ionic', 'gyazzapp.run', 'gyazzapp.controllers.page', 'gyazzapp.controllers.pagelist', 'gyazzapp.controllers.newpage', 'gyazzapp.controllers.stars', 'gyazzapp.controllers.search', 'gyazzapp.controllers.todos', 'gyazzapp.controllers.notification', 'gyazzapp.controllers.login', 'gyazzapp.controllers.issues', 'gyazzapp.controllers.random', 'gyazzapp.controllers.account', 'gyazzapp.services.values', 'gyazzapp.filters.toago', 'gyazzapp.directives.htmldata', 'gyazzapp.model.user', 'gyazzapp.model.pushnotification', 'gyazzapp.model.db', 'gyazzapp.model.issues', 'gyazzapp.model.notifications', 'gyazzapp.model.pages', 'gyazzapp.model.stars', 'gyazzapp.model.todos', 'ngCordova']).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  }).state('tab.pagelist', {
    url: '/pagelist',
    views: {
      'tab-pagelist': {
        templateUrl: 'templates/tab-pagelist.html',
        controller: 'PagelistCtrl'
      }
    }
  }).state('tab.pagelist-page', {
    url: '/pagelist/pages/*pageTitle',
    views: {
      'tab-pagelist': {
        templateUrl: 'templates/page.html',
        controller: 'PageCtrl'
      }
    }
  }).state('tab.pagelist-search', {
    url: '/pagelist/search',
    views: {
      'tab-pagelist': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  }).state('tab.stars', {
    url: '/stars',
    views: {
      'tab-stars': {
        templateUrl: 'templates/tab-stars.html',
        controller: 'StarsCtrl'
      }
    }
  }).state('tab.stars-page', {
    url: '/stars/pages/*pageTitle',
    views: {
      'tab-stars': {
        templateUrl: 'templates/page.html',
        controller: 'PageCtrl'
      }
    }
  }).state('tab.stars-search', {
    url: '/stars/search',
    views: {
      'tab-stars': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  }).state('tab.random', {
    url: '/random',
    views: {
      'tab-random': {
        templateUrl: 'templates/page.html',
        controller: 'RandomCtrl'
      }
    }
  }).state('tab.random-page', {
    url: '/random/pages/*pageTitle',
    views: {
      'tab-random': {
        templateUrl: 'templates/page.html',
        controller: 'PageCtrl'
      }
    }
  }).state('tab.notification', {
    url: '/notification',
    views: {
      'tab-notification': {
        templateUrl: 'templates/tab-notification.html',
        controller: 'NotificationCtrl'
      }
    }
  }).state('tab.notification-page', {
    url: '/notification/pages/*pageTitle',
    views: {
      'tab-notification': {
        templateUrl: 'templates/page.html',
        controller: 'PageCtrl'
      }
    }
  }).state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  }).state('tab.account-page', {
    url: '/account/pages/*pageTitle',
    views: {
      'tab-account': {
        templateUrl: 'templates/page.html',
        controller: 'PageCtrl'
      }
    }
  }).state('tab.account-issues', {
    url: '/account/issues/*title',
    views: {
      'tab-account': {
        templateUrl: 'templates/issues.html',
        controller: 'IssuesCtrl'
      }
    }
  }).state('tab.account-todos', {
    url: '/account/todos',
    views: {
      'tab-account': {
        templateUrl: 'templates/todos.html',
        controller: 'TodosCtrl'
      }
    }
  }).state('login', {
    url: '/login',
    templateUrl: 'templates/modal-editpage.html',
    controller: 'LoginCtrl'
  });
  return $urlRouterProvider.otherwise('/tab/pagelist');
});

angular.module('gyazzapp.run', []).run(function($ionicPlatform, $location, $cordovaGoogleAnalytics, $ionicScrollDelegate, $cordovaClipboard, $rootScope, $cordovaPush, $cordovaToast, GYAZZ_URL, GYAZZ_WIKI_NAME, ANDROID_GCM_SENDER_ID, PushNotification, User) {
  return $ionicPlatform.ready(function() {
    $cordovaGoogleAnalytics.startTrackerWithId('UA-62257533-1');
    $cordovaGoogleAnalytics.trackView('Start v1.1.0');
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
    if (window.cordova && ionic.Platform.isIOS()) {
      window.addEventListener('statusTap', function() {
        return $ionicScrollDelegate.scrollTop(true);
      });
    }
    $rootScope.registerIOS = function() {
      var iosConfig;
      $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
        var snd;
        if (notification.alert) {
          $cordovaToast.show(notification.alert, 'short', 'center');
        }
        if (notification.sound) {
          snd = new Media(event.sound);
          snd.play();
        }
        if (notification.badge) {
          return $cordovaPush.setBadgeNumber(notification.badge);
        }
      });
      iosConfig = {
        'badge': true,
        'sound': true,
        'alert': true
      };
      return $cordovaPush.register(iosConfig).then(function(deviceToken) {
        return PushNotification.registerDeviceID(deviceToken, 'ios');
      }, function(err) {
        return alert('Registration error: ' + err);
      });
    };
    $rootScope.registerAndroid = function() {
      return console.log('Androidのプッシュ通知は未対応');
    };
    if (!localStorage.getItem('user_id')) {
      if (ionic.Platform.isIOS()) {
        User.register('ios');
      } else if (ionic.Platform.isAndroid()) {
        User.register('android');
      }
    } else {
      if (ionic.Platform.isIOS()) {
        $rootScope.registerIOS();
      } else if (ionic.Platform.isAndroid()) {
        $rootScope.registerAndroid();
      }
    }
    $rootScope.checkClipboardURL = function() {
      return $cordovaClipboard.paste().then(function(result) {
        var abc, reg, tab_name, this_page, title;
        abc = GYAZZ_URL + GYAZZ_WIKI_NAME;
        reg = new RegExp(abc);
        if (result.match(reg)) {
          title = result.replace("" + GYAZZ_URL + GYAZZ_WIKI_NAME + "/", '');
          $cordovaToast.show('URLコピーされたページに移動しました', 'short', 'center');
          this_page = $location.path();
          tab_name = this_page.split('/');
          $location.path('/tab/' + tab_name[2] + '/pages/' + title);
          return $cordovaClipboard.copy('');
        }
      });
    };
    document.addEventListener('resume', function() {
      return $rootScope.checkClipboardURL();
    });
    if (!localStorage.getItem('logined')) {
      return $location.path('/login');
    } else {
      return $rootScope.checkClipboardURL();
    }
  });
});

angular.module('gyazzapp.controllers.account', []).controller('AccountCtrl', function($scope, $timeout, Pages) {
  return $scope.logout = function() {
    localStorage.removeItem('logined');
    return alert('ログアウトしました');
  };
});

angular.module('gyazzapp.controllers.issues', []).controller('IssuesCtrl', function($scope, $state, $stateParams, $cordovaInAppBrowser, $cordovaGoogleAnalytics, $ionicModal, $timeout, $location, Issues) {
  $scope.isLoading = true;
  $scope.label = $stateParams.title;
  switch ($scope.label) {
    case 'bug':
      $scope.title = '確認済みのバグ';
      break;
    case 'enhancement':
      $scope.title = '搭載予定の機能/リクエスト';
      break;
    case '愚痴':
      $scope.title = '愚痴';
  }
  $cordovaGoogleAnalytics.trackView('[' + $scope.title + ']');
  Issues.getIssues($scope.label).then(function(issues) {
    $scope.issues = issues;
    $scope.isLoading = false;
    return $scope.$apply();
  });
  return $scope.openWebPage = function(url) {
    var options;
    options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };
    return $cordovaInAppBrowser.open(url, '_blank', options);
  };
});

angular.module('gyazzapp.controllers.login', []).controller('LoginCtrl', function($scope, $ionicModal, $location) {
  $scope.errorMessage = false;
  $ionicModal.fromTemplateUrl('templates/modal-editpage.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    return $scope.modal.show();
  });
  return $scope.signIn = function(user) {
    if (user.username === 'pitecan' && user.pass === 'masu1lab') {
      $location.path('/tab/pagelist');
      localStorage.setItem('logined', 'logined');
      return $scope.modal.hide();
    } else {
      return $scope.errorMessage = true;
    }
  };
});

angular.module('gyazzapp.controllers.newpage', []).controller('NewpageCtrl', function($scope, $ionicPopup, $location, $timeout) {
  $scope.goNewPage = function(title) {
    var tab_name, this_page;
    this_page = $location.path();
    tab_name = this_page.split('/');
    return $location.path('/tab/' + tab_name[2] + '/pages/' + title);
  };
  return $scope.showPopup = function() {
    var myPopup;
    $scope.data = {};
    myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.title">',
      title: '新規作成するページ名を入力',
      subTitle: 'スラッシュは使用禁止',
      scope: $scope,
      buttons: [
        {
          text: 'キャンセル'
        }, {
          text: '<b>作成</b>',
          type: 'button-assertive',
          onTap: function(e) {
            if (!$scope.data.title) {
              return e.preventDefault();
            } else {
              return $scope.data.title;
            }
          }
        }
      ]
    });
    return myPopup.then(function(res) {
      if (res !== void 0) {
        return $scope.goNewPage(res);
      }
    });
  };
});

angular.module('gyazzapp.controllers.notification', []).controller('NotificationCtrl', function($scope, $location, Notifications) {
  $scope.isLoading = true;
  $scope.goNextPage = function(title) {
    var tab_name, this_page;
    this_page = $location.path();
    tab_name = this_page.split('/');
    return $location.path('/tab/' + tab_name[2] + '/pages/' + title);
  };
  Notifications.getLists().then(function(data) {
    $scope.notifications = data;
    $scope.isLoading = false;
    return $scope.$apply();
  });
  return $scope.doRefresh = function() {
    return Notifications.getLists().then(function(data) {
      $scope.notifications = data;
      return $scope.$broadcast('scroll.refreshComplete');
    });
  };
});

angular.module('gyazzapp.controllers.page', []).controller('PageCtrl', function($scope, $state, $stateParams, $cordovaVibration, $cordovaInAppBrowser, $cordovaToast, $cordovaGoogleAnalytics, $ionicModal, $timeout, $location, Pages, Stars) {
  $scope.page = Pages.getPage($stateParams.pageTitle);
  $scope.isLoading = true;
  $scope.isWriting = false;
  $scope.beforeEditText = null;
  $scope.isEditing = false;
  $scope.starAni = false;
  $cordovaGoogleAnalytics.trackView($scope.page.title);
  Pages.getPageDetail($scope.page.title).then(function(detail) {
    $scope.pageDetail = detail;
    $scope.isLoading = false;
    return $scope.$apply();
  });
  $scope.openWebPage = function(url) {
    var options;
    options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };
    return $cordovaInAppBrowser.open(url, '_blank', options);
  };
  $scope.goNextPage = function(title) {
    var tab_name, this_page;
    this_page = $location.path();
    tab_name = this_page.split('/');
    return $location.path('/tab/' + tab_name[2] + '/pages/' + title);
  };
  $scope.checkStar = function() {
    return Stars.checkStar($scope.page.title);
  };
  $scope.addStar = function() {
    Stars.addStar($scope.page.title).then(function(detail) {
      return $cordovaVibration.vibrate(400);
    });
    $scope.starAni = true;
    $timeout(function() {
      return $scope.starAni = false;
    }, 1600);
    $cordovaToast.show('スターをつけました', 'short', 'center');
    return $cordovaGoogleAnalytics.trackEvent('Star', 'AddStar', 'add', 100);
  };
  $scope.removeStar = function() {
    Stars.removeStar($scope.page.title).then(function(detail) {});
    return $cordovaGoogleAnalytics.trackEvent('Star', 'RemoveStar', 'remove', 100);
  };
  $scope.changeStar = function() {
    if ($scope.checkStar() === true) {
      return $scope.addStar();
    } else {
      return $scope.removeStar();
    }
  };
  $scope.transParagraph = function(rawData) {
    return Pages.transParagraph(rawData);
  };
  $scope.doRefresh = function() {
    return Pages.getPageDetail($scope.page.title).then(function(detail) {
      $scope.pageDetail = detail;
      return $scope.$broadcast('scroll.refreshComplete');
    });
  };
  $scope.insertFirstParagraph = function() {
    var insertHtmlData;
    insertHtmlData = '<span class="conversion_text htmlData" content="transParagraph(gyazzNew)"></span><label class="item item-input raw-textarea" style="display:none;"><textarea class="original_data new_gyazz_data" ng-blur="endEditMode()" ng-trim="false" ng-model="gyazzNew" ng-change="onInputText($eve)" ng-init="gyazzNew=\'\'"></textarea></label>';
    $scope.pageDetail.push(insertHtmlData);
    return $timeout(function() {
      var _this;
      _this = $('ion-view[nav-view="active"] .new_gyazz_data').closest('.paragraphWrapper');
      $scope.isEditing = true;
      if (!_this.hasClass('isEditing')) {
        $scope.endEditMode();
        _this.addClass('isEditing');
        _this.find('.conversion_text').hide();
        _this.find('.raw-textarea').show();
        $scope.beforeEditText = _this.find('textarea').val();
        return $timeout((function() {
          return _this.find('textarea').focus();
        }), 0);
      }
    }, 10);
  };
  $scope.openModal = function() {
    return $scope.modal.show();
  };
  $scope.closeModal = function() {
    return $scope.modal.hide();
  };
  $scope.swipeRight = function() {
    if ($scope.isEditing) {
      return $scope.insertGyazzMark('[');
    }
  };
  $scope.swipeLeft = function() {
    if ($scope.isEditing) {
      return $scope.insertGyazzMark(']');
    }
  };
  $scope.insertGyazzMark = function(mark) {
    var np, o, p, s, target_area;
    target_area = $(':focus');
    target_area = target_area.get(0);
    o = target_area;
    s = o.value;
    p = o.selectionStart;
    np = p + mark.length;
    o.value = s.substr(0, p) + mark + s.substr(p);
    o.setSelectionRange(np, np);
    return o.focus();
  };
  $scope.onInputText = function(evt) {
    var _this, lineHeight, results;
    _this = event;
    if (_this.currentTarget.scrollHeight > _this.currentTarget.offsetHeight) {
      return $(_this.currentTarget).height(_this.currentTarget.scrollHeight);
    } else {
      lineHeight = Number($(_this.currentTarget).css('lineHeight').split('px')[0]);
      results = [];
      while (true) {
        $(_this.currentTarget).height($(_this.currentTarget).height() - lineHeight);
        if (_this.currentTarget.scrollHeight > _this.currentTarget.offsetHeight) {
          $(_this.currentTarget).height(_this.currentTarget.scrollHeight);
          break;
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };
  $scope.editMode = function(event) {
    var _this;
    $scope.isEditing = true;
    _this = $(event.currentTarget);
    if (!_this.hasClass('isEditing')) {
      $scope.endEditMode();
      _this.addClass('isEditing');
      _this.find('.conversion_text').hide();
      _this.find('.raw-textarea').show();
      $scope.beforeEditText = _this.find('textarea').val();
      $timeout(function() {
        return _this.find('textarea').focus();
      }, 0);
    }
    return $cordovaGoogleAnalytics.trackEvent('Paragraph', 'LongTapEdit', 'start', 100);
  };
  return $scope.endEditMode = function() {
    var edit_data, isEditing, page_all_data, texts_area;
    isEditing = $('.isEditing');
    edit_data = isEditing.find('textarea').val();
    isEditing.removeClass('isEditing');
    if (edit_data !== void 0) {
      $scope.isEditing = false;
      if (edit_data !== $scope.beforeEditText) {
        $scope.isWriting = true;
        page_all_data = '';
        $('ion-nav-view[nav-view="active"] ion-view[nav-view="active"] .raw-textarea .original_data').each(function(i) {
          var arr, content_num, insertHtmlData, insertNumber, pageDetailNumber, text_data;
          pageDetailNumber = i;
          text_data = $(this).val();
          if (text_data === '') {
            $(this).closest('.paragraphWrapper').remove();
            return true;
          }
          if (text_data.match(/\r\n/) || text_data.match(/(\n|\r)/)) {
            arr = text_data.split(/\r\n|\r|\n/);
            i = 0;
            while (i < arr.length) {
              insertNumber = pageDetailNumber + i;
              content_num = $scope.pageDetail.length;
              insertHtmlData = '<span class="conversion_text htmlData" content="transParagraph(gyazz' + content_num + ')"></span><label class="item item-input raw-textarea" style="display:none;"><textarea class="original_data" ng-blur="endEditMode()" ng-trim="false" ng-model="gyazz' + content_num + '" ng-init="gyazz' + content_num + '=\'' + arr[i] + '\'" ng-change="onInputText($eve)"></textarea></label>';
              $scope.pageDetail.splice(insertNumber + 1, 0, insertHtmlData);
              i++;
            }
            $scope.pageDetail.splice(pageDetailNumber, 1);
          }
          page_all_data += text_data;
          return page_all_data += '\n';
        });
        Pages.writePage($scope.page.title, page_all_data).then(function(data) {
          $timeout(function() {
            $scope.isWriting = false;
          }, 100);
        });
        $cordovaGoogleAnalytics.trackEvent('Paragraph', 'Write', 'end', 100);
      } else {
        $scope.isWriting = false;
      }
    }
    texts_area = $('.paragraphWrapper');
    texts_area.find('.conversion_text').show();
    texts_area.find('.raw-textarea').hide();
    return $timeout(function() {
      return texts_area.find('textarea').blur();
    }, 0);
  };
});

angular.module('gyazzapp.controllers.pagelist', []).controller('PagelistCtrl', function($scope, $timeout, $ionicPopup, $cordovaToast, $ionicLoading, Pages) {
  $scope.isLoading = true;
  $scope.pages = [];
  $scope.noMoreItemsAvailable = true;
  $scope.getPagesFromRss = function() {
    $cordovaToast.show('RSSから読み込みます', 'short', 'center');
    return Pages.getPagesFromRss().then(function(pages) {
      $scope.pages = pages;
      $scope.isLoading = false;
      $scope.noMoreItemsAvailable = true;
      $scope.$apply();
      return $scope.$broadcast('scroll.refreshComplete');
    });
  };
  Pages.getPages().then((function(pages) {
    $scope.pages = pages;
    $scope.isLoading = false;
    $scope.noMoreItemsAvailable = false;
    return $scope.$apply();
  }), function(data) {
    return $scope.getPagesFromRss();
  });
  $scope.loadMore = function() {
    $scope.pages = $scope.pages.concat(Pages.getMorePages($scope.pages.length));
    return $scope.$broadcast('scroll.infiniteScrollComplete');
  };
  return $scope.doRefresh = function() {
    return Pages.getPages().then((function(pages) {
      $scope.pages = pages;
      $scope.isLoading = false;
      $scope.noMoreItemsAvailable = false;
      $scope.$apply();
      return $scope.$broadcast('scroll.refreshComplete');
    }), function(data) {
      return $scope.getPagesFromRss();
    });
  };
});

angular.module('gyazzapp.controllers.random', []).controller('RandomCtrl', function($scope, $http, $cordovaGoogleAnalytics, $controller, Pages) {
  $controller('PageCtrl', {
    $scope: $scope
  });
  $scope.page.title = 'Loading...';
  Pages.getRandomPageDetail().then(function(detail) {
    $scope.page.title = detail;
    Pages.getPageDetail($scope.page.title).then(function(detail) {
      $scope.pageDetail = detail;
      $scope.isLoading = false;
      return $scope.$apply();
    });
    return $cordovaGoogleAnalytics.trackView('[Random]' + $scope.page.title);
  });
  return $scope.doRefresh = function() {
    return Pages.getRandomPageDetail().then(function(detail) {
      $scope.page.title = detail;
      console.log($scope.page.title);
      Pages.getPageDetail($scope.page.title).then(function(detail) {
        $scope.pageDetail = detail;
        return $scope.$broadcast('scroll.refreshComplete');
      });
      return $cordovaGoogleAnalytics.trackView('[Random]' + $scope.page.title);
    });
  };
});

angular.module('gyazzapp.controllers.search', []).controller('SearchCtrl', function($scope, $location, $cordovaGoogleAnalytics, $timeout, Pages) {
  $scope.isLoading = false;
  $scope.noMoreItemsAvailable = true;
  $scope.results = [];
  $scope.noData = false;
  $scope.searchPage = function(query) {
    $scope.results = [];
    $scope.isLoading = true;
    $scope.noData = false;
    Pages.searchPage(query).then(function(results) {
      if (results.length === 0) {
        $scope.noData = true;
      }
      $scope.results = results;
      $scope.isLoading = false;
      $scope.noMoreItemsAvailable = false;
      return $scope.$apply();
    });
    return $cordovaGoogleAnalytics.trackView('[Search]' + query);
  };
  $scope.showPage = function() {
    var tab_name, this_page;
    this_page = $location.path();
    tab_name = this_page.split('/');
    $location.path('/tab/' + tab_name[2] + '/search');
    return $timeout(function() {
      return $('.search_text_input').focus();
    }, 800);
  };
  $scope.goNextPage = function(title) {
    var tab_name, this_page;
    this_page = $location.path();
    tab_name = this_page.split('/');
    return $location.path('/tab/' + tab_name[2] + '/pages/' + title);
  };
  return $scope.loadMore = function() {
    $scope.results = $scope.results.concat(Pages.getMoreSearch($scope.results.length));
    return $scope.$broadcast('scroll.infiniteScrollComplete');
  };
});

angular.module('gyazzapp.controllers.stars', []).controller('StarsCtrl', function($scope, Stars) {
  $scope.isLoading = true;
  Stars.getStars().then(function(stars) {
    $scope.stars = stars;
    $scope.isLoading = false;
    return $scope.$apply();
  });
  return $scope.doRefresh = function() {
    return Stars.getStars().then(function(stars) {
      $scope.stars = stars;
      return $scope.$broadcast('scroll.refreshComplete');
    });
  };
});

angular.module('gyazzapp.controllers.todos', []).controller('TodosCtrl', function($scope, $state, $stateParams, $cordovaInAppBrowser, $cordovaGoogleAnalytics, $timeout, $location, Todos) {
  $scope.isLoading = true;
  $cordovaGoogleAnalytics.trackView('[増井研ToDo]');
  Todos.getTodos().then(function(todos) {
    $scope.todos = todos;
    $scope.isLoading = false;
    return $scope.$apply();
  });
  return $scope.openWebPage = function(url) {
    var options;
    options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };
    return $cordovaInAppBrowser.open(url, '_blank', options);
  };
});


/*
  UNIXスタンプを渡してあげることでhoge分前などという形式に変換してくれる
  AngularFilter
 */
angular.module('gyazzapp.filters.toago', []).filter('toAgo', function() {
  return function(input) {
    var d, diffTime, nD;
    d = input;
    nD = Math.floor((new Date).getTime() / 1000);
    diffTime = nD - d;
    if (diffTime > 31536000) {
      diffTime = Math.floor(diffTime / 31536000);
      diffTime = diffTime + '年前';
    } else if (diffTime > 86400) {
      diffTime = Math.floor(diffTime / 86400);
      diffTime = diffTime + '日前';
    } else if (diffTime > 3600) {
      diffTime = Math.floor(diffTime / 3600);
      diffTime = diffTime + '時間前';
    } else if (diffTime > 60) {
      diffTime = Math.floor(diffTime / 60);
      diffTime = diffTime + '分前';
    } else {
      diffTime = diffTime + '秒前';
    }
    return diffTime;
  };
});


/*
  生HTMLを表示するDirective
 */
angular.module('gyazzapp.directives.htmldata', []).directive('htmlData', function($compile, $parse) {
  return {
    restrict: 'C',
    link: function(scope, element, attr) {
      return scope.$watch(attr.content, function() {
        element.html($parse(attr.content)(scope));
        return $compile(element.contents())(scope);
      }, true);
    }
  };
});

angular.module('gyazzapp.services.values', []).value('GYAZZ_URL', 'http://gyazz.masuilab.org/').value('GYAZZ_WIKI_NAME', '増井研').value('GITHUB_ISSUE_API_URL', 'https://api.github.com/repos/Hikaru-Ito/Gyazz-App/issues').value('GITHUB_MASUILAB_TODO_API_URL', 'https://api.github.com/repos/masuilab/todo/issues').value('ANDROID_GCM_SENDER_ID', '545984238773').value('PARSE_API_URL', 'https://api.parse.com/1/installations').value('X_Parse_Application_Id', 'pVATfByzSVGuH1cfC7q9sdfZhOSBBZjoToIRVXli').value('X_Parse_REST_API_Key', 'lyQJVyUEVzJCqq2A5HYNRx5ytlSuNtbjlqkwA6R6').value('GYAZZ_APP_BACKEND_URL', 'http://gyazz-app-api.herokuapp.com');

angular.module('gyazzapp.model.db', []).factory('DB', function($q) {
  db;
  var db, errorCB, initQuery, self, successCB;
  self = this;
  errorCB = function(err) {
    return console.log("SQL 実行中にエラーが発生しました:" + err.code);
  };
  initQuery = function(tx) {
    return tx.executeSql('CREATE TABLE IF NOT EXISTS TestTable ( id integer primary key autoincrement, value text, created datetime default current_timestamp)');
  };
  successCB = function() {};
  db = window.openDatabase("Database", "1.0", "TestDatabase", 200000);
  db.transaction(initQuery, errorCB, successCB);
  self.query = function(query) {
    var deferred;
    deferred = $q.defer();
    db.transaction(function(transaction) {
      return transaction.executeSql(query, [], function(transaction, result) {
        return deferred.resolve(result);
      }, function(transaction, error) {
        return deferred.reject(error);
      });
    });
    return deferred.promise;
  };
  return self;
});

angular.module('gyazzapp.model.issues', []).factory('Issues', function($http, GITHUB_ISSUE_API_URL) {
  return {
    getIssues: function(label) {
      return $.ajax({
        url: GITHUB_ISSUE_API_URL + '?labels=' + label
      }).then(function(data) {
        var i, issues;
        i = 0;
        issues = [];
        $.each(data, function(i, value) {
          var issue;
          issue = {
            id: i,
            number: value['number'],
            title: value['title'],
            url: value['html_url'],
            user_name: value['user']['login'],
            user_icon: value['user']['avatar_url'],
            body: value['body']
          };
          return issues.push(issue);
        });
        return issues;
      });
    },
    getIssue: function(title) {
      var issue;
      issue = {
        title: title
      };
      return issue;
    }
  };
});

angular.module('gyazzapp.model.notifications', []).factory('Notifications', function($http, GYAZZ_APP_BACKEND_URL) {
  return {
    getLists: function() {
      return $.ajax({
        url: GYAZZ_APP_BACKEND_URL + '/notifications'
      }).then(function(data) {
        return data;
      });
    }
  };
});

angular.module('gyazzapp.model.pages', []).factory('Pages', function($http, GYAZZ_URL, GYAZZ_WIKI_NAME) {
  var gt, pages, results;
  pages = [];
  results = [];
  gt = void 0;
  gt = new GyazzTag;
  return {
    writePage: function(title, data) {
      return $.ajax({
        type: 'POST',
        url: GYAZZ_URL + '__write',
        data: {
          name: GYAZZ_WIKI_NAME,
          title: title,
          data: data
        },
        xhrFields: {
          withCredentials: true
        },
        headers: {
          'Authorization': 'Basic cGl0ZWNhbjptYXN1MWxhYg=='
        }
      }).done(function(data) {
        return data;
      }).fail(function(data) {
        console.log('書き込み失敗');
        return data;
      });
    },
    getPages: function() {
      return $.ajax({
        url: GYAZZ_URL + GYAZZ_WIKI_NAME + '/__list',
        xhrFields: {
          withCredentials: true
        },
        headers: {
          'Authorization': 'Basic cGl0ZWNhbjptYXN1MWxhYg=='
        },
        timeout: 5000
      }).then(function(data) {
        var first_pages, i;
        i = 0;
        first_pages = [];
        $.each(data.data, function(i, value) {
          var gyazz_page, title;
          title = value['_id'];
          gyazz_page = {
            id: i,
            title: title
          };
          if (i < 25) {
            first_pages.push(gyazz_page);
          }
          return pages.push(gyazz_page);
        });
        return first_pages;
      });
    },
    getPagesFromRss: function() {
      return $.ajax({
        url: GYAZZ_URL + GYAZZ_WIKI_NAME + '/rss.xml',
        xhrFields: {
          withCredentials: true
        },
        headers: {
          'Authorization': 'Basic cGl0ZWNhbjptYXN1MWxhYg=='
        }
      }).then(function(data) {
        var i;
        i = 0;
        pages = [];
        $(data).find('item').each(function() {
          var gyazz_page;
          gyazz_page = {
            id: i,
            title: $(this).find('title').text()
          };
          pages.push(gyazz_page);
          return i++;
        });
        return pages;
      });
    },
    getMorePages: function(id) {
      var i, more_pages;
      more_pages = [];
      id = Number(id);
      i = 0;
      while (i < pages.length) {
        if (i > id && i < id + 25) {
          more_pages.push(pages[i]);
        }
        i++;
      }
      return more_pages;
    },
    getPage: function(pageTitle) {
      var page;
      page = {
        title: pageTitle
      };
      return page;
    },
    getPageDetail: function(pageTitle) {
      return $.ajax({
        url: GYAZZ_URL + GYAZZ_WIKI_NAME + '/' + pageTitle + '/json',
        xhrFields: {
          withCredentials: true
        },
        headers: {
          'Authorization': 'Basic cGl0ZWNhbjptYXN1MWxhYg=='
        }
      }).then(function(data) {
        var pageDetail;
        pageDetail = [];
        $.each(data.data, function(i, value) {
          var original_data, text;
          text = value;
          original_data = '<label class="item item-input raw-textarea" style="display:none;"><textarea class="original_data" ng-model="gyazz' + i + '" ng-init="gyazz' + i + '=\'' + text + '\'" ng-change="onInputText($eve)" ng-blur="endEditMode()" ng-trim="false"></textarea></label>';
          text = '<span class="conversion_text htmlData" content="transParagraph(gyazz' + i + ')"></span>' + original_data;
          return pageDetail.push(text);
        });
        return pageDetail;
      });
    },
    transParagraph: function(text) {
      var _indent, data, tag;
      tag = gt.expand(text, GYAZZ_WIKI_NAME, null, null, GYAZZ_URL);
      _indent = tag.match(/^( *)/)[1].length;
      tag = tag.replace(/^ +/, '');
      data = '<p class="indent indent' + _indent + '">' + tag + '</p>';
      return data;
    },
    getRandomPageDetail: function() {
      return $.ajax({
        url: GYAZZ_URL + GYAZZ_WIKI_NAME + '/__random',
        xhrFields: {
          withCredentials: true
        },
        headers: {
          'Authorization': 'Basic cGl0ZWNhbjptYXN1MWxhYg=='
        }
      }).then(function(data) {
        var title;
        title = $(data).find('#title').text();
        title = title.replace(/[\n\r]/g, '');
        title = title.replace(/^\s+|\s+$/g, '');
        return title;
      });
    },
    searchPage: function(query) {
      results = [];
      return $.ajax({
        url: GYAZZ_URL + GYAZZ_WIKI_NAME + '/__search/?q=' + query,
        xhrFields: {
          withCredentials: true
        },
        headers: {
          'Authorization': 'Basic cGl0ZWNhbjptYXN1MWxhYg=='
        }
      }).then(function(data) {
        var first_results, i;
        first_results = [];
        i = 0;
        $(data).find('.tag').each(function() {
          var result;
          result = {
            id: i,
            title: $(this).text()
          };
          results.push(result);
          if (i < 25) {
            first_results.push(result);
          }
          return i++;
        });
        return first_results;
      });
    },
    getMoreSearch: function(id) {
      var i, more_results;
      more_results = [];
      id = Number(id);
      i = 0;
      while (i < results.length) {
        if (i > id && i < id + 25) {
          more_results.push(results[i]);
        }
        i++;
      }
      return more_results;
    }
  };
});

angular.module('gyazzapp.model.pushnotification', []).factory('PushNotification', function($http, $cordovaToast, ANDROID_GCM_SENDER_ID, PARSE_API_URL, X_Parse_Application_Id, X_Parse_REST_API_Key) {
  return {
    registerDeviceID: function(deviceID, platform) {
      var channel_id;
      localStorage.setItem('deviceID', deviceID);
      alert('デバイスデータ登録開始' + deviceID);
      channel_id = 'GyazzUserID' + localStorage.getItem('user_id');
      if (platform === 'ios') {
        $.ajax({
          url: PARSE_API_URL,
          type: 'POST',
          headers: {
            'X-Parse-Application-Id': X_Parse_Application_Id,
            'X-Parse-REST-API-Key': X_Parse_REST_API_Key
          },
          contentType: 'application/json',
          data: JSON.stringify({
            deviceType: platform,
            deviceToken: deviceID,
            channels: [channel_id, 'ALLRECIEVE']
          })
        }).done(function(data) {
          $cordovaToast.show('デバイスデータ登録完了', 'short', 'center');
          return true;
        }).fail(function(data) {
          return false;
        });
      }
      if (platform === 'android') {
        return $.ajax({
          url: PARSE_API_URL,
          type: 'POST',
          headers: {
            'X-Parse-Application-Id': X_Parse_Application_Id,
            'X-Parse-REST-API-Key': X_Parse_REST_API_Key
          },
          contentType: 'application/json',
          data: JSON.stringify({
            deviceType: platform,
            deviceToken: deviceID,
            GCMSenderId: ANDROID_GCM_SENDER_ID,
            pushType: 'gcm',
            channels: [channel_id, 'ALLRECIEVE']
          })
        }).done(function(data) {
          $cordovaToast.show('デバイスデータ登録完了', 'short', 'center');
          console.log('デバイスデータ登録完了');
          return true;
        }).fail(function(data) {
          return false;
        });
      }
    }
  };
});

angular.module('gyazzapp.model.stars', []).factory('Stars', function($http, $cordovaToast, GYAZZ_URL, GYAZZ_APP_BACKEND_URL, GYAZZ_WIKI_NAME, DB) {
  var init, stars;
  stars = [];
  init = function() {
    DB.query('SELECT * FROM TestTable ORDER BY created DESC').then(function(result) {
      var i, len, star;
      stars = [];
      len = result.rows.length;
      i = 0;
      while (i < len) {
        star = {
          id: result.rows.item(i).id,
          title: result.rows.item(i).title,
          created: result.rows.item(i).created
        };
        stars.push(star);
        i++;
      }
      return stars;
    });
  };
  init();
  return {
    getStars: function() {
      return DB.query('SELECT * FROM TestTable ORDER BY created DESC').then(function(result) {
        var i, len, star;
        stars = [];
        len = result.rows.length;
        i = 0;
        while (i < len) {
          star = {
            id: result.rows.item(i).id,
            title: result.rows.item(i).title,
            created: result.rows.item(i).created
          };
          stars.push(star);
          i++;
        }
        return stars;
      });
    },
    addStar: function(title) {
      var postServer;
      postServer = function(title) {
        return $.ajax({
          type: 'POST',
          url: GYAZZ_APP_BACKEND_URL + '/stars/add',
          data: {
            session_key: localStorage.getItem('session_key'),
            page_name: title
          }
        }).done(function() {}).fail(function() {
          return $cordovaToast.show('スター情報のサーバー同期に失敗しました', 'short', 'center');
        });
      };
      return DB.query('INSERT INTO TestTable (title) VALUES ("' + title + '")').then(function(result) {
        var star;
        star = {
          id: result.insertId,
          title: title
        };
        stars.unshift(star);
        postServer(title);
        return result;
      });
    },
    removeStar: function(title) {
      var postServer;
      postServer = function(title) {
        return $.ajax({
          type: 'POST',
          url: GYAZZ_APP_BACKEND_URL + '/stars/remove',
          data: {
            session_key: localStorage.getItem('session_key'),
            page_name: title
          }
        }).done(function() {}).fail(function() {
          return $cordovaToast.show('スター情報のサーバー同期に失敗しました', 'short', 'center');
        });
      };
      return DB.query('DELETE FROM TestTable WHERE title = "' + title + '"').then(function(result) {
        var i, remove_title;
        i = 0;
        while (i < stars.length) {
          remove_title = stars[i].title;
          if (remove_title === title) {
            stars.splice(i, 1);
            break;
          }
          i++;
        }
        postServer(title);
        return result;
      });
    },
    checkStar: function(title) {
      var i, result, stared_title;
      result = true;
      i = 0;
      while (i < stars.length) {
        stared_title = stars[i].title;
        if (stared_title === title) {
          result = false;
          break;
        }
        i++;
      }
      return result;
    }
  };
});

angular.module('gyazzapp.model.todos', []).factory('Todos', function($http, GITHUB_MASUILAB_TODO_API_URL) {
  return {
    getTodos: function() {
      return $.ajax({
        url: GITHUB_MASUILAB_TODO_API_URL
      }).then(function(data) {
        var i, todos;
        i = 0;
        todos = [];
        $.each(data, function(i, value) {
          var todo;
          todo = {
            id: i,
            number: value['number'],
            title: value['title'],
            url: value['html_url'],
            user_name: value['user']['login'],
            user_icon: value['user']['avatar_url'],
            body: value['body'],
            labels: value['labels']
          };
          return todos.push(todo);
        });
        return todos;
      });
    }
  };
});

angular.module('gyazzapp.model.user', []).factory('User', function($http, $rootScope, $cordovaToast, GYAZZ_APP_BACKEND_URL) {
  return {
    register: function(platform) {
      var name;
      name = 'UserID' + Math.floor(Math.random() * (999999 - 100000));
      return $.ajax({
        url: GYAZZ_APP_BACKEND_URL + '/users',
        type: 'POST',
        data: {
          name: name,
          platform: platform
        }
      }).then(function(data) {
        $cordovaToast.show('ユーザー登録完了', 'short', 'center');
        localStorage.setItem('user_id', data._id);
        localStorage.setItem('session_key', data.session_key);
        if (platform === 'ios') {
          $rootScope.registerIOS();
        } else if (platform === 'android') {
          $rootScope.registerAndroid();
        }
        return data;
      });
    }
  };
});
