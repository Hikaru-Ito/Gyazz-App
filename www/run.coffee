angular.module('gyazzapp.run', [])

.run ($ionicPlatform, $location, $cordovaGoogleAnalytics, $ionicScrollDelegate, $cordovaClipboard, $rootScope, $cordovaPush, $cordovaToast, GYAZZ_URL, GYAZZ_WIKI_NAME, ANDROID_GCM_SENDER_ID, PushNotification, User) ->

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


    # プッシュ通知設定（iOS）
    $rootScope.registerIOS = ->
      # プッシュ通知受信時のイベント登録
      $rootScope.$on '$cordovaPush:notificationReceived', (event, notification) ->

        if notification.alert
          $cordovaToast.show notification.alert, 'short', 'center'

        if notification.sound
          snd = new Media event.sound
          snd.play()

        if notification.badge
          $cordovaPush.setBadgeNumber notification.badge

      iosConfig =
        'badge': true
        'sound': true
        'alert': true

      $cordovaPush.register(iosConfig).then (deviceToken) ->
        PushNotification.registerDeviceID deviceToken, 'ios'
      , (err) ->
        alert 'Registration error: ' + err


    # プッシュ通知設定（Android）
    $rootScope.registerAndroid = ->
      console.log 'Androidのプッシュ通知は未対応'


    # ユーザー登録を確認する
    if !localStorage.getItem('user_id')
      if ionic.Platform.isIOS()
        User.register 'ios'
      else if ionic.Platform.isAndroid()
        User.register 'android'
    else
      # デバイス情報登録
      if ionic.Platform.isIOS()
        $rootScope.registerIOS()
      else if ionic.Platform.isAndroid()
        $rootScope.registerAndroid()


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


    document.addEventListener 'resume', ->
      $rootScope.checkClipboardURL()

    # ログインを確認する
    if !localStorage.getItem 'logined'
      $location.path '/login'
    else
      # URLコピーを確認
      $rootScope.checkClipboardURL()
