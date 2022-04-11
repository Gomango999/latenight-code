---
title: "Tutor CTF: subliminal_messaging"
description: (200 points) Forensics Challenge
author: Kevin Zhu
public: true
uploadDate: 2022-04-10 15:45+11:00
lastModified: 2022-04-10 15:45+11:00
notes: ''
prevPage: 35_tutorctf_first_contact
nextPage: 37_tutorctf_substitute_teacher
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: []
  submenus: []
name: 36_tutorctf_subliminal_messaging
---

_Contest Source: [COMP6[84]41 CTF](https://www.comp6841.com/challenges)_

> _Note that all flags have been replaced with "COMP6841{REDACTED}". This is to discourage you from just blindly submitting the final answer, and to encourage you to follow along and learn something along the way._

We're given a file called `loud_food.mp4`, where a voice loudly declares "ALL our FOOD... is BLOWING UP!". Doing some research, this appears to be a popular Arby's commercial (A popular American fast food company, if you're not familiar with U.S. culture). However, this gives us no information about the flag.

Before we do any extensive digging into the frames themselves, let's open up the mp4 file with strings, and look for the opening curly braces of the flag.

```term
$ strings loud_food.mp4 | grep "{"
AXk_c{
c{i
aa&{L1!2
S{kd
5}dPO{
)`={
U{R.
F+{:
D9{M8
{Vz8e
-{Om6-
q{RX
{$7K
U	{l
g[{pK7
Quo{
```

No luck. Next, let's have a look at the metadata:

```term
$ exiftool ./loud_food.mp4
ExifTool Version Number         : 11.88
File Name                       : loud_food.mp4
Directory                       : .
File Size                       : 56 kB
File Modification Date/Time     : 2022:04:06 16:01:32+00:00
File Access Date/Time           : 2022:04:10 06:17:55+00:00
File Inode Change Date/Time     : 2022:04:06 16:01:32+00:00
File Permissions                : rw-rw-r--
File Type                       : MP4
File Type Extension             : mp4
MIME Type                       : video/mp4
Major Brand                     : MP4  Base Media v1 [IS0 14496-12:2003]
Minor Version                   : 0.2.0
Compatible Brands               : isom, iso2, avc1, mp41
Media Data Size                 : 53605
Media Data Offset               : 48
Movie Header Version            : 0
Create Date                     : 0000:00:00 00:00:00
Modify Date                     : 0000:00:00 00:00:00
Time Scale                      : 1000
Duration                        : 2.44 s
Preferred Rate                  : 1
Preferred Volume                : 100.00%
Preview Time                    : 0 s
Preview Duration                : 0 s
Poster Time                     : 0 s
Selection Time                  : 0 s
Selection Duration              : 0 s
Current Time                    : 0 s
Next Track ID                   : 3
Track Header Version            : 0
Track Create Date               : 0000:00:00 00:00:00
Track Modify Date               : 0000:00:00 00:00:00
Track ID                        : 1
Track Duration                  : 2.37 s
Track Layer                     : 0
Track Volume                    : 0.00%
Image Width                     : 256
Image Height                    : 144
Graphics Mode                   : srcCopy
Op Color                        : 0 0 0
Compressor ID                   : avc1
Source Image Width              : 256
Source Image Height             : 144
X Resolution                    : 72
Y Resolution                    : 72
Bit Depth                       : 24
Pixel Aspect Ratio              : 1:1
Video Frame Rate                : 29.97
Matrix Structure                : 1 0 0 0 1 0 0 0 1
Media Header Version            : 0
Media Create Date               : 0000:00:00 00:00:00
Media Modify Date               : 0000:00:00 00:00:00
Media Time Scale                : 44100
Media Duration                  : 2.44 s
Media Language Code             : eng
Handler Description             : ISO Media file produced by Google Inc.
Balance                         : 0
Audio Format                    : mp4a
Audio Channels                  : 2
Audio Bits Per Sample           : 16
Audio Sample Rate               : 44100
Handler Type                    : Metadata
Handler Vendor ID               : Apple
Encoder                         : Lavf58.19.102
Shared User Rating              : 99
Director                        : FLAG{REDACTED}
Image Size                      : 256x144
Megapixels                      : 0.037
Avg Bitrate                     : 176 kbps
Rotation                        : 0
```

Looking in the Director field (near the bottom), we see our flag!