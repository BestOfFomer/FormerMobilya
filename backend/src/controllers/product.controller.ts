import { Request, Response } from 'express';
import { Product } from '../models';

/**
 * Get all products with filtering, sorting, and pagination
 * GET /api/products
 */
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt',
      page = '1',
      limit = '20',
    } = req.query;

    // Build filter object
    const filter: any = { active: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = Number(minPrice);
      if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search as string };
    }

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort as string)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      count: products.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      products,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch products',
    });
  }
};

/**
 * Get product by slug
 * GET /api/products/:slug
 */
export const getProductBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug, active: true }).populate(
      'category',
      'name slug'
    );

    if (!product) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch product',
    });
  }
};

/**
 * Create new product (Admin only)
 * POST /api/products
 */
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      slug,
      sku,
      description,
      category,
      basePrice,
      discountedPrice,
      images,
      dimensions,
      materials,
      variants,
      featured,
      active,
    } = req.body;

    // Validation
    if (!name || !description || !category || !basePrice) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Name, description, category, and price are required',
      });
      return;
    }

    // Validate discounted price
    if (discountedPrice !== undefined && discountedPrice !== null && discountedPrice >= basePrice) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'İndirimli fiyat, normal fiyattan düşük olmalıdır',
      });
      return;
    }

    // Check if slug or SKU already exists
    if (slug) {
      const existingProduct = await Product.findOne({ slug });
      if (existingProduct) {
        res.status(409).json({
          error: 'Conflict',
          message: 'Product with this slug already exists',
        });
        return;
      }
    }

    if (sku) {
      const existingProduct = await Product.findOne({ sku });
      if (existingProduct) {
        res.status(409).json({
          error: 'Conflict',
          message: 'Product with this SKU already exists',
        });
        return;
      }
    }

    const product = await Product.create({
      name,
      slug,
      sku,
      description,
      category,
      basePrice,
      discountedPrice,
      images,
      dimensions,
      materials,
      variants,
      featured,
      active,
    });

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create product',
    });
  }
};

/**
 * Update product (Admin only)
 * PUT /api/products/:id
 */
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate discounted price if both prices are being updated
    if (updateData.discountedPrice !== undefined && updateData.basePrice !== undefined) {
      if (updateData.discountedPrice >= updateData.basePrice) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'İndirimli fiyat, normal fiyattan düşük olmalıdır',
        });
        return;
      }
    } else if (updateData.discountedPrice !== undefined) {
      // If only discounted price is being updated, check against existing basePrice
      const existingProduct = await Product.findById(id);
      if (existingProduct && updateData.discountedPrice >= existingProduct.basePrice) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'İndirimli fiyat, normal fiyattan düşük olmalıdır',
        });
        return;
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!product) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update product',
    });
  }
};

/**
 * Delete product (Admin only)
 * DELETE /api/products/:id
 */
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete product',
    });
  }
};
