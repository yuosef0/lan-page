const mongoose = require('mongoose');

const homePageSchema = new mongoose.Schema({
  hero: {
    title: {
      type: String,
      required: true,
      default: 'Beyond Construction'
    },
    subtitle: {
      type: String,
      required: true,
      default: 'At A.B. we are committed to helping our clients bring their visions to life.'
    }
  },
  featureCards: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HomePage', homePageSchema);
