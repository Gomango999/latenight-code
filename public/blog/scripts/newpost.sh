# A helper tool to create the template for a new post.
#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <name>"
    exit 1
fi
name="$1"

# Create the folder and file
script_dir="$(cd "$(dirname "$0")" && pwd)"
posts_dir=$(realpath "$script_dir/../posts")

# Find the highest numbered folder in post_dir and increment it by 1
next_num=0
for folder in "$posts_dir"/*/; do
    folder=$(basename $folder)
    if [[ "$folder" =~ ^([0-9]+)_ ]]; then
        # get the number and remove leading zeros
        num="${BASH_REMATCH[1]#0}" 
        if (( num >= next_num )); then
            next_num=$((num + 1))
        fi
    fi
done
name="${next_num}_$name"

mkdir -p "$posts_dir/$name"
file_path="$posts_dir/$name/$name.md"

# Write template to file 
now=$(date +"%Y-%m-%d %H:%M+11:00")
cat > "$file_path" <<EOF
---
title: 
description: 
uploadDate: $now
---

EOF

echo "Created $file_path"
