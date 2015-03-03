#!/bin/sh
#
#   Publish gh-pages
#
cd ./build/web
vulcanize --output example.html --strip --inline --csp example.html
vulcanize --output index.html --strip --inline --csp index.html
rm -fr ./packages


