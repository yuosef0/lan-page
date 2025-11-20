const express = require('express');
const router = express.Router();
const {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getTeamMembers);
router.get('/:id', getTeamMember);
router.post('/', protect, admin, createTeamMember);
router.put('/:id', protect, admin, updateTeamMember);
router.delete('/:id', protect, admin, deleteTeamMember);

module.exports = router;
