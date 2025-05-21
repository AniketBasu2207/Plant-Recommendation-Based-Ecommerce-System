const mongoose = require('mongoose');

// aniket + salman
// const plantSchema = new mongoose.Schema({
  
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   othername: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   discount: {
//     type: Number,
//     required: true
//   },
//   stock: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   mintemp: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   maxtemp: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   minrainfall: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   maxrainfall: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   category: {
//     type: String,
//     required: true,
//     enum: ['Indoor', 'Fruit', 'Flower']
//   },
//   zones: {
//     type: [String],
//     required: true,
//     enum: ['Tropical', 'Temperate', 'Arid', 'Cold']
//   },
//   humidity: {
//     type: String,
//     required: true,
//     enum: ['High', 'Low', 'Moderate']
//   },
//   sunlight: {
//     type: String,
//     required: true,
//     enum: ['Full Sun', 'Partial Sun']
//   },
//   image: {
//     type: String,
//     default: ''
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });


// subho
const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  othername: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  mintemp: {
    type: String,
    required: true,
  },
  maxtemp: {
    type: String,
    required: true,
  },
  minrainfall: {
    type: String,
    required: true,
  },
  maxrainfall: {
    type: String,
    required: true,
  },
  ph: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Indoor', 'Fruit', 'Flower']
  },
  zones: {
    type: [String],
    required: true,
    enum: ['AF', 'AM', 'AW', 'BSH', 'BWH', 'CFA', 'CSA', 'CWA', 'CWB', 'DFC', 'ET'],
    validate: {
      validator: function(v) {
        return v.length > 0; // At least one zone must be selected
      },
      message: 'At least one zone must be selected'
    }
  },
  soilTypes: {
    type: [String],
    required: true,
    enum: ['Alluvial', 'Arid', 'Black', 'Laterite', 'Mountain', 'Red & Yellow'],
    validate: {
      validator: function(v) {
        return v.length > 0; // At least one soil type must be selected
      },
      message: 'At least one soil type must be selected'
    }
  },
  humidity: {
    type: String,
    required: true,
    enum: ['High', 'Low', 'Moderate']
  },
  waterTollerence: {
    type: String,
    required: true,
    enum: ['High', 'Low', 'Moderate']
  },
  sunlight: {
    type: String,
    required: true,
    enum: ['Full Sun', 'Partial Sun']
  },
  image: {
    type: String,
    default: ''
  }
},{
  timestamps:true
});



module.exports = mongoose.model('Plant', plantSchema);

