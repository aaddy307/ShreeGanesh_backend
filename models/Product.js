const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Chargers', 'Earphones', 'Earbuds', 'Power Banks', 'Smart Watches', 'Speakers', 'Cables', 'Adapters', 'Mobile Covers', 'Screen Protectors', 'Bluetooth Speakers', 'Extension Boards', 'Other'],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);