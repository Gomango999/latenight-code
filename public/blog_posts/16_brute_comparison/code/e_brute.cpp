/*
Brute force solution
dp(i,j,k) = best score you can get in range s[l:r] with k
*/
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

#define MAXN 200

pii findseg(string &s, int i) {
	// returns a range containing 3 or more identical characters surrounding i
	// returns {-1,-1} if not magical
	int N = s.length();
	int l = i; int r = i;
	while (r < N && s[r] == s[i]) r++;
	while (l >= 0 && s[l] == s[i]) l--;
	l++;
	if (r-l >= 3) return {l, r};
	else return {-1, -1};
}

vector<pii> findsegs(string &s) {
	// O(5N)
	int N = s.length();
	vector<pii> segs;
	string t = s;
	for (int i = 0; i < N; i++) {
		if (i) {
			t[i] = s[i-1];
			pii p = findseg(t, i);
			if (p.x != -1) segs.pb(p);
			t[i] = s[i];
		}
		if (i < N-1) {
			t[i] = s[i+1];
			pii p = findseg(t, i);
			// check not the same change as the previous
			if (p.x != -1 && (segs.empty() || p != segs.back())) {
				segs.pb(p);
			}
			t[i] = s[i];
		}
	}
	return segs;
}

int dp[MAXN][MAXN][MAXN];
bool done[MAXN][MAXN][MAXN];
int solvedp(string &s, int l, int r, int K) {
	if (r-l < 3) return 0;
	if (K == 0) return 0;
	if (done[l][r][K]) return dp[l][r][K];
	int best = 0;
	string t = s.substr(l, r-l);
	vector<pii> segs = findsegs(t);
	// printf("%d-%d K:%d\n", l, r, K);
	// for(pii seg : segs) printf("%s\n", s.substr(seg.x, seg.y-seg.x).c_str());
	for (pii seg : segs) {
		seg.x += l, seg.y += l;
		assert(seg.x >= l && seg.y <= r);
		for (int k = 0; k <= K-1; k++) {
			best = max(
				best,
				solvedp(s, l, seg.x, k) + (seg.y-seg.x) + solvedp(s, seg.y, r, K-1-k)
			);
		}
	}
	// printf("%d-%d K:%d best:%d\n", l, r, K, best);
	done[l][r][K] = true;
	return dp[l][r][K] = best;
}


void solve() {
	string s;
	cin >> s;
	int K;
	cin >> K;

	int N = s.length();
	K = min(N, K);
	assert(N < MAXN-5);

	// vector<pii> segs = findsegs(s, 0, N);
	// for(pii seg : segs) printf("%s\n", s.substr(seg.x, seg.y-seg.x).c_str());
	// printf("\n");
	printf("%d\n", solvedp(s, 0, N, K));
}

int main () {
	ios_base::sync_with_stdio(0); cin.tie(0);
	int T = 1;
	cin >> T;
	for (int t = 0; t < T; t++) {
		// printf("Case #%d: ", t+1);
		solve();
	}
}
