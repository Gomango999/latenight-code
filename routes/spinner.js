var express = require('express');
var router = express.Router();
var spinnerController = require('../controllers/spinnerController');

router.get('/', spinnerController.index);

module.exports = router;
