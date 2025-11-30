import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs/promises';

// Configure multer storage
const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
  }
};

// Multer upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
});

/**
 * Upload single image
 * POST /api/upload/image
 */
export const uploadImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'No file uploaded',
      });
      return;
    }

    // Optimize image with sharp and convert to webp
    const baseFileName = path.parse(req.file.filename).name;
    const optimizedFileName = `optimized-${baseFileName}.webp`;
    const optimizedPath = path.join(
      path.dirname(req.file.path),
      optimizedFileName
    );

    await sharp(req.file.path)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toFile(optimizedPath);

    // Delete original file
    await fs.unlink(req.file.path);

    const fileUrl = `/uploads/${optimizedFileName}`;

    res.status(200).json({
      message: 'Image uploaded successfully',
      filePath: fileUrl,
      filename: optimizedFileName,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to upload image',
    });
  }
};

/**
 * Upload multiple images
 * POST /api/upload/images
 */
export const uploadImages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'No files uploaded',
      });
      return;
    }

    const uploadedFiles = await Promise.all(
      req.files.map(async (file) => {
        const baseFileName = path.parse(file.filename).name;
        const optimizedFileName = `optimized-${baseFileName}.webp`;
        const optimizedPath = path.join(
          path.dirname(file.path),
          optimizedFileName
        );

        await sharp(file.path)
          .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 85 })
          .toFile(optimizedPath);

        // Delete original file
        await fs.unlink(file.path);

        return `/uploads/${optimizedFileName}`;
      })
    );

    res.status(200).json({
      message: 'Images uploaded successfully',
      filePaths: uploadedFiles,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to upload images',
    });
  }
};

/**
 * 3D Model Upload Configuration
 */
const model3DStorage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'models');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'model-' + uniqueSuffix + ext);
  },
});

// 3D Model file filter
const model3DFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'];
  const allowedExtensions = ['.glb', '.gltf'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only GLB and GLTF files are allowed.'));
  }
};

// Multer upload middleware for 3D models
export const upload3DModel = multer({
  storage: model3DStorage,
  fileFilter: model3DFileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

/**
 * Upload 3D model
 */
export const uploadModel3D = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'No file uploaded',
      });
    }

    const file = req.file;
    const filePath = `/uploads/models/${file.filename}`;

    return res.status(200).json({
      message: '3D model uploaded successfully',
      filePath: filePath,
    });
  } catch (error) {
    console.error('3D model upload error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to upload 3D model',
    });
  }
};
