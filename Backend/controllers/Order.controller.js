const mongoose=require('mongoose')
const Order = require('../models/Order.model'); // or correct path
const Cart=require('../models/AddToCart.model');
const User = require('../models/User');
const Profile=require('../models/profileModel');

const make_order = async (req, res) => {
    try {
      const user_id = req.session?.user_id;
        console.log(req.session.user_id);
        
      if (!user_id) {
        return res.status(401).json({ message: 'User not logged in', response: false });
      }
  
      const orderData = {
        ...req.body,
        user_id
      };
  
      await Order.create(orderData);
      // delete all items from cart
      await Cart.updateOne({ user_id }, { $set: { plantList: [] } });

      return res.status(200).json({ message: 'Order Placed Successfully.', response: true });
  
    } catch (error) {
      // console.error('Make order error:', error);
      return res.status(500).json({ message: 'Something Went Wrong! with payment', response: false ,error });
    }
  };
  

const view_order = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    //console.log(user_id);
   // console.log(`user_id ${user_id}`);

    if (!user_id) {
      return res.status(401).json({ message: 'User not logged in' });
    }

    const order = await Order.find({ user_id }).populate('order_details.plant_lists.plant').sort({ createdAt: -1 });

    if (!order) {
      return res.status(404).json({ message: "You haven't Order anything!",response:false });
    }

    res.status(200).json({ order,response:true });
  } catch (error) {
    console.error('View wishlist error:', error);
    res.status(500).json({ message: 'Server error', error ,response:false });
  }
};


const admin_view_all_orders = async (req, res) => {
  try {
    // const orders = await Order.find()
    //   .populate('user_id', 'name email') // Only get name and email of user
    //   .sort({ createdAt: -1 });

    const orders = await Order.find()
      .populate({
        path: "user_id",
        select: "name email",
      })
      .populate({
        path: "order_details.plant_lists.plant", // path to the nested plant field
        select: "name", // only fetch plantname from the Plant model
      })
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Admin View All Orders Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const admin_update_order_status = async (req, res) => {
  try {
    const { orderId, newStatus } = req.body;
    
    if (!['Accepted', 'Under Processing','Packaging', 'Shipped','Out of Delivery','Delivered', 'Cancelled'].includes(newStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = newStatus;
    await order.save();

    res.status(200).json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Admin Update Order Status Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const fetch_user_address=async (req,res)=>{
  try {
    const user_id = req.session?.user_id;
     // console.log(req.session.user_id);
      
    if (!user_id) {
      return res.status(401).json({ message: 'User not logged in', response: false });
    }

    
    const userAddress = await Profile.findOne({ user_id }).select('-_id name email gender phone address pincode district country state block');

    if(!userAddress) return res.status(401).json({ message: 'User Address Not Found.', response: false });

    return res.status(200).json({ message: userAddress , response: true });

  } catch (error) {
    console.error('Fetching user Address error :', error);
    return res.status(500).json({ message: 'Something Went Wrong!', response: false });
  }
}

const cancelOrder=async (req,res)=>{
  const orderId = req.params.orderId;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'Cancelled' },
      { new: true } // return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found',response:false});
    }

    res.json({ message: 'Order cancelled successfully', order: updatedOrder,response:true });
  } catch (error) {
    console.error('Cancel Order Error:', error);
    res.status(500).json({ message: 'Server error while cancelling order',response:false });
  }
}

const reOrder=async (req,res)=>{
  const orderId = req.params.orderId;

  try {
     // 1️⃣ Find the original order
     const existingOrder = await Order.findById(orderId);

     if (!existingOrder) {
       return res.status(404).json({ message: 'Original order not found', response: false });
     }
 
     // 2️⃣ Clone the order data (excluding _id and timestamps)
     const orderData = existingOrder.toObject();
     delete orderData._id; // Let MongoDB assign a new ID
     delete orderData.createdAt;
     delete orderData.updatedAt;
 
     // 3️⃣ Create and save new order
     const newOrder = new Order({
       ...orderData,
       status: 'Accepted', // reset status
     });
 
     await newOrder.save();
 
     // 4️⃣ Delete the old order
     await Order.findByIdAndDelete(orderId);
 
     res.json({
       message: 'Order re-placed successfully',
       order: newOrder,
       response: true
     });
  } catch (error) {
    console.error('Cancel Order Error:', error);
    res.status(500).json({ message: 'Failed to reorder',response:false });
  }
}

const changeAddress=async (req,res)=>{
  
  try {
     // 1️⃣ Find the original order
     const {order_id,userAddress}=req.body;
     await Order.findByIdAndUpdate(order_id,{userAddress});
 
     res.json({
       message: 'Order Address Changed successfully',
       response: true
     });
     
  } catch (error) {
    console.error('Cancel Order Error:', error);
    res.status(500).json({ message: 'Failed to Change Order Address',response:false });
  }
}

module.exports = {
  make_order,
  view_order,
  admin_view_all_orders,
  admin_update_order_status,
  fetch_user_address,
  cancelOrder,
  reOrder,
  changeAddress
};
