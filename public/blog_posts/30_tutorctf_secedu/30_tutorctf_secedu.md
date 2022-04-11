---
title: "Tutor CTF: secedu"
description: (250 points) Crypto Challenge
author: Kevin Zhu
public: true
uploadDate: 2022-04-08 23:00+11:00
lastModified: 2022-04-08 23:00+11:00
notes: ''
prevPage: 29_tutorctf_shuffle
nextPage: 31_tutorctf_cookie_monster
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: [tutorctf]
  submenus: []
name: 30_tutorctf_secedu
---

_Contest Source: [COMP6[84]41 CTF](https://www.comp6841.com/challenges)_

> _Note that all flags have been replaced with "COMP6841{REDACTED}". This is to discourage you from just blindly submitting the final answer, and to encourage you to follow along and learn something along the way._

We are given a file called `secedu.txt`. Opening it, we see it contains a single line containing the following:

```
secedusecedusecedueduedu secedueduseceduedueduedu secedueduedusecedueduedu secseceduseceduedusecsec
secsecedusecsecsecsecsec seceduedueduedusecsecedu secedueduseceduedueduedu secedueduedusecedusecedu
secsecedusecsecsecsecsec seceduedusecseceduedusec seceduedusecedusecsecedu seceduedusecsecedueduedu
...
```

Looking more closely we can see that it's made up of blocks of text, each of which contains either "sec" or "edu" repeated 8 times. This looks suspiciously like binary, so I wrote a script to extract out the binary and convert it into ASCII:

```python
import binascii

with open("secedu.txt", "r") as f:
    lines = f.readlines()

line = lines[0]
line = line.replace("sec", "0")
line = line.replace("edu", "1")

# print(line)
data = line.split()
data = map(lambda x : int(x, 2), data)
data = map(chr, data)
print("".join(data))
```

Running this gets:

```
Wow, you figured it out! Great work! How long it it take for you to figure it out?! I would share with you some extra secrets... but... (sorry)
QWggd2VsbCB0aGF0J3Mgbm8gZmFpciEgSGVyZSwganVzdCB0YWtlIHRoZSBzZWNyZXQuIFJlbWVtYmVyIGl0IGlzIGEgc2VjcmV0LCBzbyBrZWVwIGl0IGh1c2ggaHVzaCEgQ09NUDY4NDF7UzNjX0VkdV8xc19jMDBsfQ==
```

We know from before (see the [Warmup Challenge](../26_tutorctf_warmup)) that this is base64, so running that through an online converter gives us:

```
Ah well that's no fair! Here, just take the secret. Remember it is a secret, so keep it hush hush! COMP6841{REDACTED}
```