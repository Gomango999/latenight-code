_Problem Source: [2018 Asia Singapore ICPC Regionals](https://asiasg18.kattis.com/problems)_

We know that every positive integer larger than 1 can be written as a product of primes, otherwise known as the prime factorisation. Suppose $x$ is made up of $k$ primes $p\_1, p\_2, \ldots, p\_k$. In other words:

```latex
x = p_1^{a_1} \times p_2^{a_2} \times \ldots \times p_k^{a_k}.
```

Then all factors $y$ of $x$ are given by some combination of the primes in $x$, i.e.
```latex
y = p_1^{b_1} \times p_2^{b_2} \times \ldots \times p_k^{b_k},
```
where $0 \le b\_i \le a\_i$ for all $1 \le i \le k$. Since there are exactly $a\_i+1$ choices for every $b\_i$, then the number of factors of $x$ is just $(a\_1+1) \times (a\_2+1) \times \ldots \times (a\_k+1)$. To get the number of non-prime factors, we can simply subtract off $k$.

Now the question is how to efficiently find the prime factorisation of each query. There exist prime factorisation methods in $O(\sqrt{N})$ time, but that is too slow for our purposes. One way to do this is to use the [Sieve of Erathosthenes](https://www.geeksforgeeks.org/prime-factorization-using-sieve-olog-n-multiple-queries/) so that for every integer, you store it's smallest prime factor. This will allow you to prime factorise any number in $O(\log N)$, which will be fast enough. The final complexity comes down to $O(N \log\log N + Q\log N)$, where $N$ is the maximum value of query $i$.

## C++
<pre class="line-numbers"><code class="language-c++">#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef pair<ll, ll> pii;
typedef vector<int> vi;
#define x first
#define y second
#define pb push_back
#define all(x) x.begin(), x.end()

#define MAXN 2000005

ll prime[MAXN];
// 1 for prime, otherwise  prime[i] = smallest factor of i
void sieve() {
	fill(prime, prime+MAXN, 1);
	for (int i = 2; i*i <= MAXN; i++) {
		if (prime[i] == 1) {
			int step = i == 2 ? i : i*2;
			for (int j = i*i; j <= MAXN; j += step) {
				if (prime[j] == 1) prime[j] = i;
			}
		}
	}
}

vector<pii> prime_factorise(int N) {
	vector<pii> pf;
	while (prime[N] != 1) {
		int pow = 0;
		int p = prime[N];
		while (N % p == 0) N /= p, pow++;
		pf.pb({p, pow});
	}
	if (N != 1) pf.pb({N, 1});
	return pf;
}

int main () {
	ios_base::sync_with_stdio(0); cin.tie(0);

	sieve();

	int Q;
	cin >> Q;
	for (int i = 0; i < Q; i++) {
		int a;
		cin >> a;
		vector<pii> v = prime_factorise(a);

		ll factors = 1;
		for (pii p : v) factors *= (p.y+1);

		ll ans = factors - (int) v.size();
		printf("%lld\n", ans);
	}
}
</code></pre>
