---
title: "Tutor CTF"
description: How to nab every flag in the COMP6841 Tutor CTF
author: Kevin Zhu
public: true
uploadDate: 2022-04-11 19:27+11:00
lastModified: 2022-04-11 19:27+11:00
notes: ''
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: [tutorctf]
  submenus: []
name: 44_tutorctf
---

_Contest Source: [COMP6[84]41 CTF](https://www.comp6841.com/challenges)_

In UNSW's COMP6841, the tutors were kind enough to put together a [CTF]((https://www.comp6841.com/challenges)) (which I affectionally refer to as the Tutor CTF) for us to do. This CTF consisted of 18 challenges for us to do, and loving a good challenge, I had a go at solving all of them. Here is the documentation of how I solved all 18 problems, the tools I used, as well as my thought process for each one. I hope you enjoy and are able to learn something from these writeups!

## Links

- Reverse Engineering
    - (300 points) [Executable text file](/blog/38_tutorctf_executable_text_file)
    - (750 points) [Alice & Bob](/blog/42_tutorctf_alice_and_bob)
- Misc
    - (100 points) [Warmup](/blog/26_tutorctf_warmup)
    - (150 points) [bad_rand](/blog/28_tutorctf_bad_rand)
    - (250 points) [Shuffle](/blog/29_tutorctf_shuffle)
    - (500 points) [bus buddies](/blog/40_tutorctf_bus_buddies)
- Pwn
    - (500 points) [Chain](/blog/41_tutorctf_chain)
- Binary
    - (200 points) [Cookie Monster](/blog/31_tutorctf_cookie_monster)
    - (300 points) [shimmy](/blog/32_tutorctf_shimmy)
    - (450 points) [tired](/blog/39_tutorctf_tired)
- Crypto
    - (140 points) [substitution](/blog/27_tutorctf_substitution)
    - (250 points) [secedu](/blog/30_tutorctf_secedu)
    - (300 points) [substitute teacher](/blog/37_tutorctf_substitute_teacher)
- Web
    - (300 points) [Baby SSRF](/blog/43_tutorctf_baby_ssrf)
- Forensics
    - (200 points) [art_assignment](/blog/33_tutorctf_art_assignment)
    - (200 points) [block_game](/blog/34_tutorctf_block_game)
    - (200 points) [first_contact](/blog/35_tutorctf_first_contact)
    - (200 points) [subliminal_messaging](/blog/36_tutorctf_subliminal_messaging)

> _Note that all flags have been replaced with "COMP6841{REDACTED}". This is to discourage you from just blindly submitting the final answer, and to encourage you to follow along and learn something along the way._


## Scoreboard
Finally, here's the scoreboard proving my achievement as one of the top scorers:

![](/blog_posts/44_tutorctf/images/score.png){width=100%}
