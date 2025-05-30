const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a menu item name'],
    trim: true,
    maxlength: [100, 'Menu item name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'appetizers',
      'main-course',
      'desserts',
      'beverages',
      'soups',
      'salads',
      'snacks',
      'breakfast',
      'lunch',
      'dinner',
      'specials'
    ]
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  images: [{
    url: String,
    alt: String
  }],
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'extra-hot'],
    default: 'mild'
  },
  allergens: [{
    type: String,
    enum: [
      'nuts',
      'dairy',
      'eggs',
      'soy',
      'wheat',
      'fish',
      'shellfish',
      'sesame'
    ]
  }],
  ingredients: [{
    type: String,
    trim: true
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number,
    sodium: Number
  },
  preparationTime: {
    type: Number,
    required: [true, 'Please add preparation time in minutes'],
    min: [1, 'Preparation time must be at least 1 minute'],
    max: [120, 'Preparation time cannot exceed 120 minutes']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  availabilitySchedule: {
    monday: { available: { type: Boolean, default: true }, startTime: String, endTime: String },
    tuesday: { available: { type: Boolean, default: true }, startTime: String, endTime: String },
    wednesday: { available: { type: Boolean, default: true }, startTime: String, endTime: String },
    thursday: { available: { type: Boolean, default: true }, startTime: String, endTime: String },
    friday: { available: { type: Boolean, default: true }, startTime: String, endTime: String },
    saturday: { available: { type: Boolean, default: true }, startTime: String, endTime: String },
    sunday: { available: { type: Boolean, default: true }, startTime: String, endTime: String }
  },
  rating: {
    average: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  orderCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  customizations: [{
    name: {
      type: String,
      required: true
    },
    options: [{
      name: String,
      price: {
        type: Number,
        default: 0
      }
    }],
    required: {
      type: Boolean,
      default: false
    },
    multiSelect: {
      type: Boolean,
      default: false
    }
  }],
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative']
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  saleStartDate: Date,
  saleEndDate: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create menu item slug from the name
menuItemSchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  next();
});

// Check if item is currently available based on schedule
menuItemSchema.methods.isCurrentlyAvailable = function() {
  if (!this.isAvailable) {
    return false;
  }
  
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toTimeString().substring(0, 5); // HH:MM format
  
  const todaySchedule = this.availabilitySchedule[day];
  
  if (!todaySchedule || !todaySchedule.available) {
    return false;
  }
  
  // If no specific time range is set, item is available all day
  if (!todaySchedule.startTime || !todaySchedule.endTime) {
    return true;
  }
  
  return currentTime >= todaySchedule.startTime && currentTime <= todaySchedule.endTime;
};

// Get effective price (considering discounts)
menuItemSchema.methods.getEffectivePrice = function() {
  if (this.isOnSale && this.discountPrice && this.discountPrice < this.price) {
    const now = new Date();
    
    // Check if sale is currently active
    if ((!this.saleStartDate || now >= this.saleStartDate) && 
        (!this.saleEndDate || now <= this.saleEndDate)) {
      return this.discountPrice;
    }
  }
  
  return this.price;
};

// Calculate discount percentage
menuItemSchema.virtual('discountPercentage').get(function() {
  if (this.isOnSale && this.discountPrice && this.discountPrice < this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Update rating
menuItemSchema.methods.updateRating = async function() {
  const Order = mongoose.model('Order');
  
  const stats = await Order.aggregate([
    { $unwind: '$items' },
    {
      $match: { 
        'items.menuItem': this._id,
        'items.rating': { $exists: true, $ne: null }
      }
    },
    {
      $group: {
        _id: '$items.menuItem',
        averageRating: { $avg: '$items.rating' },
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

// Index for text search
menuItemSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  ingredients: 'text'
});

// Index for filtering
menuItemSchema.index({ restaurant: 1, category: 1, isAvailable: 1 });
menuItemSchema.index({ restaurant: 1, isVegetarian: 1 });
menuItemSchema.index({ restaurant: 1, isVegan: 1 });
menuItemSchema.index({ restaurant: 1, price: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
