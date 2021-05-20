# Generating your own themes for pandoc
https://stackoverflow.com/questions/30880200/pandoc-what-are-the-available-syntax-highlighters

- Pandoc themes are a subset of KDE themes. You can find sample KDE themes here:
https://github.com/KDE/syntax-highlighting/tree/master/data/themes

- Run this to generate the CSS for a specific theme
pandoc ./public/files/blog_posts/sandbox.md --highlight-style ./public/syntax-highlighting/gruvbox-dark.theme --mathjax -o ./public/files/blog_posts/out/sandbox.html

- To update the theme, update `syntax-highlighting.css`. Some modifications will also be needed in `latenight-code.css`.
