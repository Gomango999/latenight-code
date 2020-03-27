var express = require('express');
var router = express.Router();
var writeupsController = require('../controllers/writeupsController');

router.get('/', writeupsController.index);

module.exports = router;
