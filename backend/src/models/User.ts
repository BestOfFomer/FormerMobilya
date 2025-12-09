import mongoose, { Schema, Document } from 'mongoose';

// User Role Enum
export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

// User Interface
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  addresses?: Array<{
    title: string;
    fullName: string;
    phone: string;
    city: string;
    district: string;
    address: string;
    isDefault: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'İsim gereklidir'],
      trim: true,
      minlength: [2, 'İsim en az 2 karakter olmalıdır'],
      maxlength: [100, 'İsim maksimum 100 karakter olabilir'],
    },
    email: {
      type: String,
      required: [true, 'Email gereklidir'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Geçerli bir email adresi giriniz',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Şifre gereklidir'],
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10,11}$/, 'Geçerli bir telefon numarası giriniz'],
    },
    resetPasswordToken: {
      type: String,
      select: false, // Don't return in queries by default
    },
    resetPasswordExpires: {
      type: Date,
      select: false, // Don't return in queries by default
    },
    addresses: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        fullName: {
          type: String,
          required: true,
          trim: true,
        },
        phone: {
          type: String,
          required: true,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        district: {
          type: String,
          required: true,
          trim: true,
        },
        address: {
          type: String,
          required: true,
          trim: true,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for email is already defined with unique: true

// Pre-save: Ensure only one default address
UserSchema.pre('save', function () {
  if (this.addresses && this.addresses.length > 0) {
    const defaultAddresses = this.addresses.filter((addr) => addr.isDefault);
    if (defaultAddresses.length > 1) {
      // Keep only the first one as default
      this.addresses.forEach((addr, index) => {
        if (index > 0) addr.isDefault = false;
      });
    }
  }
});

// Method to compare password (will be used in auth)
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
