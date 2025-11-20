const AboutPage = require('../models/AboutPage');

// @desc    Get about page content
// @route   GET /api/about
// @access  Public
exports.getAboutPage = async (req, res) => {
  try {
    let aboutPage = await AboutPage.findOne();

    if (!aboutPage) {
      aboutPage = await AboutPage.create({
        hero: {
          title: 'About Apex & Base',
          subtitle: 'Building Beyond Construction: Crafting visions into reality with integrity, quality, and innovation.'
        },
        mission: {
          title: 'Our Mission',
          content: 'Our mission is to deliver exceptional construction services...'
        },
        values: {
          title: 'Our Values',
          content: 'At Apex & Base, our core values...'
        },
        principles: [],
        principlesSection: {
          title: 'Our Guiding Principles',
          subtitle: 'We are defined by our commitment to these core principles in every project we undertake.'
        },
        teamSection: {
          title: 'Meet Our Leadership',
          subtitle: 'Our dedicated team of professionals is the cornerstone of our success.'
        }
      });
    }

    res.json(aboutPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update about page content
// @route   PUT /api/about
// @access  Private/Admin
exports.updateAboutPage = async (req, res) => {
  try {
    const updates = req.body;

    let aboutPage = await AboutPage.findOne();

    if (!aboutPage) {
      aboutPage = await AboutPage.create(updates);
    } else {
      Object.keys(updates).forEach(key => {
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
          aboutPage[key] = { ...aboutPage[key], ...updates[key] };
        } else {
          aboutPage[key] = updates[key];
        }
      });
      await aboutPage.save();
    }

    res.json(aboutPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add principle card
// @route   POST /api/about/principles
// @access  Private/Admin
exports.addPrinciple = async (req, res) => {
  try {
    const { icon, title, description, order } = req.body;

    let aboutPage = await AboutPage.findOne();

    if (!aboutPage) {
      return res.status(404).json({ message: 'About page not found' });
    }

    aboutPage.principles.push({ icon, title, description, order: order || aboutPage.principles.length });
    await aboutPage.save();

    res.status(201).json(aboutPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update principle card
// @route   PUT /api/about/principles/:principleId
// @access  Private/Admin
exports.updatePrinciple = async (req, res) => {
  try {
    const { principleId } = req.params;
    const { icon, title, description, order } = req.body;

    const aboutPage = await AboutPage.findOne();

    if (!aboutPage) {
      return res.status(404).json({ message: 'About page not found' });
    }

    const principle = aboutPage.principles.id(principleId);

    if (!principle) {
      return res.status(404).json({ message: 'Principle not found' });
    }

    if (icon) principle.icon = icon;
    if (title) principle.title = title;
    if (description) principle.description = description;
    if (order !== undefined) principle.order = order;

    await aboutPage.save();

    res.json(aboutPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete principle card
// @route   DELETE /api/about/principles/:principleId
// @access  Private/Admin
exports.deletePrinciple = async (req, res) => {
  try {
    const { principleId } = req.params;

    const aboutPage = await AboutPage.findOne();

    if (!aboutPage) {
      return res.status(404).json({ message: 'About page not found' });
    }

    aboutPage.principles.pull(principleId);
    await aboutPage.save();

    res.json({ message: 'Principle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
