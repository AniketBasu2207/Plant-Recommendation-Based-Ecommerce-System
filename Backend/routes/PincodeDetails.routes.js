const express = require('express');
const router = express.Router();
const get_details_from_pincode=require('../controllers/PincodeDetails.controller')



router.get('/:state/:district',get_details_from_pincode)


module.exports = router;