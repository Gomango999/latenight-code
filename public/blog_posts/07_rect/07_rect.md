---
title: G. Rectangular City
description: 2018 ICPC Asia Singapore Regional Contest, Problem G Solution
author: Kevin Zhu
public: true
uploadDate: 2021-02-19 18:30+11:00
lastModified: 2021-02-19 18:30+11:00
notes: ''
tags:
- competitive programming
- icpc
- asiasg
menu:
  groups:
  - 2018_asiasg_icpc_regionals
  submenus: []
name: 07_rect
---

_Problem Source: [2018 Asia Singapore ICPC Regionals](https://asiasg18.kattis.com/problems)_

First, let's reword the question in a more formal sense:
> _How many ways are there of choosing $N$ rectangles in a $R \times C$ grid such that the intersection of all of them has area at least $K$?_

When we are working with rectangles, a common technique is to reduce the dimensionality of the problem. In this case, the 1D equivalent of finding the intersection of rectangles is finding the intersection of ranges on a line. One way we can formulate our 1D subproblem is:

> _For every range of length $i$, how many ways are there of choosing $N$ ranges from $0$ to $M-1$ such that their intersection has length exactly $i$?_

Let's suppose we solve this problem for when $M = R$ and store the results in `ycnt`, such that `ycnt[i]` is the number of ways to choose $N$ ranges to get length $i$. Additionally, we can do the same thing for $M=C$ and store that in `xcnt`. Then, we can simply loop through all possible $x$-axis ranges $i$ and $y$-axis ranges $j$. If $i \times j \ge K$, then we can simply add on `xcnt[i] * ycnt[j]` to our answer, since any choice of $N$ ranges on the x-axis can be uniquely combined with any choice of $N$ ranges on the y-axis to form $N$ rectangles with intersection area $i \times j$.

Now, how do we solve our subproblem? For length $i$, let's suppose we fix a position for the overlapping segment at $[j, j+i-1]$. To choose $N$ events that have this exact interval of overlap, we have to find $N$ positions for the endpoints in the range $[j+i-1, M-1]$ such that at least one of the endpoints lies on $j+i-1$. Similarly, we have to find $N$ positions for the startpoints in the range $[0, j]$ such that at least one of the endpoints lies on $j$. The number of ways of choosing endpoints such that at least one of them lies on $j+i-1$ is equal to the number of ways of choosing endpoints in the range $[j+i-1, M-1]$ minus the number of ways of choosing endpoints in the range $[j+i, M-1]$, i.e. we take off the number of ways where there are no endpoints that lie on $j+i-1$. Hence, we can get the formula for the number of ways to choose endpoints:

$$
\begin{aligned}
    ways &= ((M-1)-(j+i-1)+1)^N - ((M-1)-(j+i)+1)^N \\
        &= (M-j-i+1)^N - (M-j-i)^N \\
\end{aligned}
$$

We can apply the same method to find the number of ways to choose startpoints, and then multiply the two values together to get the number of ways to choose ranges that cover the exact interval $[j, j+i-1]$. Using binary exponentiation for the powers, this takes $O(\log N)$ time. Then, we can loop over every interval length $i$, and every starting point $j$ in order to calculate `xcnt` and `ycnt` in $O(N^2 \log N)$. Unfortunately, this is too slow and will get you a `TIME LIMIT EXCEEDED` when submitting.

We can speed things up by noticing that when we run binary exponentiation, we only take things to the power of $N$. Hence, we can just cache all the values of $1$ to $5000$ taken to the value of $N$ and reuse them to lower our complexity down to $O(N^2)$. Combining the results of the two dimensions together to get our final solution is also $O(N^2)$, so our final complexity is $O(N^2)$.

## C++
```{.cpp .numberLines}
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
#define MOD ll(1e9+7)
#define MAXN 5005

ll modadd(ll a, ll b) { return (a + b) % MOD; }
ll modsub(ll a, ll b) { return ((a - b) % MOD + MOD) % MOD; }
ll modmult(ll a, ll b) { return (a * b) % MOD; }
ll modpow(ll b, ll e) {
	ll a = 1;
	while (e) {
		if (e & 1) a = modmult(a, b);
		b = modmult(b, b);
		e >>= 1;
	}
	return a;
}
ll totheN[MAXN];

// given length M and N ranges, find the number of ways to have intersection = i for all i.
vector<ll> getcnt(ll N, ll M) {
	vector<ll> cnt = {0};
    // for each interval length i...
	for (ll i = 1; i <= M; i++) {
		ll ways = 0;
        // for each starting point j...
		for (ll j = 0; j < M-i+1; j++) {
			ll A = j + 1;
			ll B = M - (j + i - 1);
			// choose N starting points such that at least one is at j
			ll aways = modsub(totheN[A], totheN[A-1]);
			// choose N end points such that at least one of them is at j+i-1
			ll bways = modsub(totheN[B], totheN[B-1]);
			ways = modadd(ways, modmult(aways, bways));
		}
		cnt.push_back(ways);
	}
	return cnt;
}

int main () {
	ll N, R, C, K;
  	cin >> N >> R >> C >> K;

    // preprocess values of i^N
	for (int i = 0; i < MAXN; i++) totheN[i] = modpow(i, N);

	vector<ll> ycnt = getcnt(N, R);
	vector<ll> xcnt = getcnt(N, C);

	ll ways = 0;
	for (int i = 1; i <= R; i++) {
		for (int j = 1; j <= C; j++) {
			if (i * j >= K) {
				ways = modadd(ways, modmult(ycnt[i], xcnt[j]));
			}
		}
	}
	printf("%lld\n", ways);
}
```
