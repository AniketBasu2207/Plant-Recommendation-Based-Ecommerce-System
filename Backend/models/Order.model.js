const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    razorpay_order_id: {
        type: String,
        required: true
    },
    razorpay_payment_id: {
        type: String,
        required: true
    },
    razorpay_signature: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Accepted',
        enum: ['Accepted', 'Under Processing','Packaging', 'Shipped','Out of Delivery','Delivered', 'Cancelled']
    },
    payment_mode: {
        type: String,
        required: true,
        default: 'Online',
        enum: ['Online', 'Cash on Delivery']
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // assuming you have a User model
        required: true
    },
    order_details: {
       plant_lists: [{
        _id: false,
            plant: {  // subdocument containing both plant reference and quantity
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Plant',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1  // ensure at least 1 item is ordered
            }
        }],
        total_price: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        }
    }
    ,
    userAddress: {
        name: { type: String},
        email: { type: String},
        gender: { type: String },
        phone: { type: String },
        address: { type: String },
        address2: { type: String },
        pincode: { type: String },
        district: { type: String },
        state: { type: String },
        country: { type: String },
        block: { type: String }
      },
}, {
    timestamps: true // optional: adds createdAt and updatedAt fields
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;