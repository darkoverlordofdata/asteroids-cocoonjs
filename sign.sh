#!/bin/sh
#keytool -genkey -v -keystore ~/apk/asteroids.jks -alias asteroids -keyalg RSA -keysize 2048 -validity 10000
/opt/java/jdk1.8.0_11/bin/jarsigner -verbose -keystore /home/bruce/apk/asteroids.jks -storepass d16a-asteroids -keypass d16a-asteroids Asteroids_release_unsigned.apk asteroids
/home/bruce/Applications/android-studio/sdk/build-tools/19.1.0/zipalign -v 4 Asteroids_release_unsigned.apk Asteroids_release.apk
