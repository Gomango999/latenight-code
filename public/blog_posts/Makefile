# https://stackoverflow.com/questions/53136024/makefile-to-compile-all-c-files-without-needing-to-specify-them/53138757
SRCS=$(wildcard */*.md)
HTMLS=$(patsubst %.md, %.html, $(SRCS))

all: $(HTMLS)

# convert to html
%.html: %1.md
	pandoc $^ -o $@ --mathjax

# add download html for each download link
%1.md : %.md
	python3 add_downloads.py $^ $@
