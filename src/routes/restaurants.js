const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validate, restaurantSchemas } = require('../middleware/validation');
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantsInRadius,
  uploadRestaurantPhoto
} = require('../controllers/restaurants');

const router = express.Router();

// Include other resource routers
const menuRouter = require('./menus');

// Re-route into other resource routers
router.use('/:restaurantId/menus', menuRouter);

// Public routes
router.route('/').get(getRestaurants);
router.route('/:id').get(getRestaurant);
router.route('/radius/:zipcode/:distance').get(getRestaurantsInRadius);

// Protected routes - Restaurant owners and admins
router.use(protect);

router
  .route('/')
  .post(
    authorize('restaurant', 'admin'),
    validate(restaurantSchemas.create),
    createRestaurant
  );

router
  .route('/:id')
  .put(
    authorize('restaurant', 'admin'),
    validate(restaurantSchemas.update),
    updateRestaurant
  )
  .delete(authorize('restaurant', 'admin'), deleteRestaurant);

router
  .route('/:id/photo')
  .put(authorize('restaurant', 'admin'), uploadRestaurantPhoto);

module.exports = router;
