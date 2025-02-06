# Blogs

## Making a Blog
To write new blog post, follow the following steps.

1. Use `./newpost <post name>`
2. Fill out the Title, Description and Tags fields
3. Hit ``Ctrl+S`` in order to automatically build the HTML using make.

## Filters
There is a list of custom filters that are applied to each markdown file before being compiled. To add a new filter, modify the Makefile.

- `add_downloads.py`
    - This is used to add custom download buttons to the markdown, for downloading code or images or anything else.
    - To use it, make a new line starting with `!!! download` followed by the file name. For example,
    ```
    !!! downloads blog_posts/16_brute_comparison/code/e_broken.cpp
    ```
- `terminal_syntax_highlighting.py`
    - This is used to add syntax highlighting for terminal code blocks
    - Namely, this just adds a blue color to any line starting with "$" to represent a prompt
    - Usage is:
    ```
    ```term
    $ cat hello.txt
    hi there!
    ```
    ```

