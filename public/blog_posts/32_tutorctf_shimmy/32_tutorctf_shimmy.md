---
title: "Tutor CTF: Shimmy"
description: (300 points) Binary Challenge
author: Kevin Zhu
public: true
uploadDate: 2022-04-10 15:05+11:00
lastModified: 2022-04-10 15:05+11:00
notes: ''
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: []
  submenus: []
name: 32_tutorctf_shimmy
---

_Contest Source: [COMP6[84]41 CTF](https://www.comp6841.com/challenges)_

> _Note that all flags have been replaced with "COMP6841{REDACTED}". This is to discourage you from just blindly submitting the final answer, and to encourage you to follow along and learn something along the way._

## Exploration

Examining the code, our `shimmy.c` looks like this:

``` c
#include <stdio.h>
#include <stdlib.h>

void print_flag() {
    // for security purposes, this function has been [[REDACTED]]
}

int main(int argc, char **argv) {
    int i = rand();
    printf("hi! your random number is: %d\n", i);

    if (i == -5) {
        print_flag();
    }

    return EXIT_SUCCESS;
}
```

It looks like we have 0 way to give input to this program. We're just supposed to hope that the random number generated is -5, which is impossible, since `rand()` always returns a non-negative number.

## Corrupt Header File

Trying to run the executable though, gives a problem that even patchelf cannot fix.

```
$ ./shimmy
./shimmy: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.34' not found (required by ./shimmy)
$ patchelf --set-interpreter /home/ubuntu/glibc/glibc-2.34-install/lib/ld-linux-x86-64.so.2 --set-rpath /home/ubuntu/glibc/glibc-2.34-install/lib/ shimmy
patchelf: unsupported ELF version
```

It looks like patchelf doesn't recognise the ELF version. Looking at the hexdump for `./shimmy` tells us the reason:

```
$ xxd ./shimmy | head -2
00000000: 7f45 4c46 4646 4646 4646 4646 4646 4646  .ELFFFFFFFFFFFFF
00000010: 0300 3e00 0100 0000 7010 0000 0000 0000  ..>.....p.......
```

And for reference, here's what a regular ELF header looks like (using the `./vuln` script from [bad_rand](../28_tutotctf_bad_rand))

```
$ xxd ./vuln | head -2
00000000: 7f45 4c46 0201 0100 0000 0000 0000 0000  .ELF............
00000010: 0300 3e00 0100 0000 d010 0000 0000 0000  ..>.............
```

You can see that we have alot more "F's" than normal. Looking at the [Linux Foundation ELF Header Specs](https://refspecs.linuxfoundation.org/elf/gabi4+/ch4.eheader.html), we can see that the `e_type`, `e_machine`, and `e_version` fields have all been overwritten with F's. The file header is corrupt! Running `readelf -h` gives us some more details:

```
$ readelf -h ./shimmy
ELF Header:
  Magic:   7f 45 4c 46 46 46 46 46 46 46 46 46 46 46 46 46
  Class:                             <unknown: 46>
  Data:                              <unknown: 46>
  Version:                           70 <unknown>
  OS/ABI:                            <unknown: 46>
  ABI Version:                       70
  Type:                              DYN (Shared object file)
  Machine:                           Advanced Micro Devices X86-64
  Version:                           0x1
  Entry point address:               0x1070
  Start of program headers:          0 (bytes into file)
  Start of section headers:          64 (bytes into file)
  Flags:                             0x0
  Size of this header:               14200 (bytes)
  Size of program headers:           0 (bytes)
  Number of program headers:         0
  Size of section headers:           0 (bytes)
  Number of section headers:         0
  Section header string table index: 0
readelf: Warning: possibly corrupt ELF file header - it has a non-zero section header offset, but no section headers
```

As you can see, this file has 0 section headers and program headers, which is definitely problematic. The fact that the class, data, version, and OS are all 46 ('F' in ASCII) gives us also a hint that something is not right.

Hence, we can simply replace the first row of bytes with the one from vuln, which I'll save into a new file called `shimmy2`. After running patchelf, we get:

```
$ ./shimmy2
hi! your random number is: 1804289383
```

It works! If we were to run readelf on this again, we'd also see that the program headers and section headers are displaying their correct values now, even though we didn't technically modify those sections. My only guess is that readelf relies on the information from the first row (file type, machine, version) to work out how to read the remaining fields.

## Getting the Flag

Now to get the actual flag, we just have to make the random number -5. This can easily be achieved by opening up gdb. We step through the program until we find the address after the random number is generated (approx address `0x5555555551eb`). For some reason, I had trouble setting register RBP which contains the value of `i` to -5 (it would always set to -9 instead), but I found an alternative was just to update the program counter to skip the comparison check and head straight into the if statement. Doing this makes the program print out the flag!

