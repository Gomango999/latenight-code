var express = require('express');
var router = express.Router();
var projectsController = require('../controllers/projectsController');

router.get('/', projectsController.index);

module.exports = router;
