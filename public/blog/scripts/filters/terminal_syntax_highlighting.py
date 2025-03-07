# Finds ```term ... ``` and replaces it with html to colour in any $ in prompts
import os
import sys
from pathlib import Path

if len(sys.argv) != 3:
    print("Usage: python terminal_syntax_highlighting.py infile outfile")
infile = sys.argv[1]
outfile = sys.argv[2]

if not os.path.isfile(infile):
    print(infile, "does not exist")
    exit(1)

# read file
lines = []
in_term_block = False
with open(infile, 'r') as f:
    for line in f:
        if not in_term_block and (line.startswith("```term") or line.startswith("``` term")):
            # starting a block
            in_term_block = True
            lines.append('<div class="sourceCode"><pre class="sourceCode term"><code class="sourceCode term">')
        elif in_term_block and line.strip() == "```":
            # ending a block
            in_term_block = False
            lines.append('</code></pre></div>')
        elif in_term_block:
            # inside a terminal code block
            if (line.startswith("$ ")):
                lines.append('<span><span class="ex">$</span> ' + line[2:] +'</span>')
            else:
                lines.append('<span>' + line + '</span>')
        else:
            # regular line
            lines.append(line)

with open(outfile, 'w+') as f:
    for line in lines:
        f.write(line)
