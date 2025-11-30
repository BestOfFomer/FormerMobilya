import dotenv from 'dotenv';
import path from 'path';
import Category from '../models/Category';
import Product from '../models/Product';
import { connectDatabase } from '../config/database';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Helper function to create slug from name
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper function to create SKU
const createSKU = (name: string, index: number): string => {
  const prefix = name.split(' ')[0].toUpperCase().slice(0, 3);
  return `${prefix}-${String(index).padStart(4, '0')}`;
};

const seedData = async () => {
  try {
    await connectDatabase();

    console.log('🌱 Seeding data...');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // 1. Create Categories
    const categories = [
      {
        name: 'Oturma Odası',
        slug: 'oturma-odasi',
        description: 'Konforlu ve şık oturma odası mobilyaları',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'
      },
      {
        name: 'Yatak Odası',
        slug: 'yatak-odasi',
        description: 'Huzurlu uyku için yatak odası mobilyaları',
        image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80'
      },
      {
        name: 'Yemek Odası',
        slug: 'yemek-odasi',
        description: 'Şık ve fonksiyonel yemek odası takımları',
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80'
      },
      {
        name: 'Çalışma Odası',
        slug: 'calisma-odasi',
        description: 'Verimli çalışma alanları için mobilyalar',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80'
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // 2. Create Products
    const products = [
      // Oturma Odası Ürünleri
      {
        name: 'Modern Köşe Koltuk',
        slug: createSlug('Modern Köşe Koltuk'),
        sku: createSKU('Modern Köşe Koltuk', 1),
        description: 'Geniş ve rahat oturum sağlayan, modern tasarımlı L köşe koltuk takımı. Silinebilir kumaş ve gürgen iskelet.',
        basePrice: 25000,
        discountedPrice: 22500,
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
          'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80',
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'
        ],
        category: createdCategories[0]._id,
        variants: [
          {
            name: 'Standart - Gri',
            options: [{ name: 'Renk', values: ['Gri'] }],
            stock: 15,
          },
          {
            name: 'Standart - Bej',
            options: [{ name: 'Renk', values: ['Bej'] }],
            stock: 10,
          }
        ],
        dimensions: {
          width: 280,
          height: 85,
          depth: 170,
          unit: 'cm'
        },
        materials: ['Gürgen İskelet', '32 Dansite Sünger', 'Keten Kumaş'],
        featured: true
      },
      {
        name: 'Ahşap TV Ünitesi',
        description: 'Doğal meşe kaplama, minimalist TV ünitesi. 2 çekmeceli ve raflı depolama alanı.',
        basePrice: 8500,
        images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80'],
        category: createdCategories[0]._id,
        variants: [
          {
            name: '180cm',
            options: [{ name: 'Boyut', values: ['180cm'] }],
            stock: 8,
          }
        ],
        dimensions: {
          width: 180,
          height: 55,
          depth: 40,
          unit: 'cm'
        },
        materials: ['MDF Lam', 'Meşe Kaplama'],
        featured: false
      },
      {
        name: 'Berjer Koltuk',
        description: 'Tekli, konforlu okuma koltuğu. Kadife kumaş ve ahşap ayaklar.',
        basePrice: 6000,
        discountedPrice: 5400,
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'],
        category: createdCategories[0]._id,
        variants: [
          {
            name: 'Yeşil',
            options: [{ name: 'Renk', values: ['Yeşil'] }],
            stock: 12,
          },
          {
            name: 'Lacivert',
            options: [{ name: 'Renk', values: ['Lacivert'] }],
            stock: 7,
          }
        ],
        dimensions: {
          width: 80,
          height: 95,
          depth: 85,
          unit: 'cm'
        },
        materials: ['Gürgen Ayak', 'Kadife Kumaş'],
        featured: true
      },
      {
        name: '3lü Kanepe',
        description: 'Üç kişilik klasik kanepe. Yüksek konfor ve şık tasarım.',
        basePrice: 18000,
        images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'],
        category: createdCategories[0]._id,
        variants: [
          {
            name: 'Standart',
            options: [{ name: 'Renk', values: ['Kahverengi', 'Antrasit'] }],
            stock: 5,
          }
        ],
        materials: ['Ahşap İskelet', 'Kumaş Döşeme'],
        featured: false
      },

      // Yatak Odası Ürünleri
      {
        name: 'Çift Kişilik Yatak',
        description: 'Modern başlıklı, ortopedik yataklı çift kişilik yatak.',
        basePrice: 15000,
        discountedPrice: 13500,
        images: ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80'],
        category: createdCategories[1]._id,
        variants: [
          {
            name: '160x200',
            options: [{ name: 'Boyut', values: ['160x200'] }],
            stock: 10,
          },
          {
            name: '180x200',
            options: [{ name: 'Boyut', values: ['180x200'] }],
            stock: 6,
          }
        ],
        dimensions: {
          width: 180,
          height: 120,
          depth: 200,
          unit: 'cm'
        },
        materials: ['Meşe', 'Kumaş Başlık', 'Ortopedik Yatak'],
        featured: true
      },
      {
        name: 'Gardırop',
        description: '5 kapılı, aynalı ve raflı geniş gardırop.',
        basePrice: 22000,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
        category: createdCategories[1]._id,
        variants: [
          {
            name: 'Beyaz',
            options: [{ name: 'Renk', values: ['Beyaz'] }],
            stock: 4,
          }
        ],
        dimensions: {
          width: 250,
          height: 220,
          depth: 60,
          unit: 'cm'
        },
        materials: ['MDF', 'Ayna'],
        featured: false
      },
      {
        name: 'Şifonyer',
        description: '4 çekmeceli, kompakt şifonyer.',
        basePrice: 5500,
        images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80'],
        category: createdCategories[1]._id,
        variants: [
          {
            name: 'Standart',
            options: [{ name: 'Renk', values: ['Ceviz', 'Beyaz'] }],
            stock: 15,
          }
        ],
        materials: ['Ahşap'],
        featured: false
      },

      // Yemek Odası Ürünleri
      {
        name: 'Yemek Masası Takımı',
        description: '6 kişilik yemek masası ve sandalye takımı. Modern tasarım.',
        basePrice: 12000,
        discountedPrice: 10800,
        images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80'],
        category: createdCategories[2]._id,
        variants: [
          {
            name: '6 Kişilik',
            options: [{ name: 'Kapasite', values: ['6 Kişilik'] }],
            stock: 8,
          }
        ],
        dimensions: {
          width: 160,
          height: 75,
          depth: 90,
          unit: 'cm'
        },
        materials: ['Meşe Masif', 'Kumaş Döşeme'],
        featured: true
      },
      {
        name: 'Vitrin Dolabı',
        description: 'Camlı vitrin dolabı, LED aydınlatmalı.',
        basePrice: 9500,
        images: ['https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80'],
        category: createdCategories[2]._id,
        variants: [
          {
            name: 'Standart',
            options: [{ name: 'Renk', values: ['Ceviz'] }],
            stock: 6,
          }
        ],
        materials: ['Ahşap', 'Cam'],
        featured: false
      },

      // Çalışma Odası Ürünleri
      {
        name: 'Çalışma Masası',
        description: 'Geniş çalışma yüzeyi, çekmeceli modern çalışma masası.',
        basePrice: 7500,
        images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80'],
        category: createdCategories[3]._id,
        variants: [
          {
            name: '140cm',
            options: [{ name: 'Genişlik', values: ['140cm'] }],
            stock: 12,
          }
        ],
        dimensions: {
          width: 140,
          height: 75,
          depth: 70,
          unit: 'cm'
        },
        materials: ['MDF', 'Metal Ayak'],
        featured: false
      },
      {
        name: 'Ofis Koltuğu',
        description: 'Ergonomik, ayarlanabilir ofis koltuğu.',
        basePrice: 3500,
        discountedPrice: 3150,
        images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80'],
        category: createdCategories[3]._id,
        variants: [
          {
            name: 'Siyah',
            options: [{ name: 'Renk', values: ['Siyah'] }],
            stock: 20,
          }
        ],
        materials: ['Mesh Kumaş', 'Metal'],
        featured: true
      },
      {
        name: 'Kitaplık',
        description: '5 raflı, modern tasarım kitaplık.',
        basePrice: 4500,
        images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80'],
        category: createdCategories[3]._id,
        variants: [
          {
            name: 'Standart',
            options: [{ name: 'Renk', values: ['Beyaz', 'Ceviz'] }],
            stock: 10,
          }
        ],
        materials: ['MDF'],
        featured: false
      },
    ];

    // Add slug and SKU to all products
    const productsWithSlugAndSKU = products.map((product, index) => ({
      ...product,
      slug: product.slug || createSlug(product.name),
      sku: product.sku || createSKU(product.name, index + 1),
    }));

    const createdProducts = await Product.insertMany(productsWithSlugAndSKU);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('\n✨ Seeding completed successfully\n');
    console.log('📊 Summary:');
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
