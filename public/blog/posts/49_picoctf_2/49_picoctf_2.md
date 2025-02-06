---
title: "PicoCTF 2021 - Part 2."
description: My experience solving web exploitation challenges in PicoCTF 2021
author: Kevin Zhu
public: true
uploadDate: 2022-04-12 02:44+11:00
lastModified: 2022-04-12 02:44+11:00
notes: ''
prevPage: 48_picoctf_1
nextPage: 50_picoctf_3
tags:
- capture the flag
- picoCTF
menu:
  groups: []
  submenus: []
name: 49_picoctf_2
---

> _This was submitted as part of my blog posts for week 3 of COMP6841_

This week, I tried my hand at web exploitation. Unfortunately, as I did these challenges, I found my lack of knowledge of how the web and servers work really let me down in places. This meant that for many of these, I simply had to rely on writeups to fill in the gaps. There's nothing wrong with this exactly since I'm still learning, but I would prefer an approach where I learn first, and then try problems. PicoCTF may not be the best site for this, so I may consider switching to other sites.

Anyways here are the problems of the week:

## GET aHEAD

In this problem, we're presented with two buttons. On inspection, it seems one of them posts a GET request, and the other posts a POST request. However, the hints and title seem to suggest that we'd like to post a third type of request: the HEAD request.

The hints represented BurpSuite. Looking into it, BurpSuite seems to be a tool that allows you to intercept requests and responses. By setting Firefox to have a proxy of localhost:8080, it seems that we are able to intercept HTTP requests before they are sent. We're also able to modify them beforehand.

Now modifying a GET request into a HTTP request gave us a new page, but unfortunately the entire page was empty. My next suspicion was that there might be something in the header itself, and after a bit of research, it turns out that BurpSuite can also intercept responses too. Intercepting the response got me the flag.

## Cookies

In this problem, you can enter in the names of cookies, and you'll get a nice message if you match a certain type of cookie out of a list of cookies. Experimenting with it a bit, I found that actual cookies, such as "fortune" or "snickerdoodle" would give us the nice message, and everything else would give an error message.

Since the challenge name was cookies, this gave me a strong hint as to where to look next. Looking at the cookies, I noticed that there was one cookie called "name". It's value seemed to change for every cookie I entered. No cookie was -1, fortune was 20 and snickerdoodle was 0. They seemed to correspond to the cookie names, so I tried some different values, and was able to find a bunch of different cookies of different names.

Experimenting a bit, I thought maybe the flag might be the last cookie, so after binary searching, I eventually found the last cookie at value 29. Only problem was that it wasn't the flag, it was just another real cookie. I also tried other values like 1000 and -2 but to no luck.

I eventually gave up, and much to my dismay, the real solution was just to brute force the remaining cookies. The flag was actually at cookie 18. Honestly, after reading this, I was a bit annoyed that it was just brute forcing, but I also reckon it should have been something that I tried given there was only 30 cookies to try.

## Scavenger Hunt

For this one, I had actually seen a slightly similar challenge in PicoCTF 2019, so I kinda knew what was up. However, this one ended up being more difficult.

First thing I did was inspect the source, where I found part 1. Inspecting the CSS gave me part 2, but instead of finding part 3 in the javascript, I found a message wondering how to stop google indexing a page.

After doing some research, it turns out there are a couple ways. One is to use a noindex tag, but the second one was to use a file called robots.txt. Opening up the file gave me the third part.

This page now made a reference to the fact that the server was run on Apache. I assumed that this was going to be somewhat similar, that there was some sort of config file for Apache that I could once again access to get the key. Unfortunately, doing some googling didn't allow me to spot the answer, and I had to rely on a writeup for this one. The file name was .htaccess. Turns out that .htaccess allows you to make configuration changes on a directory based basis, and going there gets us the 4th part.

Finally, it makes reference to Mac. Being the owner of a Mac, I was pretty sure that this had to be .DS_Store and I was right! This got me the final part of the flag.

## Some Assembly Required 1

This one was the hardest out of all of them. We start with a textbox asking us to enter the flag, and it gives us the answer "Incorrect" for whatever we type in. Let's look into the javascript! Looking at the javscript, it seems that everything is super obfuscated. Prettifying it and running it through an obfuscator, I noticed that there was a particular function that was being used alot: `_0xa80748`. Specifically, all it did was subtract off a value from its argument and return it. Not only that, it was almost always used to access an array `_0xa80748`, which contained a list of strings. Looking at the strings in the array, parts of it looked like javascript code. It dawned on me that this was just a really obfuscated way of using strings! After a painstaking process, I was able to replace all occurences of `_0xa80748` and `_0xa80748` with just strings.

Afterwards, I was left with lines that looked similar this:
```
exports["copy_char"](inputvalue["charCodeAt"](i), i);
```

I couldn't understand it. charCodeAt looked like it was a method, but it was being used to access a dictionary? It was a while before I realised that this was just a fancy way of accessing the methods of a object. I had actually learnt this before, but it was just so rarely used I had completely forgotten about it. Writing this out more neatly gave me this: `exports.copy_char(inputvalue.charCodeAt(i), i);` which was a lot more understandable. Deobfuscating all the code even more, I was left with something like this:

``` javascript
(async() => {
  let idk1 = await fetch("./JIFxzHyW8W");
  let idk2 = await WebAssembly.instantiate(await idk1["arrayBuffer"]());
  let idk4 = idk2.instance;
  exports = idk4["exports"];
})();
/**
 * @return {undefined}
 */
function onButtonPress() {
  let inputvalue = document.getElementById("input").value;
  for (let i = 0; i < inputvalue.length; i++) {
    exports.copy_char(inputvalue.charCodeAt(i), i);
  }
  exports.copy_char(0, inputvalue.length);
  if (exports.check_flag() == 1) {
    document.getElementById("result").innerHTML = "Correct!";
  } else {
    document.getElementById("result").innerHTML = "Incorrect!";
  }
}
;
```
I actually have no knowledge of WebAssembly or what it is, so I decided to look into it. Apparently, it's just assembly that can run in the browser. You can typically compile c programs, python programs or whatever into WebAssembly which are provided as a separate file, and this code is then run to produce results in the browser. Looking at the code, I recognised the fetch command as a means to retrieve a file, and so I tried following the link. Opening up the assembly file, I clearly saw the flag at the bottom and took it for the victory. Typing it back into the original input field proved that the assembly was working correctly.