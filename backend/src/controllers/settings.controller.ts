import { Request, Response } from 'express';
import { Settings } from '../models/Settings';

// Get settings (public)
export const getSettings = async (_req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      const newSettings = await Settings.create({
        whatsapp: {
          enabled: false,
          phoneNumber: '',
          defaultMessage: 'Merhaba, Former Mobilya ile ilgili bilgi almak istiyorum.',
        },
        contact: {
          email: 'info@formermobilya.com',
          phone: '',
          address: '',
        },
        social: {},
      });
      settings = Array.isArray(newSettings) ? newSettings[0] : newSettings;
    }

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Ayarlar alınırken hata oluştu' });
  }
};

// Update settings (admin only)
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const updates = req.body;

    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create new settings
      const newSettings = await Settings.create(updates);
      settings = Array.isArray(newSettings) ? newSettings[0] : newSettings;
    } else {
      // Update existing settings
      Object.assign(settings, updates);
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Ayarlar güncellenirken hata oluştu' });
  }
};
