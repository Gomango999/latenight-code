---
title: Baubles
description: 2020 AIO Problem 1 Solution
author: Kevin Zhu
public: true
uploadDate: 2020-09-09 00:00+11:00
lastModified: 2020-09-09 00:00+11:00
notes: ''
tags:
- competitive programming
- aio
name: 02_baubles
---

_Contest Source: [AIO 2020](https://orac2.info/hub/aio/)_

If `rp` is 0, then Olaf will paint all his spares blue. Hence, we just to make sure that he fails the blue order, in which case, we print `max(s+bo-(bp-1), 0)`. Note that we use max here, in the case where Olaf was not able to fulfil the order to begin with. In this case, we do not need to destroy any baubles. Similarly, if `bp` is 0, then we print `max(s+ro-(rp-1), 0)`

Now notice that given the option to destroy a red, blue, or spare bauble, we always want to destroy spare baubles first, since they have the most versatility. Thus, we calculate the number of spare baubles Olaf needs to paint as `needed = max(rp-ro,0) + max(bp-bo,0)`. If `s < needed`, then Olaf doesn't have spare baubles to make the order, so we don't need to destroy any baubles. Otherwise, we destroy as many spare baubles as we can so that Olaf cannot meet the criteria. This is given by `min(s, s - (needed-1))`.

Finally, if Olaf originally had enough red and blue baubles to meet the order without painting any spares, we have to destroy some blues and reds to make this impossible. We take the minimum of deleting blues and deleting reds, since we only need to ruin one of the colours to ensure that Olaf cannot meet the order. This is given by `min(ro-(rp-1), bo-(bp-1))`.

## C++ Solution
```{.cpp .numberLines}
#include <cstdio>
#include <algorithm>
#include <algorithm>
using namespace std;

int main () {
    freopen("baublesin.txt", "r", stdin);
    freopen("baublesout.txt", "w", stdout);

    int ro, bo, s, rp, bp;
    scanf("%d %d %d %d %d", &ro, &bo, &s, &rp, &bp);

    // if rp is 0, then all spares are blue.
    // delete as many baubles as necessary to fail the blue order.
    if (rp == 0) {
        printf("%d\n", max(s+bo-(bp-1), 0));
        return 0;
    }
    // if bp is 0, then all spares are red.
    // delete as many baubles as necessary to fail the red order.
    if (bp == 0) {
        printf("%d\n", max(s+ro-(rp-1), 0));
        return 0;
    }

    // the number of spares needed to meet the criteria
    int needed = max(rp-ro,0) + max(bp-bo,0);
    // if cannot meet orders anyway
    if (s < needed) {
        printf("%d\n", 0);
        return 0;
    }

    // delete spares until we either cannot meet the criteria anymore, or there are no spares left.
    int ans = 0;
    ans += min(s, s - (needed-1));

    // If deleting all the spares wasn't enough, then that implies that Olaf had enough painted baubles to begin with. So take the minimum of sabotaging the red order and sabotaging the blue order.
    if (ro >= rp && bo >= bp) {
        ans += min(
            ro-(rp-1),
            bo-(bp-1)
        );
    }

    printf("%d\n", ans);
    return 0;
}
```
