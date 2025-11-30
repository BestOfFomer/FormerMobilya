import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  whatsapp: {
    enabled: boolean;
    phoneNumber: string;
    defaultMessage: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    whatsapp: {
      enabled: {
        type: Boolean,
        default: false,
      },
      phoneNumber: {
        type: String,
        default: '',
      },
      defaultMessage: {
        type: String,
        default: 'Merhaba, Former Mobilya ile ilgili bilgi almak istiyorum.',
      },
    },
    contact: {
      email: {
        type: String,
        default: 'info@formermobilya.com',
      },
      phone: {
        type: String,
        default: '',
      },
      address: {
        type: String,
        default: '',
      },
    },
    social: {
      facebook: String,
      instagram: String,
      twitter: String,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
settingsSchema.index({}, { unique: true });

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
