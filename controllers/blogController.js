const showdown = require('showdown');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const showdownKatex = require('showdown-katex')

// get groups
const groups = JSON.parse(fs.readFileSync('./public/files/blog_posts/metadata/groups.json', 'utf-8'));

// find blog post files
let blogPosts = []
const dir = fs.opendirSync('./public/files/blog_posts/')
let dirent
while ((dirent = dir.readSync()) !== null) {
  if (path.extname(dirent.name) != '.json') continue;
  blogPosts.push(dirent.name)
}
dir.closeSync()

// gets the blog header
function getBlog(filename) {
  rawText = fs.readFileSync(path.join('./public/files/blog_posts/', filename), 'utf-8');
  let blog = JSON.parse(rawText);

  blog.url = '/'+blog.name;
  blog.timeFromUpload = moment(blog.uploadDate).fromNow();

  return blog
}

// generate blogs list, and populate it with information
let blogs = []
blogPosts.forEach(filename => {
  // get json data
  blog = getBlog(filename)
  if (!blog.public) return;

  // populate blog menu data with group data
  if ('menu' in blog && 'groups' in blog.menu) {
    blog.menu.groups.forEach(groupName => {
      group = groups[groupName];
      let submenu = {};
      submenu.title = group.title;
      submenu.relatedLinks = [];
      group.posts.forEach(post =>{
        let relatedBlog = getBlog(post+'.json');
        let link = {};
        link.title = relatedBlog.title;
        link.href = relatedBlog.name;
        link.live = relatedBlog.public;
        submenu.relatedLinks.push(link);
      });
      blog.menu.submenus.push(submenu);
    });
  }

  // get blog content and convert from markdown
  let rawMarkdown = fs.readFileSync(path.join('./public/files/blog_posts/', blog.name + '.md'), 'utf-8');

  const converter = new showdown.Converter({
    extensions: [showdownKatex({
      throwOnError: false,
      delimiters: [{ left: '$', right: '$', asciimath: false }],
      delimiters: [{ left: '$$', right: '$$', asciimath: false, displayMode: true }],
    })]
  });
  blog.content = converter.makeHtml(rawMarkdown);

  blogs.push(blog);
});

// sort blogs in reverse chronological order
blogs.sort((a, b) => {
  return moment(a.uploadDate).isBefore(moment(b.uploadDate)) ? 1 : -1;
});

// add renderers to each blog
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
