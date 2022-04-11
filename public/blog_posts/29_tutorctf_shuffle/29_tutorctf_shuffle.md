---
title: "Tutor CTF: Shuffle"
description: (250 points) Misc. Challenge
author: Kevin Zhu
public: true
uploadDate: 2022-04-08 22:45+11:00
lastModified: 2022-04-08 22:45+11:00
notes: ''
prevPage: 28_tutorctf_bad_rand
nextPage: 30_tutorctf_secedu
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: []
  submenus: []
name: 29_tutorctf_shuffle
---

_Contest Source: [COMP6[84]41 CTF](https://www.comp6841.com/challenges)_

> _Note that all flags have been replaced with "COMP6841{REDACTED}". This is to discourage you from just blindly submitting the final answer, and to encourage you to follow along and learn something along the way._

We are given a mysterious `Shuffle.txt`. Exploring a bit, we see the following:

```term
$ wc -l shuffle.txt
     593 shuffle.txt
$ cat shuffle.txt | head -10
\|::164::__|
/:/ ::542:: /
::179::
\:\  \ /:/  /::523::
/:/__::421::/
|::458:::|  |
::186::
::265::  |\__\
/:/\:\ ::16::\:\__\
/:/\:\  ::14::\
```

Looking through the file, we immediately see that every line contains something of the format `::<num>::`. Not only that these numbers seem to be unique, and range anywhere from 1 to about 600. To confirm my suspicions, I wrote up a quick script with a little bit of regex in order to make a list of all the numbers that appear, and see if there's anything special about them.

```python
import re

with open("shuffle.txt", "r") as f:
    lines = f.readlines()

nums = []
for line in lines:
    # search for anything of the form ::<numbers>::
    match = re.search("::\\d+::", line)
    if match:
        # remove colons, and add the number into the nums array
        nums.append((int(match.group()[2:-2])))
    else:
        print("no number on line: ", line)
        exit(1)

# check every number appears exactly once
nums.sort()
print(nums)
```

Here, "::\\d+::" matches anything where we have some amount of digits surrounded by a pair of colons. And sure enough, printing out the nums gave the following output:

```sh
$ python3 get.py
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, ..., 591, 592, 593]
# Numbers in the middle removed for space
```

Which was good enough to confirm my theory that all the numbers were unique and from 0 to 593. Next it seemed natural to sort the lines by their numbers, so I went ahead and modified the script to do that. Here's what the new text looked like:

```
     ::0:: ___
    ::1:: /\__\
  ::2::  /::|  |
   /::3:::|:|  |
  /:/|:::4::|__|__
 /:/ |::5::::::\__\
 \/__::6::/~~/:/  /
 ::7::      /:/  /
      /:::8::/  /
 ::9::    /:/  /
     \/__::10::/
      _::11::__
     /::12::\  \
    /::\  ::13::\
   /:/\:\  ::14::\
  ::15::/::\~\:\  \
 /:/\:\ ::16::\:\__\
 \/__\:\/:/  /::17::
      \::18::::/  /
::19::      /:/  /
     /::20:::/  /
     \/_::21::_/
      ::22::___
     /::23::\__\
::24::    /:/  /
   /:/__/::25::
  ::26::/::\__\____
::27:: /:/\:::::\__\
 \/_|:|~~|::28::~
    |::29:::|  |
    |:|::30::  |
    |:|::31::  |
     ::32::\|__|
::33::
```
If we look carefully, we can see that this actually looks kinda like ASCII art letters. The numbers themselves don't seem to have anything to do with the art, so let's remove those in the process. We get the following output:

```
      ___
     /\__\
    /::|  |
   /:|:|  |
  /:/|:|__|__
 /:/ |::::\__\
 \/__/~~/:/  /
       /:/  /
      /:/  /
     /:/  /

     \/__/
      ___
     /\  \
    /::\  \
   /:/\:\  \
  /::\~\:\  \
 /:/\:\ \:\__\
 \/__\:\/:/  /
      \::/  /
      /:/  /
     /:/  /
     \/__/
      ___
     /\__\
    /:/  /
   /:/__/
  /::\__\____
 /:/\:::::\__\
 \/_|:|~~|~
    |:|  |
    |:|  |
    |:|  |
     \|__|
```

So the first three letters of the flag are "MAK...". Printing out the rest of the text gets us the flag. Here's the final python code that I used:

```python
import re

with open("shuffle.txt", "r") as f:
    lines = f.readlines()

nums = []
for line in lines:
    match = re.search("::\\d+::", line)
    if match:
        # remove the number from the line
        line = re.sub("::\\d+::", "", line)

        # last line does not have a \n
        if line[-1] != '\n':
            line = line + '\n'

        nums.append((int(match.group()[2:-2]), line))
    else:
        print("no number on line: ", line)
        exit(1)

# every number appears exactly once
nums.sort()

_, lines = zip(*nums)
print("".join(lines))
```
