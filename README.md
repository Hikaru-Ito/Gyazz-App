# Gyazz App for iOS/Android

![GyazzApp](http://i.gyazo.com/5aa64932df88f913b9122a91d8822cba.png)


慶応SFC増井俊之研究室のメンバーのためのGyazzアプリです

閲覧はもちろん、編集もできます。


使い方やインストール方法は[Gyazzページ](http://gyazz.masuilab.org/%E5%A2%97%E4%BA%95%E7%A0%94/GyazzApp)から


## GyazzApp Backend

ユーザー管理やスター管理、ページ更新データ管理など

[https://github.com/Hikaru-Ito/GyazzAppBackend](https://github.com/Hikaru-Ito/GyazzAppBackend)


## Tech

- Apache Cordova

- ionic

- CoffeeScript

- AngularJS

- scss

- jade

- gulp

- XCode

- Android SDK

- Android SDK Build Tool


## Contribution

### 1. Fork this repo

### 2. Install Dependencies

```
% npm i -g cordova ionic gulp
% npm i
```

### 4. Install Plugins & Add Platforms
依存しているCordovaプラグインやプラットフォームのCordova設定を反映させます
```
$ ionic state restore
```

### 5. Generate js/html/css Files

coffee/jade/scssファイルをそれぞれ全変換します

```
$ gulp prepare
```


### 6. Development

gulp watchを作動させてからコードを書いてください

www/配下のファイルを編集します

```
$ gulp
```


### 7. Build

platform/ 配下にそれぞれプラットフォームごとに出力されます

```
% cordova build ios android
```


### 8. Run in Browser
端末ネイティブのAPIに依存している機能が多いので、PCブラウザ上ではまともに動作しません。
UIの確認等の目的でのみご利用ください

```
% ionic serve --lab
```


### 9. Run in Emulator

```
% ionic emulate $PLATFORM
```


### 10. Run in your Device

- **Android**

GenyMotionでももちろん動きます。
```
% ionic run android
```

- **iOS**

Xcodeプロジェクトから、プロビジョニングファイル等を設定してビルド
```
open /platform/ios/Gyazz.xcodeproj
```
