import { Router } from 'express';
import { uploadImage, uploadImages, upload, uploadModel3D, upload3DModel } from '../controllers/upload.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimiter';

const router = Router();

// Admin only - single image upload with rate limiting
router.post('/image', uploadLimiter, authenticate, authorizeAdmin, upload.single('image'), uploadImage);

// Admin only - multiple images upload with rate limiting
router.post('/images', uploadLimiter, authenticate, authorizeAdmin, upload.array('images', 10), uploadImages);

// Admin only - 3D model upload with rate limiting
router.post('/model3d', uploadLimiter, authenticate, authorizeAdmin, upload3DModel.single('model'), uploadModel3D);

export default router;
