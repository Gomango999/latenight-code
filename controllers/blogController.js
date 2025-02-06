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
    blog.url = '/' + blog.name;
    blog.filepath = path.join('./public/blog_posts/', blog.name, blog.name + '.md');
    blog.outpath = path.join('./public/blog_posts/', blog.name, blog.name + '.html');

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

function loadMetadata() {
    function readJSON(path) {
        const data = fs.readFileSync(path, 'utf-8');
        return JSON.parse(data);
    }

    const groups = readJSON('./public/blog_posts/metadata/groups.json');
    const authors = readJSON('./public/blog_posts/metadata/authors/authors.json')

    return { groups, authors }
}

function loadBlogPosts(blogPostNames) {

    const { groups, authors } = loadMetadata();

    const blogs = blogPostNames.map(postName => {
        let blog = getBlogMetadata(postName);
        blog = populateHeader(blog, postName, groups, authors);
        blog.content = fs.readFileSync(blog.outpath, 'utf-8');
    }).filter(blog => {
        return !blog.hidden;
    }).sort((a, b) => {
        return moment(a.uploadDate).isBefore(moment(b.uploadDate)) ? 1 : -1;
    }).map(blog => {
        blog.renderer = function (_req, res) {
            res.render('blog.pug', { blog: blog });
        };
    });

    return blogs
}

const blogPostNames = getAllBlogPostNames();
const blogs = loadBlogPosts(blogPostNames);

export { blogs as blogs };

export function index(_req, res) {
    res.render('blog_list.pug', {
        blogs: blogs,
    });
}
