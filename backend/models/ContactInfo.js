const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  hero: {
    title: {
      type: String,
      default: 'Get In Touch'
    },
    subtitle: {
      type: String,
      default: "We're here to help and answer any question you might have. We look forward to hearing from you."
    }
  },
  office: {
    title: {
      type: String,
      default: 'Our Office'
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    mapEmbedUrl: {
      type: String,
      default: ''
    }
  },
  socialLinks: {
    facebook: {
      type: String,
      default: '#'
    },
    twitter: {
      type: String,
      default: '#'
    },
    linkedin: {
      type: String,
      default: '#'
    },
    instagram: {
      type: String,
      default: '#'
    }
  },
  footer: {
    companyName: {
      type: String,
      default: 'Apex & Base Constructions Company L.L.C'
    },
    copyright: {
      type: String,
      default: '© 2024 Apex & Base Constructions Company L.L.C. All Rights Reserved.'
    },
    foundedYear: {
      type: String,
      default: '2005'
    },
    tagline: {
      type: String,
      default: 'Building visions into reality since 2005.'
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
