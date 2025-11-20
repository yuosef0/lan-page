const mongoose = require('mongoose');

const aboutPageSchema = new mongoose.Schema({
  hero: {
    title: {
      type: String,
      required: true,
      default: 'About Apex & Base'
    },
    subtitle: {
      type: String,
      required: true,
      default: 'Building Beyond Construction: Crafting visions into reality with integrity, quality, and innovation.'
    }
  },
  mission: {
    title: {
      type: String,
      default: 'Our Mission'
    },
    content: {
      type: String,
      required: true
    }
  },
  values: {
    title: {
      type: String,
      default: 'Our Values'
    },
    content: {
      type: String,
      required: true
    }
  },
  missionImage: {
    type: String,
    default: ''
  },
  principlesSection: {
    title: {
      type: String,
      default: 'Our Guiding Principles'
    },
    subtitle: {
      type: String,
      default: 'We are defined by our commitment to these core principles in every project we undertake.'
    }
  },
  principles: [{
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  teamSection: {
    title: {
      type: String,
      default: 'Meet Our Leadership'
    },
    subtitle: {
      type: String,
      default: 'Our dedicated team of professionals is the cornerstone of our success, bringing expertise and passion to every project.'
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AboutPage', aboutPageSchema);
