angular.module('starter.services', [])

.constant('GYAZZ_URL', 'http://gyazz.com/')
.constant('GYAZZ_WIKI_NAME', 'Hikaru')

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
.factory('Stars', function($http, GYAZZ_URL, GYAZZ_WIKI_NAME, DB) {

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
      return DB.query('INSERT INTO TestTable (title) VALUES ("'+title+'")')
        .then(function(result){
            var star = {
              id : result.insertId,
              title : title,
              //created : result.rows.item(i).created
            }
            stars.unshift(star);
            return result;
        });
    },
    removeStar: function(title) {
      return DB.query('DELETE FROM TestTable WHERE title = "'+title+'"')
        .then(function(result){
            for (var i=0; i<stars.length; i++){
              var remove_title = stars[i].title;
              if(remove_title == title) {
                stars.splice(i, 1);
                break;
              }
            }
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


  // Gyazzのページ一覧を取得する
  return {
    writePage: function(title, data) {
      return $.ajax({
          type: "POST",
          url: GYAZZ_URL + '__write',
          data: {
              name: GYAZZ_WIKI_NAME,
              title: title,
              orig_md5: 'ec0c02c2884ec60d59cb38ec711e34f4',
              data: data
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
        url: GYAZZ_URL + GYAZZ_WIKI_NAME,
        // xhrFields: {
        //   withCredentials: true
        // },
        // headers: {
        //   "Authorization": "Basic cGl0ZWNhbjptYXN1MWxhYg=="
        // }
      }).then(function(data) {
          var i = 0;
          var pages = [];
          $(data).find('.tag').each(function() {
            var gyazz_page = {
              id : i,
              title : $(this).text()
            }
            pages.push(gyazz_page);
            if(i == 50) {
              return false;
            }
            i++;
          });
          return pages
        });
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
        // xhrFields: {
        //   withCredentials: true
        // },
        // headers: {
        //   "Authorization": "Basic cGl0ZWNhbjptYXN1MWxhYg=="
        // }
      }).then(function(data) {
          var pageDetail = [];

          $.each(data.data, function(i, value) {
            var text = value;// ng-blur="endEditMode()"
            var original_data = '<label class="item item-input raw-textarea" style="display:none;"><textarea class="original_data" ng-model="gyazz'+i+'" ng-init="gyazz'+i+'=\''+text+'\'" ng-change="onInputText($eve)" ng-blur="endEditMode()"></textarea></label>';
            // text = '<span class="conversion_text">' + text + '</span>' + original_data;
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
        // トリプルカッコに該当する場合
        if(text.match(/\[\[\[/g)) {
            var t = text.replace(/\[\[\[*(.*?)>*\]\]\]/g,'$1');
            // 画像URLの場合は縮小したimgタグに変換
            if(t.match(/http[s]?\:\/\/[\w\+\$\;\?\.\%\,\!\#\~\*\/\:\@\&\\\=\_\-]+(jpg|jpeg|gif|png|bmp)/g)) {
              text = text.replace(/\[\[\[(.*?)\]\]\]/g, '<img src="$1" class="mini_img">')
            } else {
              // 文字列の場合は太字への変換
              text = text.replace(/\[\[\[(.*?)\]\]\]/g, '<b>$1</b>')
            }
        }
        // ダブルカッコに該当する場合
        if(text.match(/\[\[/g)) {
            var t = text.replace(/\[\[\[*(.*?)>*\]\]\]/g,'$1');
            // 画像URLの場合はimgタグに変換
            if(t.match(/http[s]?\:\/\/[\w\+\$\;\?\.\%\,\!\#\~\*\/\:\@\&\\\=\_\-]+(jpg|jpeg|gif|png|bmp)/g)) {
              text = text.replace(/\[\[(.*?)\]\]/g, '<img src="$1">')
            } else if(t.match(/(http[s]?):\/\/.+/)) {
              if(t.match(/^ +/)) {
                // 文字付きリンクの場合は、変換(空白がある場合)
                text = text.replace(/\[\[(.*?) (.*?)\]\]/g, '<a href="$1" class="gyazz_link">$2</a>');
              } else {
                // URLの場合はリンクに変換
                text = text.replace(/\[\[(.*?)\]\]/g, '<div class="button" ng-click="openWebPage(\'$1\')">$1</div>')
              }
            } else {
              // 普通の文字列の場合は、Gyazzページヘのリンクにする
              //href="#/tab/pagelist/pages/$1"
              text = text.replace(/\[\[(.*?)\]\]/g, '<span class="gyazz_link" ng-click="goNextPage(\'$1\')">$1</span>');
            }
        }
        // 先頭の空白をインデントに変換する
        if(text.match(/^ +/)) {
          // 先頭から連続した空白のインデントは未実装
          text = text.replace(/^ +/g, '<span class="indent icon ion-arrow-right-b"></span>');
        } else if(!text.match(/\S/g)) {
          // 大見出し（空白なし）の場合
          text = '';
        } else {
          text = '<span class="caption">' + text + '</span>';
        }
        return text
    },
    getRandomPageDetail: function() {
      return $.ajax({
        url: GYAZZ_URL+GYAZZ_WIKI_NAME+'/__random',
        // xhrFields: {
        //   withCredentials: true
        // },
        // headers: {
        //   "Authorization": "Basic cGl0ZWNhbjptYXN1MWxhYg=="
        // }
      }).then(function(data) {
        var title = $(data).find('#title').text();
            title = title.replace(/[\n\r]/g,"")
            title = title.replace(/^\s+|\s+$/g, "");

          return title
      });
    },
    searchPage: function(query) {
      var results = [];
      return $.ajax({
        url: GYAZZ_URL+'__search/'+GYAZZ_WIKI_NAME+'?q='+query,
        // xhrFields: {
        //   withCredentials: true
        // },
        // headers: {
        //   "Authorization": "Basic cGl0ZWNhbjptYXN1MWxhYg=="
        // }
      }).then(function(data) {
        var i = 0;
        $(data).find('.tag').each(function() {
          var result = {
            id : i,
            title : $(this).text()
          }
          results.push(result);
          i++;
        });
        return results
      });
    }
  };
});
