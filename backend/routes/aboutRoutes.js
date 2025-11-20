const express = require('express');
const router = express.Router();
const {
  getAboutPage,
  updateAboutPage,
  addPrinciple,
  updatePrinciple,
  deletePrinciple
} = require('../controllers/aboutController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getAboutPage);
router.put('/', protect, admin, updateAboutPage);
router.post('/principles', protect, admin, addPrinciple);
router.put('/principles/:principleId', protect, admin, updatePrinciple);
router.delete('/principles/:principleId', protect, admin, deletePrinciple);

module.exports = router;
