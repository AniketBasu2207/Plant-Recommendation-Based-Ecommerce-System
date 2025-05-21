const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', (req,res)=>{
    res.send("<h1>Welcome to Home page</h1>");
})
router.get('/check', authMiddleware, authController.checkAuth);
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/logout', authController.logout);
router.get('/count', authController.cart_wishlist_count);
router.get('/islogin', authController.isLogin);

module.exports = router;

