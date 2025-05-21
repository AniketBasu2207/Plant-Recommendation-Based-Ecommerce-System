const Plant = require('../models/plantModel'); // Update this path to match your existing model file

// Rest of the controller code remains the same
exports.getPlantsForCards = async (req, res) => {
  try {
    const { category } = req.query;
    
    const filter = {};
    if (category && ['Flower', 'Indoor', 'Fruit'].includes(category)) {
      filter.category = category;
    }

    const plants = await Plant.find(filter).select(
      'name price discount image category'
    );

    res.status(200).json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

exports.getPlantDetailsForCard = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: plant
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};
