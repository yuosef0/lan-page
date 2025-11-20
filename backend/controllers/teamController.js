const TeamMember = require('../models/TeamMember');

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
exports.getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ order: 1 });
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
exports.getTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json(teamMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create team member
// @route   POST /api/team
// @access  Private/Admin
exports.createTeamMember = async (req, res) => {
  try {
    const { name, position, bio, image, order } = req.body;

    const teamMember = await TeamMember.create({
      name,
      position,
      bio,
      image,
      order: order || 0
    });

    res.status(201).json(teamMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private/Admin
exports.updateTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    const { name, position, bio, image, order } = req.body;

    teamMember.name = name || teamMember.name;
    teamMember.position = position || teamMember.position;
    teamMember.bio = bio || teamMember.bio;
    teamMember.image = image || teamMember.image;
    if (order !== undefined) teamMember.order = order;

    const updatedTeamMember = await teamMember.save();

    res.json(updatedTeamMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
exports.deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    await teamMember.deleteOne();

    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
