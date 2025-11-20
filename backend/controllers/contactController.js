const ContactInfo = require('../models/ContactInfo');
const ContactSubmission = require('../models/ContactSubmission');

// @desc    Get contact info
// @route   GET /api/contact/info
// @access  Public
exports.getContactInfo = async (req, res) => {
  try {
    let contactInfo = await ContactInfo.findOne();

    if (!contactInfo) {
      contactInfo = await ContactInfo.create({
        hero: {
          title: 'Get In Touch',
          subtitle: "We're here to help and answer any question you might have."
        },
        office: {
          title: 'Our Office',
          address: '123 Construction Ave, Suite 456, Builderville, ST 78910',
          phone: '(123) 456-7890',
          email: 'contact@apexbase.com',
          mapEmbedUrl: ''
        },
        socialLinks: {
          facebook: '#',
          twitter: '#',
          linkedin: '#',
          instagram: '#'
        },
        footer: {
          companyName: 'Apex & Base Constructions Company L.L.C',
          copyright: '© 2024 Apex & Base Constructions Company L.L.C. All Rights Reserved.',
          foundedYear: '2005',
          tagline: 'Building visions into reality since 2005.'
        }
      });
    }

    res.json(contactInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update contact info
// @route   PUT /api/contact/info
// @access  Private/Admin
exports.updateContactInfo = async (req, res) => {
  try {
    const updates = req.body;

    let contactInfo = await ContactInfo.findOne();

    if (!contactInfo) {
      contactInfo = await ContactInfo.create(updates);
    } else {
      Object.keys(updates).forEach(key => {
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
          contactInfo[key] = { ...contactInfo[key].toObject(), ...updates[key] };
        } else {
          contactInfo[key] = updates[key];
        }
      });
      await contactInfo.save();
    }

    res.json(contactInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit contact form
// @route   POST /api/contact/submit
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    const { type, name, email, message, companyName, contactPerson, phone } = req.body;

    if (!type || !email) {
      return res.status(400).json({ message: 'Type and email are required' });
    }

    const submission = await ContactSubmission.create({
      type,
      name,
      email,
      message,
      companyName,
      contactPerson,
      phone,
      status: 'new'
    });

    res.status(201).json({
      message: 'Contact form submitted successfully',
      submission
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contact/submissions
// @access  Private/Admin
exports.getSubmissions = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;

    const submissions = await ContactSubmission.find(filter).sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single submission
// @route   GET /api/contact/submissions/:id
// @access  Private/Admin
exports.getSubmission = async (req, res) => {
  try {
    const submission = await ContactSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Mark as read if it's new
    if (submission.status === 'new') {
      submission.status = 'read';
      await submission.save();
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update submission status
// @route   PUT /api/contact/submissions/:id
// @access  Private/Admin
exports.updateSubmission = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const submission = await ContactSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (status) submission.status = status;
    if (notes !== undefined) submission.notes = notes;

    await submission.save();

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete submission
// @route   DELETE /api/contact/submissions/:id
// @access  Private/Admin
exports.deleteSubmission = async (req, res) => {
  try {
    const submission = await ContactSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    await submission.deleteOne();

    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
