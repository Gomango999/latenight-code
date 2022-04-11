---
title: "Tutor CTF: bad_rand"
description: (150 points) Misc. Challenge
author: Kevin Zhu
public: true
uploadDate: 2022-04-08 22:30+11:00
lastModified: 2022-04-08 22:30+11:00
notes: ''
prevPage: 27_tutorctf_substitution
nextPage: 29_tutorctf_shuffle
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: []
  submenus: []
name: 28_tutorctf_bad_rand
---

_Contest Source: [COMP6[84]41 CTF](https://www.comp6841.com/challenges)_

> Note that all flags have been replaced with "COMP6841{REDACTED}". This is to discourage you from just blindly submitting the final answer, and to encourage you to follow along and learn something along the way.

Here, we're given a server to netcat to, as well as the vulnerable files that we are trying to exploit. Let's have a look at `vuln.c`:

```c
#include <stdlib.h>
#include <stdio.h>
#include <time.h>
#include <unistd.h>

int main() {
    sleep(1);
    time_t seed = time(NULL);
    srand(seed);
    int secret = rand();

    puts("(g)uess my secret");
    puts("(s)how my secret");
    printf("choose one: ");
    fflush(stdout);

    int c = fgetc(stdin);

    if (c == 'g') {
        printf("What's my secret? ");
        fflush(stdout);

        int guess;
        scanf("%d", &guess);
        if (guess == secret) {
            puts("COMP6841{the real flag will be here on the server!} (this is not the real flag)");
        } else {
            puts("nope. better luck next time");
        }
    } else if (c == 's') {
        printf("%d\n", secret);
        printf("%lx\n", seed);
    } else {
        printf("%c is not an option!\n", c);
        puts("pick either g or s");
    }

    fflush(stdout);
}
```

So we randomly generate a secret number, and we have the option to type `s` to show what the secret number was, or type `g` to guess the secret number. The only problem is that regardless of which option you make the program finishes directly after, which means that we won't have time to enter in our guess before a new secret is generated.

However, this program isn't as secure as you might think. Since we know the random seed is based exactly on the time (`time(NULL)` returns the current time in seconds), then as long as we know the time the program was run, then we know the random seed.

But even then, this still requires knowing the exact second the random seed was generated, which can be a little bit of a hassle to get. An easier an attack is to just connect to the netcat server twice in two different terminals in quick succession.

![_Two terminals side by side, connected at almost the same time._](/blog_posts/28_tutorctf_bad_rand/images/screen1.png){width=120%}

We can now show the secret for one of them, and guess the secret on the other. It might take a couple tries, but doing so nets us the flag :)

