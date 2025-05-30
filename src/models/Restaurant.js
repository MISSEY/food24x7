const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a restaurant name'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  cuisine: [{
    type: String,
    required: [true, 'Please add at least one cuisine type']
  }],
  address: {
    street: {
      type: String,
      required: [true, 'Please add a street address']
    },
    city: {
      type: String,
      required: [true, 'Please add a city']
    },
    state: {
      type: String,
      required: [true, 'Please add a state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please add a zip code']
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
        type: [Number],
        index: '2dsphere'
      }
    }
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    match: [/^[0-9]{10,15}$/, 'Please add a valid phone number']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  openingHours: {
    monday: {
      open: String,
      close: String,
      isClosed: { type: Boolean, default: false }
    },
    tuesday: {
      open: String,
      close: String,
      isClosed: { type: Boolean, default: false }
    },
    wednesday: {
      open: String,
      close: String,
      isClosed: { type: Boolean, default: false }
    },
    thursday: {
      open: String,
      close: String,
      isClosed: { type: Boolean, default: false }
    },
    friday: {
      open: String,
      close: String,
      isClosed: { type: Boolean, default: false }
    },
    saturday: {
      open: String,
      close: String,
      isClosed: { type: Boolean, default: false }
    },
    sunday: {
      open: String,
      close: String,
      isClosed: { type: Boolean, default: false }
    }
  },
  deliveryRadius: {
    type: Number,
    min: [1, 'Delivery radius must be at least 1 km'],
    max: [50, 'Delivery radius cannot exceed 50 km'],
    default: 10
  },
  minimumOrder: {
    type: Number,
    min: [0, 'Minimum order cannot be negative'],
    default: 0
  },
  deliveryFee: {
    type: Number,
    min: [0, 'Delivery fee cannot be negative'],
    default: 0
  },
  rating: {
    average: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must can not be more than 5'],
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  images: [{
    url: String,
    alt: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: String,
    url: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }],
  totalOrders: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create restaurant slug from the name
restaurantSchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  next();
});

// Cascade delete menu items when a restaurant is deleted
restaurantSchema.pre('remove', async function(next) {
  console.log(`Menu items being removed from restaurant ${this._id}`);
  await this.model('MenuItem').deleteMany({ restaurant: this._id });
  next();
});

// Reverse populate with virtuals
restaurantSchema.virtual('menuItems', {
  ref: 'MenuItem',
  localField: '_id',
  foreignField: 'restaurant',
  justOne: false
});

// Check if restaurant is currently open
restaurantSchema.methods.isCurrentlyOpen = function() {
  const now = new Date();
  const day = now.toLocaleLowerCase().substring(0, 3); // mon, tue, etc.
  const currentTime = now.toTimeString().substring(0, 5); // HH:MM format
  
  const todayHours = this.openingHours[day];
  
  if (!todayHours || todayHours.isClosed) {
    return false;
  }
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
};

// Calculate distance from given coordinates
restaurantSchema.methods.getDistanceFrom = function(lat, lng) {
  if (!this.address.coordinates || !this.address.coordinates.coordinates) {
    return null;
  }
  
  const [restaurantLng, restaurantLat] = this.address.coordinates.coordinates;
  
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat - restaurantLat) * Math.PI / 180;
  const dLng = (lng - restaurantLng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(restaurantLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

// Update rating
restaurantSchema.methods.updateRating = async function() {
  const Order = mongoose.model('Order');
  
  const stats = await Order.aggregate([
    {
      $match: { 
        restaurant: this._id,
        rating: { $exists: true, $ne: null }
      }
    },
    {
      $group: {
        _id: '$restaurant',
        averageRating: { $avg: '$rating' },
        ratingCount: { $sum: 1 }
      }
    }
  ]);
  
  if (stats.length > 0) {
    this.rating.average = Math.round(stats[0].averageRating * 10) / 10;
    this.rating.count = stats[0].ratingCount;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }
  
  await this.save();
};

module.exports = mongoose.model('Restaurant', restaurantSchema);
