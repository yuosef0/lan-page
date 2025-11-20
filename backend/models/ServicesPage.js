const mongoose = require('mongoose');

const servicesPageSchema = new mongoose.Schema({
  hero: {
    title: {
      type: String,
      required: true,
      default: 'Our Construction Services'
    },
    subtitle: {
      type: String,
      required: true,
      default: 'We help you plan, design, and build with precision and creativity.'
    },
    image: {
      type: String,
      default: ''
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServicesPage', servicesPageSchema);
