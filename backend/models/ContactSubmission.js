const mongoose = require('mongoose');

const contactSubmissionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['general', 'vendor'],
    required: true
  },
  // General inquiry fields
  name: {
    type: String,
    required: function() {
      return this.type === 'general';
    }
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: function() {
      return this.type === 'general';
    }
  },
  // Vendor/Subcontractor fields
  companyName: {
    type: String,
    required: function() {
      return this.type === 'vendor';
    }
  },
  contactPerson: {
    type: String,
    required: function() {
      return this.type === 'vendor';
    }
  },
  phone: {
    type: String,
    required: function() {
      return this.type === 'vendor';
    }
  },
  // Status tracking
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'archived'],
    default: 'new'
  },
  notes: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);
