---
title: "Tutor CTF: substitute_teacher"
description: (300 points) Crypto Challenge
author: Kevin Zhu
public: true
uploadDate: 2022-04-11 01:21+11:00
lastModified: 2022-04-11 01:21+11:00
notes: ''
prevPage: 36_tutorctf_subliminal_messaging
nextPage: 38_tutorctf_executable_text_file
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: []
  submenus: []
name: 37_tutorctf_substitute_teacher
---

## Exploration

We are given two files. First we have `spicy_flag.txt` which looks like this:

```
ሐᤀោᦡ௑ಱૹৄ㰐⩀⯤ោ⽄⢤␀㎩ॡ㄀᰹㸄
```

And another file, called `encrypt.py` which looks like this:

```python
from numpy.polynomial import Polynomial

#alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{}_1234567890"

def encrypt(plaintext):
    f = Polynomial([1, 2, 1])
    return "".join(chr(int(f(c))) for c in plaintext)

with open("flag.txt", "rb") as f, open("spicy_flag.txt", "w") as g:
    FLAG = f.read().strip()
    enc = encrypt(FLAG)
    g.write(enc)
```

Looking at this file, we see that it opens something called `flag.txt`, encrypts each character of the flag, and writes it to `spicy_flag.txt`. In other words, this is the encryption file that was used to generate the stuff in `spicy_flag.txt`, and it's out job to reverse engineer it in order to get the original flag back out.

One method of solving it is to reverse engineer the mathematics function. Let's look into the function in more detail. `chr(int(f(c))) for c in plaintext` generates a list, with each element corresponding to a single character in the original flag. Looking at numpy documentation, we see that `f` is the polynomial defined as $x^2 + 2x + 1$. Hence, our function is getting the character $c$, passing it through our polynomial to get $c^2+2c+1$, and then converting that number into unicode using `chr`.

> _Note that every unicode has a unique identifier known as a code point. `chr` takes a number, and converts into the unicode with that unicode code point. For example, `chr(2665)` gives `♥` which has code point U+2665._

## Option 1: Maths

Now that we understand the function, let's try to reverse it and find the character that translates into the unicode with code point $x$. I.e. we're trying to find a character $c$ such that $c^2+2c+1 = x$. Luckily, we know that $x = c^2+2c+1 = (c+1)^2$, so rearranging in terms of $x$, we get $c = \sqrt{x}-1$. Here's a python script which does this for us. We use `ord(x)` in order to obtain the unicode code point of each unicode character.

```python
from isqrt import isqrt

with open("spicy_flag.txt", "r") as f:
    line = f.readline().strip()

ans = ""
for x in line:
    print(chr(isqrt(ord(x))-1), end="")

print(ans)
```
> _Note, we use the isqrt library, which gives us integer square root. This is nice since we know that all the numbers we are dealing with are perfect squares, so we only need to work with integers_

## Option 2: Brute Force

Alternatively if we are bad at maths, there exists another method. As the question title suggests, we can also solve this using brute force. For each unicode character, we can try encrypting every letter in the alphabet until we find one that translates to the same unicode character. They are even nice enough to present the entire alphabet in `encrypt.py`. Here's a python script that does the same thing:

```python
from numpy.polynomial import Polynomial

alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{}_1234567890"

def encrypt(plaintext):
    f = Polynomial([1, 2, 1])
    return "".join(chr(int(f(c))) for c in plaintext)

with open("spicy_flag.txt", "r") as f:
    line = f.readline().strip()

ans = ""
for c in line:
    for d in alphabet:
        if (encrypt(bytes(d, "utf-8") == c):
            ans = ans + d
            break

print(ans)
```