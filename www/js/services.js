angular.module('starter.services', [])

.constant('GYAZZ_WIKI_URL', 'http://gyazz.com/Hikaru/')

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

.factory('Pages', function($http, GYAZZ_WIKI_URL) {

  // Gyazzのページ一覧を取得する
  var pages = [];


  return {
    writePages: function(title, data) {
      return null
    },
    getPages: function() {
      return $.ajax({
        url: GYAZZ_WIKI_URL,
        // xhrFields: {
        //   withCredentials: true
        // },
        // headers: {
        //   "Authorization": "Basic cGl0ZWNhbjptYXN1MWxhYg=="
        // }
      }).then(function(data) {
          var i = 0;
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
        url: GYAZZ_WIKI_URL+pageTitle+'/json',
        // xhrFields: {
        //   withCredentials: true
        // },
        // headers: {
        //   "Authorization": "Basic cGl0ZWNhbjptYXN1MWxhYg=="
        // }
      }).then(function(data) {
          var pageDetail = [];
          $.each(data.data, function(i, value) {
            // Gyazo記法をHTMLに変換する

            var text = value;
            var original_data = '<label class="item item-input raw-textarea" style="display:none;"><textarea class="original_data">'+text+'</textarea></label>';

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
                        text = text.replace(/\[\[(.*?) (.*?)\]\]/g, '<a href="$1">$2</a>');
                      } else {
                        // URLの場合はリンクに変換
                        text = text.replace(/\[\[(.*?)\]\]/g, '<div class="button" ng-click="openWebPage(\'$1\')">$1</div>')
                      }
                    } else {
                      // 普通の文字列の場合は、Gyazzページヘのリンクにする
                      text = text.replace(/\[\[(.*?)\]\]/g, '<a href="#/tab/pagelist/pages/$1">$1</a>');
                    }
                }
                // 先頭の空白をインデントに変換する
                if(text.match(/^ +/)) {
                  // 先頭から連続した空白のインデントは未実装
                  text = text.replace(/^ +/g, '□');
                }


            text = '<span class="conversion_text">' + text + '</span>' + original_data;

            // 配列に再置換
            pageDetail.push(text);
          });

          return pageDetail
      });
    }
  };
});
