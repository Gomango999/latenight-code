---
title: "CTF Tools of the Trade"
description: A list of useful tools and software for capture the flags.
author: Kevin Zhu
public: true
uploadDate: 2022-04-11 22:03+11:00
lastModified: 2022-04-11 22:03+11:00
notes: ''
tags:
- capture the flag
menu:
  groups: []
  submenus: []
name: 45_ctf_tools
---

_For a list of command line tools, please see [CTF Command Line Tools](/blog/46_ctf_commands)._

As with any profession, having the right tools is crucial for completing any task. After progressing through so many CTF challenges, here's a list of tools that came up time and time again. I'll be sharing a brief synopsis of what the tool is, how to use it, and what tasks it's good at solving. By the end of this, you should have an idea of the common tools that are necessary for CTF challenges.

### Text Editor
This one is a bit of a no brainer compared to the others on this list, but it's so well used that I had to include it on this list.

A text editor is a way to view the contents of a file and potentially edit some of its contents. It's extremely useful in the exploratory steps, since it allows you to very quickly get an idea of what a file contains. You can very quickly identify a bunch of important things, such as how large the file is and what type of file it is. If it's a program, then sometimes strings in the program are stored in plain text. I can't count how many times I was just looking through a file in a text editor, and happened to find the plain-text flag nestled in there.

Text editors come installed by default on almost all machines. On Windows, it's notepad. On Mac, it's TextEdit and on Linux, it's gedit. Of course, you can install your own, which typically have more useful features than the default text editors given. Examples include Sublime, Atom, and VSCode.

### GDB
GDB stands for the GNU Project Debugger, and is a useful tool for looking at exactly what is happening when a program is run. Essentially, what GDB does is that it gives you access to the underlying assembly code and registers, and allows you to view them as you step through your program. You have access to all sorts of tools, such as stepping through code, setting breakpoints, viewing the stack, or even manually changing the values of variables and registers halfway through execution.

In CTF's GDB is useful for viewing the underlying assembly and viewing the program state at any point. As an example, suppose a program generates a random number, and then asks you to input it without showing you the random number. With GDB, you can take a peak at the variable that stores the random number while the program is running, and then enter it in.

Below is a short cheat sheet for some of the common commands in GDB.

#### Basic GDB Commands
Here are some of the basic commands of GDB:

- `run` or `r`
    - runs the program.
- `start`
    - runs the program, but sets a breakpoint in the main function.
- `stepi` or `si`
    - runs the next machine instruction. It will step into function calls.
- `nexti` or `ni`
    - runs the next machine instruction. However, it will step over function calls.
- `break *0x12345678`
    - sets a breakpoint at address `0x12345678`
- `continue` or `c`
    - runs the program until we hit a breakpoint or the program completes
- `info functions`
    - gives a list of all functions in the program, and their addresses
- `info variables`
    - gives a list of all variables in the program
- `quit` or `q`
    - quits gdb
- `disassemble <function>`
    - shows you the assembly code for a particular function

#### Advanced GDB Commands
And here are some of the more advanced ones:

- `set disassembly-flavor intel`
    - Sets the way assembly is displayed to use intel flavor
    - This seems to be preferred by users because it's easier to read.
- `starti`
    - runs the program,  but set a breakpoint at the first line of machine code.
- `info file`
    - gives a list of sections and their addresses. Useful for finding the entrypoint into the code.
- `layout asm`
    - shows the assembly code, and gives you a visual representation of where you are up to in code execution.
- `info registers`
    - gives a list of all registers
- `p $rip`
    - prints out the value stored in register `$RIP`
    - also works with variable names
- `set $eax = 0`
    - sets the value of register `$EAX` to 0.
    - also works with variable names
- `x 0x12345678`
    - display the contents of memory at a particular address
    - we can also specify how to print it. For example
        - x/c to print as char
        - x/x to print as hex
        - x/s to print as array
- `x/20x $sp`
    - prints the first 20 values off of the stack
- `jump <function>`
    - Set the program counter to the start of a particular function

### Pwndbg
Pwndbg is a GDB plugin that makes debugging in GDB alot easier. Though technically feature complete, GDB can be a bit hard to work with at times due to is non-user-friendly nature. Pwndbg is a python module that is loaded directly into GDB, which provides a bunch of utilities, tools, and shortcuts to make debugging in GDB much smoother.

Some features that it includes are

- Showing arguments to functions when they are called
- Displaying the current context, including registers, code, stack, and backtrace
- Ability to add expressions to be watched by the context, and displayed
- Ability to show decompiled source code from the Ghidra Decompiler (with the help of Radare2)

### Ghidra
Ghidra is a software reverse engineering suite of tools, developed by the NSA. It's most useful feature is the decompiler, which allows you to take an executable, and then give a possible version of the original C code that was used to compile it. This is great for when you want to work out how a binary file works, but you don't have access to the original source code, and you don't want to spend hours trawling through the assembly and keeping track of which registers and stack positions store which variables.

However, while decompiling sounds awesome for debugging, it's important not to rely too much on the decompiler output. For a start, variable and function names are not preserved, so you will often have to spend some time in the beginning going through and taking a guess at what each variable stores and or what each function does. Ghidra provides tools to allow you to rename variables as you work out what they do, as well as add comments, but you will have to manually make these changes.

Also often times the code can changed on decompilation, and some of the original logic may be obfuscated. For example, a typical string might be instead broken up into 7 different variables. In other cases, functions do not display their arguments, and it's up to you to read the corresponding assembly code in order to try and figure out what is being passed into the function. Hence, it's important to treat the decompiled code as merely a guideline, and to only often refer to the corresponding assembly code to tell you what is really happening.

### Pwntools
`pwntools` is a CTF framework and exploit development library. It's written in python, and provides a bunch of tools which allow you to rapidly prototype code and help with exploiting code. Though there are many useful features, there are two that I have used the most:

- Sockets (`pwnlib.tubes.sock`)
    - Allows you to connect to any remote server, and send and receive bytes from it.
- Processes (`pwnlib.tubes.process`)
    - Allows you to connect to any process, and send and receive bytes from it.

Pwnlib (the name of the python module) is very useful in automating interactions with programs. Suppose that you have a program where you have to go through a 10 step process before you can enter in some input for an exploit. It would certainly be very tedious to go through those steps every time you wanted to test your exploit so instead, you can automate it in a python script using pwntools. Pwnlib is also really useful if we want to brute force something, since it allows us to rapidly make new connections and test things until we get it right.

Here's an example, taken from the [Cookie Monster](/blog/31_tutorctf_cookie_monster) challenge from Tutor CTF. We use Pwnlib in order to test the exact right offset for our buffer overflow attack.

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

Here, we connect to a server, and then brute force a bunch of different inputs. Note that we use `recvuntil` in order to sync our python script with the program. `recvuntil` causes our program to wait until we receive the message `"Feed the cookie monster: "` before offering up our own input.

### HexFiend (or other Hex Editor)
HexFiend is a macOS tool for editing hex files. Sometimes, header files can get corrupt, and it's important to be able to manually access them and change their values.

If you don't have HexFiend, you can still edit hex through alternative methods. Here are the steps

1. Open vim on the binary you want to modify
2. Type `:%!xxd` and press enter
    - This will convert your file into a hex dump
    - `%` selects the whole file
    - `!xdd` runs the xxd shell command
3. Edit the column on the left with your new hex values
4. Type `%!xxd -r` and press enter
    - This converts the hex back into binary
5. Save changes and quit

### GIMP (or other Image Editor)
GIMP is an open source image editor. Certain challenges (mainly forensics ones) require you to open an image file and examine it's contents. Furthermore, certain techniques, such as LSB steganography require you to change the level curves of an image, or modify an image in other ways in order to obtain a flag.

### Chrome Developer Tools
Chrome Devtools are a set of builtin tools that can be used to analyse web pages. One of it's major use cases is "Inspect Element", where you can right click on any element on a page ane view the HTML code. You can also look at CSS and Javscript, network packets, cookies and more. There is such a broad range of applications that it would be impossible to list them all here. These tools are an absolute must for any sort of web exploitation.

### Burp Suite
Burp Suite provides a a whole host of tools for web exploitation. Some of it's features include:

- Spider
    - A web spider / crawler that is used to find a list of all the endpoints of a particular website
- Proxy
    - Provides an intercepting proxy that allows you to view and/or modify incoming and outgoing requests.
- Decoder
    - Supplies some common encoding methods such as URL, HTML, Base64, Hex etc.

The full version of Burp Suite costs $400, and contains more tools such as a scanner that automatically goes to a website and tests a bunch of common vulnerabilities. However, we can still get the community version with most of the tools for free.

### Radare2
Radare2 is a framework for reverse engineering and analyzing binaries. It's usage is similar to GDB in that we can step through assembly code, but it has a tonne of other really useful tools as well which make it alot more powerful. It's even lower level than GDB, which means that it can do some things that GDB can't.

> _Note: All the challenges I've done so far I have completed with just vanilla GDB. All writeups are written up with that restriction in mind._



