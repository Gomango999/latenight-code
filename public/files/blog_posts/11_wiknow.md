_Problem Source: [2018 Asia Singapore ICPC Regionals](https://asiasg18.kattis.com/problems)_

We are tasked with finding the lexicographically smallest pattern $ABAB$ in the message. We say that two $A$'s are consecutive if they represent positions $i$ and $j$ in $S$, and the same character does not appear anywhere between $i$ and $j$. Then to find $ABAB$, we can consider each pair of consecutive numbers as the $B$, and then try to find a matching $A$ that it is as low as possible. We can do this problem using segment trees, and some clever choices in which order we look through and update our tree.

First, construct a range min query, point update segment tree. It will be of size $N$, so that each point in the range tree will correspond to a point in the original message $S$. We initialise the entire contents of the range tree to be $\infty$.

During preprocessing, we will also calculate for each position in the array the next position to the right that holds the same letter. In other words, $succ\_i$ should store the first position after $i$ such that $S\_i = S\_{succ\_i}$. We can do this by looping over the $S$ backwards, and keeping track of the last time we saw each character (initially starting at $-1$). At each position, we simply set $succ\_i = last\_{S\_i}$ before updating the last array.

Now that this is done, we can proceed with finding the pattern. We will loop through the array from left to right. For each position $i$ in the message, we assume the letter at $i$ and the letter at $succ\_i$ is our '$B$', and then try to find the lowest $A$ to form the pattern. We do this in two parts.

1. Query the minimum of the range $(i, succ\_i)$ non-inclusive, in order to find the best pairing.
2. Update position $succ\_i$ in our min range tree to be equal to the value of $S\_i$

Step 1 finds the minimum choice of $A$ such that there $A$ exists in the range $(i, succ\_i)$, as well as to the left of the position $i$. Step 2 sets up the range tree so that we can consider $i$ and $succ\_i$ as the '$A$' for future queries. After doing this for all positions, we simply retuurn the lexicographically smallest $ABAB$ we've found so far.

This works because when we're at position $i$, we're given that all future queries will occur to the right of $i$, since we are looping left to right. Hence, if a query to the range tree returns the character at $i$, we are guaranteed that the character exists both inside the range, as well as to the left of that range, and thus is a valid possibility for $A$. The fact that we use a min range tree guarantees that we are finding the minimum out of all of the potential choices of $A$.

Note that this solution does not consider every possible $ABAB$ pattern in the array, but rather takes advantage of the observation that if an $ABAB$ pattern exists, there always exists a pattern $ABAB$ (perhaps with different indexes in $S$) such that the two $B$'s are consecutive and the two $A$'s are also consecutive. The solution works by only searching for these types of $ABAB$ patterns.

We have time complexity of $O(NlogN)$ to construct the tree, $O(N)$ to generate the $succ$ array, and finally, $O(NlogN)$ to loop through the array and perform a single query and update operation for each letter. This gives the final complexity of $O(NlogN)$

## C++
<pre class="line-numbers"><code class="language-c++">#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef pair<int, int> pii;
typedef vector<int> vi;
#define x first
#define y second
#define pb push_back
#define all(x) x.begin(), x.end()

#define MAXN 400005
int rt[MAXN * 4];

// query the minimum of a range
int query(int i, int l, int r, int ql, int qr) {
	if (ql <= l && r <= qr) return rt[i];
	int m = (l + r) / 2;
	int ret = INT_MAX;
	if (ql < m) ret = min(ret, query(i*2, l, m, ql, qr));
	if (qr > m) ret = min(ret, query(i*2+1, m, r, ql, qr));
	return ret;
}

// update the element at k to be v
void update(int i, int l, int r, int k, int v) {
	if (l == r-1) rt[i] = v;
	else {
		int m = (l+r)/2;
		if (k < m) update(i*2, l, m, k, v);
		else update(i*2+1, m, r, k, v);
		rt[i] = min(rt[i*2], rt[i*2+1]);
	}
}

int main () {
	ios_base::sync_with_stdio(0); cin.tie(0);

	int N;
	cin >> N;
	int a[N];
	for (int i = 0; i < N; i++) cin >> a[i];

	// work out for each index the next occurence of the same value
	int last[MAXN];
	int succ[MAXN];
	fill(last, last+MAXN, -1);
	for (int i = N-1; i >= 0; i--) {
		succ[i] = last[a[i]];
		last[a[i]] = i;
	}

	for (int i = 0; i < N; i++) update(1, 0, N, i, INT_MAX);

	pii best = {INT_MAX, INT_MAX};
	for (int i = 0; i < N; i++) {
		int B = a[i];
		if (succ[i] != -1) {
			int A = query(1, 0, N, i+1, succ[i]);
			best = min(best, {A, B});
		}
		update(1, 0, N, succ[i], a[succ[i]]);
	}

	if (best.x == INT_MAX || best.y == INT_MAX) printf("-1\n");
	else printf("%d %d\n", best.x, best.y);
}
</code></pre>
