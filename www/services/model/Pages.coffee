angular.module('gyazzapp.model.pages', [])
.factory 'Pages', ($http, GYAZZ_URL, GYAZZ_WIKI_NAME) ->

  # ページリストの配列を定義
  pages = []
  results = []

  # GyazzTag関数の定義
  gt = undefined
  gt = new GyazzTag

  return {

    # ページを更新する
    writePage: (title, data) ->
      $.ajax
        type: 'POST'
        url: GYAZZ_URL + '__write'
        data:
          name: GYAZZ_WIKI_NAME
          title: title
          data: data
        xhrFields: withCredentials: true
        headers: 'Authorization': 'Basic cGl0ZWNhbjptYXN1MWxhYg=='
      .done (data) ->
        data
      .fail (data) ->
        console.log '書き込み失敗'
        data


    # ページリストを取得する（ページリストAPIを使用）
    getPages: ->
      $.ajax
        url: GYAZZ_URL + GYAZZ_WIKI_NAME + '/__list'
        xhrFields: withCredentials: true
        headers: 'Authorization': 'Basic cGl0ZWNhbjptYXN1MWxhYg=='
        timeout: 5000
      .then (data) ->
        i = 0
        first_pages = []
        $.each data.data, (i, value) ->
          title = value['_id']
          gyazz_page =
            id: i
            title: title
          if i < 25
            first_pages.push gyazz_page
          pages.push gyazz_page

        return first_pages


    # ページリストを取得（RSSを使用）
    getPagesFromRss: ->
      $.ajax
        url: GYAZZ_URL + GYAZZ_WIKI_NAME + '/rss.xml'
        xhrFields: withCredentials: true
        headers: 'Authorization': 'Basic cGl0ZWNhbjptYXN1MWxhYg=='
      .then (data) ->
        i = 0
        pages = []
        $(data).find('item').each ->
          gyazz_page =
            id: i
            title: $(this).find('title').text()
          pages.push gyazz_page
          i++
        return pages


    # ページリストを追加取得
    getMorePages: (id) ->
      more_pages = []
      id = Number(id)
      i = 0
      while i < pages.length
        if i > id and i < id + 25
          more_pages.push pages[i]
        i++
      return more_pages


    # ページタイトルを返す(なんだこれ)
    getPage: (pageTitle) ->
      page = title: pageTitle
      return page


    # ページ内容を、変換して返す
    getPageDetail: (pageTitle) ->
      $.ajax
        url: GYAZZ_URL + GYAZZ_WIKI_NAME + '/' + pageTitle + '/json'
        xhrFields: withCredentials: true
        headers: 'Authorization': 'Basic cGl0ZWNhbjptYXN1MWxhYg=='
      .then (data) ->
        pageDetail = []
        $.each data.data, (i, value) ->
          text = value
          original_data = '<label class="item item-input raw-textarea" style="display:none;"><textarea class="original_data" ng-model="gyazz' + i + '" ng-init="gyazz' + i + '=\'' + text + '\'" ng-change="onInputText($eve)" ng-blur="endEditMode()" ng-trim="false"></textarea></label>'
          text = '<span class="conversion_text htmlData" content="transParagraph(gyazz' + i + ')"></span>' + original_data
          # 配列に追加
          pageDetail.push text

        return pageDetail


    # Gyazo記法をGyazzAppHTMLに変換する
    transParagraph: (text) ->
      tag = gt.expand(text, GYAZZ_WIKI_NAME, null, null, GYAZZ_URL)
      _indent = tag.match(/^( *)/)[1].length
      tag = tag.replace(/^ +/, '')
      data = '<p class="indent indent' + _indent + '">' + tag + '</p>'
      return data


    # ページを1つランダムに取得する(スクレイピング)
    getRandomPageDetail: ->
      $.ajax
        url: GYAZZ_URL + GYAZZ_WIKI_NAME + '/__random'
        xhrFields: withCredentials: true
        headers: 'Authorization': 'Basic cGl0ZWNhbjptYXN1MWxhYg=='
      .then (data) ->
        title = $(data).find('#title').text()
        title = title.replace(/[\n\r]/g, '')
        title = title.replace(/^\s+|\s+$/g, '')
        return title


    # キーワードでページを検索する
    searchPage: (query) ->
      results = []
      $.ajax
        url: GYAZZ_URL + GYAZZ_WIKI_NAME + '/__search/?q=' + query
        xhrFields: withCredentials: true
        headers: 'Authorization': 'Basic cGl0ZWNhbjptYXN1MWxhYg=='
      .then (data) ->
        first_results = []
        i = 0
        $(data).find('.tag').each ->
          result =
            id: i
            title: $(this).text()
          results.push result
          if i < 25
            first_results.push result
          i++

        return first_results


    # 検索結果を追加取得する
    getMoreSearch: (id) ->
      more_results = []
      id = Number(id)
      i = 0
      while i < results.length
        if i > id and i < id + 25
          more_results.push results[i]
        i++
      more_results

  }