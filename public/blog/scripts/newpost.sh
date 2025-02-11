#!/bin/bash

# Read options
title=""
description=""
num_options=0
while getopts ":t:d:" opt; do
    case $opt in
        t)
            title=${OPTARG}
            let "num_options+=2"
            ;;
        d)
            description=${OPTARG}
            let "num_options+=2"
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            exit 2
            ;;
        :)
            echo "Option -$OPTARG requires an argument." >&2
            exit 2
            ;;
    esac
done

# Read file name
if (( $# - $num_options  != 1 )); then
    echo "Usage: ./newpost [options] name" >&2
    echo "Options:
    -t Title
    -d Description"
    exit 2
fi
name=${!#}

now=$(date +"%Y-%m-%d %H:%M+11:00")

# create file
mkdir "$name"
echo "---
title: \"$title\"
description: $description
uploadDate: $now
---
" > "$name/$name.md"


