#!/bin/sh
#
#   Publish gh-pages
#
cd ./build/
git clone git@github.com:$1/$2.git gh-pages
cd ./gh-pages/
git checkout gh-pages
git rm -rf .
cp -r ./.git ../web
cd ../web
git add . --all
git commit -m publish
git push origin gh-pages
#
# clean up
#
rm -fr ./.git
cd ..
rm -fr ./gh-pages