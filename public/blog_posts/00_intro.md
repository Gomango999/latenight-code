---
title: Welcome to Latenight Code!
description: Find out more about who I am, and why I chose to make a site!
author: Kevin Zhu
public: true
uploadDate: 2020-06-06 12:00+11:00
lastModified: 2020-06-06 12:00+11:00
notes: ''
tags:
- general
name: 00_intro
---

Welcome to Late Night Code, my very own personal blog!

My name is Kevin, and I'm a uni student at UNSW currently pursuing a Bachelor of Science in Advanced Mathematics and Computer Science. My majors are in pure maths and artificial intelligence.

I built this website from scratch using Node.js, and I wrote every bit of HTML, CSS and JS that you're currently looking at. Could I have used templates or premade sites to make a better looking site? Yep. Would it have taken a fraction of the time and effort? Also yep. But doing that was and never will be an option for me. As far as I'm concerned, making it from scratch is the only way to go, becuase it's the only way that I'll get something out of it that I can truly call my own.

In the future, I'm expecting to make posts about all forms of programming, ranging from competitive programming writeups, to documenting my journey through cool side projects (if I can ever muster up the motivation to finish one)! My vision for this blog is a warm, comfortable space that is welcoming to people of all levels of expertise.

If you'd like to follow the development of this site, check out the github page [here](https://github.com/Gomango999/latenight-code).

Anyways, it's getting late... Nice chatting with you and I hope you enjoy your stay :)

<div class="centering w-100 mt-5">
<img id="snoozing-fox" width=30% src="/images/fox/tp_fox1.png" style="min-width:170px;">
<i class="mt-3" style="display:block;">... zzz ...</i>
</div>

<script>
    state = 0
    setInterval(() => {
        if (state == 0) {
            $('#snoozing-fox').attr("src","/images/fox/tp_fox2.png");
            state = 1
        } else if (state == 1) {
            $('#snoozing-fox').attr("src","/images/fox/tp_fox1.png");
            state = 0
        }
    }, 1500);
</script>
