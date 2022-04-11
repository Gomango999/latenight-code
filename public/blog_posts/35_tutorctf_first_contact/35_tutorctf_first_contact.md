---
title: "Tutor CTF: first_contact"
description: (200 points) Forensics Challenge
author: Kevin Zhu
public: true
uploadDate: 2022-04-10 15:35+11:00
lastModified: 2022-04-10 15:35+11:00
notes: ''
prevPage: 34_tutorctf_block_game
nextPage: 36_tutorctf_subliminal_messaging
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: [tutorctf]
  submenus: []
name: 35_tutorctf_first_contact
---

_Contest Source: [COMP6[84]41 CTF](https://www.comp6841.com/challenges)_

> _Note that all flags have been replaced with "COMP6841{REDACTED}". This is to discourage you from just blindly submitting the final answer, and to encourage you to follow along and learn something along the way._

We receive an alien message, containing a single wav file. Listening to it, it sounds like mjust a bunch of random beeps. Let's open this up in an audio viewer such as audacity:

![_`alien_message.wav` in Audacity_](/blog_posts/35_tutorctf_first_contact/images/audio1.png){width=100%}

As we can see, there a bunch of spikes in audio. I originally thought this might be binary, but there were some spiikes which seemed in between a 1 and a 0, so it was difficult to fully translate. Not to mention that some were in groups of 5, others were in groups of 4 and 3, so binary didn't seem like the best fit.

The next thing we can try is the spectogram view. The spectogram view of some audio is shows us how energy in different frequency bands change over time. In a typical audio file, the spectrogram may look like this:

![_From the Audacity Manual on Spectrogram View_](/blog_posts/35_tutorctf_first_contact/images/audio4.png){width=100%}

But by manipulating the soundwaves, we can actually make this spectrogram look however we want. Turning it on in audacity gives us the flag:

![_Spectrogram view of `alien_message.wav`_](/blog_posts/35_tutorctf_first_contact/images/audio3.png){width=100%}