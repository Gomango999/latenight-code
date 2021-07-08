# Blogs

## Making a Blog
To write new blog post, follow the following steps.

1. Create a new file in `blog_posts/` with the number, followed by the blog name, E.g. `blog_posts/17_aio_2020`
2. In the folder, create a `.md` file with the same name. Copy over the YAML header from another blog post, and update the details to match.
3. If you have any images or code, place them inside the same folder as the blog post.
4. Write your blog post.
5. Make sure you compile the md with `make`. This will use pandoc to convert your markdown into html, which will get automatically found by `blogController.js`

## Filters
There is a list of custom filters that are applied to each markdown file before being compiled. Currently there is only one in the list.

- `add_downloads.py`
    - This is used to add custom download buttons to the markdown, for downloading code or images or anything else.
    - To use it, make a new line starting with `!!! download` followed by the file name. For example,
    ```
    !!! downloads blog_posts/16_brute_comparison/code/e_broken.cpp
    ```
