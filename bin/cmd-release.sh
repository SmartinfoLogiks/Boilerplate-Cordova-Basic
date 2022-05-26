#!/bin/sh

./bin/cmd-setup.sh

rm dist/app-release.apk

cordova build android --release

#jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore app.keystore platforms/android/build/outputs/apk/release/app-release-unsigned.apk app_alias  

#zipalign -v 4 platforms/android/build/outputs/apk/release/app-release-unsigned.apk ./dist/app-release.apk

cp platforms/android/build/outputs/apk/release/android-release.apk ./dist/app-release.apk