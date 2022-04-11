---
title: "CTF Command Line Tools"
description: A list of common command line tools that are useful for solving CTFs
author: Kevin Zhu
public: true
uploadDate: 2022-04-11 23:28+11:00
lastModified: 2022-04-11 23:28+11:00
notes: ''
tags:
- capture the flag
menu:
  groups: []
  submenus: []
name: 46_ctf_commands
---

_For a list of software tools, please see [CTF Tools of the Trade](/blog/45_ctf_tools)._

Terminal commands are super useful. They give us a tonne of powerful shortcuts and utilities at the press of a few keystrokes. Here's how we can take advantage of them for use in CTF challenges. Below is a list of some of the common tools that I used when tackling CTF challenges. It's by no means exhaustive, but this list should at least cover the most frequently used ones in my arsenal.

This tutorial also does not cover the basic terminal commands, such as `ls, cd, mkdir ...` etc. For an in-depth tutorial on the basics of the command line, check out this [excellent tutorial series](https://ubuntu.com/tutorials/command-line-for-beginners) from Ubuntu.


### `file`
The `file` command can be used to analyse what type of file something is. Typically, the file extension should also give you a hint as to what the file is, but in the case where the extension is missing or altogether incorrect, the `file` command can be used to identify what's truly in a file.

Here's some usage examples
```term
$ file notes.md
notes.md: ASCII text
$ file final_submission.png
final_submission.png: PNG image data, 500 x 500, 8-bit/color RGBA, non-interlaced
$ file shimmy2
shimmy2: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /home/ubuntu/glibc/glibc-2.34-install/lib/ld-linux-x86-64.so.2, for GNU/Linux 4.4.0, BuildID[sha1]=7d9f6bf41778ec81867309e99b4cf6c847dfc65d, not stripped
```

### `strings`
`strings` is used to find the printable strings within a file. This is useful when searching through a large binary file for ASCII strings. Any ASCII string of length greater than 4 (you can change this with arguments) will output on a new line.

```term
$ strings filename
```

### `objdump`
`objdump` displays information from binaries. You can specify through the arguments exactly what you want it to do with a specific section of a binary.

Here are just a few of the use cases:
```sh
objdump -j .text -D ./shimmy2 # disassemble the code section of shimmy2
objdump -t ./chain # displays the symbol table entries of the file
objdump -h shimmy2 # display file header of shimmy2
```

### `grep`
`grep` is super useful for searching through the output of another command for a specific string. If the output of a command is too long to check by hand, then piping it into a grep command will make it only return the lines that match your search term.

If you know the format of your flag (e.g. COMP6841{...}), then you can grep for `COMP6841` in the output of `strings` in order to see if the flag is stored anywhere there in plaintext.

### `xxd`
`xxd` gives a hexdump of a file. The hexdump is essentially the bytes of the file, written out in hexadecimal. It is useful for looking at the bits of a file without actually looking at the individual bits (which are hard to read and take up way too much space).

We can even go one step further and use `xxd` with `vim` in order to edit the binary of a file. Simply follow these steps:

1. Open vim on the binary you want to modify
2. Type `:%!xxd` and press enter
    - This will convert your file into a hex dump
    - `%` selects the whole file
    - `!xdd` runs the xxd shell command
3. Edit the column on the left with your new hex values
4. Type `%!xxd -r` and press enter
    - This converts the hex back into binary
5. Save changes and quit

### `nc` (netcat)
`nc`, short for netcat, provides a wide range of commands related to connecting to and managing networks, and monitoring the flow of network data. It can be used to connect to servers, run port scans, listen for TCP connections, send files, and more.

Typically in CTF's, netcat is used to connect to a server hosting a program. You can then interact with the program as if it were a file on your own computer. The catch of course, is that unlike running it locally, you do not have access to the binary for that file. A handy tool for interacting with programs like this automatically is Pwntools. You can find out more in our [CTF Tools of the Trade](/blog/45_ctf_tools) tutorial.

### `nmap`
Nmap is a network scanner. A network scanner basically probes a computer netowrk by sending a bunch of packets, and analysing the responses for each one. This gives allows us to check what ports are open on a system, and even figure out additional information about the system such as what OS it is, or if it is susceptible to any common vulnerabilities.

To run a portscan on a device, do
```sh
sudo nmap -Sv -O target_ip -p-
```
- `-Sv` tells it to determine the version and type of service running on it (e.g. Apache web server)
- `-O` tells it to attempt to figure out the operating system
- `-p-` tells it to scan ALL ports

Sometimes running this can take a while (15 minutes), so it's worth taking a break while it's running.

### `netstat`
`netstat`, short for network statistics, is a command line tool that tells you information about the network connection states of currently running processes. For each connection, it will tell yout the protocol (TCP or UDP), the local and foreign address, and it's state.

Here's a sample usage of the command
```sh
netstat -ap
```
- `-a` means to show all connections, for both listening and non-listening sockets
- `-p` means to show the PID and name of the program that the socket belongs to

This command was used in [TutorCTF: Alice & Bob](42_tutorctf_alice_and_bob) in order to find the port number of a locally running server.

### `readelf`
`readelf` displays information about ELF (executable) files. The main way I used it was with the flag `-h`, which prints out information about an ELF files header.  This can give a tonne of useful information, such as the number of bits in an address, whether it's big or little endian, what version it is, the entry point etc.

```term
$ readelf -h shimmy2
ELF Header:
  Magic:   7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00
  Class:                             ELF64
  Data:                              2's complement, little endian
  Version:                           1 (current)
  OS/ABI:                            UNIX - System V
  ABI Version:                       0
  Type:                              DYN (Shared object file)
  Machine:                           Advanced Micro Devices X86-64
  Version:                           0x1
  Entry point address:               0x1070
  Start of program headers:          64 (bytes into file)
  Start of section headers:          14200 (bytes into file)
  Flags:                             0x0
  Size of this header:               64 (bytes)
  Size of program headers:           56 (bytes)
  Number of program headers:         16
  Size of section headers:           64 (bytes)
  Number of section headers:         30
  Section header string table index: 21
```

For some of the challenges in Tutor CTF, the ELF header was corrupt in some way. Running `readelf -h` on the file would typically give a warning saying that the header was corrupt. Typically fixing the first few bytes in the header would solve the problem, as was in [Tutor CTF: Shimmy](/blog/32_tutorctf_shimmy).

### `strace`
`strace` prints out every system call that is made by a program. System calls are anything that requires the underlying OS to handle, and include things such as reading, writing, printing, scanning, connecting to a network and more. It can be useful in working out exactly how a program is running.

An example use case taken from [Tutor CTF: Executable text file](/blog/38_tutorctf_executable_text_file) is:

```term
$ strace ./intro
execve("./intro", ["./intro"], 0x7ffe6cf19f80 /* 26 vars */) = 0
open("/dev/null", O_WRONLY|O_CREAT, 0644) = 3
write(3, "C", 1)                        = 1
write(3, "O", 1)                        = 1
write(3, "M", 1)                        = 1
write(3, "P", 1)                        = 1
write(3, "6", 1)                        = 1
write(3, "8", 1)                        = 1
write(3, "4", 1)                        = 1
write(3, "1", 1)                        = 1
write(3, "{", 1)                        = 1
write(3, "R", 1)                        = 1
write(3, "E", 1)                        = 1
write(3, "D", 1)                        = 1
write(3, "A", 1)                        = 1
write(3, "C", 1)                        = 1
write(3, "T", 1)                        = 1
write(3, "E", 1)                        = 1
write(3, "D", 1)                        = 1
write(3, "}", 1)                        = 1
close(3)                                = 0
exit(0)                                 = ?
+++ exited with 0 +++
```

Here, we see every call to `open()` and `write()` being used by the file.

### `ltrace`
`ltrace` is the sibling of `strace`. It runs the program, but also returns any dynamic library calls. It can also be used to trace system calls, jsut like `strace`. It's use cases are very similar, in that you would use it to gather information about how a program is executing.

### `base64`
`base64` takes in input from standard input and encodes or decodes it as base64. Here's a sample use case:

```term
$ echo "Hello there!" | base64
SGVsbG8gdGhlcmUhCg==
$ echo "SGVsbG8gdGhlcmUhCg==" | base64 --decode
Hello there!
```

### `openssl`
`openssl` is similar to base64, but it provides an entire suite of different encoding and decoding options. It is an open source implementation of the SSL and TLS protocols, and can do all sorts of encryption, decryption and hashing.

### `exiftool`
`exiftool` is a tool used to examine the metadata of files. Examining the metadata of files can be useful since they may give information such as the data of creation, date of last modification, the author, etc.

### `binwalk`
`binwalk` is a bit more of a niche tool. It's used for searching a file for any embedded files inside it.
Once found, we can extract it with `binwalk -e`.


