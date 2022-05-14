const fs = require('fs');
const path = require('path');
const moment = require('moment');
const metadataParser = require('markdown-yaml-metadata-parser');
const os = require('os');

// Get group and author metadata
function getMetadata() {

  const groupFilePath = './public/blog_posts/metadata/groups.json'
  const groupRawData = fs.readFileSync(groupFilePath, 'utf-8');
  const groups = JSON.parse(groupRawData);

  const authorFilePath = './public/blog_posts/metadata/authors/authors.json'
  const authorRawData = fs.readFileSync(authorFilePath, 'utf-8');
  const authors = JSON.parse(authorRawData);

  return {groups, authors}
}

// Generate a list of compiled blog post filenames.
function getBlogPostNames() {
  const dir = fs.opendirSync('./public/blog_posts/')

  let blogPostNames = []
  let dirent
  while ((dirent = dir.readSync()) !== null) {
    if (!dirent.isDirectory()) continue;
    if (dirent.name == "metadata") continue;
    if (dirent.name == "filters") continue;
    blogPostNames.push(dirent.name);
  }
  dir.closeSync()
  return blogPostNames
}

function getBlogMetadata(filename) {
  const filepath = path.join('./public/blog_posts/', filename, filename+".md");
  const rawText = fs.readFileSync(filepath, 'utf-8');
  const markdown = metadataParser(rawText);
  return markdown.metadata;
}

// Populates the header with some additional information
function populateHeader(blog, blogName, groups, authors) {
  // Fill in some default values
  if (!('public' in blog)) blog.public = false
  if (!('hidden' in blog)) blog.hidden = false
  if (!('lastModified' in blog)) blog.lastModified = blog.uploadDate
  if (!('notes' in blog)) blog.notes = ""
  if (!('prevPage' in blog)) blog.prevPage = ""
  if (!('nextPage' in blog)) blog.nextPage = ""
  if (!('tags' in blog)) blog.tags = []
  if (!('name' in blog)) blog.name = blogName
    
  // Populate misc information
  blog.url = '/'+blog.name;
  blog.filepath = path.join('./public/blog_posts/', blog.name, blog.name+'.md');
  blog.outpath = path.join('./public/blog_posts/', blog.name, blog.name+'.html');
  
  blog.timeFromUpload = moment(blog.uploadDate).fromNow();
  blog.displayUploadDate = moment(blog.uploadDate).format('D MMM, YYYY');
  
  currDate = moment.now();
  blog.overOneWeek = moment(currDate).diff(moment(blog.uploadDate), 'days') >= 7;
  blog.monthYear = moment(blog.uploadDate).format('MMMYYYY'); // used to make spacers

  // Set default cover art
  const defaultCoverArt = '/images/background/desk/desk5_cropped0_small.png';
  if (!blog.hasOwnProperty('coverArt')) {
    blog.coverArt = defaultCoverArt
  }

  // TODO: Add code to display the title of the previous and next page

  // Populate authors
  blog.author = authors[blog.author]

  // Populate blog menu data based on the group
  if ('menu' in blog && 'groups' in blog.menu) {
    blog.menu.groups.forEach(groupName => {
      group = groups[groupName];

      let submenu = {};
      submenu.title = group.title;
      submenu.relatedLinks = [];
      group.posts.forEach(post =>{
        let relatedBlog = getBlogMetadata(post)
        let link = {};
        link.title = relatedBlog.title;
        link.href = relatedBlog.name;
        link.live = relatedBlog.public;
        submenu.relatedLinks.push(link);
      });
      blog.menu.submenus.push(submenu);
    });
  }

  return blog;
}

// Generate list of blogs, and populate with information
function getBlogPosts(blogPostNames) {
    
  // Find all blogs and populate with information
  let blogs = []
  let {groups, authors} = getMetadata();
  for (let i = 0; i < blogPostNames.length; i++) {
      
    // Get blog metadata and populate it's header
    let blog = getBlogMetadata(blogPostNames[i])
    blog = populateHeader(blog, blogPostNames[i], groups, authors)
    
    // Check to see whether we should display hidden blogs
    if (blog.hidden) continue;
    
    // If not hidden, but not public, append an asterisk in the title.
    let islocal = Boolean(os.hostname().indexOf("local") > -1);
    if (!blog.public) {
      if (islocal) blog.title = "* " + blog.title;
      else continue;
    }
    if (!fs.existsSync(blog.outpath)) continue;
    
    blog.content = fs.readFileSync(blog.outpath, 'utf-8');

    blogs.push(blog);
  }

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

  return blogs
}

// Get all block post names
const blogPostNames = getBlogPostNames();

// Get all blog posts
const blogs = getBlogPosts(blogPostNames);

// Export them
exports.blogs = blogs;
exports.index = function (req, res) {
  res.render('blog_list.pug', {
    blogs: blogs,
  });
};
