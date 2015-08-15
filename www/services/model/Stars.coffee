angular.module('gyazzapp.model.stars', [])
.factory 'Stars', ($http, $cordovaToast, GYAZZ_URL, GYAZZ_APP_BACKEND_URL, GYAZZ_WIKI_NAME, DB) ->

  # スターはローカル変数にも格納しておく
  stars = []

  # データベースからスター一覧を取得し、変数に格納しておく
  init = ->
    DB.query('SELECT * FROM TestTable ORDER BY created DESC').then (result) ->
      stars = []
      len = result.rows.length
      i = 0
      while i < len
        #stars = new Array;
        star =
          id: result.rows.item(i).id
          title: result.rows.item(i).title
          created: result.rows.item(i).created
        stars.push star
        i++
      stars
    return

  do init


  return {

    # スター一覧をデータベースから取得
    getStars: ->
      DB.query('SELECT * FROM TestTable ORDER BY created DESC').then (result) ->
        stars = []
        len = result.rows.length
        i = 0
        while i < len
          #stars = new Array;
          star =
            id: result.rows.item(i).id
            title: result.rows.item(i).title
            created: result.rows.item(i).created
          stars.push star
          i++
        stars

    # スターを追加するメソッド
    addStar: (title) ->

      #️ サーバー送信処理
      postServer = (title) ->
        $.ajax(
          type: 'POST'
          url: GYAZZ_APP_BACKEND_URL + '/stars/add'
          data:
            session_key: localStorage.getItem 'session_key'
            page_name: title
        ).done(->
        ).fail ->
          $cordovaToast.show 'スター情報のサーバー同期に失敗しました', 'short', 'center'

      # DB処理
      DB.query('INSERT INTO TestTable (title) VALUES ("' + title + '")').then (result) ->
        star =
          id: result.insertId
          title: title
        stars.unshift star
        postServer title
        result


    # スター削除処理
    removeStar: (title) ->

      #️ サーバー送信処理
      postServer = (title) ->
        $.ajax(
          type: 'POST'
          url: GYAZZ_APP_BACKEND_URL + '/stars/remove'
          data:
            session_key: localStorage.getItem 'session_key'
            page_name: title
        ).done(->
        ).fail ->
          $cordovaToast.show 'スター情報のサーバー同期に失敗しました', 'short', 'center'

      # DB同期
      DB.query('DELETE FROM TestTable WHERE title = "' + title + '"').then (result) ->
        i = 0
        while i < stars.length
          remove_title = stars[i].title
          if remove_title == title
            stars.splice i, 1
            break
          i++
        postServer title
        result


    # スターされているかチェック
    checkStar: (title) ->
      result = true
      i = 0
      while i < stars.length
        stared_title = stars[i].title
        if stared_title == title
          result = false
          break
        i++
      result

  }
