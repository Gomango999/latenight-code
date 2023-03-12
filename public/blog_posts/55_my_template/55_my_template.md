---
title: "How to Make a Great Competitive Programming Template"
description: 100x Coding Speed Increase Guaranteed!
author: Kevin Zhu
public: true
uploadDate: 2023-03-13 00:30+11:00
---

Having a template is certainly not necessary for competition but there's a reason why everyone on the top leaderboards has one. Using a perfectly tailored template tailored will make typing a breeze, breathe new life into your code, and make you feel like an absolute legend.

There are two main use cases of a competitive programming template:

1. To shorten operations that are commonly used and would take longer to type otherwise.
2. To have code around that you find difficult to remember. 

Building a template is really up to an individual's personal preference, so I'll be offering here a selection of useful code snippets to pick and choose from. If you just want to get your hands on a finished template, you can scroll to the very bottom. Enjoy!

### 1. Libraries

```c++
#include <bits/stdc++.h>
using namespace std;
```

The first line is shorthand for importing all standard libraries at once. Most online judges support this, though some computers do not have this installed by default. If it isn't installed on yours, that's fine since you can manually download and insert it into the correct folder.

The second line makes sure that you don't have to type `std::` before every standard library function. This is a life saver given the sheer amount of data structures and functions that you'll be using from the standard library.

### 2. Typedefs

Here are some commonly used types:

```c++
typedef pair<int, int> pr;
typedef long long ll;
typedef long double ld;
typedef array<int, 3> a3;
typedef vector<int> vi;
```

Using `array<int, 3>` and `pair<int, int>`can be nice since they have comparison built in right out of the box. This means that unlike `struct`s, you don't have to write your own. They can be real handy when you need to find the max of something, but also store some extra information about it too like it's index.

```c++
pii best = {-1, -1};
for (int i = 0; i < N; i++) best = max(best, {a[i], i});
```

### 3. Pair Access

Writing out `.first` and `.second` every time we want to access something in a pair is extremely tedious. Let's write a macro for that!

```c++
#define x first
#define y second
```

Note that you can still call variables `x` and `y` and it will compile just fine. The only catch is that if your compiler is printing out an unrelated error, it may refer to your variables as `first` and `second` instead of their actual names `x` and `y`.

### 4. Pair Hashing

And while we're on the topic of pairs, let's also include some pair hashing as well. This is quite common, but it's difficult to remember the syntax, so it's handy to just have it there and not have to worry about it.

```c++
namespace std{template<> struct hash<pair<int,int>>{size_t operator()(const pair<int, int> k)const{return hash<long long>()(((long long)k.first)<<32|(long long)k.second);}};}
```

Expanded out, it looks like this:

```c++
namespace std {
	template<>
	struct hash<pair<int, int>> {
		size_t operator()(const pair<int, int> k) const {
			return hash<long long>()(((long long)k.first) << 32 | (long long) k.second);
		}
	};
}
```

### 5. Data Structure Shortcuts

Some operations that make dealing with vectors and other data structures easier:

```c++
#define pb push_back
#define sz(x) int(x.size())
#define all(x) x.begin(),x.end()
```

For the last one, you can use it whenever you need to pass an iterator to to the beginning and end to a function. You see this alot in `algorithm` functions, for example:

```c++
vector<int> v = {1, 2, 3};
sort(all(v));
reverse(all(v));
v.insert(v.end(), all(v)); // duplicate v and add it on to itself
```

### 6. Easier Looping

One of the most of common lines we type in competitive programming is the for loop, i.e. `for (int i = 0; i < n; i++)`. We can abstract this all away with a couple of macros.

```c++
#define rep(i,n) for (int i = 0; i < (n); ++i)
#define per(i,n) for (int i = (n)-1; i >= 0; --i)
```

Some people even like to take it a step further and define lower and upper bounds.

```c++
#define fore(i,a,b) for (int i = a; i < (b); ++i)
#define erof(i,a,b) for (int i = (b)-1; i >= a; --i)
```

... And even include one for range based for loops (though personally, I find the `for(auto x : v)` to be plenty short as is).

```c++
#define each(a, x) for (auto &a : (x))
```

### 7. I/O Speed Increase

By default, `cin` and `cout` is much slower than `scanf` and `printf`, due to it constantly flushing the buffer. In order to speed it up, we can add the following lines of code inside our main function.

```c++
int main () {
    ios_base::sync_with_stdio(false); cin.tie(NULL);
    // code here
}
```

Supposedly, there's an even faster way to read integers which uses `getchar()`, though I'm not entirely sure how it works. I'll leave it up to reader to spot it in the wild :)

### 8. Debug Printing

Though personally I haven't had much experience using this, this looks useful enough for me to recommend. When you call it on a variable, it prints out the _variable name_ along with it's value.

```c++
#define DEBUG(x) cerr<<#x<<": "<<x<<'\n'
```

```c++
int main () {
    int my_var = 5;
    DEBUG(my_var); // my_var: 5
}
```

This is especially useful when you want to quickly print out the values of multiple variables at once, but you need some way to differentiate between them. You can even go one step further and print out the line number the `DEBUG` macro was called from as well!

```c++
#define DEBUG(x) cerr<<__LINE__<<':'<<#x<<": "<<x<<'\n';
```

Also one of the great things about printing to `stderr` is that this doesn't get picked up by the judges who are only checking for `stdout`. This means that you can skip the effort of having to comb your code for debug statements to comment out, and can just submit directly. 

In the same vein, printing out the contents of pairs and data structures are super common, so they deserve their own debug macros as well.

```c++
#define DEBUGP(p) cerr<<#p<<": ("<<p.first<<", "<<p.second<<")\n";
#define DEBUGV(v) {cerr<<#v<<": {"; for(auto &x:v) cerr<<x<<", "; cerr<<"}\n";}
```

```c++
int main () {
    pair<int, int> my_pair = {3, 5};
    DEBUGP(my_pair); // my_pair: (3, 5)

    vector<int> my_vec = {1, 2, 3, 4, 5};
    DEBUGV(my_vec); // my_vec: {1, 2, 3, 4, 5, } 
}
```

## Summary

Here's a list of all the templates discussed, put into one codeblock for easy copy pasting:

```c++
#include <bits/stdc++.h>
using namespace std;
typedef pair<int, int> pr;
typedef long long ll;
typedef long double ld;
typedef array<int, 3> a3;
typedef vector<int> vi;
#define x first
#define y second
#define pb push_back
#define sz(x) int(x.size())
#define all(x) x.begin(),x.end()
#define rep(i,n) for (int i = 0; i < (n); ++i)
#define per(i,n) for (int i = (n)-1; i >= 0; --i)
#define fore(i,a,b) for (int i = a; i < (b); ++i)
#define erof(i,a,b) for (int i = (b)-1; i >= a; --i)
#define each(a, x) for (auto &a : (x))
#define DEBUG(x) cerr<<#x<<": "<<x<<'\n'
#define DEBUGP(p) cerr<<#p<<": ("<<p.first<<", "<<p.second<<")\n";
#define DEBUGV(v) {cerr<<#v<<": {"; for(auto &x:v) cerr<<x<<", "; cerr<<"}\n";}
namespace std{template<> struct hash<pair<int,int>>{size_t operator()(const pair<int, int> k)const{return hash<long long>()(((long long)k.first)<<32|(long long)k.second);}};}

int main () {
    ios_base::sync_with_stdio(false); cin.tie(NULL);
    
}
```

It's quite long, so it's common to see people with a script they run in the command line that automatically creates a new cpp file with the template pre-typed out.


### My Personal Template

In practice, a large template may be a bit overwhelming for beginners. Hence, I recommend you start with the ones that you really _really_ use almost all the time, and slowly add (or remove) elements as you get more familiar with it. My own personal template is quite a bit small since I like to keep things clean, but it also has the side effect of being a great starting point for beginners to the template game. 

```c++
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


int main () {
	ios_base::sync_with_stdio(false); cin.tie(NULL);


}
```

Note: I have an extra comment block (`/* */`) at the top since I like to plan out my code in comments at the top of the file before coding.




