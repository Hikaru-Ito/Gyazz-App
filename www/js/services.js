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
.factory('Stars', function($http, GYAZZ_URL, GYAZZ_WIKI_NAME) {
  return {
    getStars: function() {
      var stars = [
        {
          id:1,
          title:'テストスター',
          created:'2015-04-22'
        },
        {
          id:2,
          title:'テストスター2',
          created:'2015-04-23'
        }];
      return stars
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
              text = text.replace(/\[\[(.*?)\]\]/g, '<a href="#/tab/pagelist/pages/$1" class="gyazz_link" ng-click="goNextPage()">$1</a>');
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
    }
  };
});
