blogList = [
  "First Blog",
  "second Blog",
  "yes",
]
exports.index = function (req, res) {
    res.render('blog_list.pug', {
        blogList: blogList,
    });
}
