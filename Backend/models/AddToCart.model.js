const mongoose = require('mongoose');


const AddToCartSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    plantList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant' // target collection name
  }]
})

const AddToCart = mongoose.model("Cart", AddToCartSchema);

module.exports = AddToCart;
