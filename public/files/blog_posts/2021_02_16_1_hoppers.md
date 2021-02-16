# B. Hoppers

---

Suppose the graph is split into `M` components. For the hopper to spread to all other nodes, then clearly we will have to connect all of these components at some points. The minimum number of edges required for this is `M-1`.

We call a component "good" if we can infect a node in that component and have it spread to every other node in the system. If there is even one good component in the system, then we can simply use `M-1` additional edges to connect it to all the other components, which is clearly the minimum possible. Hence, we need a way to find whether a component is good.

Observe that a component is good if and only if there exists an odd cycle in within the component. We can do this by running a depth first search, where our state is recorded by the node we're at, as well as the parity of the distance from the starting node. If we ever reach a node on both an even and an odd distance from our starting node, then we know there is an odd cycle in that component.

Now we handle the case where there are no good components. It can be shown that after connecting all the components together with `M-1` edges, you will need exactly 1 extra edge to make the entire graph good. To do this, we merely consider the following cases:
- If all the components are of size 1, then we pick one component, and connect all other components to it. Since there are at least 3 nodes, then we can always add one more edge to make a triangle, which is an odd cycle.
- Now if there is at least one component `C` larger than size 2, then there must exist three connected nodes somewhere inside `C`. By our assumption, the graph isn't good, these three nodes do not form a triangle, but rather a straight line. We can make it a triangle with one extra edge.
- Finally, we consider the case where there is at least one component `C` with size 2. Clearly there must be at least one other component, since `N` is at least 3. Hence, we pick any arbitrary node in the other component and connect it to one of the nodes in component `C`. This now forms a straight line of 3 nodes, and we can then form a triangle with one extra edge.

Therefore, if there are no good components, then the answer is simply `M-1+1` or `M`. The complexity of this algorithm is O(`N`), which is the complexity of using the DFS's to detect odd cycles and count components.

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

#define MAXN 500005

vector<int> G[MAXN];
bool seen[MAXN][2];

// returns true if this subgraph is good
bool isgood = false;
void dfs(int at, bool iseven) {
	if (seen[at][iseven]) return;
	seen[at][iseven] = true;
	if (seen[at][iseven] && seen[at][!iseven]) isgood = true;
	for (int to : G[at]) {
		if (seen[to][!iseven]) continue;
		dfs(to, !iseven);
	}
}

vector<bool> good;

int main () {
	ios_base::sync_with_stdio(0); cin.tie(0);

	int N, M;
	cin >> N >> M;
	for (int i = 0; i < M; i++) {
		int a, b;
		cin >> a >> b;
		G[a-1].pb(b-1);
		G[b-1].pb(a-1);
	}

	bool atleastonegood = false;
	for (int i = 0; i < N; i++) {
		isgood = false;
		if (!seen[i][0] && !seen[i][1]) {
			dfs(i, 0);
			good.pb(isgood);
			atleastonegood |= isgood;
		}
	}

	int cnt = good.size();
	if (atleastonegood) printf("%d\n", cnt-1);
	else printf("%d\n", cnt);
}
</code></pre>
