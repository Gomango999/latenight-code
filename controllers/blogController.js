const showdown  = require('showdown');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

// Metadata files for blogs
// Update me when adding new blog posts
files = [
  '2020_06_06_0_intro.json',
  '2020_06_06_1_memset.json',
  '2020_09_09_0_aio_1.json',
  '2021_02_16_0_food.json',
  '2021_02_16_1_hoppers.json',
]

// Generate blogs list, and populate it with information
let blogs = []
files.forEach(filename => {
  rawText = fs.readFileSync(path.join('./public/files/blog_posts/', filename), 'utf-8');
  blog = JSON.parse(rawText);
  let converter = new showdown.Converter();
  let rawMarkdown = fs.readFileSync(path.join('./public/files/blog_posts/', blog.name + '.md'), 'utf-8');
  blog.content = converter.makeHtml(rawMarkdown);
  blog.url = '/'+blog.name;
  blog.timeFromUpload = moment(blog.uploadDate).fromNow();
  blogs.push(blog);
});

// Sort blogs in reverse chronological order
blogs.sort((a, b) => {
  return moment(a.uploadDate).isBefore(moment(b.uploadDate)) ? 1 : -1;
});

// Add renderers to each blog
blogs.forEach(blog => {
  blog.renderer = function (req, res) {
    res.render('blog.pug', { blog: blog });
  };
})

exports.blogs = blogs;

exports.index = function (req, res) {
  res.render('blog_list.pug', {
    blogs: blogs,
  });
}
