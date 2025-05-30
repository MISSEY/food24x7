const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    customizations: [{
      name: String,
      selectedOptions: [String],
      additionalPrice: {
        type: Number,
        default: 0
      }
    }],
    specialInstructions: {
      type: String,
      maxlength: [200, 'Special instructions cannot exceed 200 characters']
    },
    itemTotal: {
      type: Number,
      required: true
    }
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  deliveryAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number]
      }
    },
    deliveryInstructions: {
      type: String,
      maxlength: [200, 'Delivery instructions cannot exceed 200 characters']
    }
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'out-for-delivery',
      'delivered',
      'cancelled'
    ],
    default: 'pending'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'out-for-delivery',
        'delivered',
        'cancelled'
      ]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'wallet'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentGateway: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },
  timing: {
    orderPlacedAt: {
      type: Date,
      default: Date.now
    },
    confirmedAt: Date,
    preparationStartedAt: Date,
    readyAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date
  },
  specialInstructions: {
    type: String,
    maxlength: [500, 'Special instructions cannot exceed 500 characters']
  },
  rating: {
    overall: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    food: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    delivery: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    ratedAt: Date
  },
  deliveryPerson: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  cancellation: {
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['customer', 'restaurant', 'admin']
    },
    cancelledAt: Date,
    refundAmount: Number
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate unique order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last order of the day
    const lastOrder = await this.constructor.findOne({
      orderNumber: new RegExp(`^ORD${year}${month}${day}`)
    }).sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `ORD${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Add status to history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
    
    // Update timing based on status
    const now = new Date();
    switch (this.status) {
      case 'confirmed':
        this.timing.confirmedAt = now;
        break;
      case 'preparing':
        this.timing.preparationStartedAt = now;
        break;
      case 'ready':
        this.timing.readyAt = now;
        break;
      case 'out-for-delivery':
        this.timing.pickedUpAt = now;
        break;
      case 'delivered':
        this.timing.deliveredAt = now;
        this.timing.actualDeliveryTime = now;
        break;
    }
  }
  next();
});

// Calculate estimated delivery time
orderSchema.methods.calculateEstimatedDeliveryTime = function() {
  const now = new Date();
  const preparationTime = this.items.reduce((total, item) => {
    return Math.max(total, item.preparationTime || 30);
  }, 0);
  
  // Add preparation time + 30 minutes for delivery
  const estimatedTime = new Date(now.getTime() + (preparationTime + 30) * 60000);
  this.timing.estimatedDeliveryTime = estimatedTime;
  
  return estimatedTime;
};

// Check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  const nonCancellableStatuses = ['out-for-delivery', 'delivered', 'cancelled'];
  return !nonCancellableStatuses.includes(this.status);
};

// Calculate delivery time
orderSchema.virtual('deliveryTime').get(function() {
  if (this.timing.deliveredAt && this.timing.orderPlacedAt) {
    return Math.round((this.timing.deliveredAt - this.timing.orderPlacedAt) / (1000 * 60)); // in minutes
  }
  return null;
});

// Check if order is delayed
orderSchema.virtual('isDelayed').get(function() {
  if (this.timing.estimatedDeliveryTime && this.status !== 'delivered' && this.status !== 'cancelled') {
    return new Date() > this.timing.estimatedDeliveryTime;
  }
  return false;
});

// Update restaurant statistics after order completion
orderSchema.post('save', async function(doc) {
  if (doc.status === 'delivered' && doc.isModified('status')) {
    const Restaurant = mongoose.model('Restaurant');
    await Restaurant.findByIdAndUpdate(doc.restaurant, {
      $inc: {
        totalOrders: 1,
        totalRevenue: doc.pricing.total
      }
    });
    
    // Update menu item order counts
    const MenuItem = mongoose.model('MenuItem');
    for (const item of doc.items) {
      await MenuItem.findByIdAndUpdate(item.menuItem, {
        $inc: { orderCount: item.quantity }
      });
    }
  }
});

// Indexes for efficient queries
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'timing.estimatedDeliveryTime': 1 });

module.exports = mongoose.model('Order', orderSchema);
