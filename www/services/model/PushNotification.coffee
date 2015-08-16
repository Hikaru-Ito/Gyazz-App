angular.module('gyazzapp.model.pushnotification', [])
.factory 'PushNotification', ($http, $cordovaToast, ANDROID_GCM_SENDER_ID, PARSE_API_URL, X_Parse_Application_Id, X_Parse_REST_API_Key) ->

  return {


    # 全プッシュ設定を変更
    changeAllPushStatus: (bool) ->

      # cannelData生成
      channel_id = 'GyazzUserID' + localStorage.getItem('user_id')
      if bool
        channel_data = [channel_id, 'ALLRECIEVE']
      else
        channel_data = [channel_id]

      # サーバーに送信
      $.ajax
        url: PARSE_API_URL + '/' + localStorage.getItem 'parse_obj_id'
        type: 'PUT'
        headers:
          'X-Parse-Application-Id': X_Parse_Application_Id
          'X-Parse-REST-API-Key': X_Parse_REST_API_Key
        contentType: 'application/json'
        data: JSON.stringify
          channels: channel_data
      .done (data) ->
        $cordovaToast.show 'プッシュ設定変更完了', 'short', 'center'
        true
      .fail (data) ->
        false


    # デバイス情報を登録
    registerDeviceID: (deviceID, platform) ->

      # localStorageに保存
      localStorage.setItem 'deviceID', deviceID

      # Parseの識別用のIDを生成
      channel_id = 'GyazzUserID' + localStorage.getItem('user_id')

      # プッシュ通知の設定をチャンネル登録に反映させる
      setting_data = JSON.parse localStorage.getItem 'setting'
      if setting_data.all_push
        channel_data = [channel_id, 'ALLRECIEVE']
      else
        channel_data = [channel_id]

      # iOS登録
      if platform is 'ios'
        $.ajax
          url: PARSE_API_URL
          type: 'POST'
          headers:
            'X-Parse-Application-Id': X_Parse_Application_Id
            'X-Parse-REST-API-Key': X_Parse_REST_API_Key
          contentType: 'application/json'
          data: JSON.stringify
            deviceType: platform
            deviceToken: deviceID
            channels: channel_data
        .done (data) ->
          $cordovaToast.show 'デバイスデータ登録完了', 'short', 'center'
          console.log data.objectId
          localStorage.setItem 'parse_obj_id', data.objectId
          true
        .fail (data) ->
          false

      # Android登録
      if platform is 'android'
        $.ajax
          url: PARSE_API_URL
          type: 'POST'
          headers:
            'X-Parse-Application-Id': X_Parse_Application_Id
            'X-Parse-REST-API-Key': X_Parse_REST_API_Key
          contentType: 'application/json'
          data: JSON.stringify
            deviceType: platform
            deviceToken: deviceID
            GCMSenderId: ANDROID_GCM_SENDER_ID
            pushType: 'gcm'
            channels: channel_data
        .done (data) ->
          $cordovaToast.show 'デバイスデータ登録完了', 'short', 'center'
          console.log 'デバイスデータ登録完了'
          true
        .fail (data) ->
          false
 }
