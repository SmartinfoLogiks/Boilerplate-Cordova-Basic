#!/bin/bash

#export JAVA_HOME="/usr/lib/jvm/java-8-oracle"
#export ANDROID_HOME="/opt/android-sdk-linux"
#export ANDROID_SDK_ROOT="/opt/android-sdk-linux"

cp www/config.xml ./
cp media/logos/logox100.png ./icon.png
cp media/logos/logox100.png ./www/assets/media/logos/logo.png

git add -A
git commit -m "new build"
git push origin master

echo $DIRNAME

