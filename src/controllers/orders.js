const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    let query;

    // Admin can see all orders, others see only their own
    if (req.user.role === 'admin') {
      query = Order.find();
    } else {
      query = Order.find({ customer: req.user.id });
    }

    const orders = await query
      .populate({
        path: 'customer',
        select: 'name email phone'
      })
      .populate({
        path: 'restaurant',
        select: 'name address phone'
      })
      .populate({
        path: 'items.menuItem',
        select: 'name price'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'customer',
        select: 'name email phone'
      })
      .populate({
        path: 'restaurant',
        select: 'name address phone email'
      })
      .populate({
        path: 'items.menuItem',
        select: 'name price description'
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Make sure user can access this order
    if (order.customer._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'restaurant') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private/Customer
const createOrder = async (req, res, next) => {
  try {
    const { restaurant, items, deliveryAddress, paymentMethod, specialInstructions } = req.body;

    // Verify restaurant exists
    const restaurantDoc = await Restaurant.findById(restaurant);
    if (!restaurantDoc) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    // Calculate pricing
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          error: `Menu item ${item.menuItem} not found`
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          error: `Menu item ${menuItem.name} is not available`
        });
      }

      const itemTotal = menuItem.getEffectivePrice() * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.getEffectivePrice(),
        quantity: item.quantity,
        specialInstructions: item.specialInstructions,
        itemTotal
      });
    }

    // Calculate total with delivery fee and tax
    const deliveryFee = restaurantDoc.deliveryFee || 0;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + deliveryFee + tax;

    // Check minimum order amount
    if (subtotal < restaurantDoc.minimumOrder) {
      return res.status(400).json({
        success: false,
        error: `Minimum order amount is ₹${restaurantDoc.minimumOrder}`
      });
    }

    const order = await Order.create({
      customer: req.user.id,
      restaurant,
      items: orderItems,
      pricing: {
        subtotal,
        deliveryFee,
        tax,
        total
      },
      deliveryAddress,
      paymentMethod,
      specialInstructions
    });

    // Calculate estimated delivery time
    order.calculateEstimatedDeliveryTime();
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate({
        path: 'restaurant',
        select: 'name address phone'
      })
      .populate({
        path: 'items.menuItem',
        select: 'name price'
      });

    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Restaurant/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, estimatedDeliveryTime } = req.body;

    let order = await Order.findById(req.params.id).populate('restaurant');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && 
        order.restaurant.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this order'
      });
    }

    order.status = status;
    if (estimatedDeliveryTime) {
      order.timing.estimatedDeliveryTime = estimatedDeliveryTime;
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user can cancel this order
    if (order.customer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        error: 'Order cannot be cancelled at this stage'
      });
    }

    order.status = 'cancelled';
    order.cancellation = {
      reason: req.body.reason || 'Cancelled by customer',
      cancelledBy: 'customer',
      cancelledAt: new Date()
    };

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate order
// @route   PUT /api/v1/orders/:id/rate
// @access  Private/Customer
const rateOrder = async (req, res, next) => {
  try {
    const { overall, food, delivery, comment } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user can rate this order
    if (order.customer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to rate this order'
      });
    }

    // Check if order is delivered
    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        error: 'Can only rate delivered orders'
      });
    }

    order.rating = {
      overall,
      food,
      delivery,
      comment,
      ratedAt: new Date()
    };

    await order.save();

    // Update restaurant rating
    const restaurant = await Restaurant.findById(order.restaurant);
    await restaurant.updateRating();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my orders
// @route   GET /api/v1/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate({
        path: 'restaurant',
        select: 'name address phone'
      })
      .populate({
        path: 'items.menuItem',
        select: 'name price'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get restaurant orders
// @route   GET /api/v1/orders/restaurant/:restaurantId
// @access  Private/Restaurant/Admin
const getRestaurantOrders = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    // Check if user owns the restaurant or is admin
    if (req.user.role !== 'admin') {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant || restaurant.owner.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to access these orders'
        });
      }
    }

    const orders = await Order.find({ restaurant: restaurantId })
      .populate({
        path: 'customer',
        select: 'name email phone'
      })
      .populate({
        path: 'items.menuItem',
        select: 'name price'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  rateOrder,
  getMyOrders,
  getRestaurantOrders
};
