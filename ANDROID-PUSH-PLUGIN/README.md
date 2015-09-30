# PushPlugin Android  - Support Parce.com

PushNotificationに利用しているCordovaPushPluginが、Android版のGCM処理の部分でParce.comからのリクエストデータ構造に対応できていなかったので、プラグインのjavaプログラムを修正した。
本家リポジトリにはPullRequest済み
https://github.com/phonegap/phonegap-plugin-push/pull/182

## 該当ファイル

`ionic restore`したあとに追加されるPushPluginの `src/android/com/adobe/phonegap/push/GCMIntentService.java`
