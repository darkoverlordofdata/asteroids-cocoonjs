#!/usr/bin/env bash
#keytool -list -printcert -jarfile ./Asteroids_debug.apk | grep -Po "(?<=SHA1:) .*" |  xxd -r -p | openssl base64
keytool -list -printcert -jarfile ./CustomCocoonJSLauncher.apk | grep -Po "(?<=SHA1:) .*" |  xxd -r -p | openssl base64
