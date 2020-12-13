#!/bin/sh

MAPPNAME=`basename "$PWD"`;

keytool -genkey -v -keystore mapp-$MAPPNAME.keystore -alias $MAPPNAME -keyalg RSA -keysize 2048 -validity 50000