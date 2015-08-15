angular.module('gyazzapp.controllers.page', [])

.controller 'PageCtrl', ($scope, $state, $stateParams, $cordovaVibration, $cordovaInAppBrowser, $cordovaToast, $cordovaGoogleAnalytics, $ionicModal, $timeout, $location, Pages, Stars) ->

  # 初期変数定義
  $scope.page = Pages.getPage $stateParams.pageTitle
  $scope.isLoading = true
  $scope.isWriting = false
  $scope.beforeEditText = null
  $scope.isEditing = false
  $scope.starAni = false

  # Google Analyctis
  $cordovaGoogleAnalytics.trackView $scope.page.title

  # ページ本文詳細を通信
  Pages.getPageDetail($scope.page.title).then (detail) ->
    $scope.pageDetail = detail
    $scope.isLoading = false
    $scope.$apply()

  # InAppBrowser起動関数
  $scope.openWebPage = (url) ->
    options =
      location: 'yes'
      clearcache: 'yes'
      toolbar: 'yes'
    $cordovaInAppBrowser.open url, '_blank', options

  # 別ページ遷移
  $scope.goNextPage = (title) ->
    this_page = $location.path()
    # 現在のタブのstateを取得
    tab_name = this_page.split('/')
    $location.path '/tab/' + tab_name[2] + '/pages/' + title

  # スターの確認
  $scope.checkStar = ->
    Stars.checkStar $scope.page.title

  # スターに追加
  $scope.addStar = ->
    Stars.addStar($scope.page.title).then (detail) ->
      $cordovaVibration.vibrate 400
    $scope.starAni = true
    $timeout ->
      $scope.starAni = false
    , 1600
    $cordovaToast.show 'スターをつけました', 'short', 'center'
    $cordovaGoogleAnalytics.trackEvent 'Star', 'AddStar', 'add', 100

  # スター削除
  $scope.removeStar = ->
    Stars.removeStar($scope.page.title).then (detail) ->
    $cordovaGoogleAnalytics.trackEvent 'Star', 'RemoveStar', 'remove', 100

  # スター追加/削除 Toggle
  $scope.changeStar = ->
    if $scope.checkStar() is true then $scope.addStar() else $scope.removeStar()

  # Gyazz記法変換
  $scope.transParagraph = (rawData) ->
    Pages.transParagraph rawData

  # PullToRefresh
  $scope.doRefresh = ->
    Pages.getPageDetail($scope.page.title).then (detail) ->
      $scope.pageDetail = detail
      $scope.$broadcast 'scroll.refreshComplete'

  # 初回Paragraph挿入
  $scope.insertFirstParagraph = ->
    insertHtmlData = '<span class="conversion_text htmlData" content="transParagraph(gyazzNew)"></span><label class="item item-input raw-textarea" style="display:none;"><textarea class="original_data new_gyazz_data" ng-blur="endEditMode()" ng-trim="false" ng-model="gyazzNew" ng-change="onInputText($eve)" ng-init="gyazzNew=\'\'"></textarea></label>'
    $scope.pageDetail.push insertHtmlData
    $timeout ->
      _this = $('ion-view[nav-view="active"] .new_gyazz_data').closest('.paragraphWrapper')
      $scope.isEditing = true
      # 現在編集中の要素のロングタップの場合はキャンセルする
      if !_this.hasClass('isEditing')
        # 現在編集モードの他の項目があれば終了させる
        $scope.endEditMode()
        # 編集中のボックスにクラスをつけておく
        _this.addClass 'isEditing'
        # テキストを一旦非表示
        _this.find('.conversion_text').hide()
        # フォームを表示
        _this.find('.raw-textarea').show()
        # 変更前内容を記憶
        $scope.beforeEditText = _this.find('textarea').val()
        # フォームにフォーカスを当てる
        $timeout (->
          _this.find('textarea').focus()
        ), 0
    , 10

  $scope.openModal = ->
    $scope.modal.show()

  $scope.closeModal = ->
    $scope.modal.hide()

  # 入力中にスワイプことで記号挿入
  $scope.swipeRight = ->
    if $scope.isEditing
      $scope.insertGyazzMark '['
      # コメントを解除すれば、スワイプでカーソル移動ができるようになる
      # var target_area = $(':focus');
      #     target_area = target_area.get(0);
      # var o = target_area;
      # var p = o.selectionStart;
      # var np = p + 1;
      # o.setSelectionRange(np, np);
      # o.focus();

  $scope.swipeLeft = ->
    if $scope.isEditing
      $scope.insertGyazzMark ']'
      # コメントを解除すれば、スワイプでカーソル移動ができるようになる
      # var target_area = $(':focus');
      #     target_area = target_area.get(0);
      # var o = target_area;
      # var p = o.selectionStart;
      # var np = p - 1;
      # o.setSelectionRange(np, np);
      # o.focus();

  # 記号挿入関数
  $scope.insertGyazzMark = (mark) ->
    target_area = $(':focus')
    target_area = target_area.get(0)
    o = target_area
    s = o.value
    p = o.selectionStart
    np = p + mark.length
    o.value = s.substr(0, p) + mark + s.substr(p)
    o.setSelectionRange np, np
    o.focus()

  # テキストエリア自動可変
  # テキストエリアの入力量に応じてテキストエリアサイズを自動で変更する
  $scope.onInputText = (evt) ->
    _this = event
    if _this.currentTarget.scrollHeight > _this.currentTarget.offsetHeight
      $(_this.currentTarget).height _this.currentTarget.scrollHeight
    else
      lineHeight = Number($(_this.currentTarget).css('lineHeight').split('px')[0])
      loop
        $(_this.currentTarget).height $(_this.currentTarget).height() - lineHeight
        if _this.currentTarget.scrollHeight > _this.currentTarget.offsetHeight
          $(_this.currentTarget).height _this.currentTarget.scrollHeight
          break


  # ページを編集モードに切り替え
  $scope.editMode = (event) ->
    $scope.isEditing = true
    _this = $(event.currentTarget)
    # 現在編集中の要素のロングタップの場合はキャンセルする
    if !_this.hasClass('isEditing')
      # 現在編集モードの他の項目があれば終了させる
      $scope.endEditMode()
      # 編集中のボックスにクラスをつけておく
      _this.addClass 'isEditing'
      # テキストを一旦非表示
      _this.find('.conversion_text').hide()
      # フォームを表示
      _this.find('.raw-textarea').show()
      # 変更前内容を記憶
      $scope.beforeEditText = _this.find('textarea').val()
      # フォームにフォーカスを当てる
      $timeout ->
        _this.find('textarea').focus()
      , 0
    # Google Analyctis
    $cordovaGoogleAnalytics.trackEvent 'Paragraph', 'LongTapEdit', 'start', 100


  # 編集モード終了（全要素に適応）
  $scope.endEditMode = ->
    # 変更内容を書き込む
    isEditing = $('.isEditing')
    edit_data = isEditing.find('textarea').val()
    isEditing.removeClass 'isEditing'
    if edit_data != undefined
      $scope.isEditing = false

      # 変更があるか比較する
      if edit_data != $scope.beforeEditText
        # 最初のロングタップ時にも動作するため判別
        $scope.isWriting = true
        # ページの内容を全取得して連結させる
        page_all_data = ''
        $('ion-nav-view[nav-view="active"] ion-view[nav-view="active"] .raw-textarea .original_data').each (i) ->
          pageDetailNumber = i
          text_data = $(this).val()
          if text_data is ''
            $(this).closest('.paragraphWrapper').remove()
            # パラグラフを削除
            return true
          # テキストエリアの中に改行がある場合、切り取って、HTML付加してpageDetail配列に追加
          if text_data.match(/\r\n/) or text_data.match(/(\n|\r)/)
            arr = text_data.split(/\r\n|\r|\n/)
            i = 0
            while i < arr.length
              insertNumber = pageDetailNumber + i
              content_num = $scope.pageDetail.length
              insertHtmlData = '<span class="conversion_text htmlData" content="transParagraph(gyazz' + content_num + ')"></span><label class="item item-input raw-textarea" style="display:none;"><textarea class="original_data" ng-blur="endEditMode()" ng-trim="false" ng-model="gyazz' + content_num + '" ng-init="gyazz' + content_num + '=\'' + arr[i] + '\'" ng-change="onInputText($eve)"></textarea></label>'
              $scope.pageDetail.splice insertNumber + 1, 0, insertHtmlData
              i++
            # 編集前のパラグラフを削除
            $scope.pageDetail.splice pageDetailNumber, 1
          page_all_data += text_data
          page_all_data += '\n'
          # 最後のeachにこれを足すと、編集するごとに末尾に謎の空白ができてしまう

        Pages.writePage($scope.page.title, page_all_data).then (data) ->
          $timeout ->
            $scope.isWriting = false
            return
          , 100
          return

        # Google Analyctis
        $cordovaGoogleAnalytics.trackEvent 'Paragraph', 'Write', 'end', 100

      else
        $scope.isWriting = false

    texts_area = $('.paragraphWrapper')
    # テキストを一旦非表示
    texts_area.find('.conversion_text').show()
    # フォームを表示
    texts_area.find('.raw-textarea').hide()
    # フォームのフォーカスを外す
    $timeout ->
      texts_area.find('textarea').blur()
    , 0