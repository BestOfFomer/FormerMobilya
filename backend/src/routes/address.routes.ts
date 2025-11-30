import express from 'express';
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/address.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/addresses - Get all user addresses
router.get('/', getAddresses);

// POST /api/addresses - Add new address
router.post('/', addAddress);

// PUT /api/addresses/:addressId - Update address
router.put('/:addressId', updateAddress);

// DELETE /api/addresses/:addressId - Delete address
router.delete('/:addressId', deleteAddress);

// PUT /api/addresses/:addressId/set-default - Set as default
router.put('/:addressId/set-default', setDefaultAddress);

export default router;
