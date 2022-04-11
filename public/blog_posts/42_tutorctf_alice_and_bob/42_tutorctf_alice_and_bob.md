---
title: "Tutor CTF: Alice & Bob"
description: (750 points) Reverse Engineering
author: Kevin Zhu
public: true
uploadDate: 2022-04-11 18:25+11:00
lastModified: 2022-04-11 18:25+11:00
notes: ''
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: []
  submenus: []
name: 42_tutorctf_alice_and_bob
---

## Exploration

We are given a zip file containing two scripts: `alice` and `bob`. Running each of them individually gives:

``` term
$ ./alice
> Connecting to Bob...
Failed to connect() to bob
```

```term
$ ./bob
> Setting up socket to listen for alice
> Waiting for alice...
```

This appears to be some sort of server-client setup. Let's open a new terminal, and run them both side by side. Here are the outputs of both terminals:

``` term
$ ./alice
> Connecting to Bob...
> Waiting for key...
> Encrypting message with Bob's key...
> Sending encrypted message...
> Bye!
```

```term
$ ./bob
> Setting up socket to listen for alice
> Waiting for alice...
> Sending key to alice...
> Waiting for secret from alice...
> Bye!
```

It appears that this is the order of events:

1. Bob waits for Alice to connect
2. Alice connects
3. Bob sends Alice a key
4. Alice encrypts a message with Bob's Key
5. Alice sends the encrypted message to Bob and quits
6. Bob receives the encrypter message and quits

It's also clear that both scripts connect via localhost, since it would have been impossible to know my computers IP address when the challenge makers were making the challenge.

## Man in the Middle Attack
As the title suggests, we are to play the role of Eve, the eve-dropper. We'd like to have a script in the middle, which takes input from Bob and passes it on to Alice and vice versa, but not before taking a peek at the bytes that are being passed through.

The first challenge we have to solve is what port is Bob listening on? We can solve this problem by running `netstat -ap`, which gives us a list of processes and the ports they are listening on. Running this, we get:

```
tcp        0      0 127.0.0.1:31337         0.0.0.0:*               LISTEN      1000       943147     155281/./bob
```

This means that Bob is listening on port 31337. Nice!

Next, let's make a fake Alice script that will connect to Bob, and see what key Bob sends them. Our script looks like this:

```python
from pwn import *

conn = remote("127.0.0.1", 31337)

ret = conn.recv()
print(ret)

print("Sending encrypted message!")
conn.sendline(b"hello this is a totally valid encrypted message!")
conn.sendline(b"hello this is a totally valid encrypted message!")
conn.sendline(b"hello this is a totally valid encrypted message!")
conn.close()
```

```term
$ p3 client.py
[+] Opening connection to 127.0.0.1 on port 31337: Done
b'y\x81L}?\x80]\xd9u\xf99\x8b\x96TiI'
Sending key!
Traceback (most recent call last):
  File "/home/ubuntu/.local/lib/python3.8/site-packages/pwnlib/tubes/sock.py", line 65, in send_raw
    self.sock.sendall(data)
BrokenPipeError: [Errno 32] Broken pipe

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "client.py", line 11, in <module>
    conn.sendline(b"hello this is a totally valid secret!")
  File "/home/ubuntu/.local/lib/python3.8/site-packages/pwnlib/tubes/tube.py", line 798, in sendline
    self.send(line + self.newline)
  File "/home/ubuntu/.local/lib/python3.8/site-packages/pwnlib/tubes/tube.py", line 777, in send
    self.send_raw(data)
  File "/home/ubuntu/.local/lib/python3.8/site-packages/pwnlib/tubes/sock.py", line 70, in send_raw
    raise EOFError
EOFError
[*] Closed connection to 127.0.0.1 port 31337
```

Our program crashes because we don't handle the rest of the shutdown properly. However, we got what we wanted: The key that Bob sent us is `b'y\x81L}?\x80]\xd9u\xf99\x8b\x96TiI'`. It's worth noting that each time we run this script, the key that Bob sends us is different.

Anyway, let's try and find out what Alice would typically send back if we were to really give her this key. Hence, we write a similar script, this time from the perspective of Bob.

```python
from pwn import *

l = listen(port=31337, fam='ipv4', typ='tcp')
c = l.wait_for_connection()

msg = b'y\x81L}?\x80]\xd9u\xf99\x8b\x96TiI'
c.sendline(msg)

ret = c.recv()
print(ret)

c.close()
```

Running this as well as Alice's script, we get:

```term
$ p3 server.py
[+] Trying to bind to 0.0.0.0 on port 31337: Done
[+] Waiting for connections on 0.0.0.0:31337: Got connection from 127.0.0.1 on port 34108
b'\x92.\x1e9\xf4\xfb}VE\xf5\x8b\xf6\xec\xa9j\xb0\xb0\xea\x9cFq\xba\xab\xa2%\xa2\x93(\x19\x89\x95\x16s\x12V|v\xad\x9d\xd7\x92\xf8\xaa\xf8loc\xc3'
[*] Closed connection to 127.0.0.1 port 34108
```

In other words, we got `b'\x92.\x1e9\xf4\xfb}VE\xf5\x8b\xf6\xec\xa9j\xb0\xb0\xea\x9cFq\xba\xab\xa2%\xa2\x93(\x19\x89\x95\x16s\x12V|v\xad\x9d\xd7\x92\xf8\xaa\xf8loc\xc3'` as the encrypted message.

Unfortunately, we are still no closer to solving the problem. All we have is a seemingly random key, as well as a encrypted flag. However, our efforts have given us a better understanding of the protocol involved. Next up, let's try using Ghidra to reverse engineer our code.

## Corrupt Headers
... at least, we'd like to. Unfortunately, Ghidra cannot seem to guess a compiler, and hence can't decompile our code. In fact, trying to run GDB on this file fails too:

```term
$ gdb alice
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
"/home/ubuntu/tutor_ctf/alice_and_bob/test/alice": not in executable format: file format not recognized
(gdb) run
Starting program:
No executable file specified.
Use the "file" or "exec-file" command.
(gdb)
```

It doesn't even seem to be able to identify that Alice is an executable file! Running `readelf -h` on Alice and Bob gives a similar error message:

```
$ readelf -h alice
ELF Header:
  Magic:   7f 45 4c 46 01 01 01 00 00 00 00 00 00 00 00 00
  Class:                             ELF32
  Data:                              2's complement, little endian
  Version:                           1 (current)
  OS/ABI:                            UNIX - System V
  ABI Version:                       0
  Type:                              EXEC (Executable file)
  Machine:                           Advanced Micro Devices X86-64
  Version:                           0x1
  Entry point address:               0x4010de
  Start of program headers:          0 (bytes into file)
  Start of section headers:          64 (bytes into file)
  Flags:                             0x0
  Size of this header:               0 (bytes)
  Size of program headers:           0 (bytes)
  Number of program headers:         0
  Size of section headers:           0 (bytes)
  Number of section headers:         0
  Section header string table index: 0
readelf: Warning: possibly corrupt ELF file header - it has a non-zero section header offset, but no section headers
```

Just like some of our previous exercises (e.g.[shimmy](/blog/32_tutorctf_shimmy)), it seems like the headers are corrupt. For reference, here's how a regular header (`./vuln` from [bad_rand](/blog/28_tutorctf_bad_rand)) looks like:

```term
$ xxd ./vuln | head -2
00000000: 7f45 4c46 0201 0100 0000 0000 0000 0000  .ELF............
00000010: 0300 3e00 0100 0000 d010 0000 0000 0000  ..>.............
```

Comparing the two, we see that `vuln` has `0x02` in the 5th byte, instead of a `0x01`. Checking the [Linux Foundation ELF Header Specs](https://refspecs.linuxfoundation.org/elf/gabi4+/ch4.eheader.html), this byte is called `e_type` and defines the object file type. `0x01` means a "Relocatable file", whereas `0x02` represents a "Executable file". We can use a hexeditor to make the change, and now both Ghidra and GDB work again!

## Reverse Engineering

Opening up Alice in Ghidra, and cleaning it up a little bit, we get the following:

![](/blog_posts/42_tutorctf_alice_and_bob/images/image1.png){width=70%}

Hence, we see that at one point in lines 40-49, the flag is loaded in memory. It's possible to reverse engineer the encrypt function, and then also control the key that Bob sends in order to extract out the flag from Alice. However, the easiest method would be just to open up Alice in GDB and inspect the memory. And sure enough, after stepping through and printing out the stack with `x/5s %sp`, we're able to get the flag.

