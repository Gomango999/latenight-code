---
title: K. Conveyor Belts
description: 2018 ICPC Asia Singapore Regional Contest, Problem K Solution
author: Kevin Zhu
public: true
uploadDate: 2021-03-10 18:30+11:00
lastModified: 2021-03-10 18:30+11:00
notes: ''
tags:
- competitive programming
- icpc
- asiasg
menu:
  groups:
  - 2018_asiasg_icpc_regionals
  submenus: []
name: '09_belts'
---

_Problem Source: [2018 Asia Singapore ICPC Regionals](https://asiasg18.kattis.com/problems)_

Suppose that a product $p_i$ is on edge $e$ at time $t$. Since the product's route is fixed, and is produced every $K$ minutes, then $p_i$ will be on $e$ at times $t+K$, $t+2K$... etc. This tells us that if we are able to route each product in a way such that they reach the end, and there are no collisions within $K$ timesteps, then there will never be any collisions no matter how far in the future we go.

The fact that we have belts that have a capacity of one item, and the fact that we have sources and sinks of products tells us that this is a max flow problem. We model it as follows. For each node $v_i$ in the graph, we make $K$ nodes $w_{i,t}$ ($0 \le t < K$) in our flow graph which presents the node $v_i$ at time $t$. Since each conveyor belt takes exactly 1 minute to traverse, then if there is belt from $v_i$ to $v_j$, we connect $w_{i,t}$ to $w_{j,t+1}$ for $0 \le t < K-1$, and $w_{j,K-1}$ to $w_{j,0}$ to capture the $K$ periodic nature of the system. Of course, all edges in the flow graph should have a capacity of $1$ since there can be only one product on a conveyor belt at a given time.

We connect our source to $w_{i,i}$ for $0 \le i < K$ to represent how each producer produces a product one minute after the previous. Finally, we connect $w_{N,k}$ for all $k$ to the sink. Make sure that the sink connections all have capacity $K$, since multiple products can enter the junction $N$ at the same time.

Hence, the maximum number of producers we can leave running at once is the same as the maximum flow of the flow graph. If we use Edmond Karp's the complexity of the max flow is $O(Ef)$, where $E$ is the number of edges, and $f$ is the maximum flow. $E$ is equal to $MK + 2K$ and $f$ is equal to $K$, so our solution will run in time.

## C++
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

#define MAXN 305
#define MAXM 1005
#define MAXV (MAXN * MAXN + 2)
#define MAXE ( (MAXM * MAXN + MAXN*2) * 2 )

int N, K, M;
int S, T;

int E = 0;
int start[MAXV];
int to[MAXE], cap[MAXE], succ[MAXE];

void _add_edge(int a, int b, int c) {
	to[E] = b;
	cap[E] = c;
	succ[E] = start[a];
	start[a] = E;
	E++;
}
void add_edge(int a, int b, int c = 1) {
	_add_edge(a, b, c);
	_add_edge(b, a, 0);
}
void clear_edges() {
	fill(start, start+MAXV, -1);
	E = 0;
}

void bfs(bool seen[], int from[]) {
	fill(seen, seen+MAXV, false);
	fill(from, from+MAXV, -1);
	queue<int> q;
	q.push(S);
	seen[S] = true;
	while(!q.empty()) {
		int at = q.front();
		q.pop();
		for (int i = start[at]; i != -1; i = succ[i]) {
			if (cap[i] <= 0) continue;
			if (seen[to[i]]) continue;
			from[to[i]] = i;
			seen[to[i]] = true;
			q.push(to[i]);
		}
	}
}

bool seen[MAXV];
int from[MAXV];
int augment() {
	bfs(seen, from);
	if (!seen[T]) return 0;
	int pf = INT_MAX;
	for (int at = T; at != S; at = to[from[at]^1]) {
		pf = min(pf, cap[from[at]]);
	}
	for (int at = T; at != S; at = to[from[at]^1]) {
		cap[from[at]] -= pf;
		cap[from[at]^1] += pf;
	}
	return pf;
}

int max_flow() {
	int ans = 0;
	int pf;
	while ((pf = augment())) ans += pf;
	return ans;
}

int main () {
	ios_base::sync_with_stdio(0); cin.tie(0);

	clear_edges();
	cin >> N >> K >> M;
	S = N*K;
	T = N*K+1;
	for (int i = 0; i < M; i++) {
		int a, b;
		cin >> a >> b;
		a--; b--;
		for (int k = 0; k < K; k++) {
			int u = a + N * k;
			int v = b + N * ((k+1)%K);
			add_edge(u, v);
		}
	}
	for (int i = 0; i < K; i++) {
		add_edge(S, i + N * i);
		add_edge((N-1) + N * i, T, K);
	}

	int ans = max_flow();
	printf("%d\n", ans);
}
```
