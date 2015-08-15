angular.module('gyazzapp.model.pushnotification', [])
.factory 'PushNotification', ($http, $cordovaToast, ANDROID_GCM_SENDER_ID, PARSE_API_URL, X_Parse_Application_Id, X_Parse_REST_API_Key) ->

  return {

    # デバイス情報を登録
    registerDeviceID: (deviceID, platform) ->

      # localStorageに保存
      localStorage.setItem 'deviceID', deviceID
      alert 'デバイスデータ登録開始' + deviceID

      # Parseの識別用のIDを生成
      channel_id = 'GyazzUserID' + localStorage.getItem('user_id')

      # iOS登録
      if platform is 'ios'
        $.ajax(
          url: PARSE_API_URL
          type: 'POST'
          headers:
            'X-Parse-Application-Id': X_Parse_Application_Id
            'X-Parse-REST-API-Key': X_Parse_REST_API_Key
          contentType: 'application/json'
          data: JSON.stringify(
            deviceType: platform
            deviceToken: deviceID
            channels: [
              channel_id
              'ALLRECIEVE'
            ])).done((data) ->
          $cordovaToast.show 'デバイスデータ登録完了', 'short', 'center'
          true
        ).fail (data) ->
          false

      # Android登録
      if platform is 'android'
        $.ajax(
          url: PARSE_API_URL
          type: 'POST'
          headers:
            'X-Parse-Application-Id': X_Parse_Application_Id
            'X-Parse-REST-API-Key': X_Parse_REST_API_Key
          contentType: 'application/json'
          data: JSON.stringify(
            deviceType: platform
            deviceToken: deviceID
            GCMSenderId: ANDROID_GCM_SENDER_ID
            pushType: 'gcm'
            channels: [
              channel_id
              'ALLRECIEVE'
            ])).done((data) ->
          $cordovaToast.show 'デバイスデータ登録完了', 'short', 'center'
          console.log 'デバイスデータ登録完了'
          true
        ).fail (data) ->
          false
 }
