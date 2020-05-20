const express = require('express');
const router = express.Router();
const controller=require('../controllers/user');

router.get('/', controller.testReturn);


module.exports = router;