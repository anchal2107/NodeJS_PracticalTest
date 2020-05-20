const express = require('express');
const router = express.Router();
const controller=require('../controllers/user');
router.post('/testReturn2', controller.testReturn2);
router.get('/testReturn', controller.testReturn);
router.post('/signup',controller.signup);
router.post('/signUp2',controller.signup2);
module.exports = router;