---
title: "Tutor CTF: Warmup"
description: (100 points) Misc Challenge
author: Kevin Zhu
public: true
uploadDate: 2022-04-08 22:00+11:00
lastModified: 2022-04-08 22:00+11:00
notes: ''
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: []
  submenus: []
name: 26_tutorctf_warmup
---

_Contest Source: [COMP6[84]41 CTF](https://www.comp6841.com/challenges)_

> _Note that all flags have been replaced with "COMP6841{REDACTED}". This is to discourage you from just blindly submitting the final answer, and to encourage you to follow along and learn something along the way._

For our first challenge of Tutor CTF, we have a nice and simple warmup. We're given a `file.txt`, with the following inside:

```
NDM0ZjRkNTA3YjQ5NWY2ODRmNzA0NTVmNzkzMDc1NWY0MTUyMzM1Zjc3NjE3MjZkNjU2NDVmMzI1ZjY2Njk2ZTY0NWY2ZDMwNzI0NTVmNDYzMTYxNjc3MzIxN2Q=
```

Given that all the characters are either upper and lower case letters and numbers, and the fact that it ends with an equals sign, this is almost certainly base 64. Hence we can run

```term
$ base64 --decode < file.txt > file2.txt
```

to decode it. This gives us a new file containing the following:

```
434f4d507b495f684f70455f7930755f4152335f7761726d65645f325f66696e645f6d3072455f4631616773217d
```

Looking at this, we have alot of values from 41 to 5A, as well as 61 to 7B, which immediately tell us that this is ASCII. We can use the `xxd` command to decode this:

```term
$ xxd -r -p < flag.txt
COMP{REDACTED}
```

The `-r -p` flags tell xxd to convert from raw hexadecimal back into ASCII. Running this gets us the flag. Hopefully that wasn't too bad :)
