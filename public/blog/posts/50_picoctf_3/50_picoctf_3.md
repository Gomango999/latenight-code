---
title: "PicoCTF 2021 - Part 3."
description: My experience solving assorted challenges in PicoCTF 2021
author: Kevin Zhu
public: true
uploadDate: 2022-04-12 02:46+11:00
lastModified: 2022-04-12 02:46+11:00
notes: ''
prevPage: 49_picoctf_2
nextPage:
tags:
- capture the flag
- picoCTF
menu:
  groups: []
  submenus: []
name: 50_picoctf_3
---

> _This was submitted as part of my blog posts for week 4 of COMP6841_

Some assorted PicoCTF's because I ran out of time this week.

## Information

This one gives us a cat.jpg file and asks us to find the hidden flag. First thing I tried was steganography, by fiddling with the brightness values to try and find the anything encoded with LSB, but no luck. Tried using Mac's "Get Info" but that didn't work either. I assumed perhaps mac was hiding some information, and tried an online metadata obtained too, but I couldn't find anything interesting.

At this point I got stuck, so I had to look up the solution. Turns out the license, which was `cGljb0NURnt0aGVfbTN0YWRhdGFfMXNfbW9kaWZpZWR9` was actual;y a base64 encoding! Decoding this gives the flag.

In general, I need to be better at spotting different types of encodings, such as Base64 or ASCII in hex values. Base64 is primarily made up of A-Z, a-z and 0-9, as well as + and /, so it should be pretty obvious when presented with a random string like that that Base64 is involved somehow.

## Transformation

We are given an encoded text file as well as a python script. Originally, I thought that this would just be like "Python Wrangling" where we run the script on the text. Unfortunately, I kept getting errors and it didn't work.

Then I started to read the python script mode closely. Looking closer, it looked as though the script was for encoding, not decoding! With this in mind, I reverse engineered the algorithm and wrote the following script:

```python
encoded = input()
l = []
for word in encoded:
    decoded = ord(word)
    a = decoded & 0xFF
    b = (decoded >> 8) & 0xFF
    l.append(chr(b))
    l.append(chr(a))
print(''.join(l))
Running this got me the flag.
```

## Stonks

Note: This was solved before I had learnt about format strings in class

So we were given a script which seemed to print out our stocks. It also gave us the ability to enter an API token, which would be printed back. My initial thought was that when the string was stored intot he buffer, it could perhaps use some sort of buffer overflow attack to obtain the flag, which was stored in another buffer right before it. However, I realised that this was impossible, since the scanf was set up only accept the first 300 characters. Doing some reading into binary exploitation though, I found a more likely candidate: format string exploitation. They were printing out my user output directly!

Hence, I spammed `"%x.%x.%x.%x..."` into the scanf and read the output. I wrote a script that would generate inputs for me to copy paste into the program. These would print out stack elements 1-50, then 51-99, etc. Grabbing the output and reading ti clsoely, I was actually able to find what looked like ASCII within the output. Writing a python script to decode the ASCII part, I was able to obtain the flag.