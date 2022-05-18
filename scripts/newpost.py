#!/usr/bin/python3
import os
import re
import sys

if len(sys.argv) == 1:
    print("Must specify a blog post name")
    exit(1)
elif len(sys.argv) != 2:
	print("Usage: python3 newpost name")    
	exit(1)

name = sys.argv[1]

os.chdir("/Users/kevin/projects/latenight_code/public/blog_posts")

# Add a number to the start of the name
largest_num = 0
for file in os.listdir():
	res = re.search(r"^\d+_[a-zA-Z]+", file)
	if res:
		res = re.search(r"^\d+", file)
		num = int(res.group())
		largest_num = max(largest_num, num)
name = f"{largest_num+1:02}_{name}"
print(f"Creating blog {name}")

# Create new post
os.system(f"/Users/kevin/projects/latenight_code/public/blog_posts/newpost.sh {name}")

# Open the post for editting
os.system(f"/usr/local/bin/atom /Users/kevin/projects/latenight_code/public/blog_posts/")
os.system(f"/usr/local/bin/atom /Users/kevin/projects/latenight_code/public/blog_posts/{name}/{name}.md:8")

# Open the website
os.system(f"open \"http://localhost:8080/blog/{name}\"")