---
title: "Tutor CTF: block_game"
description: (200 points) Forensics Challenge
author: Kevin Zhu
public: true
uploadDate: 2022-04-10 15:35+11:00
lastModified: 2022-04-10 15:35+11:00
notes: ''
prevPage: 33_tutorctf_art_assignment
nextPage: 35_tutorctf_first_contact
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: [tutorctf]
  submenus: []
name: 34_tutorctf_block_game
---

_Contest Source: [COMP6[84]41 CTF](https://www.comp6841.com/challenges)_

> _Note that all flags have been replaced with "COMP6841{REDACTED}". This is to discourage you from just blindly submitting the final answer, and to encourage you to follow along and learn something along the way._

We're given a `level.dat` file. Trying to open it, we're greeted with some binary nonsense:

```term
$ cat level.dat
�      ��W�oI��|x��5�X�	��eW��$��"E�|؎�N,���jT��f��ꮦ����j����9���^��	D���=!� ��Jp߃yU�=퉽#u���W�{�~��^����ҡ����#� Y<<���M�Y��8 BȵYh	��m�5��$����a�R��3��Vu��29dKg%e1�@*�R̔^+��6��p��!��wA��lIĤ����ƌs���|�Ys��!��5���_���/jd�MQi �Iu���q$$�!���8�Jd�/�T��(m+���U��
...
```

So let's use `file` to try and see what type of file it is:

```term
$ file level.dat
level.dat: gzip compressed data, original size modulo 2^32 3923
```

So it's gzip data! Let's unzip it:

```term
$ gunzip < level.dat > decoded1
$ file decoded1
decoded1.txt: PCX ver. 2.5 image data bounding box [1024, 24900] - [24948, 3], 10-bit 22298 x 28257 dpi, uncompressed
```

In other words, this is a PCX (Picture Exchange) file, i.e. an image! Opening up the file in GIMP however gives an error message, unfortunately. Let's go ahead and examine the file now:

```term
$ cat decoded1


BorderCenterZTraderSpawnChance
DifficultyBorderSizeLerpTimerainingTimeGameType
BorderCenterXBorderDamagePerBlock?ə�����BorderWarningBlocks@anilla
WorldGenSettings
                bonus_chestseed(�q��generate_features

dimensions
minecraft:overworld
	generator
settingfeaturebiomeminecraft:plains	layers
blockminecraft:bedrockheight	structure_overrideminecraft:strongholdsminecraft:villageslaketypeminecraft:flatypeminecraft:overworld
minecraft:the_nether
	generatsettingsminecraft:netherseed(�q��

biome_sourcpresetminecraft:nethetypeminecraft:multi_noistypeminecraft:noistypeminecraft:the_nether
minecraft:the_end
minecraft:endseed(�q��s

biome_sourceseed(�q�typeminecraft:the_entypeminecraft:noistypeminecraft:the_end

DragonFightNeedsStateScanning  Gateways
...
```

No points for guessing what game this is from now. There's alot of text here, so let's use the `strings` command to filter it down. We also use `grep` to filter out the nonsense, and after trying a few keywords, we eventually find the flag:    

```term
$ strings decoded1 | grep "FLAG"
0[{"text":"FLAG{REDACTED}","italic":false}]
```