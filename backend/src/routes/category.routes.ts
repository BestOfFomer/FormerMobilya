import { Router } from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from '../controllers/category.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { categorySchema } from '../validators/schemas';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin routes with validation
router.post('/', authenticate, authorizeAdmin, validate(categorySchema), createCategory);
router.put('/:id', authenticate, authorizeAdmin, validate(categorySchema), updateCategory);
router.delete('/:id', authenticate, authorizeAdmin, deleteCategory);
router.patch('/reorder', authenticate, authorizeAdmin, reorderCategories);

export default router;
