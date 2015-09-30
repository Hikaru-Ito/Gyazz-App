angular.module('gyazzapp.run', [])

.run ($ionicPlatform, $location, $cordovaGoogleAnalytics, $ionicScrollDelegate, $cordovaClipboard, $rootScope, $cordovaPush, $cordovaToast, GYAZZ_URL, GYAZZ_WIKI_NAME, ANDROID_GCM_SENDER_ID, PushNotifications, User) ->

  $ionicPlatform.ready ->

    # Google Analytics
    $cordovaGoogleAnalytics.startTrackerWithId 'UA-62257533-1'
    $cordovaGoogleAnalytics.trackView 'Start v1.1.0'

    # キーボードとステータスバーの設定
    if window.cordova and window.cordova.plugins and window.cordova.plugins.Keyboard
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar true

    if window.StatusBar
      StatusBar.styleLightContent()

    # iOSのみ、ステータスバーでタップでスクロールを戻す
    if window.cordova and ionic.Platform.isIOS()
      window.addEventListener 'statusTap', ->
        $ionicScrollDelegate.scrollTop true


    # 新プッシュ通知プラグインの設定
    # このPushNotificationのインスタンスは、factoryのPushNotificationではない。
    # ネイティブAPIを呼び出すブリッジのプラグインのインスタンスである
    # 名前が競合していると使えない・・・
    # プラグインを変更するよりは、Factory側の定義を変更したほうがよさそう
    # PushNotification-FactoryをPushNotifications-Factoryに変更した
    # 関数化した
    $rootScope.PushNotificationInit = ->

      # 設定変数
      push = PushNotification.init {
        "android": {"senderID": ANDROID_GCM_SENDER_ID},
        "ios": {"alert": "true", "badge": "true", "sound": "true"},
        "windows": {}
      }

      # デバイストークンを取得したら、Factoryに流す
      push.on 'registration', (data) ->
        if ionic.Platform.isIOS()
          PushNotifications.registerDeviceID data.registrationId, 'ios'
        else if ionic.Platform.isAndroid()
          PushNotifications.registerDeviceID data.registrationId, 'android'
        console.log data.registrationId

      # foregroundでPush受信したら、トーストメッセージを出す
      push.on 'notification', (data) ->
        console.log JSON.stringify data
        $cordovaToast.show data.additionalData.data.alert, 'short', 'center'

      # エラーハンドラ
      push.on 'error', (e) ->
        console.log "プッシュ通知エラー : #{e}"


    # ユーザー登録を確認する
    # ユーザー登録していれば、Push通知のデバイストークン初期化
    # ユーザー登録していなければ、User-Factoryに登録を促す
    if !localStorage.getItem('user_id')
      if ionic.Platform.isIOS()
        User.register 'ios'
      else if ionic.Platform.isAndroid()
        User.register 'android'
    else
      $rootScope.PushNotificationInit()


    # クリップボードの中身を確認して処理するメソッド
    $rootScope.checkClipboardURL = ->
      $cordovaClipboard.paste().then (result) ->
        # GyazzページへのURLかどうかを確認する
        abc = GYAZZ_URL + GYAZZ_WIKI_NAME
        reg = new RegExp abc
        if result.match reg
          title = result.replace "#{GYAZZ_URL}#{GYAZZ_WIKI_NAME}/", ''
          $cordovaToast.show 'URLコピーされたページに移動しました', 'short', 'center'
          this_page = $location.path()
          tab_name = this_page.split '/'
          $location.path '/tab/' + tab_name[2] + '/pages/' + title
          # クリップボードの中身消す
          $cordovaClipboard.copy ''


    # アプリを立ち上げた時（インメモリのときも含めて）
    # クリップボードの確認をする
    document.addEventListener 'resume', ->
      $rootScope.checkClipboardURL()

    # ログインを確認する
    if !localStorage.getItem 'logined'
      $location.path '/login'
    else
      # URLコピーを確認
      $rootScope.checkClipboardURL()
