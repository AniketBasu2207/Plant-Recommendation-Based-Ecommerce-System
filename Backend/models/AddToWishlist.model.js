const mongoose = require('mongoose');


const AddToWishlistSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    plantList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant' // target collection name
  }]
})

const AddToWishlist = mongoose.model("Wishlist", AddToWishlistSchema);

module.exports = AddToWishlist;
