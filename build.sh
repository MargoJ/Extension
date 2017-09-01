#!/usr/bin/env bash
rm -rf build
mkdir build

mkdir build/chrome
mkdir build/firefox

cp -r shared/* build/chrome
cp -r shared/* build/firefox
cp -r chrome/* build/chrome
cp -r firefox/* build/chrome
