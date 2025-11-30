import { Request, Response } from 'express';
import { User } from '../models';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role = 'customer' } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Email already registered',
      });
      return;
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
    });

    // Generate tokens
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register user',
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid credentials',
      });
      return;
    }

    // Verify password using bcryptjs
    const isMatch = await bcryptjs.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid credentials',
      });
      return;
    }

    // Generate tokens
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to login',
    });
  }
};

/**
 * Get user profile
 * GET /api/auth/me
 */
export const getProfile = async (
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

    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get profile',
    });
  }
};

/**
 * Update user profile
 * PATCH /api/auth/profile
 */
export const updateProfile = async (
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

    const { name, email, phone } = req.body;
    const updates: any = {};

    if (name) updates.name = name;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user.userId },
      });
      if (existingUser) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Email already in use',
        });
        return;
      }
      updates.email = email;
    }
    if (phone !== undefined) updates.phone = phone;

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      runValidators: true,
    }).select('-passwordHash');

    if (!user) {
      res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update profile',
    });
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Refresh token required',
      });
      return;
    }

    // Verify refresh token
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(refreshToken, jwtSecret) as any;

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      jwtSecret,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired refresh token',
    });
  }
};

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select('+resetPasswordToken +resetPasswordExpires');
    if (!user) {
      // Don't reveal if user exists
      res.status(200).json({
        message: 'Eğer bu email kayıtlıysa, şifre sıfırlama bağlantısı gönderildi',
      });
      return;
    }

    // Generate reset token (6 digit code)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash token before saving
    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token and expiry (15 minutes)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // In production, send email here
    // For development, log the token
    console.log('🔐 Password Reset Token:', resetToken);
    console.log('📧 For user:', user.email);

    res.status(200).json({
      message: 'Şifre sıfırlama kodu: ' + resetToken + ' (15 dakika geçerli)',
      // In production, remove this and send via email
      resetToken, // Only for development
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Şifre sıfırlama isteği başarısız',
    });
  }
};

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Email, kod ve yeni şifre gereklidir',
      });
      return;
    }

    // Hash the provided token
    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires +passwordHash');

    if (!user) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Geçersiz veya süresi dolmuş kod',
      });
      return;
    }

    // Hash new password
    const passwordHash = await bcryptjs.hash(newPassword, 10);
    
    // Update password and clear reset token
    user.passwordHash = passwordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      message: 'Şifre başarıyla güncellendi',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Şifre sıfırlama başarısız',
    });
  }
};
