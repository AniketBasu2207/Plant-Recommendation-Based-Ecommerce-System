const Plant = require('../models/PlantManagementModel');

const Order = require('../models/Order.model');

const moment = require('moment');


exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const accepted = await Order.countDocuments({ status: "Accepted" });
    const underProcessing = await Order.countDocuments({ status: "Under Processing" });
    const packaging = await Order.countDocuments({ status: "Packaging" });
    const shipped = await Order.countDocuments({ status: "Shipped" });
    const outOfDelivery = await Order.countDocuments({ status: "Out of Delivery" });
    const delivered = await Order.countDocuments({ status: "Delivered" });
    const cancelled = await Order.countDocuments({ status: "Cancelled" });

    res.status(200).json({
      totalOrders,
      accepted,
      underProcessing,
      packaging,
      shipped,
      outOfDelivery,
      delivered,
      cancelled
    });
  } catch (error) {
    console.error('Get Order Stats Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all plants
exports.getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    // const plants = await Plant.find().select("name image");
    res.status(200).json(plants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single plant
exports.getPlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.status(200).json(plant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new plant
exports.createPlant = async (req, res) => {
  try {
    const plant = new Plant(req.body);
    await plant.save();
    res.status(201).json(plant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a plant
exports.updatePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.status(200).json(plant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a plant
exports.deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.status(200).json({ message: 'Plant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Ecom
exports.getEcomStats = async (req, res) => {
  try {
    const orders = await Order.find().populate('order_details.plant_lists.plant');

    // Total sales
    const totalSales = orders.reduce((sum, order) => sum + order.order_details.total_price, 0);
    const totalOrders = orders.length;

    // Plant sales mapping
    const plantSalesMap = {};
    const monthlySalesMap = {};

    orders.forEach(order => {
      const month = moment(order.createdAt).format('MMMM'); // e.g., "April"
      monthlySalesMap[month] = (monthlySalesMap[month] || 0) + order.order_details.total_price;

      order.order_details.plant_lists.forEach(item => {
        const plantId = item.plant._id.toString();
        const quantity = item.quantity;

        if (plantSalesMap[plantId]) {
          plantSalesMap[plantId].quantity += quantity;
        } else {
          plantSalesMap[plantId] = {
            name: item.plant.name,
            quantity: quantity
          };
        }
      });
    });

    // Best selling plant
    let bestSellingPlant = "No orders yet";
    const allPlants = Object.values(plantSalesMap);
    if (allPlants.length > 0) {
      const topPlant = allPlants.sort((a, b) => b.quantity - a.quantity)[0];
      bestSellingPlant = topPlant.name;
    }

    // Top 3 selling plants
    const top3SellingPlants = allPlants
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3);

    res.status(200).json({
      totalSales: totalSales.toFixed(2),
      totalOrders,
      bestSellingPlant,
      top3SellingPlants,
      monthlySales: monthlySalesMap
    });
  } catch (error) {
    console.error('Ecom Stats Error:', error);
    res.status(500).json({ message: error.message });
  }
};


