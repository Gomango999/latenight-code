var express = require('express');
var router = express.Router();
var blogController = require('../controllers/blogController');

router.get('/', blogController.index);
blogController.blogs.forEach(blog => {
  router.get(blog.url, blog.renderer);
});

module.exports = router;
