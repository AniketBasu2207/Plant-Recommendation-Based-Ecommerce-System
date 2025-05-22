const mongoose=require('mongoose')
const AddToWishlist = require('../models/AddToWishlist.model'); // or correct path

const add_to_wishlist = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const plant_id = req.body.plant_id;
    //console.log(`user id ${user_id} and plant id ${plant_id}`);
    
    if (!user_id) {
      return res.status(401).json({ message: 'User not logged in' });
    }

    // Check if wishlist exists for this user
    let userWishlist = await AddToWishlist.findOne({ user_id });

    if (userWishlist) {
      // Check if plant_id already exists
      const alreadyAdded = userWishlist.plantList.includes(plant_id);
      if (alreadyAdded) {
        return res.status(409).json({ message: 'Plant already added to wishlist' });
      }

      // Add plant_id to the list
      userWishlist.plantList.push(plant_id);
      await userWishlist.save();
      return res.status(200).json({ message: 'Plant added to wishlist successfully', wishlist: userWishlist });

    } else {
      // No wishlist found for this user — create a new one
      const newWishlist = new AddToWishlist({
        user_id,
        plantList: [plant_id]
      });

      await newWishlist.save();
      return res.status(201).json({ message: 'wishlist created and plant added', wishlist: newWishlist });
    }

  } catch (error) {
    console.error('Add to wishlist error:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const view_wishlist = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    //console.log(user_id);
   // console.log(`user_id ${user_id}`);

    if (!user_id) {
      return res.status(401).json({ message: 'User not logged in' });
    }

    const userWishlist = await AddToWishlist.findOne({ user_id }).populate('plantList');

    if (!userWishlist || userWishlist.plantList.length === 0) {
      return res.status(404).json({ message: 'wishlist is empty' });
    }

    res.status(200).json({ wishlist: userWishlist });
  } catch (error) {
    console.error('View wishlist error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const delete_wishlist = async (req, res) => {
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

    // Find the user's wishlist
    const userWishlist = await AddToWishlist.findOne({ user_id });

    if (!userWishlist) {
      return res.status(404).json({ message: 'wishlist not found for this user' });
    }

    // Check if plant_id exists in the plantList
    const plantIndex = userWishlist.plantList.indexOf(plant_id);
    if (plantIndex === -1) {
      return res.status(404).json({ message: 'Plant not found in wishlist' });
    }

    // Remove the plant_id from the array
    userWishlist.plantList.splice(plantIndex, 1);
    await userWishlist.save();

    res.status(200).json({ message: 'Plant removed from wishlist', wishlist: userWishlist });

  } catch (error) {
    console.error('Delete wishlist error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


module.exports={add_to_wishlist,view_wishlist,delete_wishlist}
