const express = require('express');
const router = express.Router();
const controller = require('../controllers/plantManagementController');
const middleware = require('../../Backend/middleware/plantManagementMiddleware');
const upload = require('../config/multerConfig');

// Plant management routes
router.get('/', controller.getAllPlants);
router.get('/:id', middleware.checkPlantExists, controller.getPlant);
router.post(
  '/',
  upload.single('image'),
  middleware.validatePlantData,
  middleware.handleImageUpload,
  controller.createPlant
);
router.put(
  '/:id',
  upload.single('image'),
  middleware.checkPlantExists,
  middleware.validatePlantData,
  middleware.handleImageUpload,
  controller.updatePlant
);
router.delete('/:id', middleware.checkPlantExists, controller.deletePlant);

// Stats routes
router.get('/stats/ecom', controller.getEcomStats);
router.get('/stats/orders', controller.getOrderStats);

module.exports = router;

