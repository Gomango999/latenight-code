---
title: "Codeforces 1163 C2 - Power Transmission (Hard Edition)"
description: Tips and tricks for how to represent lines in code.
author: Kevin Zhu
public: true
uploadDate: 2023-02-04 23:47+11:00
---

> Problem Link: [https://codeforces.com/contest/1163/problem/C2](https://codeforces.com/contest/1163/problem/C2)

_**Problem**: You are given $N$ points on a 2D plane. Between every pair of points, there is an infinite straight line that passes through those two points. How many pairs of lines intersect with one another? Note that if there are more than two points lying on the same line, it counts as a single line. $N \le 1000$_

We know that for any pair of lines, if they are not parallel, then they must intersect somewhere. Therefore, we can reduce the problem to just finding for each gradient, how many unique lines of that gradient exist. 

Now mathematically speaking, this is easy to do, but how do we actually do this in code? You might think that it is worthwhile just to loop each pair of points, and generate a line equation from each pair of points. For each line equation, we can use a hashset to make sure that we are not considering a line that we've seen before. If it's a new line we haven't seen before, then we can increase the count of the number of lines with that gradient using a hashmap. Finally, we can loop over our hashmap and assume that every line of a particular gradient will intersect with every single other line to compute our answer. Seems good right? Well the devil is in the details. Let's examine how we would actually represent out lines in code.

Let's say that we choose to represent every line by the formula $ax - by = c$. In other words, for each line, we only store the variables $a$, $b$, and $c$ as floats. Doing a bit of maths, we can find out that the gradient of this line is given by $a/b$. Now, there's a couple issues with this.. Firstly, when the line is vertical calculating the gradient will involve dividing by 0, which is a big no no. We'll tackle that problem later. The other problem right now is that if we use floats, we become susceptible to precision errors.

### The Problem with Floating Points

Let's say we want to compare two lines to see if they have the same gradient. Then we're going to have to compare the value of one float against another. The issue here is that computers aren't very good at storing floating point numbers. This is because there are an infinite number of floating point numbers that a computer needs to represent, but only in a finite set of bits. Compromises have to be made, and so computers only store a subset of the possible floating point numbers. This gives rise to precision errors, where the computer is unable to perfectly store the results of calculations, which can lead to some really surprising results. To test this for yourself, try comparing the results of $0.1 + 0.2$ with $0.3$ in the language of your choice. 

```python
print(0.1 + 0.2 == 0.3)
# False
```

What happened? Let's take a look at what $0.1 + 0.2$ actually evaluates to:

```python
print(0.1 + 0.2)
# 0.30000000000000004
```

As you can see, we have hit upon a precision error. This is why in general, when comparing floats, you should always use some sort of margin of error. Modifying our above code looks like this:

```python
EPS = 0.000001
print(abs((0.1 + 0.2) - 0.3) < EPS)
# True
```

This helps, though if possible we'd like to avoid it since it does introduce a small chance of presicion error (however small). To deal with this, when we can, we like to work with _integers_ instead. That way, there is no ambiguity when adding, multiplying and dividing numbers. 

### Standardising Lines

Okay, let's return to our formula $ax - by = c$, but this time, we are storing values of $a$, $b$ and $c$ using integers. This is possible, since the points given to us in the question are integers (if they weren't, we'd be forced to put up with the precision errors). We can use the following 3 equations to compute our $a$, $b$ and $c$ values:

$$a = y_1 - y_2, $$
$$b = x_1 - x_2,$$
$$c = a x_1 - b y_1. $$

Now, each line is uniquely determined by it's $a$, $b$ and $c$ values right? Well yes, but it doesn't mean that every unique $a$, $b$ and $c$ value correspond to a unique line. Imagine the following two lines:

$$x - 2y = 3$$
$$3x - 6y = 9$$

These two are clearly the same line, but our values are different! Therefore, the first thing that we should do is to find the [gcd](https://en.wikipedia.org/wiki/Greatest_common_divisor) of $|a|$ and $|b|$, and divide through by them (note that we don't need to include $c$ in our gcd, since $c$ is already a integer linear combination of $a$ and $b$). 

But we still run into another issue, which is negative numbers. Consider the following two lines:

$$x - y = 1$$
$$-x + y = -1$$

Once again, these are the same line, we cannot divide out anything via gcd, but their $a$, $b$ and $c$ values are still different. To standardize this line, we enforce that $a$ must be non-negative. Furthermore, if $a$ is 0, then we enforce that $b$ is positive. To make this condition true, we can simply multiply all values of $a$, $b$ and $c$ by negative one as needed. 

At this point, we have standardized all lines. This means that if we apply all the following steps, then there is a one-to-one mapping of $a$, $b$, and $c$ values with a line. Even better, the gradient can be uniquely represented as the pair ($a$, $b$) and once again, the gradient values are standardized as well. Even even better, we are now dealing with vertical lines for free! After standardisation, all vertical lines will be represented with $a = 1$ and $b = 0$. Returning the gradient as a pair means that we don't actually ever divide by 0, which is a big bonus!

### Summary

In short, to represent a line passing through $(x_1, y_1), (x_2, y_2)$ in standardized form:

1. Let $a = y_1 - y_2$
2. Let $b = x_1 - x_2$
3. if $a$ is negative, then multiply $a$ and $b$ by $-1$.
4. if $a$ is 0 and $b$ is negative, then multiple $a$ and $b$ by $-1$.
5. Let $g$ be the gcd of $a$ and $b$. Divide $a$ and $b$ by $g$.
6. Let $c = a x_1 - b y_1$

This gives us the very nice properties that:

- the line is uniquely represented by $a$, $b$ and $c$
- the gradient is uniquely represented by $a$ and $b$
- vertical lines have $a = 1$ and $b = 0$ 

And finally, bringing this all back together to solve our original problem, here is the code:

```C++
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef array<ll, 3> a3;
typedef pair<ll, ll> pii;
#define x first
#define y second
#define pb push_back
#define all(x) x.begin(), x.end()
#define sz(x) int(x.size())
#define rep(i, n) for (int i = 0; i < (n); i++)
 
#define MAXN 1005
 
ll gcd(ll a, ll b) {
    if (b == 0) return a;
    else return gcd(b, a%b);
}
 
// We define the following standard form: ax - by = c
// a and b are such that a/b is it's simplest form.
// if a is non-zero, it is positive
// if a is zero, then b is positive
// c = ax-by
// note: by definition, line is vertical iff a=1 and b=0.
struct Line {
    ll a, b, c; // ax - by = c
    Line(pii p1, pii p2) {
        a = p1.y - p2.y;
        b = p1.x - p2.x;
 
        if (a < 0 || (a == 0 && b < 0)) a *= -1, b *= -1;
        ll d = gcd(abs(a), abs(b));
        a /= d, b /= d;
 
        c = a * p1.x - b * p1.y;
    }
    pii gradient() {
        return {a, b};
    }
};
 
pii ps[MAXN];
 
int main () {
	ios_base::sync_with_stdio(false); cin.tie(NULL);
    
    int N;
    cin >> N;
    rep(i, N) cin >> ps[i].x >> ps[i].y;
 
    set<a3> seen;
    map<pii, int> grads;
 
    rep(i, N) rep(j, i) {
        pii p1 = ps[i];
        pii p2 = ps[j];
 
        Line l(p1, p2);

        // ignore this line if we've seen it before
        if (seen.count({l.a, l.b, l.c})) continue;
        seen.insert({l.a, l.b, l.c});
        
        // increment the number of lines with this gradient.
        grads[l.gradient()]++;
    }
    
    // compute total number of intersections
    ll total_lines = 0;
    ll total = 0;
    for (auto p : grads) {
        total += total_lines * p.y;
        total_lines += p.y;
    }
    printf("%lld\n", total);
}
```
