---
title: J. Free Food
description: 2018 ICPC Asia Singapore Regional Contest, Problem J Solution
author: Kevin Zhu
public: true
uploadDate: 2021-02-16 21:00+11:00
lastModified: 2021-02-16 21:00+11:00
notes: ''
tags:
- competitive programming
- icpc
- asiasg
menu:
  groups:
  - 2018_asiasg_icpc_regionals
  submenus: []
name: 03_food
---

_Problem Source: [2018 Asia Singapore ICPC Regionals](https://asiasg18.kattis.com/problems)_

The problem asks for the number of days free food is available. However, we have to careful not to double count days, since we only care if there is free food at _any_ event on a given day.

Since the bounds are very small, we can simply keep track of the free food days in an array $food$. For each day, we store whether there was free food on that day or not. We update the array by looping through it for every single event. At the end, we simply count up the number of days that contain free food.

This solution runs in $O(365 * N)$ time, since each event could make us potentially loop through all 365 days.

> Note that there exists an $O(N \log N)$ solution which runs faster in the worst case, but is overkill to implement for this question when the bounds are so small.

## C++
```{.cpp .numberLines}
#include <bits/stdc++.h>
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
```
