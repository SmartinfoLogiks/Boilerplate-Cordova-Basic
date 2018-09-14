#!/bin/sh

rm -R platforms/*
rm -R plugins/*
rm -R dist/*
rm -R node_modules/*
rm -R www/node_modules/*

mkdir dist

#cp www/config.xml ./
cd www/
npm install
cd ..

cordova platform add android