const express = require('express');
const router = express.Router();
const controller=require('../controllers/user');
const checkAuth = require('../middlewares/check-auth')



router.post('/testReturn2', controller.testReturn2);
router.get('/testReturn', controller.testReturn);
router.post('/signup',controller.signup);
router.post('/signin', controller.signin);



router.get('/', controller.get_all);
router.post('/', controller.create);
router.get('/:id', controller.get_by_id);
router.patch('/:id',controller.update_by_id );
router.delete('/:id', controller.delete_by_id);

router.post('/resetPassword',controller.resetPassword);
router.post('/changePassword',checkAuth,  controller.changePassword);
router.post('/updatePassword', controller.updatePassword);
module.exports = router;