---
title: "H - Life is a Game"
description: 2021 ICPC Asia Shanghai Regional Programming Contest, Problem H
author: Kevin Zhu
public: true
uploadDate: 2022-06-20 01:56+11:00
---

This problem is sourced from the 2021 ICPC Asia Shanghai Regional Programming Contest.

> Problem Link: [https://codeforces.com/gym/103446/problem/H](https://codeforces.com/gym/103446/problem/H)

In this problem, you are given an undirected connected graph with $n$ cities and $m$ undirected roads. The $i$-th city provides $a_i$ social skill points the first time you reach it. Furthermore, every road requires a certain amount of social skills to traverse. The goal is to answer $q$ queries, where a query is: What is the maximum social skill you can obtain if you start at node $x$ with $k$ social skill?

The bounds are: 

- $1 \le n, m, q \le 10^5$
- $1 \le a_i \le 10^4$
- $1 \le$ edge weights $\le 10^9$
- $1 \le k \le 10^9$.

## Small Merge Solution
Suppose we have a person who starts off at city $x$ with social skill $k$. Initially, suppose the graph starts off all $n$ nodes but no edges, and we progressively add edges of increasing skill level. Each time we add an edge weight $w$ that connects component $X \ni x$ with component $Y$, then there are two cases:

1. The person was able to explore all of $X$, and is able to traverse the new edge.
    - In this case, they will be able to explore all of $Y$ too, since every edge in $Y$ has weight at most $w$
2. The person was able to explore all of $X$, but is unable to traverse the new edge.
    - In this case, this person will never be able to traverse any more nodes, as every new edge after will have a weight at least as heavy as this one. In this case, we can stop here, and print out the sum of skill levels in $X$ plus $k$.

This process is $O(n+m)$ for each person, so doing this per person would give a time of $O(q(n+m))$. We can improve on this by taking advantage of small merge to handle all people at once. We start off with the no edge graph, where each one-node component also contains a set of the people which start at that node. We then run [Kruskal's algorithm](https://cp-algorithms.com/graph/mst_kruskal.html) on increasing edge weights to merge components together, maintaining each components sum of skills in the [DSU](https://cp-algorithms.com/data_structures/disjoint_set_union.html). Before each merge, we check the sets of both components and anyone who is unable to traverse the edge is removed and their final skill level is calculated, before merging the two sets together. If we sort the set by increasing skill level (e.g. using [C++ sets](https://cplusplus.com/reference/set/set/)), then we only need to remove off the front of the set, which takes $O(\log q)$ time per person. Also, since each person is added and removed from the set at most once, this gives an amortised complexity of $O(q \log q)$. Finally, we take care to always merge the smaller set into the larger one, so that we get an amortised complexity of $O(q \log (q)^2)$ as per [small merge](https://www.ralismark.xyz/posts/small-merge).

The total complexity is $O(m\log m + q\log (q)^2)$.

```cpp
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
 
#define MAXN 100005
 
struct Event {
	int a, b, w;
	bool person;
	bool operator<(const Event &oth) const {
		if (w == oth.w) return person < oth.person;
		return w < oth.w;
	}
};
 
int N, M, Q;
int a[MAXN];
vector<Event> es;
 
int ans[MAXN];
 
int rep[MAXN];
int sz[MAXN];
int skill[MAXN]; // sum of skills in component
set<pii> ss[MAXN]; // set of people in that component <initial skill, id>
 
void init() {
	rep(i, N) {
		rep[i] = i;
		sz[i] = 1;
		skill[i] = a[i];
	}
}
int getrep(int x) {
	return rep[x] == x ? x : (rep[x] = getrep(rep[x]));
}
void join(int x, int y) {
	x = getrep(x), y = getrep(y);
	if (sz[x] < sz[y]) swap(x, y);
	rep[y] = x;
	sz[x] += sz[y];
	skill[x] += skill[y];
	ss[x].insert(ss[y].begin(), ss[y].end());
	ss[y].clear();
}
 
int main () {
	ios_base::sync_with_stdio(false); cin.tie(NULL);
 
	cin >> N >> M >> Q;
	rep(i, N) cin >> a[i];
	rep(i, M) {
		int u, v, w;
		cin >> u >> v >> w;
		u--, v--;
		es.pb({u, v, w, false});
	}
	rep(i, Q) {
		int x, k;
		cin >> x >> k;
		x--;
		es.pb({i, x, k, true});
	}
	sort(all(es));
	
	init();
	fill(ans, ans+N, -1);
	
	for (Event e : es) {
		if (e.person) {
			ss[getrep(e.b)].insert({e.w, e.a}); // put him into the right set
            // Note: In this solution, we insert people into sets only after we 
            // we have considered all edges with weight <= than it. This does not
            // effect the correctness of the solution.
		} else {
			// get leaders for two components
			int x = getrep(e.a), y = getrep(e.b);
			if (x == y) continue; // already merged
			
			// remove the weak people who are gated by this edge, and
            // calculate their final answer
			while (!ss[x].empty() && ss[x].begin()->x + skill[x] < e.w) {
				ans[ss[x].begin()->y] = ss[x].begin()->x + skill[x];
				ss[x].erase(ss[x].begin());
			}
			while (!ss[y].empty() && ss[y].begin()->x + skill[y] < e.w) {
				ans[ss[y].begin()->y] = ss[y].begin()->x + skill[y];
				ss[y].erase(ss[y].begin());
			}
			
			// join them together
			join(x, y);
		}
	}
	
	// all nodes are merged, and anyone left is able to explore all of it
	for (pii p : ss[getrep(0)]) {
		ans[p.y] = p.x + skill[getrep(0)];
	}
	
	rep(i, Q) {
		printf("%d\n", ans[i]);
	}
}
```

## Jump List Solution
This idea follows from the same observations made in the small merge solution. Form a [DSU Tree](https://codeforces.com/blog/entry/85714?fbclid=IwAR2PqCRjvm8Nc3H3W1J1RQv7bgT_48ZJfrHZTpWPWXq7GA2oOLwwJesy8eA) on the graph, and let $w(v)$ denote the weight of the edge represented by a non-leaf node $v$ in the DSU Tree. For any query, we find the last node that doesn't prevents us going any further. This indicates that the person's social skill level can no longer improve, and their maximum social skill will be the sum of their initial skill and the sum of the social skills gained from all the leaf nodes in the subtree.

We can preprocess the DSU Tree to store the sum of skill in each subtree of node $i$ as $skill_i$ in $O(n)$. To find the highest node that we can reach for a query with initial skill $k$, observe that to traverse up from node $u$ to its parent node $v$, we require that $k \ge w(v) - skill_u$. Therefore, we can use a [jumplist](https://cp-algorithms.com/graph/lca_binary_lifting.html), where each jump also stores the minimum initial skill required to make the jump. This allows us to query for each person the highest jump they can make in $O(\log n)$ time.

The final complexity is $O(m \log m + (q+n) \log n)$

```cpp
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

#define MAXN 200005

struct Edge {
	int a, b, w;
	bool operator<(const Edge &oth) const {
		return w < oth.w;
	}
};

int N, M, Q;
int a[MAXN]; // skill you can get from this node's subtree
int d[MAXN]; // edge weight, only non-zero for edge nodes.

// dsu
int rep[MAXN];
void init() { rep(i, MAXN) rep[i] = i; }
int getrep(int x) { return rep[x] == x ? x : (rep[x] = getrep(rep[x])); }

// build kruskal's refactoring tree, with weights
int par[MAXN];
vector<int> G[MAXN];
void kruskal(vector<Edge> &es) {
	sort(all(es));
	init();
	fill(par, par+MAXN, -1);
	for (Edge e : es) {
		int x = getrep(e.a), y = getrep(e.b);
		// printf("a:%d b:%d, x:%d y:%d\n", e.a, e.b, x, y);
		if (x == y) continue;
		// set skill level
		a[N] = a[x] + a[y];
		d[N] = e.w;
		// connect x and y to N
		G[N].pb(x); G[N].pb(y);
		par[x] = par[y] = N;
		rep[x] = rep[y] = N; // set N to be the new leader
		// printf("kruskal: x:%d y:%d N:%d\n", x, y, N);
		N++;
	}
}

// build jumplist
int jump[MAXN][18];
int need[MAXN][18]; // how much skill you need to make the jump
void build(int at) {
	// printf("build: at:%d\n", at);
	jump[at][0] = par[at];
	if (par[at] != -1) need[at][0] = d[par[at]] - a[at];
	for (int i = 1; i <= 17; i++) {
		int to = jump[at][i-1];
		if (to == -1) jump[at][i] = -1;
		else {
			jump[at][i] = jump[to][i-1];
			need[at][i] = max(need[at][i-1], need[to][i-1]);
		}
	}
	for (int to : G[at]) build(to);
}

int main () {
	ios_base::sync_with_stdio(false); cin.tie(NULL);
	
	cin >> N >> M >> Q;
	rep(i, N) cin >> a[i];
	vector<Edge> es;
	rep(i, M) {
		int u, v, w;
		cin >> u >> v >> w;
		u--, v--;
		es.pb({u, v, w});
	}
	
	// build dsu tree
	kruskal(es);
	build(N-1); // N-1 is the root
	
	// handle queries
	rep(_, Q) {
		int x, k;
		cin >> x >> k;
		x--;
		// jump up as high as we can
		for (int i = 17; i >= 0; i--) {
			if (jump[x][i] == -1) continue;
			if (need[x][i] > k) continue;
			x = jump[x][i];
		}
		// skill is initial + sum of everything in subtree
		printf("%d\n", a[x] + k);
	}

}
```
