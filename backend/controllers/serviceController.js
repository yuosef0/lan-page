const Service = require('../models/Service');
const ServicesPage = require('../models/ServicesPage');

// @desc    Get services page content
// @route   GET /api/services/page
// @access  Public
exports.getServicesPage = async (req, res) => {
  try {
    let servicesPage = await ServicesPage.findOne();

    if (!servicesPage) {
      servicesPage = await ServicesPage.create({
        hero: {
          title: 'Our Construction Services',
          subtitle: 'We help you plan, design, and build with precision and creativity.',
          image: ''
        }
      });
    }

    res.json(servicesPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update services page hero
// @route   PUT /api/services/page
// @access  Private/Admin
exports.updateServicesPage = async (req, res) => {
  try {
    const { title, subtitle, image } = req.body;

    let servicesPage = await ServicesPage.findOne();

    if (!servicesPage) {
      servicesPage = await ServicesPage.create({ hero: { title, subtitle, image } });
    } else {
      if (title) servicesPage.hero.title = title;
      if (subtitle) servicesPage.hero.subtitle = subtitle;
      if (image !== undefined) servicesPage.hero.image = image;
      await servicesPage.save();
    }

    res.json(servicesPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all services (including inactive - for admin)
// @route   GET /api/services/all
// @access  Private/Admin
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  try {
    const { title, description, image, imagePosition, order, isActive } = req.body;

    const service = await Service.create({
      title,
      description,
      image,
      imagePosition: imagePosition || 'left',
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const { title, description, image, imagePosition, order, isActive } = req.body;

    service.title = title || service.title;
    service.description = description || service.description;
    service.image = image || service.image;
    service.imagePosition = imagePosition || service.imagePosition;
    if (order !== undefined) service.order = order;
    if (isActive !== undefined) service.isActive = isActive;

    const updatedService = await service.save();

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.deleteOne();

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
