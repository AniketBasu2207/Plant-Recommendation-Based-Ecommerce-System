const mongoose=require('mongoose')
const AddToCart = require('../models/AddToCart.model'); // or correct path
const Plant = require('../models/PlantManagementModel'); // adjust path as needed


const add_to_cart = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const plant_id = req.body.plant_id;
    //console.log(`user id ${user_id} and plant id ${plant_id}`);
    
    if (!user_id) {
      return res.status(401).json({ message: 'User not logged in' });
    }

    // Check if cart exists for this user
    let userCart = await AddToCart.findOne({ user_id });

    if (userCart) {
      // Check if plant_id already exists
      const alreadyAdded = userCart.plantList.includes(plant_id);
      if (alreadyAdded) {
        return res.status(409).json({ message: 'Plant already added to cart' });
      }

      // Add plant_id to the list
      userCart.plantList.push(plant_id);
      await userCart.save();
      return res.status(200).json({ message: 'Plant added to cart successfully', cart: userCart });

    } else {
      // No cart found for this user — create a new one
      const newCart = new AddToCart({
        user_id,
        plantList: [plant_id]
      });

      await newCart.save();
      return res.status(201).json({ message: 'Cart created and plant added', cart: newCart });
    }

  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const view_cart = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    
    //console.log(`user_id ${user_id}`);

    if (!user_id) {
      return res.status(401).json({ message: 'User not logged in' });
    }

    const userCart = await AddToCart.findOne({ user_id }).populate('plantList');

    if (!userCart || userCart.plantList.length === 0) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    res.status(200).json({ cart: userCart });
  } catch (error) {
    console.error('View cart error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const delete_cart = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    //console.log(user_id);
    const plant_id = req.params.id;
    //console.log(`plant_id ${plant_id} user_id ${user_id}`);
    

    if (!user_id) {
      return res.status(401).json({ message: 'User not logged in' });
    }

    if (!plant_id) {
      return res.status(400).json({ message: 'Plant ID is required' });
    }

    // Find the user's cart
    const userCart = await AddToCart.findOne({ user_id });

    if (!userCart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }

    // Check if plant_id exists in the plantList
    const plantIndex = userCart.plantList.indexOf(plant_id);
    if (plantIndex === -1) {
      return res.status(404).json({ message: 'Plant not found in cart' });
    }

    // Remove the plant_id from the array
    userCart.plantList.splice(plantIndex, 1);
    await userCart.save();

    res.status(200).json({ message: 'Plant removed from cart', cart: userCart });

  } catch (error) {
    console.error('Delete cart error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


module.exports={add_to_cart,view_cart,delete_cart}
//module.exports=add_to_cart