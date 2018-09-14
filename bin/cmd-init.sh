#!/bin/sh

cd ..

rm -R platforms/*
rm -R plugins/*
rm -R dist/*
rm -R node_modules/*

mkdir dist

cp www/config.xml ./

cordova platform add android