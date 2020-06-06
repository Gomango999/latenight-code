var express = require('express');
var router = express.Router();
var blogController = require('../controllers/blogController');

router.get('/', blogController.index);
blogController.blogList.forEach(blog => {
  router.get(blog.url, blogController.renderer[blog.url]);
});

module.exports = router;
