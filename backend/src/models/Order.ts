import mongoose, { Schema, Document } from 'mongoose';

// Payment Status Enum
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// Order Status Enum
export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'hazırlanıyor',
  SHIPPED = 'kargolandı',
  DELIVERED = 'teslim edildi',
  CANCELLED = 'iptal edildi',
}

// Order Item Interface
export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  productImage: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Shipping Address Interface
export interface IShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
}

// Order Interface
export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentTransactionId?: string;
  orderStatus: OrderStatus;
  orderNotes?: string;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order Schema
const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Kullanıcı gereklidir'],
      index: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        productImage: {
          type: String,
          required: true,
        },
        variantId: {
          type: String,
        },
        variantName: {
          type: String,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Miktar en az 1 olmalıdır'],
        },
        unitPrice: {
          type: Number,
          required: true,
          min: [0, 'Birim fiyat negatif olamaz'],
        },
        totalPrice: {
          type: Number,
          required: true,
          min: [0, 'Toplam fiyat negatif olamaz'],
        },
      },
    ],
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, 'Ad Soyad gereklidir'],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'Telefon gereklidir'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'İl gereklidir'],
        trim: true,
      },
      district: {
        type: String,
        required: [true, 'İlçe gereklidir'],
        trim: true,
      },
      address: {
        type: String,
        required: [true, 'Adres gereklidir'],
        trim: true,
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Ara toplam negatif olamaz'],
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: [0, 'Kargo ücreti negatif olamaz'],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Toplam tutar negatif olamaz'],
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'credit_card',
    },
    paymentTransactionId: {
      type: String,
      sparse: true, // Allow multiple null values
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      index: true,
    },
    orderNotes: {
      type: String,
      trim: true,
      maxlength: [500, 'Not maksimum 500 karakter olabilir'],
    },
    cancelReason: {
      type: String,
      trim: true,
      maxlength: [500, 'İptal nedeni maksimum 500 karakter olabilir'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for queries
OrderSchema.index({ user: 1, createdAt: -1 });

OrderSchema.index({ paymentStatus: 1, orderStatus: 1 });

// Pre-save: auto-generate order number
OrderSchema.pre('save', async function () {
  if (!this.orderNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    this.orderNumber = `FM${timestamp}${random}`;
  }

  // Calculate totalAmount if not set
  if (!this.totalAmount) {
    this.totalAmount = this.subtotal + this.shippingCost;
  }
});

// Static method: find orders by user
OrderSchema.statics.findByUser = function (userId: mongoose.Types.ObjectId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Static method: find pending orders
OrderSchema.statics.findPending = function () {
  return this.find({
    paymentStatus: PaymentStatus.PENDING,
    orderStatus: OrderStatus.PENDING,
  }).sort({ createdAt: -1 });
};

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
