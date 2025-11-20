const express = require('express');
const router = express.Router();
const {
  getServicesPage,
  updateServicesPage,
  getServices,
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/auth');

router.get('/page', getServicesPage);
router.put('/page', protect, admin, updateServicesPage);
router.get('/', getServices);
router.get('/all', protect, admin, getAllServices);
router.get('/:id', getService);
router.post('/', protect, admin, createService);
router.put('/:id', protect, admin, updateService);
router.delete('/:id', protect, admin, deleteService);

module.exports = router;
