const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllUsers,
  getAllRestaurants,
  getAllOrders,
  verifyRestaurant,
  deactivateUser,
  getAnalytics
} = require('../controllers/admin');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard and analytics
router.route('/dashboard').get(getDashboardStats);
router.route('/analytics').get(getAnalytics);

// User management
router.route('/users').get(getAllUsers);
router.route('/users/:id/deactivate').put(deactivateUser);

// Restaurant management
router.route('/restaurants').get(getAllRestaurants);
router.route('/restaurants/:id/verify').put(verifyRestaurant);

// Order management
router.route('/orders').get(getAllOrders);

module.exports = router;
