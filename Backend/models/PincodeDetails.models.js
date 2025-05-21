const mongoose = require('mongoose');

const pincode_detailsSchema = new mongoose.Schema({
    STATE: {
    type: String,
    required: true
  },
  DISTRICT: {
    type: String,
    required: true
  },
  ANNUAL_RAINFALL: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  ZONE: {
    type: String,
    required: true
  },
  SOIL: {
    type: String,
    required: true
  },
  UV_INDEX: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('pincode_details', pincode_detailsSchema);

