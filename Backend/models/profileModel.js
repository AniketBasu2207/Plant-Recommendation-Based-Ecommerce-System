const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String
    },
    pincode: {
        type: String,
        required: true,
    },
    district: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    block: {
        type: String
    }
    // ,
    // orderAddress: {
    //     name: String,
    //     country: String,
    //     state: String,
    //     district: String,
    //     pincode: String,
    //     address: String,
    //     address2: String,
    //     phone: String,
    //     block: String
    // }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);