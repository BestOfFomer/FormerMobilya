import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  whatsapp: {
    enabled: boolean;
    phoneNumber: string;
    defaultMessage: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  pageContents: {
    about: {
      about: {
        enabled: boolean;
        title: string;
        content: string;
      };
      mission: {
        enabled: boolean;
        content: string;
      };
      vision: {
        enabled: boolean;
        content: string;
      };
      stats: {
        enabled: boolean;
        items: Array<{
          icon: 'calendar' | 'users' | 'checkCircle' | 'award' | 'star' | 'trendingUp' | 'package' | 'home' | 'heart' | 'thumbsUp' | 'zap' | 'target' | 'badge';
          value: string;
          label: string;
        }>;
      };
      values: {
        enabled: boolean;
        items: Array<{
          title: string;
          content: string;
        }>;
      };
    };
    contact: {
      phone: { value: string };
      email: { value: string };
      address: { value: string };
      workdays: { value: string };
      workhours: { value: string };
      mapEmbed: { value: string };
    };
    stores: {
      items: Array<{
        name: string;
        address: string;
        phone: string;
        email: string;
        workdays: string;
        workhours: string;
        mapEmbed: string;
      }>;
    };
  };
  trustBadges: {
    items: Array<{
      title: string;
      description: string;
      icon: 'truck' | 'rotateCcw' | 'shield' | 'checkCircle' | 'star' | 'heart' | 'thumbsUp' | 'clock' | 'package' | 'award' | 'badgeCheck' | 'phone';
    }>;
  };
  featuredProducts: string[]; // Array of product IDs (max 4)
  // Deprecated fields for backward compatibility
  contact?: {
    email: string;
    phone: string;
    address: string;
  };
  aboutPage?: any;
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
    social: {
      facebook: String,
      instagram: String,
      twitter: String,
    },
    pageContents: {
      about: {
        about: {
          enabled: {
            type: Boolean,
            default: true,
          },
          title: {
            type: String,
            default: 'Hakkımızda',
          },
          content: {
            type: String,
            default: 'Fomer Mobliya, Kayseri\'de kurulu modern üretim tesislerinde faaliyet gösteren, kalite ve güveni ön planda tutan bir mobilya üretim markasıdır. Türkiye\'nin mobilya üretim merkezi olarak bilinen Kayseri\'nin güçlü sanayi altyapısını arkasına alarak; dayanıklı, estetik, fonksiyonel ve yıllarca kullanılabilir ürünler geliştirmeyi hedeflemektedir.\nÜretim süreçlerimizin tamamında 1. sınıf malzeme kullanılmakta olup, ürünlerimiz fabrikadan çıkmadan önce detaylı kalite kontrol testlerinden geçirilir. Ahşap işleme, metal konstrüksiyon, döşeme ve aksesuar uygulamalarımız yüksek standartlarda yapılır. Bu sayede Former mobilya ürünleri; uzun ömürlü, dayanıklı ve kullanıcı dostu özellikleriyle öne çıkar.\nMüşterilerine yalnızca ürün değil, güven veren bir hizmet sunmayı amaçlayan Former moliya, tüm ürünlerinde garanti kapsamında destek sağlar ve satış sonrası hizmetiyle fark yaratır. Geniş ürün yelpazesi, özel üretim çözümleri, profesyonel tasarım ekibi, güçlü işçilik kalitesi ve zamanında teslimat politikasıyla; Türkiye\'de ve uluslararası pazarlarda büyümeye devam eden bir marka olmayı sürdürüyoruz.',
          },
        },
        mission: {
        enabled: {
          type: Boolean,
          default: true,
        },
        content: {
          type: String,
          default: 'Müşterilerimize en kaliteli mobilya ürünlerini uygun fiyatlarla sunarak, yaşam alanlarını daha konforlu ve estetik hale getirmek. Her bütçeye uygun, dayanıklı ve tasarım odaklı ürünlerle hizmet vermek.',
        },
      },
      vision: {
        enabled: {
          type: Boolean,
          default: true,
        },
        content: {
          type: String,
          default: 'Mobilya ve üretim sektöründe Türkiye\'nin en güvenilir, en yenilikçi ve en kaliteli markalarından biri olmak. Dünya standartlarında, uzun ömürlü ve yüksek dayanımlı ürünler geliştiren; müşteri memnuniyetini, sürdürülebilirliği ve teknolojiyi merkeze alan bir global marka haline gelmek.',
        },
      },
      stats: {
        enabled: {
          type: Boolean,
          default: true,
        },
        items: {
          type: [
            {
              icon: {
                type: String,
                enum: ['calendar', 'users', 'checkCircle', 'award', 'star', 'trendingUp', 'package', 'home', 'heart', 'thumbsUp', 'zap', 'target', 'badge'],
              },
              value: String,
              label: String,
            },
          ],
          default: [
            { icon: 'calendar', value: '15+', label: 'Yıllık Tecrübe' },
            { icon: 'users', value: '50,000+', label: 'Mutlu Müşteri' },
            { icon: 'checkCircle', value: '1,000+', label: 'Ürün Çeşidi' },
            { icon: 'award', value: '%98', label: 'Memnuniyet Oranı' },
          ],
        },
      },
      values: {
        enabled: {
          type: Boolean,
          default: true,
        },
        items: {
          type: [
            {
              title: String,
              content: String,
            },
          ],
          default: [
            {
              title: 'Kalite',
              content: 'Ürünlerimiz seçilmiş malzemelerden üretilir ve kalite kontrolünden geçer. Uzun ömürlü ve dayanıklı mobilyalar sunuyoruz.',
            },
            {
              title: 'Müşteri Odaklılık',
              content: 'Müşteri memnuniyeti en önemli önceliğimizdir. Satış öncesi ve sonrası profesyonel destek sağlıyoruz.',
            },
            {
              title: 'İnovasyon',
              content: 'Sürekli yenilenen ürün gamımız ve modern tasarımlarımızla sektörün öncüsü olmayı hedefliyoruz.',
            },
          ],
        },
        },
      },
      contact: {
        phone: {
          value: {
            type: String,
            default: '',
          },
        },
        email: {
          value: {
            type: String,
            default: '',
          },
        },
        address: {
          value: {
            type: String,
            default: '',
          },
        },
        workdays: {
          value: {
            type: String,
            default: '',
          },
        },
        workhours: {
          value: {
            type: String,
            default: '',
          },
        },
        mapEmbed: {
          value: {
            type: String,
            default: '',
          },
        },
      },
      stores: {
        items: {
          type: [
            {
              name: String,
              address: String,
              phone: String,
              email: String,
              workdays: String,
              workhours: String,
              mapEmbed: String,
            },
          ],
          default: [],
        },
      },
    },
    trustBadges: {
      items: {
        type: [
          {
            title: String,
            description: String,
            icon: {
              type: String,
              enum: ['truck', 'rotateCcw', 'shield', 'checkCircle', 'star', 'heart', 'thumbsUp', 'clock', 'package', 'award', 'badgeCheck', 'phone'],
            },
          },
        ],
        default: [
          {
            title: 'Fabrika Çıkış Onaylı',
            description: 'Tüm ürünler fabrika çıkış onaylı kalite kontrol raporu ile teslim edilir',
            icon: 'truck',
          },
          {
            title: 'Garanti Süresi',
            description: 'Standart ürünlerde 2 yıl garanti, özel üretimlerde proje bazlı garanti süresi uygulanır',
            icon: 'rotateCcw',
          },
          {
            title: 'Servis Desteği',
            description: 'Servis ve yedek parça desteği mevcuttur',
            icon: 'shield',
          },
        ],
      },
    },
    featuredProducts: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          return v.length <= 4;
        },
        message: 'Maximum 4 featured products allowed'
      }
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
settingsSchema.index({}, { unique: true });

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
