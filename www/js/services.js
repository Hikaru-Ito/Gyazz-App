angular.module('gyazzapp.services', [])

.constant('GYAZZ_URL', 'http://gyazz.masuilab.org/')
.constant('GYAZZ_WIKI_NAME', '増井研')
.constant('GITHUB_ISSUE_API_URL', 'https://api.github.com/repos/Hikaru-Ito/Gyazz-App/issues')
.constant('GITHUB_MASUILAB_TODO_API_URL', 'https://api.github.com/repos/masuilab/todo/issues')
.value('ANDROID_GCM_SENDER_ID', '545984238773')
.value('PARSE_API_URL', 'https://api.parse.com/1/installations')
.value('X_Parse_Application_Id', 'pVATfByzSVGuH1cfC7q9sdfZhOSBBZjoToIRVXli')
.value('X_Parse_REST_API_Key', 'lyQJVyUEVzJCqq2A5HYNRx5ytlSuNtbjlqkwA6R6')
.value('GYAZZ_APP_BACKEND_URL', 'http://gyazz-app-api.herokuapp.com')

// .constant('GYAZZ_URL', 'http://gyazz.com/')
// .constant('GYAZZ_WIKI_NAME', 'Hikaru')
.filter('toAgo', function() {
  return function(input) {
  var d = input;
  var nD = Math.floor( new Date().getTime() / 1000 );
  var diffTime = nD - d;
  if(diffTime > 31536000) {
    // 年前に変換
    diffTime = Math.floor(diffTime / 31536000);
    diffTime = diffTime+'年前'
  } else if(diffTime > 86400) {
    // 日前に変換
    diffTime = Math.floor(diffTime / 86400);
    diffTime = diffTime+'日前'

  } else if(diffTime > 3600) {
    // 時間前に変換
    diffTime = Math.floor(diffTime / 3600);
    diffTime = diffTime+'時間前'

  } else if(diffTime > 60) {
    // 分前に変換
    diffTime = Math.floor(diffTime / 60);
    diffTime = diffTime+'分前'
  } else {
    // 秒前に変換
    diffTime = diffTime+'秒前'
  }
  return diffTime;
  };
})
.directive('htmlData', function($compile, $parse) {
    return {
      restrict: 'C',
      link: function(scope, element, attr) {
        scope.$watch(attr.content, function() {
          element.html($parse(attr.content)(scope));
          $compile(element.contents())(scope);
        }, true);
      }
    }
  })
.factory('User', function($http, $rootScope, $cordovaToast, GYAZZ_APP_BACKEND_URL) {

  return {
    register : function(platform) {
      // すでに登録されている場合を分岐しなければならない
      var name = 'UserID'+Math.floor(Math.random() * (999999 - 100000))
      $.ajax({
          url: GYAZZ_APP_BACKEND_URL+'/users',
          type: "POST",
          data :{
            name : name,
            platform: platform
          }
      }).then(function(data){
          $cordovaToast.show('ユーザー登録完了', 'short', 'center');
          localStorage.setItem('user_id', data._id);
          localStorage.setItem('session_key', data.session_key);
          if(platform == 'ios') {
            $rootScope.registerIOS();
          } else if(platform == 'android') {
            $rootScope.registerAndroid();
          }
          return data
      });
    }
  }
})
.factory('PushNotification', function($http, $cordovaToast, ANDROID_GCM_SENDER_ID, PARSE_API_URL, X_Parse_Application_Id, X_Parse_REST_API_Key) {

  return {
    registerDeviceID: function(deviceID, platform) {
      localStorage.setItem('deviceID', deviceID);
      alert('デバイスデータ登録開始'+deviceID);

      var channel_id = "GyazzUserID"+localStorage.getItem('user_id');
      if(platform == 'ios') {
        $.ajax({
            url: PARSE_API_URL,
            type: "POST",
            headers: {
              "X-Parse-Application-Id": X_Parse_Application_Id,
              "X-Parse-REST-API-Key": X_Parse_REST_API_Key
            },
            contentType : "application/json",
            data : JSON.stringify({
                deviceType: platform,
                deviceToken: deviceID,
                channels: [
                  channel_id,
                  "ALLRECIEVE"
                ]
              })
        }).done(function(data){
            $cordovaToast.show('デバイスデータ登録完了', 'short', 'center');
            return true
        }).fail(function(data){
            return false
        });
      }
      if(platform == 'android') {
        $.ajax({
            url: PARSE_API_URL,
            type: "POST",
            headers: {
              "X-Parse-Application-Id": X_Parse_Application_Id,
              "X-Parse-REST-API-Key": X_Parse_REST_API_Key
            },
            contentType : "application/json",
            data : JSON.stringify({
                deviceType: platform,
                deviceToken: deviceID,
                GCMSenderId: ANDROID_GCM_SENDER_ID,
                pushType : "gcm",
                channels: [
                  channel_id,
                  "ALLRECIEVE"
                ]
              })
        }).done(function(data){
            $cordovaToast.show('デバイスデータ登録完了', 'short', 'center');
            console.log('デバイスデータ登録完了');
            return true
        }).fail(function(data){
            return false
        });
      }
    }
  }
})
.factory('DB', function($q) {
    var db;
    var self = this;

    function errorCB(err) {
      console.log("SQL 実行中にエラーが発生しました: "+err.code);
    }
    function initQuery(tx) {
        //tx.executeSql('DROP TABLE IF EXISTS TestTable');
        tx.executeSql('CREATE TABLE IF NOT EXISTS TestTable (id integer primary key autoincrement, title text unique, created datetime default current_timestamp)');
    }
    function successCB() {
    }
    db = window.openDatabase("Database", "1.0", "TestDatabase", 200000);
    db.transaction(initQuery, errorCB, successCB);

    self.query = function(query) {
        var deferred = $q.defer();
        db.transaction(function(transaction) {
            transaction.executeSql(query, [], function(transaction, result) {
                deferred.resolve(result);
            }, function(transaction, error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    };
    return self;
})
.factory('Login', function($http, GYAZZ_URL, GYAZZ_WIKI_NAME) {
  return {
    // checkLogin: function(username, pass) {
    //   var encode = username+':'+pass;
    //   return $.ajax({
    //       type: "GET",
    //       url: GYAZZ_URL + '__write',
    //       xhrFields: {
    //         withCredentials: true
    //       },
    //       headers: {
    //         "Authorization": "Basic cGl0ZWNhbjptYXN1MWxhYg=="
    //       }
    //       }).done(function(data){
    //         console.log('ログイン成功');
    //         return true;
    //       }).fail(function(data){
    //         console.log('ログイン失敗');
    //         return false;
    //   });
    //}
  }
})
.factory('Stars', function($http, $cordovaToast, GYAZZ_URL, GYAZZ_APP_BACKEND_URL, GYAZZ_WIKI_NAME, DB) {

  var stars = [];

  var init = function() {
    DB.query('SELECT * FROM TestTable ORDER BY created DESC')
      .then(function(result){
          stars = [];
          var len = result.rows.length;
          for (var i=0; i<len; i++){
            //stars = new Array;
            var star = {
              id : result.rows.item(i).id,
              title : result.rows.item(i).title,
              created : result.rows.item(i).created
            }
            stars.push(star);
          }
          return stars;
      });
  }
  init();

  return {
    getStars: function() {
      return DB.query('SELECT * FROM TestTable ORDER BY created DESC')
        .then(function(result){
            stars = [];
            var len = result.rows.length;
            for (var i=0; i<len; i++){
              //stars = new Array;
              var star = {
                id : result.rows.item(i).id,
                title : result.rows.item(i).title,
                created : result.rows.item(i).created
              }
              stars.push(star);
            }
            return stars;
        });
    },
    addStar: function(title) {
      function postServer(title) {
        $.ajax({
          type: "POST",
          url: GYAZZ_APP_BACKEND_URL+'/stars/add',
          data: {
              session_key: localStorage.getItem('session_key'),
              page_name: title,
          }
        }).done(function() {
        }).fail(function() {
          $cordovaToast.show('スター情報のサーバー同期に失敗しました', 'short', 'center');
        })
      }
      return DB.query('INSERT INTO TestTable (title) VALUES ("'+title+'")')
        .then(function(result){
            var star = {
              id : result.insertId,
              title : title,
              //created : result.rows.item(i).created
            }
            stars.unshift(star);
            postServer(title);
            return result;
        });
    },
    removeStar: function(title) {
      function postServer(title) {
        $.ajax({
          type: "POST",
          url: GYAZZ_APP_BACKEND_URL+'/stars/remove',
          data: {
              session_key: localStorage.getItem('session_key'),
              page_name: title,
          }
        }).done(function() {
        }).fail(function() {
          $cordovaToast.show('スター情報のサーバー同期に失敗しました', 'short', 'center');
        })
      }
      return DB.query('DELETE FROM TestTable WHERE title = "'+title+'"')
        .then(function(result){
            for (var i=0; i<stars.length; i++){
              var remove_title = stars[i].title;
              if(remove_title == title) {
                stars.splice(i, 1);
                break;
              }
            }
            postServer(title);
            return result;
        });
    },
    checkStar: function(title) {
        var result = true;
        for (var i=0; i<stars.length; i++){
          var stared_title = stars[i].title;
          if(stared_title == title) {
            result = false;
            break;
          }
        }
        return result
    }
  }
})
.factory('Pages', function($http, GYAZZ_URL, GYAZZ_WIKI_NAME) {

  // ページリストの配列を定義
  var pages = [];
  var results = [];
  // GyazzTag関数の定義
  var gt;
      gt = new GyazzTag;

  // Gyazzのページ一覧を取得する
  return {
    writePage: function(title, data) {
      return $.ajax({
          type: "POST",
          url: GYAZZ_URL + '__write',
          data: {
              name: GYAZZ_WIKI_NAME,
              title: title,
              //orig_md5: 'ec0c02c2884ec60d59cb38ec711e34f4',
              data: data
          },
          xhrFields: {
            withCredentials: true
          },
          headers: {
            "Authorization": "Basic cGl0ZWNhbjptYXN1MWxhYg=="
          }
      }).done(function(data){
        return data;
      }).fail(function(data){
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
          "Authorization": "Basic cGl0ZWNhbjptYXN1MWxhYg=="
        },
        timeout:5000
      }).then(function(data) {
          var i = 0;
          var first_pages = [];

          $.each(data.data, function(i, value) {
            var title = value['_id'];
            var gyazz_page = {
              id : i,
              title : title
            }
            if(i < 25) {
              first_pages.push(gyazz_page);
            }
            pages.push(gyazz_page);
          });
          return first_pages
        });
    },
    getPagesFromRss: function() {
      return $.ajax({
        url: GYAZZ_URL + GYAZZ_WIKI_NAME + '/rss.xml',
        xhrFields: {
          withCredentials: true
        },
        headers: {
          "Authorization": "Basic cGl0ZWNhbjptYXN1MWxhYg=="
        }
      }).then(function(data) {
        var i = 0;
        pages = [];
        $(data).find('item').each(function() {
          var gyazz_page = {
            id : i,
            title : $(this).find('title').text()
          }
          pages.push(gyazz_page);
          i++;
        });
        return pages
      });
    },
    getMorePages: function(id) {
      var more_pages = [];
          id = Number(id);
      for (var i=0; i<pages.length; i++){
        if(i>id && i<(id+25)) {
          more_pages.push(pages[i]);
        }
      }
      return more_pages
    },
    getPage: function(pageTitle) {
      var page = {
        title : pageTitle
      }
      return page;
    },
    getPageDetail: function(pageTitle) {
      return $.ajax({
        url: GYAZZ_URL+GYAZZ_WIKI_NAME+'/'+pageTitle+'/json',
        xhrFields: {
          withCredentials: true
        },
        headers: {
          "Authorization": "Basic cGl0ZWNhbjptYXN1MWxhYg=="
        }
      }).then(function(data) {
          var pageDetail = [];

          $.each(data.data, function(i, value) {
            var text = value;
            var original_data = '<label class="item item-input raw-textarea" style="display:none;"><textarea class="original_data" ng-model="gyazz'+i+'" ng-init="gyazz'+i+'=\''+text+'\'" ng-change="onInputText($eve)" ng-blur="endEditMode()" ng-trim="false"></textarea></label>';
            text = '<span class="conversion_text htmlData" content="transParagraph(gyazz'+i+')"></span>' + original_data;

            // 配列に追加
            pageDetail.push(text);
          });

          return pageDetail
      });
    },
    transParagraph: function(text) {
        //
        // Gyazo記法をHTMLに変換する
        //
        var tag = gt.expand(text, GYAZZ_WIKI_NAME, null, null, GYAZZ_URL);
        var _indent = tag.match(/^( *)/)[1].length;
        tag = tag.replace(/^ +/, '');
        var data = '<p class="indent indent'+_indent+'">'+tag+'</p>';
        return data
    },
    getRandomPageDetail: function() {
      return $.ajax({
        url: GYAZZ_URL+GYAZZ_WIKI_NAME+'/__random',
        xhrFields: {
          withCredentials: true
        },
        headers: {
          "Authorization": "Basic cGl0ZWNhbjptYXN1MWxhYg=="
        }
      }).then(function(data) {
        var title = $(data).find('#title').text();
            title = title.replace(/[\n\r]/g,"")
            title = title.replace(/^\s+|\s+$/g, "");

          return title
      });
    },
    searchPage: function(query) {
      results = [];
      return $.ajax({
        url: GYAZZ_URL+GYAZZ_WIKI_NAME+'/__search/?q='+query,
        //url: GYAZZ_URL+'/__search/'+GYAZZ_WIKI_NAME+'?q='+query,

        xhrFields: {
          withCredentials: true
        },
        headers: {
          "Authorization": "Basic cGl0ZWNhbjptYXN1MWxhYg=="
        }
      }).then(function(data) {
        var first_results = [];
        var i = 0;
        $(data).find('.tag').each(function() {
          var result = {
            id : i,
            title : $(this).text()
          }
          results.push(result);
          if(i < 25) {
            first_results.push(result);
          }
          i++;
        });
        return first_results
      });
    },
    getMoreSearch: function(id) {
      var more_results = [];
          id = Number(id);
      for (var i=0; i<results.length; i++){
        if(i>id && i<(id+25)) {
          more_results.push(results[i]);
        }
      }
      return more_results
    }
  };
})
.factory('Issues', function($http, GITHUB_ISSUE_API_URL) {
  return {
    getIssues: function(label) {
      return $.ajax({
        url: GITHUB_ISSUE_API_URL + '?labels='+label,
      }).then(function(data) {
          var i = 0;
          var issues = [];
          $.each(data, function(i, value) {
            var issue = {
              id : i,
              number: value['number'],
              title : value['title'],
              url : value['html_url'],
              user_name : value['user']['login'],
              user_icon : value['user']['avatar_url'],
              body : value['body']
            }
            issues.push(issue);
          });
          return issues
        });
    },
    getIssue: function(title) {
      var issue = {
        title : title
      }
      return issue;
    }
  }
})
.factory('Todos', function($http, GITHUB_MASUILAB_TODO_API_URL) {
  return {
    getTodos: function() {
      return $.ajax({
        url: GITHUB_MASUILAB_TODO_API_URL,
      }).then(function(data) {
          var i = 0;
          var todos = [];
          $.each(data, function(i, value) {
            var todo = {
              id : i,
              number: value['number'],
              title : value['title'],
              url : value['html_url'],
              user_name : value['user']['login'],
              user_icon : value['user']['avatar_url'],
              body : value['body'],
              labels : value['labels']
            }
            todos.push(todo);
          });
          return todos
        });
    }
  }
})
.factory('Notifications', function($http, GYAZZ_APP_BACKEND_URL) {
  return {
    getLists: function() {
      return $.ajax({
        url: GYAZZ_APP_BACKEND_URL+'/notifications',
      }).then(function(data) {
          return data
        });
    }
  }
});
