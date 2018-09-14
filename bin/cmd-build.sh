#!/bin/bash

./bin/cmd-setup.sh

rm dist/android-debug.apk

cordova build android --debug

cp platforms/android/build/outputs/apk/debug/android-debug.apk ./dist/
