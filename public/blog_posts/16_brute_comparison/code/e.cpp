/* */
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
	// printf("singles\n");
	// for(pii seg : segs) printf("%s\n", s.substr(seg.x, seg.y-seg.x).c_str());

	// generate single cut extensions
	int M = sz(segs);
	rep(i, M) for (int j = i+1; j < M; j++) {
		pii a = segs[i];
		pii b = segs[j];
		assert(a.x <= b.x && a.y <= b.y); // assumes segs is sorted

		if (a.y <= b.x) continue; // no intersection

		if (b.x - a.x >= 3) segs.pb({a.x, b.x});
		if (b.y - a.y >= 3) segs.pb({a.y, b.y});
	}
	// printf("one cuts\n");
	// for(pii seg : segs) printf("%s\n", s.substr(seg.x, seg.y-seg.x).c_str());

	// generate double cut extensions
	rep(i, M) {
		// since segs is sorted and max size of an interval is 5,
		// anything that intersects a segment must be within 5 of it in segs.
		for (int j = i-5; j <= i; j++) {
			if (j < 0 || j > M) continue;
			for (int k = i; k <= i+5; k++) {
				if (k < 0 || k > M) continue;
				pii a = segs[i];
				pii b = segs[j];
				pii c = segs[k];

				if (b.y <= a.x) continue; // no intersect between ab
				if (c.x >= a.y) continue; // no intersect between ac
				if (c.x - b.y < 3) continue; // middle is not big enough

				segs.pb({b.y, c.x});
			}
		}
	}
	// printf("double cuts\n");
	// for(pii seg : segs) printf("%s\n", s.substr(seg.x, seg.y-seg.x).c_str());

	vector<int> starts[MAXN];
	for(pii seg : segs) starts[seg.y].pb(seg.x);

	// run dp
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
