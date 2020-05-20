const express = require('express');
const router = express.Router();
const controller=require('../controllers/event');

router.get('/', controller.testReturnEvent);


module.exports = router;