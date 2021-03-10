# C. SG Coin

---

**Contest**: 2018 Asia Singapore ICPC Regionals

**Contest Link**: [https://asiasg18.kattis.com/problems](https://asiasg18.kattis.com/problems)

---

We'll start by coming up with a way to make a block that can follow any hash. Here is the hash function given to us:
<pre class="line-numbers"><code class="language-c++">long long H(long long previousHash, string &transaction,
            long long token) {
  long long v = previousHash;
  for (int i = 0; i < transaction.length(); i++) {
    v = (v * 31 + transaction[i]) % 1000000007;
  }
  return (v * 7 + token) % 1000000007;
}
</code></pre>

Note that in the final step, we calculate `v * 7`, add on a token, and then modulo by 1,000,000,007 (henceforth denoted as `MOD`). This means that if we have some sort of target, let's say `target1 = 10,000,000` with 7 trailing zeros, then we can easily work out the value of token required to reach the target, regardless of what the value of `v * 7` was. More specifically, `token = ((target1 - previousHash) % MOD + MOD) % MOD`. This implies that the transaction string can be whatever we want, because we can always correct the hash afterwards by using our token.

Now note that there are some cases where this doesn't work. Namely, the problem specifies that our token must be smaller than 1 billion. This means that certain values of `v * 7`, namely 10,000,001 to 10,000,007 will require a token that is too large if we would like to reach out target. We can solve this by simply using a second target, such as `target2 = 20,000,000`, which we use in case we cannot reach our first target. Clearly, if we can't make the first, then we will always be able to make the second.

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

#define MOD ((ll)1e9+7)
#define MAXT 1000000000

ll modsub(ll a, ll b) { return (((a - b) % MOD) + MOD) % MOD; }

ll gettoken(int prev, char c) {
	ll v = prev;
	v = (v * 31 + c) % MOD;

	ll target1 = 10000000;
	ll target2 = 20000000;
	ll token = modsub(target1, v*7);
	if (token >= MAXT) token = modsub(target2, v*7);

	assert(token < MAXT);

	return token;
}

int main () {
	ios_base::sync_with_stdio(0); cin.tie(0);

	ll N;
	cin >> N;

    // calculate token 1
	ll token = gettoken(N, 'a');
	printf("%c %lld\n", 'a', token);

    // calculate token 2
	string str = "a";
	ll newhash = H(N, str, token);
	printf("%c %lld\n", 'b', gettoken(newhash, 'b'));
}
</code></pre>
> Here, I choose the arbitrary transaction strings `"a"` and `"b"` as the strings of my two blocks

> It is actually very unlikely that we need the second target, since it is only needed for 7 out of 1,000,000,007 values of `v*7`. There is no way that the test data can cover all of these cases, especially since the target1 we chose could have been any number with 7 trailing zeros. If you really wanted to, you could choose to omit the second target from your code entirely and take your chances.
