import { Request, Response } from 'express';
import { Category } from '../models';

/**
 * Get all categories
 * GET /api/categories
 */
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find()
      .populate('subcategories')
      .sort({ displayOrder: 1, name: 1 }); // Sort by displayOrder first, then name

    res.status(200).json({
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch categories',
    });
  }
};

/**
 * Get category by slug
 * GET /api/categories/:slug
 */
export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug }).populate('subcategories');

    if (!category) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({ category });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message:'Failed to fetch category',
    });
  }
};

/**
 * Create new category (Admin only)
 * POST /api/categories
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, slug, description, parent, image } = req.body;

    // Validation
    if (!name) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Category name is required',
      });
      return;
    }

    // Check if slug already exists
    if (slug) {
      const existingCategory = await Category.findOne({ slug });
      if (existingCategory) {
        res.status(409).json({
          error: 'Conflict',
          message: 'Category with this slug already exists',
        });
        return;
      }
    }

    const category = await Category.create({
      name,
      slug,
      description,
      parent,
      image,
    });

    res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create category',
    });
  }
};

/**
 * Update category (Admin only)
 * PUT /api/categories/:id
 */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug, description, parent, image } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug, description, parent, image },
      { new: true, runValidators: true }
    );

    if (!category) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update category',
    });
  }
};

/**
 * Delete category (Admin only)
 * DELETE /api/categories/:id
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete category',
    });
  }
};

/**
 * Reorder categories (Admin only)
 * PATCH /api/categories/reorder
 */
export const reorderCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Reorder request received:', req.body);
    const { orders } = req.body;

    if (!Array.isArray(orders)) {
      console.log('Orders is not an array:', orders);
      res.status(400).json({
        error: 'Bad Request',
        message: 'Orders must be an array',
      });
      return;
    }

    console.log('Processing orders:', orders);

    // Update each category's displayOrder
    const updatePromises = orders.map(({ id, displayOrder }: { id: string; displayOrder: number }) => {
      console.log(`Updating category ${id} with displayOrder ${displayOrder}`);
      return Category.findByIdAndUpdate(id, { displayOrder }, { new: true });
    });

    await Promise.all(updatePromises);

    const categories = await Category.find().sort({ displayOrder: 1, name: 1 });
    
    console.log('Reorder completed successfully');
    res.status(200).json({
      message: 'Categories reordered successfully',
      categories,
    });
  } catch (error) {
    console.error('Reorder categories error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to reorder categories',
    });
  }
};
