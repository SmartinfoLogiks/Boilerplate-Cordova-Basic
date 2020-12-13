#!/bin/bash

./bin/cmd-setup.sh

rm dist/app-debug.apk

cordova build android --debug

cp platforms/android/build/outputs/apk/debug/android-debug.apk ./dist/app-debug.apk
