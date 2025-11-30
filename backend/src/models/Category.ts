import mongoose, { Schema, Document } from 'mongoose';

// Category Interface
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parent?: mongoose.Types.ObjectId;
  image?: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Category Schema
const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Kategori adı gereklidir'],
      trim: true,
      maxlength: [100, 'Kategori adı maksimum 100 karakter olabilir'],
    },
    slug: {
      type: String,
      required: [true, 'Slug gereklidir'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Açıklama maksimum 500 karakter olabilir'],
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for subcategories
CategorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

// Index for performance
CategorySchema.index({ name: 1 });
CategorySchema.index({ parent: 1 });
CategorySchema.index({ displayOrder: 1 });

// Pre-save middleware: auto-generate slug if not provided
CategorySchema.pre('save', async function (this: ICategory) {
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
});

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
