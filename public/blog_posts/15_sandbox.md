---
title: Markdown Sandbox
description: A test blog post that contains all the markdown commonly used in writeups
author: Kevin Zhu
public: true
uploadDate: 2021-05-21 03:00+11:00
lastModified: 2021-05-21 03:00+11:00
notes:
tags:
- competitive programming
name: 15_sandbox
---

The markdown sandbox is designed to contain all the common things that I would likely use in a normal markdown writeup. Anytime I switch converters, I must check that it is compatible with all the features displayed on this page.

## Normal Text
Even aside from the rain and wind it hadn't been a happy practice session. Fred and George, who had been spying on the Slytherin team, had seen for themselves the speed of those new Nimbus Two Thousand and Ones. They reported that the Slytherin team was no more than seven greenish blurs, shooting through the air like missiles.

As Harry squelched along the deserted corridor he came across somebody who looked just as preoccupied as he was. Nearly Headless Nick, the ghost of Gryffindor Tower, was staring morosely out of a window, muttering under his breath, ". . . don't fulfill their requirements . . . half an inch, if that . . ."

"Hello, Nick," said Harry.

## Code Block
This is some `inline[0]` code.
Here is some cpp code
```{.cpp .numberLines startFrom="1"}
#include <cstdio>
int main () {
    printf("Hello World!\n");
    int a = 2, b = 3;
    printf("%d\n", a + b);
}
```
Here is some python code
```{.python .numberLines}
# this is a comment
print("Hello World!")
```
And here is the command to compile
```sh
pandoc ./public/files/blog_posts/sandbox.md -o ./public/files/blog_posts/out/sandbox.html --mathjax
pandoc ./public/files/blog_posts/sandbox.md -o ./public/files/blog_posts/out/sandbox_full.html --mathjax --standalone
```

## Lists
Here are my famous patented lists

- item 1
- item 2
    - sub item 1
    - sub item 2
- item 3

## Latex
And finally, displaying some maths. Here is some inline maths: $k$, $S$, $A_i$, $\lim_{t \to \infty} f(t)$, $\sum_{i=1}^n i^2$, $(P \cup Q)^c$. Next up, here is some display maths
$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$
I hope it pleases you greatly.
