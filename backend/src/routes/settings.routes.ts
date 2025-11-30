import express from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Public route - get settings
router.get('/', getSettings);

// Admin routes - update settings
router.put('/', authenticate, authorizeAdmin, updateSettings);

export default router;
