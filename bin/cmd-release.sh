#!/bin/sh

./bin/cmd-setup.sh

rm dist/app-release.apk

cordova build android --release

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore im-mapp01.keystore platforms/android/build/outputs/apk/release/app-release-unsigned.apk cbt300  

/opt/android-sdk-linux/build-tools/28.0.3/zipalign -v 4 platforms/android/build/outputs/apk/release/app-release-unsigned.apk ./dist/app-release.apk

