#!/bin/bash
if [ "$1" = "false" ]
# not a pull request, deploy to github pages
then ( cd _book
  git init
  git config user.name "LV"
  git config user.email "mamboer@gmail.com"
  git add .
  git commit -m "Deployed from Travis CI"
  git push --force --quiet "https://${GH_TOKEN}@${GH_REPO}" master:gh-pages
)
fi