---
title: D. Bitwise
description: 2018 ICPC Asia Singapore Regional Contest, Problem D Solution
author: Kevin Zhu
public: true
uploadDate: 2021-05-24 18:30+11:00
lastModified: 2021-05-24 18:30+11:00
notes: ''
tags:
- competitive programming
- icpc
- asiasg
menu:
  groups:
  - 2018_asiasg_icpc_regionals
  submenus: []
name: 13_bits
---

_Problem Source: [2018 Asia Singapore ICPC Regionals](https://asiasg18.kattis.com/problems)_

As the name implies, we work with the bits of each number in $A$. Let's define a valid segmentation in terms of $X$ as dividing $A$ into $K$ contiguous non-empty segments such that each section contains $X$. We say a section (or it's bitwise \texttt{OR}) contains $X$ if for every set bit in $X$, there exists a number in the section which also has that bit set. Now suppose we had a function $can(X)$, which tells us if there exists a valid segmentation of $A$ in terms of $X$. The answer is now simply finding the largest value of $X$ such that $can(X)$ returns true.

#### Greedily Taking Bits

We do this by taking each bit from the most significant to the least significant greedily. Let's assume the largest bit that can be set is the $31^{st}$ bit, so we start $X$ as all zeros, and let $i$ loop from 31 down to 1. We then run $can(X \mid 2^{i})$, where $\mid$ is the bitwise $\texttt{OR}$. If it returns true, then set $X$ to $X \mid 2^{i}$. Otherwise, try again for the next $i$. Once we have done it for all $i$, we print out $X$ as our answer. This has the effect of working out the $i^{th}$ bit of the final answer in the $i^{th}$ iteration.

The reason this greedy solution works is as follows: Let's consider the first iteration, where $X = 0$ and $i = 31$, so $X \mid 2^{i} = 2^{31}$. If $can(2^{31})$ returns true, then we know that the answer is at least $2^{31}$. This means that the answer must have the $31^{st}$ bit set, since any number without the $31^{st}$ bit set is necessarily smaller than $2^{31}$ and hence suboptimal. Likewise, if there was an answer with the $31^{st}$ bit set, then $can(2^{31})$ must also return true by definition. Thus, if $can(2^{31})$ is false, then the final answer's $31^{st}$ bit must be unset. Hence, by the end of the first iteration, we know the first bit of our answer. Once we have fixed the $31^{st}$ bit, we can then apply the same logic to fix the $30^{th}$ bit, then the $29^{th}$ bit and so on.

#### Finding a Segmentation 
To implement $can(X)$, we choose a set of 'starting points', which correspond to indexes in the array $A$. For each starting point, we start a section there, then greedily make new sections by iterating along $A$ and ending a section as soon as it's bitwise $\texttt{OR}$ contains $X$. Notice how if we have a section that contains $X$, then adding more numbers to it will never change the fact that it contains $X$, so it never makes sense to add more then necessary to a section. If at any point we finish $K$ sections, then we can simply append the remaining numbers into the last section and return true. If we couldn't make $K$ sections for any of the starting points, then we return false.

One way to choose starting points would be simply the set of all numbers from $1$ to $N$, but this is too slow. Observe that not all of these starting points are useful. For example if $A_i = 0$, then we might as well never consider $i+1$ as a starting point, since which section $A_i$ falls into is incosequential. In fact, we can get away with as little as only $31$ start points! We let the $i^{th}$ starting point $start[i]$ be the index after which the $i^{th}$ bit first appears in $A$. In other words, all the numbers $A_1, ... A_{start[i]}$ should not contain have the $i^{th}$ bit set, but $A_{start[i]}$ should.

The reason why this works is as follows: We call a segmentation of $A$ valid if it partitions $A$ into $K$ parts, such that each section contains $X$. For any valid segmentation of $A$, we can modify it so that it is still valid, but such that the end of the section containing $A_N$ is right before a start point. Consider the section that contains $A_N$ in a valid segmentation, and let the final element in that section be $A_i$. There are three cases to consider:

1. If $i$ is right before a start point, then no more modification is necessary.
2. Otherwise, if $A_i = 0$, then we can move $A_i$ to the next segment, and let $A_{i-1}$ be the new end of the segment. Clearly, this operation preserves the validity of the segmentation.
3. Otherwise $A_i \neq 0$, and none of the bits set in $A_{i}$ are the first occurence of that bit. This means that we can move $A_{i}$ to the next segment whilst preserving validity, since every set bit in $A_{i}$ will still appear in $A_1 ... A_{i-1}$, so the segment still contains $X$.

Hence, if our segment does not end right before a start point, we can always keep removing the last element until it does. Hence any valid segmentation will start on at least one of these start points. Since our greedy algorithm is guaranteed to find a valid segmentation for a given start point if it exists, then we only need to test these 31.

In terms of complexity, generating start points takes $O(N\log N)$, $can(X)$ takes $O(N \log N)$ and we run it $\log N$ times to work out each bit. Hence, our final complexity is $O(N \log^2 N)$

```{.cpp .numberLines}
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef pair<int, int> pii;
typedef vector<int> vi;
#define x first
#define y second
#define pb push_back
#define all(x) x.begin(), x.end()
#define rep(i, n) for (int i = 0; i < int(n); i++)
#define per(i, n) for (int i = (n)-1; i >= 0; i--)

#define MAXN 500005

int N, K;
int start[32];
int a[MAXN*2];

bool can(int X) {
	// try for every start point
	rep(i, 31) {
		if (start[i] == -1) continue;

        // greedily make sections
		int k = 0;
		int x = 0;
		for (int j = start[i]; j < start[i] + N; j++) {
			x |= a[j];
			if ((x & X) == X) k++, x = 0; // end a section
			if (k == K) return true;
		}
	}
	return false;
}

int main () {
	cin >> N >> K;
	rep (i, N) cin >> a[i];
	rep (i, N) a[i+N] = a[i];

	// generate start points for each bit
	fill(start, start+31, -1);
	rep (i, N) rep(j, 31) {
		if (a[i] & (1<<j) && start[j] == -1) start[j] = (i+1)%N;
	}

	// work out the best we can get
	int ans = 0;
	per(i, 31) if (can(ans | (1<<i))) ans |= (1<<i);
	printf("%d\n", ans);
}
```
