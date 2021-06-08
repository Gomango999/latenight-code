---
title: Brute Force Comparison
description: How to use brute force algorithms to debug your code (with code examples)!
author: Kevin Zhu
public: true
uploadDate: 2021-06-05 18:00+11:00
lastModified: 2021-06-05 18:00+11:00
notes: ''
tags:
- competitive programming
menu:
  groups: []
  submenus: []
name: 16_brute_comparison
---

## What is Brute Force Comparison?
Brute force comparison (BFC) is an excellent method to bug fix your code, when other conventional methods (i.e. staring at your code for 3 hours straight) have failed. More specifically, we use BFC to try and find a failing input case for our code. The main idea is that brute force algorithms are simpler and are less likely to have bugs in them, so if we write a brute force algorithm and then compare it to our bugged code across hundreds of randomly generated test cases, we are bound to find a breaking case.

BFC is best used when:

- The program is giving `WRONG ANSWER` on submission, but performs correctly on every test case you try it on.
- You can easily write a brute force solution and a random input generator for the problem.
- You suspect that your program can fail on inputs which are very small.

The reason why we want to find a failing case with a small input size is two-fold:
Firstly, brute force solutions are generally far too slow to process large inputs. Secondly small inputs mean you can walk through them by hand and compare it to your program execution.


## How to do Brute Force Comparison
### Incorrect Solution
To start off, you should already have a piece of code which passes sample cases, but still gets a `WA` or `RE` on submission. As an example, we use a piece of my own code which I used for the problem [Magical String](https://asiasg18.kattis.com/problems/magicalstring). This code in particular passes the first two test cases, but produces an incorrect answer on the third. I spent many hours trying to find a breaking case to no avail, so now it's earned the ability to be immortalised in this blog post.

!!! downloads blog_posts/16_brute_comparison/code/e_broken.cpp

### Brute Force Solution
Next, we need to implement a brute force solution. Luckily, the official writeup for [Magical String](https://asiasg18.kattis.com/problems/magicalstring) also describes such a brute force solution, so I was able to just copy their idea without too much difficulty. To maximise the chance that your brute force solution won't have the same bug, avoid copy pasting any code from the original into your brute force implementation. Furthermore, if your brute force has a section that does the same thing as your original, consider using an alternate method to do it, to make it as different as possible.

!!! downloads blog_posts/16_brute_comparison/code/e_brute.cpp

### Input Data Generator
After that, write out an input data generator for your code, which should take in an argument which will seed the random function. This is important because it allows you to reproduce the failing test case when needed. Needless to say, your input data generator should always produce a valid input for the problem, and also should be designed so that altering the size of the input is as easy as changing the value of a single variable.

Here is an example of my `gen.py` generator code. For this particular problem, we needed to generate strings of length $N$, such that no string has the same character repeated more than 3 times in a row. To simplify the inputs further, we only use the letters a, b, and c.

```{.python .numberLines}
import random
import sys

# seed the random generator
if len(sys.argv) == 1:
    random.seed(0)
else:
    random.seed(sys.argv[1])

# define variables
T = 1 # number of test cases
N = 9 # length of each string

print(T)
for i in range(T):
    s = ""
    K = random.randint(1,min(N+2, 1000))

    # generate a string length N
    # - it should only contain the letters a,b,c
    # - it cannot contain 3 of the same letter in a row
    for j in range(N):
        # generate character until not three in a row
        c = chr(random.randint(ord('a'), ord('c')))
        while j >= 2 and c == s[-1] == s[-2]:
            c = chr(random.randint(ord('a'), ord('c')))

        s += c

    print('{} {}'.format(s, K))
```

### Comparison Script
Finally, we need a comparison script. This is a bash script that will run our programs against all the test cases, and check to see if there is any difference in the output. Here is what mine looks like:
```{.sh .numberLines}
make
for i in {0..499}; do
    OUT1=$(python3 gen.py $i | ./e_broken)
    OUT2=$(python3 gen.py $i | ./e_brute)

    echo $i
    if [ "$OUT1" != "$OUT2" ]; then
        echo "-----"
        echo "Error at test case $i!"

        echo $(python3 gen.py $i)

        echo "output (e_broken.cpp):"
        echo $OUT1

        echo "output (e_brute.cpp):"
        echo $OUT2

        exit
    fi
done
```

It first compiles the two files using make, then loops through test cases 0 to 499. For each test case, we generate the relevant input using `python3 gen.py $i`, and then store the output of `e_broken` and `e_brute` into `$OUT1` and `$OUT2` respectively. If there is a difference in `$OUT1` and `$OUT2`, we will print out the test case and respective outputs before stopping the script.

> _In case you're curious, the failing input case was `1 bbaabaabb 9`. The bug was that I had missed case 3 when generating extended segments, as I describe in my writeup [here](./14_magic). You can also view the corrected code there as well._

### Tips and Tricks
Here are some final tips and tricks for using BFC.

- If you find a mismatch, don't forget that it's possible that your brute force is bugged as well.
- Whenever you find a mismatching test case, write down which parameters caused the mismatch to be found before experimenting with even smaller input sizes.
    - This is because we always want the smallest possible input size for our failing test case, to make manually working out the solution easier.
- Only use this technique when solving in your own time, and as a last resort.
    - This is because it takes a very long time to write the brute force solution, input generator and comparison script, as well as debugging your code after that.
    - This technique is difficult to use in contest environment for the same reason.
