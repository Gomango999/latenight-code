---
title: "Tutor CTF: bus buddies"
description: (500 points) Misc. Challenge
author: Kevin Zhu
public: true
uploadDate: 2022-04-11 16:35+11:00
lastModified: 2022-04-11 16:35+11:00
notes: ''
prevPage: 39_tutorctf_tired
nextPage: 41_tutorctf_chain
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: [tutorctf]
  submenus: []
name: 40_tutorctf_bus_buddies
---

_Contest Source: [COMP6[84]41 CTF](https://www.comp6841.com/challenges)_

> _Note that all flags have been replaced with "COMP6841{REDACTED}". This is to discourage you from just blindly submitting the final answer, and to encourage you to follow along and learn something along the way._


For this exercise, we're given a `bus.zip` which contains 8 photos inside. We are asked to determine the bus route and use that to assemble the flag. Let's take a look at our images in turn, and see what we can do with them. For a TLDR, here's the final map. In this blog post, I'll be breaking down my thought processes for cracking each location along the route.

<iframe src="https://www.google.com/maps/d/embed?mid=1P816GE2X-esayxF9sin1ElZ_N7_smM1_&hl=en&ehbc=2E312F" width="640" height="480"></iframe>

## Photo 1

![_Image 1 out of 8 (`1.png`)_](/blog_posts/40_tutorctf_bus_buddies/images/1.png){width=40%}

Here we can clearly see a White Lady Funeral's building. Typing this into google maps and looking around all the White Lady Funeral Homes in Sydney, we eventually find an exact match in Sutherland.

![](/blog_posts/40_tutorctf_bus_buddies/images/match1.png){width=70%}

## Photo 2

Moving on, here's our second image

![_Image 2 out of 8 (`2.png`)_](/blog_posts/40_tutorctf_bus_buddies/images/2.png){width=40%}

I started by looking for nearby rivers and checking their bridges, but unfortunately no luck there. I ended up skipping this one and coming back to it later.

## Photo 3

Next up, image 3

![_Image 3 out of 8 (`3.png`)_](/blog_posts/40_tutorctf_bus_buddies/images/3.png){width=40%}

This one appears to be some sort of "Library & Leisure Centre", based on the sign. We see there are few colorful blocks and a massive chessboard on the premises. Looking around for local libraries in the area, I ultimately settled on Padstow Library after catching a glimpse of a photo from Google maps.

![Padstow Library, 2017](/blog_posts/40_tutorctf_bus_buddies/images/match3.png){width=40%}

We can see that the sign has changed, but this is undoubtedly the same library. This picture was taken in 2017, though it appears the sign has changed as of 2022. I was also wrong about my initial guess. The sign actually read "Padstow Library & Knowledge Centre", not "Leisure". Goes to show that we shouldn't make assumptions!

![Padstow Library, 2022](/blog_posts/40_tutorctf_bus_buddies/images/match32.png){width=70%}

## Photo 2 Revisited

Now given that we know the locations of 1 and 3, and assuming that these locations are given out in order along the bus route, this narrows down the places we need to search for the bridge, since it must be somewhere in between. Looking at their locations, it's worth checking out the bridge between Alfords Point and Padstow Heights.

![](/blog_posts/40_tutorctf_bus_buddies/images/match2.png){width=70%}

And would you look at that! The railings on the bridge match perfectly as well as the sandy shoreline! Heading onto the bridge itself, it's obvious that we have a match.

![](/blog_posts/40_tutorctf_bus_buddies/images/match22.png){width=70%}

## Photo 4

![_Image 4 out of 8 (`1.png`)_](/blog_posts/40_tutorctf_bus_buddies/images/4.png){width=40%}

This one was pretty difficult. Clearly, we see a commbank next to a priceline, so I typed in priceline locations and commbank locations into Google maps. I then used image editting software to overlay the two markers, to try and see if I had any matches for two of them close to each other.

![](/blog_posts/40_tutorctf_bus_buddies/images/comm.png){width=30%}
![](/blog_posts/40_tutorctf_bus_buddies/images/price.png){width=30%}

![](/blog_posts/40_tutorctf_bus_buddies/images/comm_price.png){width=70%}

Unfortunately, I wasn't able to find it using this method, so I skipped it.

## Photo 5

![_Image 5 out of 8 (`1.png`)_](/blog_posts/40_tutorctf_bus_buddies/images/5.png){width=40%}

This one was pretty easy, since there was a number in the photo. A quick google search lead me to Elders Real Estate, Lidcombe.

![](/blog_posts/40_tutorctf_bus_buddies/images/match5.png){width=70%}

## Photo 4 Revisited

Using the same method, I started looking for pricelines between photos 3 and 5. Ultimately, I ended up with one in Bankstown near the train station, which matched the description:

![](/blog_posts/40_tutorctf_bus_buddies/images/match4.png){width=40%}

## Photo 6

![_Image 6 out of 8 (`1.png`)_](/blog_posts/40_tutorctf_bus_buddies/images/6.png){width=40%}

This one looks like a shopping centre of some kind. Typing in all the store names on the sign lead me to the Lidcombe Shopping Centre, on 92 Paramatta Rd. Browsing through the photos, I found the same one used in the Google Maps image.

![](/blog_posts/40_tutorctf_bus_buddies/images/match6.png){width=70%}

## Photo 7

![_Image 7 out of 8 (`1.png`)_](/blog_posts/40_tutorctf_bus_buddies/images/7.png){width=40%}

This photo contains a Rydges building, which is a hotel and resort chain in Australia and New Zealand. Searching around for Rydges buildings in the area, I ultiamtely settled on the one in Paramatta, along James Ruse Drive.

![](/blog_posts/40_tutorctf_bus_buddies/images/match7.png){width=70%}

## Photo 8

![_Image 8 out of 8 (`1.png`)_](/blog_posts/40_tutorctf_bus_buddies/images/8.png){width=40%}

Final one! This one doesn't contain alot of information. Just that its next to a train line, and some random skyscrapers in the background. However, knowing that this is the final image, and hence probably close to the bus's final destination, it makes sense that we are near a major train station. Looking at the current list of locations so far, it seems reasonable to assume this is somewhere near Paramatta station:

![](/blog_posts/40_tutorctf_bus_buddies/images/route7.png){width=60%}

Checking out the streetview near Paramatta station, we can see a skyscraper that looks quite similar to the one in the image.

![](/blog_posts/40_tutorctf_bus_buddies/images/match8.png){width=70%}

Walking down the street a bit in order to align the angle, we find the correct position just a little down the road.

![](/blog_posts/40_tutorctf_bus_buddies/images/match82.png){width=70%}

Thus our final photo is at Parammatta Station!

## Putting it All Together

Marking out all the locations on a map, we get this:

<iframe src="https://www.google.com/maps/d/embed?mid=1P816GE2X-esayxF9sin1ElZ_N7_smM1_&hl=en&ehbc=2E312F" width="640" height="480"></iframe>

In other words, our bus starts in Sutherland and heads all the way to Paramatta. Doing a google search for this, we get the following:

![](/blog_posts/40_tutorctf_bus_buddies/images/final.png){width=70%}

It's a perfect match! Entering this in the correct format gets us the flag.