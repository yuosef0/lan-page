const express = require('express');
const router = express.Router();
const {
  getContactInfo,
  updateContactInfo,
  submitContact,
  getSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

router.get('/info', getContactInfo);
router.put('/info', protect, admin, updateContactInfo);
router.post('/submit', submitContact);
router.get('/submissions', protect, admin, getSubmissions);
router.get('/submissions/:id', protect, admin, getSubmission);
router.put('/submissions/:id', protect, admin, updateSubmission);
router.delete('/submissions/:id', protect, admin, deleteSubmission);

module.exports = router;
