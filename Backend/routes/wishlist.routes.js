const express = require('express');
const router = express.Router();
const {add_to_wishlist,view_wishlist,delete_wishlist}=require('../controllers/add_to_wishlist.controller')


router.post('/',add_to_wishlist)
router.get('/',view_wishlist)
router.get('/:id',delete_wishlist)

module.exports = router;