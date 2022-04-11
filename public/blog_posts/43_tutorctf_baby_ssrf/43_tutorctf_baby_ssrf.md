---
title: "Tutor CTF: Baby SSRF"
description: (300 points) Web Challenge
author: Kevin Zhu
public: true
uploadDate: 2022-04-11 18:56+11:00
lastModified: 2022-04-11 18:56+11:00
notes: ''
prevPage: 42_tutorctf_alice_and_bob
nextPage:
tags:
- capture the flag
- tutor ctf
- comp6841
menu:
  groups: []
  submenus: []
name: 43_tutorctf_baby_ssrf
---

## Exploration

We're given `app.py`, a script that runs a Flask web server. Opening it up, we see

```python
#!/usr/bin/env python3

from flask import Flask, request
from requests import get
import os

app = Flask(__name__)

@app.route("/api/list_files")
def list_files():
    d = request.args.get('directory')
    return '\n'.join(os.listdir(d))

@app.route("/api/read_file")
def read_file():

    # To prevent people from the Internet reading files :D
    if request.remote_addr != '127.0.0.1':
        return 'Uk9UMTM6dWdnY2Y6Ly9qamoubGJoZ2hvci5wYnovam5ncHU/aT1xRGo0ajlKdEtwRA=='

    p = request.args.get('path')
    with open(p, 'r') as f:
        return f.read()

@app.route("/api/get_request")
def get_request():
    u = request.args.get('url')
    return get(u).text

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=1337)
```

We're also given a link to <http://13.210.180.94:10000/> which shows us a "URL Not Found" page. This makes sense, since this isn't one of the routes specified in `app.py`.

Let's now take a look at each of these routes in detail:

1. `/api/list_files`
    - Lists the files in the current directory
    - Accessing <http://13.210.180.94:10000/api/list_files> gives us the following files
        - app.py
        - flag.txt
    - Obviously, flag.txt is what we're after
2. `/api/read_files`
    - This will open files up on the server computer and display them.
    - Unfortunately, it does a check to see if the IP being used to access is itself or not.
    - Hence, if we try accessing <http://13.210.180.94:10000/api/read_file?path=flag.txt>, since our IP address obviously isn't equal to `127.0.0.01`, it just gives us that random base64 message.
        - Decoding the base64 message gives
            - `ROT13:uggcf://jjj.lbhghor.pbz/jngpu?i=qDj4j9JtKpD`
        - Applying ROT13 to this gives us a URL
            - <https://www.youtube.com/watch?v=dQw4w9WgXcQ>
        - Which of course I recognise as a Rick Roll link, so I'll save myself the effort of clicking it.
3. `/api/get_request`
    - This takes a url as an argument, and then returns the webpage given by that url.
    - For example, if we wanted to access Google, we could use <http://13.210.180.94:10000/api/get_request?url=http%3A%2F%2Fgoogle.com>, which would give us a rudimentary form of the google homepage (minus the CSS and Images)

We now have all the information we need to run an SSRF attack

## SSRF

SSRF stands for Server Side Request Forgery. Servers request resources all the time when displaying webpages. For example, it may request an image to be displayed, and the image is stored at another server. SSRF means making the server request something on the user's behalf, which can have unintended consequences. For example, in this case, we can make the server request `flag.txt` via it's own `get_request` api.

First the URL we are trying to access is `http://13.210.180.94:10000/api/read_file?path=flag.txt`. Using a [HTML URL Encoder](https://www.urlencoder.org/), we get `http%3A%2F%2F13.210.180.94%3A10000%2Fapi%2Fread_file%3Fpath%3Dflag.txt`. Putting this as an argument into the GET request, we have

<http://13.210.180.94:10000/api/get_request?url=http%3A%2F%2F13.210.180.94%3A10000%2Fapi%2Fread_file%3Fpath%3Dflag.txt>

Unfortunately, accessing this gives the same base64 message. It seems that since we used the public IP address to access the server, the server also used it's own public IP address as the remote address, thus triggering the message to be returned.

Let's change our URL now to be `localhost:1337/api/read_file?path=flag.txt`. Note that we change the port to `1337` as defined in `app.py` instead of the previous `10000`. This is because the server has port forwarding setup. The app is actually running on port 1337. However, from the outside connecting in, they connect to port `10000`, which is then forwarded to our app. If we're connecting from the inside, we should use the correct port. Putting this together gives us the URL

<http://13.210.180.94:10000/api/get_request?url=http%3A%2F%2Flocalhost%3A1337%2Fapi%2Fread_file%3Fpath%3Dflag.txt>

and accessing it gets us our flag!