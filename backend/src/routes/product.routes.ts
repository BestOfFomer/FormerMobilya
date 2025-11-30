import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { productSchema } from '../validators/schemas';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin routes with validation
router.post('/', authenticate, authorizeAdmin, validate(productSchema), createProduct);
router.put('/:id', authenticate, authorizeAdmin, validate(productSchema), updateProduct);
router.delete('/', authenticate, authorizeAdmin, deleteProduct);

export default router;
