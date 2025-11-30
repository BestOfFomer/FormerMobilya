import mongoose, { Schema, Document } from 'mongoose';

// Product Variant Interface
export interface IVariant {
  name: string;
  options: Array<{
    name: string;
    values: string[];
  }>;
  stock: number;
  priceOverride?: number;
}

// Product Dimensions Interface
export interface IDimensions {
  width?: number;
  height?: number;
  depth?: number;
  unit: string;
}

// Product Interface
export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  description: string;
  category: mongoose.Types.ObjectId;
  basePrice: number;
  discountedPrice?: number;
  images: string[];
  model3D?: string;
  dimensions?: IDimensions;
  materials: string[];
  variants: IVariant[];
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Virtual properties
  effectivePrice: number;
  discountPercentage: number;
  totalStock: number;
}

// Product Schema
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Ürün adı gereklidir'],
      trim: true,
      maxlength: [200, 'Ürün adı maksimum 200 karakter olabilir'],
    },
    slug: {
      type: String,
      required: [true, 'Slug gereklidir'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    sku: {
      type: String,
      required: [true, 'Ürün kodu (SKU) gereklidir'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Ürün açıklaması gereklidir'],
      trim: true,
      maxlength: [5000, 'Açıklama maksimum 5000 karakter olabilir'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Kategori gereklidir'],
      index: true,
    },
    basePrice: {
      type: Number,
      required: [true, 'Fiyat gereklidir'],
      min: [0, 'Fiyat negatif olamaz'],
    },
    discountedPrice: {
      type: Number,
      min: [0, 'İndirimli fiyat negatif olamaz'],
      // Note: Price comparison validation is handled in controller
      // to avoid issues with update operations where this.basePrice may not be available
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (images: string[]) {
          return images.length > 0;
        },
        message: 'En az bir ürün görseli gereklidir',
      },
    },
    model3D: {
      type: String,
      required: false,
      trim: true,
    },
    dimensions: {
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      depth: { type: Number, min: 0 },
      unit: { type: String, default: 'cm' },
    },
    materials: {
      type: [String],
      default: [],
    },
    variants: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        options: [
          {
            name: {
              type: String,
              required: true,
              trim: true,
            },
            values: {
              type: [String],
              required: true,
            },
          },
        ],
        stock: {
          type: Number,
          required: true,
          min: [0, 'Stok negatif olamaz'],
          default: 0,
        },
        priceOverride: {
          type: Number,
          min: [0, 'Fiyat negatif olamaz'],
        },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
ProductSchema.index({ name: 'text', description: 'text' }); // Text search
ProductSchema.index({ category: 1, active: 1 });
ProductSchema.index({ basePrice: 1 });
ProductSchema.index({ createdAt: -1 }); // Sort by newest

// Virtual: effective price (discounted or base)
ProductSchema.virtual('effectivePrice').get(function () {
  return this.discountedPrice || this.basePrice;
});

// Virtual: discount percentage
ProductSchema.virtual('discountPercentage').get(function () {
  if (this.discountedPrice && this.discountedPrice < this.basePrice) {
    return Math.round(
      ((this.basePrice - this.discountedPrice) / this.basePrice) * 100
    );
  }
  return 0;
});

// Virtual: total stock (sum of all variants)
ProductSchema.virtual('totalStock').get(function () {
  if (this.variants && this.variants.length > 0) {
    return this.variants.reduce((sum, variant) => sum + variant.stock, 0);
  }
  return 0;
});

// Pre-save: auto-generate slug from name
ProductSchema.pre('save', async function () {
  if (!this.slug && this.name) {
    const slugify = (text: string) =>
      text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/ş/g, 's')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');

    this.slug = slugify(this.name);
  }

  // Auto-generate SKU if not provided
  if (!this.sku) {
    const timestamp = Date.now().toString(36).toUpperCase();
    this.sku = `PRD-${timestamp}`;
  }
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
