const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validate, menuSchemas } = require('../middleware/validation');
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menus');

const router = express.Router({ mergeParams: true });

// Public routes
router.route('/').get(getMenuItems);
router.route('/:id').get(getMenuItem);

// Protected routes - Restaurant owners and admins
router.use(protect);

router
  .route('/')
  .post(
    authorize('restaurant', 'admin'),
    validate(menuSchemas.createItem),
    createMenuItem
  );

router
  .route('/:id')
  .put(
    authorize('restaurant', 'admin'),
    validate(menuSchemas.updateItem),
    updateMenuItem
  )
  .delete(authorize('restaurant', 'admin'), deleteMenuItem);

module.exports = router;
