---
title: "Tutor CTF: substitution"
description: (140 points) Crypto Challenge
author: Kevin Zhu
public: true
uploadDate: 2022-04-08 22:15+11:00
lastModified: 2022-04-08 22:15+11:00
notes: ''
prevPage: 26_tutorctf_warmup
nextPage: 28_tutorctf_bad_rand
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: []
  submenus: []
name: 27_tutorctf_substitution
---

_Contest Source: [COMP6[84]41 CTF](https://www.comp6841.com/challenges)_

> _Note that all flags have been replaced with "COMP6841{REDACTED}". This is to discourage you from just blindly submitting the final answer, and to encourage you to follow along and learn something along the way._

We're given `subsitution.txt`, which contains the following:

```
Mpkgwabs! Jpf huh ub! Huh jpf wraousr byrj drwr pk a dpwelak erjvpawh• Byus us ;wrbbj lfmy a sfvsbubfbupk mu;yrw dyumy jpf spocrh. MPL•6841•K3c3w_g0kk4_g1cr_f;_spoc1kg_mu;y3ws•. Lajvr gp vame bp byr KSA galr akh bwj pfb lpwr! Dyumy ;awb huh jpf mpl;orbr tuwsb• Das ub, krcrw gpkka gucr jpf f;… krcrw gpkka orb jpf hpdk… krcrw gpkka wfk awpfkh akh hrsrwb jpf!
```

If the name of this problem wasn't enough of a hint already, we can see that these letters are separated into distinct 3-5 character sections, have capital letters, and are separated by punctuation. This smells alot of a substitution cipher. Now we could code our own solver, but there are plenty of really efficient solvers online. Just picking [one at random](https://www.guballa.de/substitution-solver), we end up with the following decoded text.

```
Congrats! You did it! Did you reapise they were on a workman keyboard• This is ;retty much a substitution ci;her which you sopled. COM•6841•REDACTED•. Maybe go back to the NSA game and try out more! Which ;art did you com;pete first• Was it, neler gonna gile you u;… neler gonna pet you down… neler gonna run around and desert you!
```

It looks like our program made a few errors, and there are a few extra characters that also need to be translated (I.e. "•" and ";"), but this isn't too difficult to fill in by hand, since 99% of the work is done already. Properly rearranging, we get:

```
Congrats! You did it! Did you realise they were on a workman keyboard? This is pretty much a substitution cipher which you solved. COMP6841{REDACTED}. Maybe go back to the NSA game and try out more! Which part did you complete first? Was it, never gonna give you up… never gonna let you down… never gonna run around and desert you!
```

