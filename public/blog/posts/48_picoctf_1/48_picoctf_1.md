---
title: "PicoCTF 2021 - Part 1."
description: My experience solving general skills challenges in PicoCTF 2021
author: Kevin Zhu
public: true
uploadDate: 2022-04-12 02:40+11:00
lastModified: 2022-04-12 02:40+11:00
notes: ''
prevPage:
nextPage: 49_picoctf_2
tags:
- capture the flag
- picoCTF
menu:
  groups: []
  submenus: []
name: 48_picoctf_1
---

> _This was submitted as part of my blog posts for week 2 of COMP6841_

Today marks the first week where I set off on my task of solving as many PicoCTF 2021 problems as I can. To start off with, I did all problems marked general skills. As I quickly realised, the general skills are trivial and form the easiest 10 questions out of the 90, but the questions get exponentially harder afterwards. This week, I worked through all the general skills questions, as well as a few extra questions to gauge the difficulty.

That being said, there's a good chance that I've already exhausted most of the easy questions. Writeups in the future may have less problems but get a bit more involved, as the techniques get more complicated and I may have to rely more and more on existing writeups to solve these challenges.

Anyways, without further ado, here are the writeups for all of the "general skills" PicoCTF problems!

## Obedient Cat
Named after the typical `cat` command, just opening the downloaded file gives the flag.

## Python Wrangling
This one was just running a python script. Opening the script itself gives us usage instructions: We need to pass in a file as an argument which we want to decode, and also input a password/key into standard input. Running the script gives the flag.

## Wave a flag
This one gives us executable and asks us to invoke help flags, which is presumably `-h`.  However, it seemed that it was compiled on linux, and I couldn't run it on mac. Luckily for me, there's a nice command that helps me solve this problem. `strings` is a command that looks through a binary file, finds all occurences of ASCII text larger than a given length, and prints them out. Since whatever text in the help section is stored in ASCII in the file, this outputs what the help output would be as well. The flag is simply inside the help text.

## Nice netcat
We are introduced to the netcat command. Running `man nc`, we see that netcat is a versatile tool for TCP and UDP connections. It can open TCP connections, send UDP packets, listen on ports, etc. In the upcoming challenges, I've seen it used to obtain a text file, or straight up run an executable.

Anyways, running the suggested netcat command gives us a string of random numbers (112 105 99 111 67 84 ... ). Looking at this, all numbers are less than 128, which seems to suggest ASCII encoding. Translating from decimal to ASCII gets the flag.

## Static ain't always noise
I think I accidently cheesed this challenge. Opening up the executable as text, I found the flag almost immediately, and submitted it. Anyway, I decided to explore what was going on anyway:

`ltdis.sh` is an interesting script. It actually decompiles the executable into assembly, then runs `strings` on it to find the relevant strings in the text section. This was how I found out that the `strings` command existed in the first place!

## Tab, tab, attack
The purpose of this challenge is just to teach using tabs. We are given a zip file with a bunch of really long and annoying to type filenames. Spamming tab, allows us to navigate easily to the file at it's core. Once again, this was an executable I couldn't run on Mac, but using just looking through the executable file allowed me to find the flag.

## Magikarp Ground Mission
This one was just an exercise in SSH. SSH to the server, and follow the instruction files around the various directories to piece together the three pieces of the flag.