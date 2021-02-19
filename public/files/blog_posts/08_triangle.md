# A. Largest Triangle

---

**Contest**: 2018 Asia Singapore ICPC Regionals

**Contest Link**: [https://asiasg18.kattis.com/problems](https://asiasg18.kattis.com/problems)

---

The key thing to notice is that the largest triangle must lie on the convex hull. Suppose you have a triangle $\triangle ABC$ such that one of its points is not on the convex hull. Without loss of generality, let that point be $A$. We would like to pick a new point $A'$ such that the perpendicular distance of $A'$ to $BC$ is maximised. This distance is only maximised on the convex hull, and thus, there exists a point $A'$ on the convex hull such that the area of $\triangle A'BC$ is greater than or equal to the area of $\triangle ABC$.

With this observation out of the way, we now proceed to solve the problem. By forming the convex hull, we can check every pair of three points and obtain the largest area in $O(N^3)$, but this is too slow. Instead, we try a smarter approach. Let the points on the convex hull be points $p\_1, p\_2, ... p\_k$ ordered clockwise, and let's fix point A at $p_1$. We then let points $B$ and $C$ be the next two points after A, i.e. $p\_2, and p\_3$ respectively. We now move $C$ clockwise along the convex hull until we reach the point at which the area of $\triangle ABC$ no longer increases. This must be the largest triangle with side $AB$. We then increase $B$ by one to the next point, and repeat the process: moving $C$ clockwise around the hull until the area no longer increases, and then updating the maximum. We repeat this until we have considered all segments $AB$. The important point is that each time we shift $B$ clockwise, the point $C$ at which $\triangle ABC$ always shifts clockwise from it's previous location.

Thus, for a fixed value of $A$, we can find the largest triangle with a point at $A$ in $O(k)$ time. We simply repeat this for all starting points to find the largest triangle in $O(k^2)$ time. Since in the worst case, $k=N$, our final complexity is $O(N^2)$.


## C++

<pre class="line-numbers"><code class="language-c++">#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef long double ld;
typedef pair<ll, ll> pii;
typedef pair<pii, pii> pp;
typedef vector<int> vi;
#define x first
#define y second
#define pb push_back
#define all(x) x.begin(), x.end()

int N;
vector<pii> ps;
vector<pii> hull;

// positive if B ccw of A, negative otherwise
ll det(pii a, pii b) { return a.x * b.y - b.x * a.y; }
pii sub(pii a, pii b) { return {a.x - b.x, a.y - b.y}; }
pii add(pii a, pii b) { return {a.x + b.x, a.y + b.y}; }
pii mult(pii a, ll v) { return {a.x * v, a.y * v}; }
pii neg(pii a) { return mult(a, -1); }

void print(pii p) {printf("(%lld, %lld) ", p.x, p.y);}
void print(vector<pii> v) { for (pii p : v) print(p); printf("\n"); }

// gets the upper half of the hull, using monotone scan
vector<pii> getupperhull() {
	vector<pii> upper;
	for (int i = 0; i < N; i++) {
		while (upper.size() >= 2) {
			int n = upper.size();
			pii a = sub(upper[n-1], upper[n-2]);
			pii b = sub(ps[i], upper[n-1]);
			if (det(a, b) >= 0) upper.pop_back();
			else break;
		}
		upper.pb(ps[i]);
		// printf("%d: ", i); print(upper);
	}
	upper.pop_back(); // remove last element, so no overlap with lower
	return upper;
}

// returns area of a triangle given three points
ld area(pii a, pii b, pii c) {
	return abs( a.x*(b.y-c.y) + b.x*(c.y-a.y) + c.x*(a.y-b.y) ) / 2.0;
}

int main () {
	ios_base::sync_with_stdio(0); cin.tie(0);

	// scan in and remove duplicates
	cin >> N;
	ps.resize(N);
	for (int i = 0; i < N; i++) cin >> ps[i].x >> ps[i].y;
	sort(all(ps));
	auto it = unique(all(ps));
	N = distance(ps.begin(), it);
	ps.resize(N);
	// printf("points: "); print(ps);

	// make hull from upper and lower
	vector<pii> upper = getupperhull();
	reverse(all(ps));
	vector<pii> lower = getupperhull();

	vector<pii> hull = upper;
	hull.insert(hull.end(), lower.begin(), lower.end());
	int M = hull.size();

	// double up the hull, so I don't have to deal with cycles and mods
	hull.insert(hull.end(), hull.begin(), hull.end());

	// find largest triangle
	ld best = 0.0;
	for (int i = 0; i < M; i++) {
		int k = i+2;
		for (int j = i+1; j < i+M; j++) {
			while (k < i+M-1 && area(hull[i], hull[j], hull[k])
				<= area(hull[i], hull[j], hull[k+1]) ) k++;
			best = max(best, area(hull[i], hull[j], hull[k]));
		}
	}
	printf("%Lf\n", best);
}

</code></pre>
<br>
> _I use [monotone scan](https://www.commonlounge.com/discussion/a8f953d33c4547b8863b79b18f1795cd) to generate my convex hull._

<br>

> _When dealing with cyclic data structures such as convex hulls, it is sometimes helpful to simply double up the array back to back, so that you don't have to deal with edge cases where you go off the end._
