const express = require('express');
const router = express.Router();
const plantCardController = require('../controllers/plantcardController');

// Get plants for cards with optional filters
// router.get('/cards', plantCardController.getPlantsForCards);

// Get single plant details for card
router.get('/cards/:id', plantCardController.getPlantDetailsForCard);


module.exports = router;
