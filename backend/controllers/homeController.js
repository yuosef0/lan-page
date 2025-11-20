const HomePage = require('../models/HomePage');

// @desc    Get home page content
// @route   GET /api/home
// @access  Public
exports.getHomePage = async (req, res) => {
  try {
    let homePage = await HomePage.findOne();

    // If no home page exists, create default one
    if (!homePage) {
      homePage = await HomePage.create({
        hero: {
          title: 'Beyond Construction',
          subtitle: 'At A.B. we are committed to helping our clients bring their visions to life.'
        },
        featureCards: []
      });
    }

    res.json(homePage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update home page hero section
// @route   PUT /api/home/hero
// @access  Private/Admin
exports.updateHero = async (req, res) => {
  try {
    const { title, subtitle } = req.body;

    let homePage = await HomePage.findOne();

    if (!homePage) {
      homePage = await HomePage.create({ hero: { title, subtitle }, featureCards: [] });
    } else {
      homePage.hero.title = title;
      homePage.hero.subtitle = subtitle;
      await homePage.save();
    }

    res.json(homePage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add feature card
// @route   POST /api/home/cards
// @access  Private/Admin
exports.addFeatureCard = async (req, res) => {
  try {
    const { title, description, image, order } = req.body;

    let homePage = await HomePage.findOne();

    if (!homePage) {
      homePage = await HomePage.create({
        hero: { title: 'Beyond Construction', subtitle: '' },
        featureCards: []
      });
    }

    homePage.featureCards.push({ title, description, image, order: order || homePage.featureCards.length });
    await homePage.save();

    res.status(201).json(homePage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update feature card
// @route   PUT /api/home/cards/:cardId
// @access  Private/Admin
exports.updateFeatureCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title, description, image, order } = req.body;

    const homePage = await HomePage.findOne();

    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    const card = homePage.featureCards.id(cardId);

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    if (title) card.title = title;
    if (description) card.description = description;
    if (image) card.image = image;
    if (order !== undefined) card.order = order;

    await homePage.save();

    res.json(homePage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete feature card
// @route   DELETE /api/home/cards/:cardId
// @access  Private/Admin
exports.deleteFeatureCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const homePage = await HomePage.findOne();

    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    homePage.featureCards.pull(cardId);
    await homePage.save();

    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
