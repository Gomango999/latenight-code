# Finds `!!! download` in markdown, and replaces it with the HTML required to download the file.
import os
import sys
from pathlib import Path

download_template = """<div class="row download-block">
<a href="/{}" class="col-md-4 download-link" download>
<div class="download-card">
<div class="row">
<div class="col-3">
<img class="download-icon" src="/images/icons/download_white.png">
</div>
<div class="col-9">
<div class="row"> <div class="col">
<p> {} </p>
</div> </div>
<div class="row"> <div class="col">
<span> {} </span>
</div> </div>
</div>
</div>
</div></a></div>
"""

# get human readable bytes
def sizeof_fmt(num, suffix='B'):
    for unit in ['','K','M','G','T','P','E','Z']:
        if abs(num) < 1024.0:
            return "%3.1f%s%s" % (num, unit, suffix)
        num /= 1024.0
    return "%.1f%s%s" % (num, 'Yi', suffix)

if len(sys.argv) != 3:
    print("Usage: python add_downloads.py infile outfile")
infile = sys.argv[1]
outfile = sys.argv[2]

# check file exists
if not os.path.isfile(infile):
    print(infile, "does not exist")
    exit(1)

# read file
lines = []
with open(infile, 'r') as f:
    for line in f:
        lines.append(line)

# replace command with template
for i in range(len(lines)):
    if lines[i].startswith('!!! download'):
        data = lines[i].split() # will break if spaces in the file path!
        assert(len(data) == 3) # only support single download for now

        # gather data about file
        filepath = os.path.join('..', data[2])
        if not os.path.isfile(filepath):
            print(filepath, "does not exist")
            continue

        filename = os.path.basename(filepath)
        memory_bytes = Path(filepath).stat().st_size
        memory = sizeof_fmt(memory_bytes)

        lines[i] = download_template.format(filepath, filename, memory)

with open(outfile, 'w+') as f:
    for line in lines:
        f.write(line)
