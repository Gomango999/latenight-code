var express = require('express');
var router = express.Router();
var artController = require('../controllers/artController');

router.get('/', artController.index);

module.exports = router;
