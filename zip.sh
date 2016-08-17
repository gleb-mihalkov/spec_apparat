#!/bin/bash
zip -r "spec_apparat_$(date +'%Y-%m-%d_%H-%M-%S').zip" . -x "node_modules/*" "bower_components/*" "dist/img/*" "dist/fonts/*" "dist/res/*"
