# J. Free Food

---

The problem asks for the number of days free food is available. However, we have to careful not to double count days, since we only care if there is free food at _any_ event on a given day.

Since the bounds are very small, we can simply keep track of the free food days in an array `food`. For each day, we store whether there was free food on that day or not. We update the array by looping through it for every single event. At the end, we simply count up the number of days that contain free food.

This solution runs in O(365 * `N`) time, since each event could make us potentially loop through all 365 days.

> Note that there exists an O(NlogN) solution which runs faster in the worst case, but is overkill to implement for this question when the bounds are so small.

## C++
<pre class="line-numbers"><code class="language-c++">#include <bits/stdc++.h>
using namespace std;

#define MAXN 400

bool food[MAXN];

int main () {
	int N;
	scanf("%d", &N);
	for (int i = 0; i < N; i++) {
		int a, b;
		scanf("%d %d", &a, &b);
		for (int j = a; j <= b; j++) food[j] = true;
	}

	int cnt = 0;
	for (int i = 1; i <= 365; i++) cnt += food[i];
	printf("%d\n", cnt);
}
</code></pre>
