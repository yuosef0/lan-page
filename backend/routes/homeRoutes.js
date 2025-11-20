const express = require('express');
const router = express.Router();
const {
  getHomePage,
  updateHero,
  addFeatureCard,
  updateFeatureCard,
  deleteFeatureCard
} = require('../controllers/homeController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getHomePage);
router.put('/hero', protect, admin, updateHero);
router.post('/cards', protect, admin, addFeatureCard);
router.put('/cards/:cardId', protect, admin, updateFeatureCard);
router.delete('/cards/:cardId', protect, admin, deleteFeatureCard);

module.exports = router;
