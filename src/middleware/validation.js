const Joi = require('joi');

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        error: errorMessage
      });
    }
    
    next();
  };
};

// User validation schemas
const userSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    role: Joi.string().valid('customer', 'restaurant', 'admin').default('customer'),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().default('India')
    }).when('role', {
      is: 'customer',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
      country: Joi.string()
    })
  })
};

// Restaurant validation schemas
const restaurantSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500),
    cuisine: Joi.array().items(Joi.string()).min(1).required(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().default('India')
    }).required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    email: Joi.string().email().required(),
    openingHours: Joi.object({
      monday: Joi.object({ open: Joi.string(), close: Joi.string() }),
      tuesday: Joi.object({ open: Joi.string(), close: Joi.string() }),
      wednesday: Joi.object({ open: Joi.string(), close: Joi.string() }),
      thursday: Joi.object({ open: Joi.string(), close: Joi.string() }),
      friday: Joi.object({ open: Joi.string(), close: Joi.string() }),
      saturday: Joi.object({ open: Joi.string(), close: Joi.string() }),
      sunday: Joi.object({ open: Joi.string(), close: Joi.string() })
    }),
    deliveryRadius: Joi.number().min(1).max(50).default(10),
    minimumOrder: Joi.number().min(0).default(0),
    deliveryFee: Joi.number().min(0).default(0)
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().max(500),
    cuisine: Joi.array().items(Joi.string()),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/),
    email: Joi.string().email(),
    openingHours: Joi.object({
      monday: Joi.object({ open: Joi.string(), close: Joi.string() }),
      tuesday: Joi.object({ open: Joi.string(), close: Joi.string() }),
      wednesday: Joi.object({ open: Joi.string(), close: Joi.string() }),
      thursday: Joi.object({ open: Joi.string(), close: Joi.string() }),
      friday: Joi.object({ open: Joi.string(), close: Joi.string() }),
      saturday: Joi.object({ open: Joi.string(), close: Joi.string() }),
      sunday: Joi.object({ open: Joi.string(), close: Joi.string() })
    }),
    deliveryRadius: Joi.number().min(1).max(50),
    minimumOrder: Joi.number().min(0),
    deliveryFee: Joi.number().min(0),
    isActive: Joi.boolean()
  })
};

// Menu item validation schemas
const menuSchemas = {
  createItem: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500),
    price: Joi.number().min(0).required(),
    category: Joi.string().required(),
    isVegetarian: Joi.boolean().default(false),
    isVegan: Joi.boolean().default(false),
    spiceLevel: Joi.string().valid('mild', 'medium', 'hot', 'extra-hot'),
    allergens: Joi.array().items(Joi.string()),
    ingredients: Joi.array().items(Joi.string()),
    preparationTime: Joi.number().min(1).max(120).required(),
    isAvailable: Joi.boolean().default(true)
  }),

  updateItem: Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().max(500),
    price: Joi.number().min(0),
    category: Joi.string(),
    isVegetarian: Joi.boolean(),
    isVegan: Joi.boolean(),
    spiceLevel: Joi.string().valid('mild', 'medium', 'hot', 'extra-hot'),
    allergens: Joi.array().items(Joi.string()),
    ingredients: Joi.array().items(Joi.string()),
    preparationTime: Joi.number().min(1).max(120),
    isAvailable: Joi.boolean()
  })
};

// Order validation schemas
const orderSchemas = {
  create: Joi.object({
    restaurant: Joi.string().required(),
    items: Joi.array().items(
      Joi.object({
        menuItem: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        specialInstructions: Joi.string().max(200)
      })
    ).min(1).required(),
    deliveryAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().default('India')
    }).required(),
    paymentMethod: Joi.string().valid('cash', 'card', 'upi').required(),
    specialInstructions: Joi.string().max(500)
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled').required(),
    estimatedDeliveryTime: Joi.date().greater('now')
  })
};

module.exports = {
  validate,
  userSchemas,
  restaurantSchemas,
  menuSchemas,
  orderSchemas
};
