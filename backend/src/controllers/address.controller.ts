import { Request, Response } from 'express';
import User from '../models/User';

/**
 * @route   GET /api/addresses
 * @desc    Get all addresses for current user
 * @access  Private
 */
export const getAddresses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
      });
    }

    const user = await User.findById(userId).select('addresses');
    
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    return res.status(200).json({
      addresses: user.addresses || [],
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch addresses',
    });
  }
};

/**
 * @route   POST /api/addresses
 * @desc    Add new address
 * @access  Private
 */
export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { title, fullName, phone, city, district, address, isDefault } = req.body;

    // Validation
    if (!title || !fullName || !phone || !city || !district || !address) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'All address fields are required',
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    // If this is the first address or isDefault is true, set as default
    const shouldBeDefault = !user.addresses || user.addresses.length === 0 || isDefault;

    // If setting as default, unset all other defaults
    if (shouldBeDefault && user.addresses) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    // Add new address
    const newAddress = {
      title,
      fullName,
      phone,
      city,
      district,
      address,
      isDefault: shouldBeDefault,
    };

    if (!user.addresses) {
      user.addresses = [];
    }

    user.addresses.push(newAddress as any);
    await user.save();

    return res.status(201).json({
      message: 'Address added successfully',
      address: user.addresses[user.addresses.length - 1],
    });
  } catch (error) {
    console.error('Add address error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add address',
    });
  }
};

/**
 * @route   PUT /api/addresses/:addressId
 * @desc    Update address
 * @access  Private
 */
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { addressId } = req.params;
    const updates = req.body;

    const user = await User.findById(userId);
    
    if (!user || !user.addresses) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User or addresses not found',
      });
    }

    const addressIndex = user.addresses.findIndex(
      (addr: any) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Address not found',
      });
    }

    // Update address fields
    const allowedFields = ['title', 'fullName', 'phone', 'city', 'district', 'address'];
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        (user.addresses![addressIndex] as any)[field] = updates[field];
      }
    });

    await user.save();

    return res.status(200).json({
      message: 'Address updated successfully',
      address: user.addresses[addressIndex],
    });
  } catch (error) {
    console.error('Update address error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update address',
    });
  }
};

/**
 * @route   DELETE /api/addresses/:addressId
 * @desc    Delete address
 * @access  Private
 */
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    
    if (!user || !user.addresses) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User or addresses not found',
      });
    }

    const addressIndex = user.addresses.findIndex(
      (addr: any) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Address not found',
      });
    }

    const wasDefault = (user.addresses[addressIndex] as any).isDefault;

    // Remove address
    user.addresses.splice(addressIndex, 1);

    // If deleted address was default and there are remaining addresses, set first as default
    if (wasDefault && user.addresses.length > 0) {
      (user.addresses[0] as any).isDefault = true;
    }

    await user.save();

    return res.status(200).json({
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('Delete address error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete address',
    });
  }
};

/**
 * @route   PUT /api/addresses/:addressId/set-default
 * @desc    Set address as default
 * @access  Private
 */
export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    
    if (!user || !user.addresses) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User or addresses not found',
      });
    }

    const addressIndex = user.addresses.findIndex(
      (addr: any) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Address not found',
      });
    }

    // Unset all defaults
    user.addresses.forEach((addr: any) => {
      addr.isDefault = false;
    });

    // Set selected as default
    (user.addresses[addressIndex] as any).isDefault = true;

    await user.save();

    return res.status(200).json({
      message: 'Default address updated successfully',
      address: user.addresses[addressIndex],
    });
  } catch (error) {
    console.error('Set default address error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to set default address',
    });
  }
};
