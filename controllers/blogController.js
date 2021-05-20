const fs = require('fs');
const path = require('path');
const moment = require('moment');
const metadataParser = require('markdown-yaml-metadata-parser');

// get group and author metadata
function getMetadata() {
  const groupFilePath = './public/files/blog_posts/metadata/groups.json'
  const authorFilePath = './public/files/blog_posts/metadata/authors.json'
  const groupRawData = fs.readFileSync(groupFilePath, 'utf-8');
  const authorRawData = fs.readFileSync(authorFilePath, 'utf-8');
  const groups = JSON.parse(groupRawData);
  const authors = JSON.parse(authorRawData);
  return {groups, authors}
}

// generate a list of compiled blog post filenames.
function getBlogPostNames() {
  const dir = fs.opendirSync('./public/files/blog_posts/')

  let blogPostNames = []
  let dirent
  while ((dirent = dir.readSync()) !== null) {
    if (path.extname(dirent.name) != '.md') continue;
    blogPostNames.push(dirent.name);
  }
  dir.closeSync()
  return blogPostNames
}

// populates the header with some additional information
function populateHeader(blog, groups, authors) {
  // populate misc information
  blog.url = '/'+blog.name;
  blog.filepath = path.join('./public/files/blog_posts/', blog.name+'.md');
  blog.outpath = path.join('./public/files/blog_posts/out/', blog.name+'.html');
  blog.timeFromUpload = moment(blog.uploadDate).fromNow();
  blog.displayUploadDate = moment(blog.uploadDate).format('MMM D, YYYY');

  // populate authors
  blog.author = authors[blog.author]

  // populate blog menu data based on the group
  // if ('menu' in blog && 'groups' in blog.menu) {
  //   blog.menu.groups.forEach(groupName => {
  //     group = groups[groupName];
  //
  //     let submenu = {};
  //     submenu.title = group.title;
  //     submenu.relatedLinks = [];
  //     group.posts.forEach(post =>{
  //       let relatedBlog = getBlog(post+'.json');
  //       let link = {};
  //       link.title = relatedBlog.title;
  //       link.href = relatedBlog.name;
  //       link.live = relatedBlog.public;
  //       submenu.relatedLinks.push(link);
  //     });
  //     blog.menu.submenus.push(submenu);
  //   });
  // }

  return blog;
}

// generate list of blogs, and populate with information
function getBlogPosts(blogPostNames) {
  // find all blogs and populate with information
  let blogs = []
  let {groups, authors} = getMetadata();
  for (let i = 0; i < blogPostNames.length; i++) {
    filename = blogPostNames[i];

    const filepath = path.join('./public/files/blog_posts/', filename);
    const rawText = fs.readFileSync(filepath, 'utf-8');
    const markdown = metadataParser(rawText);
    let blog = markdown.metadata;
    blog = populateHeader(blog, groups, authors)

    if (!blog.public) continue;
    if (!fs.existsSync(blog.outpath)) continue;
    // add code to generate if doesn't exist here.

    blog.content = fs.readFileSync(blog.outpath, 'utf-8');

    blogs.push(blog);
  }

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

  return blogs
}

const blogPostNames = getBlogPostNames();
const blogs = getBlogPosts(blogPostNames);

exports.blogs = blogs;

exports.index = function (req, res) {
  res.render('blog_list.pug', {
    blogs: blogs,
  });
};
