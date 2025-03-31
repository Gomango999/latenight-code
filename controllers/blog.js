import fs from 'fs';
import path from 'path';
import moment from 'moment';
import metadataParser from 'markdown-yaml-metadata-parser';


function getAllBlogPostNames() {
    const dir = fs.opendirSync('./public/blog/posts/');

    let names = [];
    let dirent;
    while ((dirent = dir.readSync()) !== null) {
        if (!dirent.isDirectory()) continue;
        names.push(dirent.name);
    }

    dir.closeSync();

    return names;
}

function getBlogMetadata(postName) {
    const filepath = path.join('./public/blog/posts/', postName, postName + ".md");
    const rawText = fs.readFileSync(filepath, 'utf-8');
    const markdown = metadataParser(rawText);
    return markdown.metadata;
}

// Populates the header with some additional information
function populateHeader(blog, blogName, groups) {
    // Fill in some default values
    if (!('public' in blog)) blog.public = true;
    if (!('lastModified' in blog)) blog.lastModified = blog.uploadDate;
    if (!('notes' in blog)) blog.notes = "";
    if (!('prevPage' in blog)) blog.prevPage = "";
    if (!('nextPage' in blog)) blog.nextPage = "";
    if (!('tags' in blog)) blog.tags = [];
    if (!('name' in blog)) blog.name = blogName;

    // If the blog contains a 'redirect' field, we will ignore all it's contents and
    // simply have the "blog post" link to whatever is specified in the field.
    blog.is_redirect = ('redirect' in blog);
    if (blog.is_redirect) {
        blog.url = '/..' + blog.redirect;
    } else {
        blog.url = '/' + blog.name;
    }

    blog.filepath = path.join('./public/blog/posts/', blog.name, blog.name + '.md');
    blog.outpath = path.join('./public/blog/posts/', blog.name, blog.name + '.html');

    blog.timeFromUpload = moment(blog.uploadDate).fromNow();
    blog.displayUploadDate = moment(blog.uploadDate).format('D MMM, YYYY');

    // If a blog is made over a week part, we create a visual spacer in the blog list.
    let currDate = moment.now();
    blog.overOneWeek = moment(currDate).diff(moment(blog.uploadDate), 'days') >= 7;
    blog.monthYear = moment(blog.uploadDate).format('MMMYYYY'); 

    const defaultCoverArt = '/images/background/desk/desk5_cropped0_small.png';
    if (!blog.hasOwnProperty('coverArt')) {
        blog.coverArt = defaultCoverArt;
    }

    // TODO: Add code to display the title of the previous and next page

    blog.author = {
        name: "Kevin Zhu",
        image: "/images/profile_pictures/Terrarium.png",
        email: "kv.zhu999@gmail.com"
    };

    // Populate blog menu data based on the group
    if ('menu' in blog && 'groups' in blog.menu) {
        blog.menu.groups.forEach(groupName => {
            let group = groups[groupName];

            let submenu = {};
            submenu.title = group.title;
            submenu.relatedLinks = [];
            group.posts.forEach(post => {
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

function loadGroups() {
    const groupsPath = './public/blog/metadata/groups.json'
    const data = fs.readFileSync(groupsPath, 'utf-8');
    return JSON.parse(data);
}

const groups = loadGroups();

// Loads all blog posts in order of most recent first for the blog list
function loadBlogPosts(blogPostNames) {

    const blogs = blogPostNames.map(postName => {
        let blog = getBlogMetadata(postName);
        blog = populateHeader(blog, postName, groups);
        blog.content = fs.readFileSync(blog.outpath, 'utf-8');
        return blog;
    }).filter(blog => {
        return blog.public;
    }).sort((a, b) => {
        return moment(a.uploadDate).isBefore(moment(b.uploadDate)) ? 1 : -1;
    });

    return blogs
}

const blogPostNames = getAllBlogPostNames();
const blogs = loadBlogPosts(blogPostNames);

const posts = function (req, res) {
    let blog = getBlogMetadata(req.params.post);
    blog = populateHeader(blog, req.params.post, groups);

    // TODO: Render a 404 not found page if the blog doesn't exist

    blog.content = fs.readFileSync(blog.outpath, 'utf-8');
    res.render('blog.pug', { blog: blog });
}

export { posts };

export function index(_req, res) {
    res.render('blog_list.pug', {
        blogs: blogs,
    });
}
