# Gyazz App for iOS/Android

![GyazzApp](http://i.gyazo.com/5aa64932df88f913b9122a91d8822cba.png)


慶応SFC増井俊之研究室のメンバーのためのGyazzアプリです
閲覧はもちろん、編集もできます。


使い方やインストール方法は[Gyazzページ](http://gyazz.masuilab.org/%E5%A2%97%E4%BA%95%E7%A0%94/GyazzApp)から

## 開発環境

- Apache Cordova

- ionic

- gulp.js

- XCode

- Android SDK

- Android SDK Build Tool


## Contribution

### 1. Fork this repo

### 2. Install Dependencies

```
% npm install -g cordova ionic gulp
```

### 3. Add Platform

```
% ionic platform add ios android
```

or

```
% cordova platform add ios android
```

### 4. Install Plugins

package.jsonのcordovaPluginsをインストール

```
% cordova plugin add org.apache.cordova.device org.apache.cordova.console ...
```

### 5. Development

Add/Edit your Code in /www


### 6. Build

```
% cordova build ios android
```


### 7. Run in Browser

```
% ionic serve --lab
```


### 8. Run in Emulator

```
% ionic emulate $PLATFORM
```


### 9. Run in your Device

- **Android**

```
% ionic run android
```

- **iOS**

open /platform/ios/Gyazz.xcodeproj


