#!/bin/sh

./bin/cmd-setup.sh

rm dist/android-release.apk

cordova build android --release

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore dgtags.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk dgtags

~/android-sdk-linux/build-tools/24.0.2/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk ./dist/android-release.apk

