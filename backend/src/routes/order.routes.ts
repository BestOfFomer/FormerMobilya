import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/order.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { orderSchema } from '../validators/schemas';

const router = Router();

// Protected routes (customer) with validation
router.post('/', authenticate, validate(orderSchema), createOrder);
router.get('/', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);

// Admin routes
router.get('/admin/all', authenticate, authorizeAdmin, getAllOrders);
router.put('/:id/status', authenticate, authorizeAdmin, updateOrderStatus);

export default router;
