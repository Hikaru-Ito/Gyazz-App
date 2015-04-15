angular.module('starter.services', [])

.factory('Pages', function($http) {

  // Gyazzのページ一覧を取得する
  var pages = [];

  // http://feed.rssad.jp/rss/gigazine/rss_atom
  // http://gyazz.masuilab.org/%E5%A2%97%E4%BA%95%E7%A0%94
  // http://gyazz.com/Gyazz/

  return {
    getPages: function() {
      return $.ajax({
        url: 'http://gyazz.com/Gyazz/',
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
    getPage: function(pageId) {
      console.log(pages);
      for (var i = 0; i < pages.length; i++) {
        if (pages[i].id === parseInt(pageId)) {
          return pages[i];
        }
      }
      return null;
    },
    getPageDetail: function(pageTitle) {
      return $.ajax({
        url: 'http://gyazz.com/Gyazz/'+pageTitle+'/json',
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
            console.log(value);

            var text = value;
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
                    } else if(t.match(/(http|ftp):\/\/.+/)) {
                      if(t.match(/^ +/)) {
                        // 文字付きリンクの場合は、変換(空白がある場合)
                        text = text.replace(/\[\[(.*?) (.*?)\]\]/g, '<a href="$1">$2</a>');
                      } else {
                        // URLの場合はリンクに変換
                        text = text.replace(/\[\[(.*?)\]\]/g, '<a href="$1">$1</a>')
                      }
                    } else {
                      // 普通の文字列の場合は、Gyazzページヘのリンクにする
                      text = text.replace(/\[\[(.*?)\]\]/g, '<a href="#/tab">$1</a>');
                    }
                }
                // 先頭の空白をインデントに変換する
                if(text.match(/^ +/)) {
                  // 先頭から連続した空白のインデントは未実装
                  text = text.replace(/^ +/g, '□');
                }


            // 配列に再置換
            pageDetail.push(text);
          });

          return pageDetail
      });
    }
  };
});
