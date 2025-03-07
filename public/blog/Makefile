# Called to perform final post-processing to markdown files to convert them into HTML.

SRCS=$(wildcard */*/*.md)
HTMLS=$(patsubst %.md, %.html, $(SRCS))

all: $(HTMLS)

# Replaces `!!! download` with an actual download link
%1.md : %.md
	python3 scripts/filters/add_downloads.py $^ $@

# Add syntax highlighting to code blocks marked with "```term"
%2.md : %1.md
	python3 scripts/filters/terminal_syntax_highlighting.py $^ $@

# Converts to HTML. We use pandoc to handle converting maths as well.
%.html: %2.md
	pandoc $^ -o $@ --mathjax