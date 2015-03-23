#!/bin/sh
#
#   Release version
#
cd ./build/web
vulcanize --output example.html --strip --inline --csp example.html
vulcanize --output index.html --strip --inline --csp index.html
vulcanize --output options.html --strip --inline --csp options.html
vulcanize --output leaders.html --strip --inline --csp leaders.html
rm -fr ./packages


