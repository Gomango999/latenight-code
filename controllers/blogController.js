
// TODO: Replace this with dynamic list that reads in json files of metadata.
blogList = [
  {
    title: "First Blog",
    url: "/firstblog",
    content: "<h1> Heya</h1><p>This is my first everaaa blog postasd asd asd</p>"
  },
  {
    title: "second blog",
    url: "/second-blog",
    content: "<p>This is my second everr blog lol</p>"
  },
  {
    title: "yes",
    url: "/yes",
    content: "<p>pizza</p>"
  }
]
exports.blogList = blogList;

exports.index = function (req, res) {
  res.render('blog_list.pug', {
    blogList: blogList,
  });
}

exports.renderer = new Object();
exports.blogList.forEach(blog => {
  exports.renderer[blog.url] = function (req, res) {
    res.render('blog.pug', {
      blog: blog,
    });
  }
});

var showdown  = require('showdown'),
    converter = new showdown.Converter(),
    text      = '# hello, markdown!',
    html      = converter.makeHtml(text);
