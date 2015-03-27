#!/bin/sh
#
#   Release version
#
cd ./build/web
vulcanize --output example.html --strip --inline --csp example.html
vulcanize --output index.html --strip --inline --csp index.html
vulcanize --output options.html --strip --inline --csp options.html
vulcanize --output leaders.html --strip --inline --csp leaders.html
vulcanize --output more.html --strip --inline --csp more.html
#
# clean up
#
rm -fr ./packages
rm -fr ./css
rm -fr ./fonts/eot
rm -fr ./fonts/otf
rm -fr ./fonts/screenshots
rm -fr ./fonts/sources
rm -fr ./fonts/svg
rm -fr ./fonts/woff
rm -f ./example.html
rm -f ./example.js
rm -f ./res/icons/b_Background.png
rm -f ./res/icons/b_Forward1.png
rm -f ./res/icons/b_Forward2.png
rm -f ./res/icons/b_More2.png
rm -f ./res/icons/b_Pause1.png
rm -f ./res/icons/b_Pause3.png
rm -f ./res/icons/b_Play1.png
rm -f ./res/icons/b_Play2.png
rm -f ./res/icons/b_Restart.png
rm -f ./res/icons/b_Sound1_inactive.png
rm -f ./res/icons/b_Sound2.png
rm -f ./res/icons/b_Sound2_inactive.png
rm -f ./res/icons/b_Yes.png

