var express = require('express');
var router = express.Router();
var writeupsController = require('../controllers/writeupsController');

router.get('/', writeupsController.index);
writeupsController.writeups.forEach(writeup => {
  router.get(writeup.url, writeupsController.renderer[writeup.url]);
});

module.exports = router;
