const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validate, userSchemas } = require('../middleware/validation');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfile
} = require('../controllers/users');

const router = express.Router();

// All routes are protected and require authentication
router.use(protect);

// User profile routes (accessible by the user themselves)
router.put('/profile', validate(userSchemas.updateProfile), updateProfile);

// Admin only routes
router.use(authorize('admin'));

router
  .route('/')
  .get(getUsers)
  .post(validate(userSchemas.register), createUser);

router
  .route('/:id')
  .get(getUser)
  .put(validate(userSchemas.updateProfile), updateUser)
  .delete(deleteUser);

module.exports = router;
