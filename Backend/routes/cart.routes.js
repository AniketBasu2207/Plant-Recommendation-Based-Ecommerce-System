const express = require('express');
const router = express.Router();
const {add_to_cart,view_cart,delete_cart}=require('../controllers/add_to_cart.controller')


router.post('/',add_to_cart)
router.get('/',view_cart)
router.get('/:id',delete_cart)

module.exports = router;