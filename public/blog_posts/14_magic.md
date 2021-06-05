---
title: E. Magical String
description: 2018 ICPC Asia Singapore Regional Contest, Problem E Solution
author: Kevin Zhu
public: true
uploadDate: 2021-06-05 03:40+11:00
lastModified: 2021-06-05 03:40+11:00
notes: ''
tags:
- competitive programming
- icpc
- asiasg
menu:
  groups:
  - 2018_asiasg_icpc_regionals
  submenus: []
name: 14_magic
---
_Problem Source: [2018 Asia Singapore ICPC Regionals](https://asiasg18.kattis.com/problems)_

> _Note: My solution is based on the solution presented in the official contest writeup. You can the slides [here](https://www.comp.nus.edu.sg/~acmicpc/icpcsg18-analysis_SHU.pdf). My aim is to provide just a little more detail, for those who are also looking to upsolve._

This problem was definitely the hardest one in the competition, with no teams solving it in the given time limit. While technically there is nothing too challenging about the implementation, the observations and proofs required to reach that solution are quite difficult to spot.

### Naive Dynamic Programming Solution
We define 'segments' as substrings of $S$ such that if you change one of the letters within the segment, the entire segment becomes the same letter (and is turned into asterisks). We also ensure that the segment is as large as possible. E.g. if `"aabac"` is a string, `"aab"` is not a valid segment, since it is contained within the longer segment `"aaba"`

We now find some nice properties of segments. Firstly, any two segments that share the same left endpoint or the same right endpoint must be the same segment. This means that we can naturally sort the segments from left to right, and the number of these segments is at most $O(|S|)$. Furthermore the maximum size of a segment is length 5, being of the pattern `"aabaa"`. Using these facts, we can find all segments of $S$ in $O(|S|)$ time by just testing every starting point and segment length.

Then a brute force dynamic programming solution would be defining a function $f(i, j, k)$ which returns the maximum number of asterisks if you were only working on the substring $s[i:j]$ with $k$ conversions. Suppose segment $s$ has left side $s_x$ and right side $s_y$. Then
$$f(i, j, k) = \max_{s \in segments} \max_{0 \le l < k} f(i, s_x, l) + (s_y - s_x) + f(s_y, j, (k-1)-l).$$

Unfortunately, this has complexity at least $O(|S|^2 K)$, so this is too slow. We maintain our observations about segments, but try a different approach.

### Weighted Interval Scheduling Solution
Note how we are essentially choosing non-overlapping segments of $S$ and maximising their sizes (with some caveats, we will explain later). This bears alot of similarity to the Weighted Interval Scheduling Problem (WISP), which defines the following problem: Given a set of intervals each with their own weight, find a set of intervals such that none of them are overlapping, and the weight is maximised. This problem can be solved with dynamic programming, where $dp[i][k]$ is the maximum score within the first $i$ letters, and using at most $k$ intervals. Assuming there are $N$ segments, the complexity is amortised $O(|S|K + KN)$

But we cannot apply WISP directly, since certain strings allow you to choose intervals that are otherwise overlapping. For example, consider the string `"abaacaa"` which has overlapping segments `"abaa"` and `"aacaa"`. However, we can "choose both segments" by first selecting `"abaa"`, and then selecting the remaining `"caa"`. To handle this case we simply treat `"caa"` as it's own segment. We call the original segments "single" segments, and new segments of this form "extended" segments. Though this may seem incorrect, since in theory WISP might choose the extended segment in isolation as part of the optimal solution, it can be shown that we can always modify such a solution so that the segment immediately to the left (or right, depending on how the extension was generated) of the extended segment is chosen.

In order to generate extended segments, we find the intersections between overlapping segments. Specifically, [a,b] is an extended segment if its size is 3 or greater, and there is an interval [l,r] in the set of single segments which can be cut into [a,b] by other overlapping segments. There are three cases of this occuring:

<div class="centering w-100 my-4">
![_Three cases for generating extensions. The generated extended segment is marked in purple_](/images/blog/14_magic/01.png){width=50%}
</div>

We can find extensions of case 1 and 2 by simply comparing every pair of single extensions. For case 3, we observe that if we were to sort all segments in an array, since the segments are at most length 5 and start points are unique, any intersecting segment of a segment $s$ must have a distance of at most 5 from $s$ in the sorted order. Hence we can calculate these extensions in $O(|S|^2 + 25|S|)$ time. Once we have these, we run WISP in order to obtain our final solution.

## Coded Solution
``` {.cpp .numberLines}
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef pair<int, int> pii;
#define x first
#define y second
#define pb push_back
#define all(x) x.begin(), x.end()
#define sz(x) int(x.size())
#define rep(i, n) for (int i = 0; i < (n); i++)

#define MAXN 1005
#define MAXK 1005

void solve() {
	string s;
	cin >> s;
	int N = s.length();
	int K;
	cin >> K;

	if (N < 3) {
		printf("0\n");
		return;
	}

	// find singles
	vector<pii> segs;
	for (int i = 0; i < N-2; i++) {
		// printf("%d\n", i);
		char a = s[i], b = s[i+1], c = s[i+2];
		char mode = -1;
		if (a == b) mode = a;
		if (a == c) mode = a;
		if (b == c) mode = b;
		if (mode == -1) continue;
		int j = i+3;
		while (j < N && s[j] == mode) j++;
		if (segs.empty() || j > segs.back().y) segs.pb({i, j});
	}

	// generate single cut extensions
	int M = sz(segs);
	rep(i, M) for (int j = i+1; j < M; j++) {
		pii a = segs[i]; // left segment
		pii b = segs[j]; // right segment
		assert(a.x <= b.x && a.y <= b.y); // assumes segs is sorted

		if (a.y <= b.x) continue; // no intersection

		if (b.x - a.x >= 3) segs.pb({a.x, b.x});
		if (b.y - a.y >= 3) segs.pb({a.y, b.y});
	}

	// generate double cut extensions
	rep(i, M) {
		// since segs is sorted and max size of an interval is 5,
		// anything that intersects a segment must be within 5 of it in segs.
		for (int j = i-5; j <= i; j++) {
			if (j < 0 || j > M) continue;
			for (int k = i; k <= i+5; k++) {
				if (k < 0 || k > M) continue;
				pii a = segs[i]; // middle segment
				pii b = segs[j]; // left segment
				pii c = segs[k]; // right segment

				if (b.y <= a.x) continue; // no intersect between ab
				if (c.x >= a.y) continue; // no intersect between ac
				if (c.x - b.y < 3) continue; // middle is not big enough

				segs.pb({b.y, c.x});
			}
		}
	}

	vector<int> starts[MAXN];
	for(pii seg : segs) starts[seg.y].pb(seg.x);

	// run dp (WISP)
    // weight of interval is equal to its size
	int dp[MAXN][MAXK] = {{0}}; // max score to get to <= i with <= k
	for (int i = 1; i <= N; i++) {
		for (int k = 1; k <= K; k++) {
			dp[i][k] = max(dp[i][k], dp[i][k-1]);
			dp[i][k] = max(dp[i][k], dp[i-1][k]);
			for (int start : starts[i]) {
				dp[i][k] = max(dp[i][k], dp[start][k-1] + i-start);
			}
		}
	}
	printf("%d\n", dp[N][K]);
}

int main () {
	ios_base::sync_with_stdio(0); cin.tie(0);

	int T = 0;
	cin >> T;
	for (int i = 0; i < T; i++) {
		solve();
	}
}

```
