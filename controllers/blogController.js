import fs from 'fs';
import path from 'path';
import moment from 'moment';
import metadataParser from 'markdown-yaml-metadata-parser';
import os from 'os';


function getAllBlogPostNames() {
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

function getBlogMetadata(postName) {
    const filepath = path.join('./public/blog_posts/', postName, postName + ".md");
    const rawText = fs.readFileSync(filepath, 'utf-8');
    const markdown = metadataParser(rawText);
    return markdown.metadata;
}

// Populates the header with some additional information
function populateHeader(blog, blogName, groups) {
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
    blog.url = '/' + blog.name;
    blog.filepath = path.join('./public/blog_posts/', blog.name, blog.name + '.md');
    blog.outpath = path.join('./public/blog_posts/', blog.name, blog.name + '.html');

    blog.timeFromUpload = moment(blog.uploadDate).fromNow();
    blog.displayUploadDate = moment(blog.uploadDate).format('D MMM, YYYY');

    let currDate = moment.now();
    blog.overOneWeek = moment(currDate).diff(moment(blog.uploadDate), 'days') >= 7;
    blog.monthYear = moment(blog.uploadDate).format('MMMYYYY'); // used to make spacers

    // Set default cover art
    const defaultCoverArt = '/images/background/desk/desk5_cropped0_small.png';
    if (!blog.hasOwnProperty('coverArt')) {
        blog.coverArt = defaultCoverArt;
    }

    // TODO: Add code to display the title of the previous and next page

    blog.author = {
        name: "Kevin Zhu",
        image: "/images/profile_pictures/Terrarium.png",
        email: "kv.zhu999@gmail.com"
    }

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
    const groupsPath = './public/blog_posts/metadata/groups.json'
    const data = fs.readFileSync(groupsPath, 'utf-8');
    return JSON.parse(data);
}

const groups = loadGroups();

// Loads all blog posts in order of most recent first
function loadBlogPosts(blogPostNames) {

    const blogs = blogPostNames.map(postName => {
        let blog = getBlogMetadata(postName);
        blog = populateHeader(blog, postName, groups);
        blog.content = fs.readFileSync(blog.outpath, 'utf-8');
        return blog;
    }).filter(blog => {
        return !blog.hidden;
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
