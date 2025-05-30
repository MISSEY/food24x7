const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validate, orderSchemas } = require('../middleware/validation');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  rateOrder,
  getMyOrders,
  getRestaurantOrders
} = require('../controllers/orders');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Customer routes
router.route('/').get(getOrders).post(validate(orderSchemas.create), createOrder);
router.route('/my-orders').get(getMyOrders);
router.route('/:id').get(getOrder);
router.route('/:id/cancel').put(cancelOrder);
router.route('/:id/rate').put(rateOrder);

// Restaurant and admin routes
router.route('/restaurant/:restaurantId').get(
  authorize('restaurant', 'admin'),
  getRestaurantOrders
);

router.route('/:id/status').put(
  authorize('restaurant', 'admin'),
  validate(orderSchemas.updateStatus),
  updateOrderStatus
);

module.exports = router;
