import { Request, Response } from 'express';
import { Order, OrderStatus, PaymentStatus } from '../models';

/**
 * Create new order
 * POST /api/orders
 */
export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    const {
      items,
      shippingAddress,
      subtotal,
      shippingCost,
      paymentMethod,
      orderNotes,
    } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Order items are required',
      });
      return;
    }

    if (!shippingAddress) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Shipping address is required',
      });
      return;
    }

    // Create order
    const order = await Order.create({
      user: req.user.userId,
      items,
      shippingAddress,
      subtotal,
      shippingCost,
      paymentMethod: paymentMethod || 'credit_card',
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING,
      orderNotes,
    });

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create order',
    });
  }
};

/**
 * Get user's orders
 * GET /api/orders
 */
export const getUserOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product', 'name slug images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch orders',
    });
  }
};

/**
 * Get order by ID
 * GET /api/orders/:id
 */
export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    const { id } = req.params;

    const order = await Order.findById(id).populate(
      'items.product',
      'name slug images'
    );

    if (!order) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Order not found',
      });
      return;
    }

    // Check if user owns the order or is admin
    if (
      order.user.toString() !== req.user.userId &&
      req.user.role !== 'admin'
    ) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to view this order',
      });
      return;
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch order',
    });
  }
};

/**
 * Get all orders (Admin only)
 * GET /api/orders/admin/all
 */
export const getAllOrders = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch orders',
    });
  }
};

/**
 * Update order status (Admin only)
 * PUT /api/orders/:id/status
 */
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus, paymentStatus },
      { new: true, runValidators: true }
    );

    if (!order) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Order not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update order status',
    });
  }
};
