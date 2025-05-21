const Plant = require('../models/PlantManagementModel');
// const cloudinary = require('../config/cloudinary');

// Validate plant data
exports.validatePlantData = (req, res, next) => {
  const requiredFields = [
    'name', 'othername','description', 'price', 'discount', 'stock', 'mintemp', 'maxtemp', 'minrainfall', 'maxrainfall','category','ph',
    'zones', 'humidity', 'sunlight'];
  
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(', ')}`
    });
  }
  
  if (req.body.price < 0) {
    return res.status(400).json({ message: 'Price cannot be negative' });
  }
  
  if (req.body.stock < 0) {
    return res.status(400).json({ message: 'Stock cannot be negative' });
  }
  
  next();
};

// Check if plant exists
exports.checkPlantExists = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    req.plant = plant;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handle image upload (placeholder - would integrate with cloud storage in real app
exports.handleImageUpload = async (req, res, next) => {
  if (!req.file) return next(); // Skip if no file

  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'plant-app', // Optional: Organize images in a folder
      use_filename: true,  // Keep original filename
      unique_filename: false,
      overwrite: true,
    });

    // Attach Cloudinary URL to req.body
    req.body.image = result.secure_url; // Use secure HTTPS URL

    // Optionally delete the temp file after upload (if using multer)
    const fs = require('fs');
    fs.unlinkSync(req.file.path);

    next();
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return res.status(500).json({ error: 'Image upload failed' });
  }
};

