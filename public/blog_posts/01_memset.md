---
title: How to Use Memset
description: Using memset to make array initialisation a breeze
author: Kevin Zhu
public: true
uploadDate: 2020-06-06 14:00+11:00
lastModified: 2020-06-06 14:00+11:00
notes: ''
tags:
- competitive programming
name: 01_memset
---

You may have noticed the following line of code in peoples answers to programming competitions:
```{.cpp .numberLines}
#include <cstring>
int main () {
  //...
  int dp[1005];
  memset(dp, 0xcf, sizeof(dp));
  //...
}
```
But what does it mean, and how can we take advantage of it in our own code? First lets have a look at what `memset` is.

## What is memset?
`memset` is a function from the `cstring` library. According to [cplusplus.com](http://www.cplusplus.com/reference/cstring/memset/), we have:
> `void * memset ( void * ptr, int value, size_t num );`
>
> Sets the first num bytes of the block of memory pointed by _ptr_ to the specified _value_ (interpreted as an `unsigned char`).

In other words, memset replaces the first `num` bytes in memory to become equal to `value`. For example `memset(dp, 0, sizeof(dp))` allows us to initialise an array to all `0` in one line.

So memset is a cool one liner that allows me to initialise my array to any value right? Well, not quite....

## The Catch
 Consider the following example:
```{.cpp .numberLines}
#include <cstring>
int main () {
  int a[3], b[3], c[3];
  memset(a, 0, sizeof(a));
  memset(b, -1, sizeof(b));
  memset(c, 1, sizeof(c));
}
```
This should initialise `a` to all `0`, `b` to all `-1`, and `c` to all `1` right? Well lets take a closer look at the values of the arrays in the function after the command is run (you can check these for yourself):
```
a = {0, 0, 0}
b = {-1, -1, -1}
c = {16843009, 16843009, 16843009}
```
What? `memset` worked for 0 and -1, but gave some strange value for 1!

Notice how the definition tells us that `value` is converted into type `unsigned char` before use, which only holds 1 byte of information. The trap is that memset only fills one **byte** at a time. If our array is of type `int`, with 4 bytes in an `int`, then memset will fill every `int` with the same byte repeated 4 times. Lets look at what these looks like for these 3 numbers:
- `(unsigned char)(0)` = `0x00` which when repeated 4 times gives `0x00000000` = `0`
- `(unsigned char)(-1)` = `0xff` which when repeated 4 times gives `0xffffffff` = `-1`
- `(unsigned char)(1)` = `0x01` which when repeated 4 times gives `0x01010101` = `16843009`

Notice that the reason that `0` and `-1` work is because their `unsigned char` conversion repeated 4 times is equal to its integer representation in memory. However, this is generally not true, as we see with the case of `1`.

## Usage
Now that we're aware of that pitfall, we can investigate how we can use this to our advantage in competitive programming. It is commonly the case that we need to initialise some sort (potentially multidimensional) array to INT_MAX, like so:
```{.cpp .numberLines}
int dp[R][C];
for (int y = 0; y < R; y++) {
  for (int x = 0; x < C; x++) {
    dp[y][x] = INT_MAX;
  }
}
```
This takes forever to write out. Instead, we can simply replace it with the following memset:
```{.cpp .numberLines}
int dp[R][C];
memset(dp, 0x3f, sizeof(dp))
```
Here `sizeof` works regardless of the number of dimensions in dp. `0x3f` repeated 4 times is `0x3f3f3f3f` gives the value `1061109567`. The reason we choose this number for infinity is because it is less than half of INT_MAX. Adding this number to itself does not overflow, thus giving us some safe guard. Of course, if we are careful, we may instead use a number that will get us much close to the `INT_MAX` value.

Here are some common values to use memset with.
- `0` to set to `0`
- `-1` to set to `-1`
- `0x3f` to set to approx. half `INT_MAX` (`1061109567`)
- `0xc0` to set to approx. half `INT_MIN` (`-1061109568`)
- `0x7f` to set to approx. `INT_MAX` (`2139062143`)
- `0x80` to set to approx. `INT_MIN` (`-2139062144`)

And for reference,
- `INT_MAX` is `2147483647`
- `INT_MIN` is `-2147483648`

Just note that some people use other values that may be easier to memorise for them. I've seen `0xcf` and `0xbf` both used before in competition. It all comes down to personal preference. Other than that, using `memset` is a quick and easy way to initialise an array, and theres no reason you shouldn't be using it for any of your array initalisations.

> 16/02/20 - My opinion has changed since I wrote this article. I find that using the `fill` command from the standard algorithm library to set to `INT_MAX` is easier to remember and easier for others to read as well. More readable code leads to less bugs!
