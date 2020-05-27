exports.index = function (req, res) {
    res.render('blog_list.pug', {
        writeups: exports.writeups,
    });
}
