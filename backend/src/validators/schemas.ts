import { z } from 'zod';

/**
 * User registration validation schema
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(16, 'Şifre en fazla 16 karakter olabilir'),
  role: z.enum(['admin', 'customer']).optional(),
});

/**
 * User login validation schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Category validation schema
 */
export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  parent: z.string().optional(),
  image: z.string().optional(),
});

/**
 * Product validation schema
 */
export const productSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).optional(),
  sku: z.string().min(2).max(50).optional(),
  description: z.string().min(10).max(5000),
  category: z.string().min(1, 'Category is required'),
  basePrice: z.number().min(0, 'Price cannot be negative'),
  discountedPrice: z.number().min(0).optional(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  dimensions: z
    .object({
      width: z.number().min(0).optional(),
      height: z.number().min(0).optional(),
      depth: z.number().min(0).optional(),
      unit: z.string().default('cm'),
    })
    .optional(),
  materials: z.array(z.string()).optional(),
  variants: z
    .array(
      z.object({
        name: z.string(),
        options: z.array(
          z.object({
            name: z.string(),
            values: z.array(z.string()),
          })
        ),
        stock: z.number().min(0),
        priceOverride: z.number().min(0).optional(),
      })
    )
    .optional(),
  active: z.boolean().optional(),
});

/**
 * Order validation schema
 */
export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string(),
        productName: z.string(),
        productImage: z.string(),
        variantId: z.string().optional(),
        variantName: z.string().optional(),
        quantity: z.number().min(1),
        unitPrice: z.number().min(0),
        totalPrice: z.number().min(0),
      })
    )
    .min(1, 'At least one item is required'),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().regex(/^[0-9]{10,11}$/, 'Invalid phone number'),
    city: z.string().min(2),
    district: z.string().min(2),
    address: z.string().min(5),
  }),
  subtotal: z.number().min(0),
  shippingCost: z.number().min(0).optional(),
  paymentMethod: z.string().optional(),
  orderNotes: z.string().max(500).optional(),
});
