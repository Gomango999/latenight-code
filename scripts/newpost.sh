#!/bin/bash

if [ "$1" == "edit" ]; then
  subl "/Users/kevin/projects/latenight_code/"
  subl "/Users/kevin/projects/latenight_code/scripts/newpost.py"
else
  # Create a new post
  /usr/bin/python3 /Users/kevin/projects/latenight_code/scripts/newpost.py $1 \
  && cd "/Users/kevin/projects/latenight_code" \
  && /usr/local/bin/npm run devstart
fi