#!/bin/bash
STAMP=`date +'%Y-%m-%d_%H-%M-%S'`
NAME=""
if [ "$1" = "all" ]; then
  echo -ne "\n==> Export project:\n\n"
  NAME="spec_apparat_project_${STAMP}.zip"
  zip -r "${NAME}" . -x "node_modules/*" "bower_components/*" ".git/*" "*.zip" "*.sh"
else
  echo -ne "\n==> Export dist:\n\n"
  NAME="spec_apparat_dist_${STAMP}.zip"
  (cd dist; zip -r "../${NAME}" .)
fi
echo -e "\n==> File created: ${NAME}"

  
