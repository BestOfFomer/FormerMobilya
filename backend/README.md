# FormerMobilya Backend API

Express.js + MongoDB + TypeScript backend server.

## 📁 Klasör Yapısı

```
backend/
├── src/
│   ├── models/              # Mongoose models
│   │   ├── Category.ts      # Kategori modeli
│   │   ├── Product.ts       # Ürün modeli
│   │   ├── User.ts          # Kullanıcı modeli
│   │   └── Order.ts         # Sipariş modeli
│   │
│   ├── routes/              # Express routes
│   │   ├── auth.routes.ts   # /api/auth
│   │   ├── category.routes.ts # /api/categories
│   │   ├── product.routes.ts  # /api/products
│   │   ├── order.routes.ts    # /api/orders
│   │   └── upload.routes.ts   # /api/upload
│   │
│   ├── controllers/         # Route handlers
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   ├── product.controller.ts
│   │   ├── order.controller.ts
│   │   └── upload.controller.ts
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.ts      # JWT verification
│   │   ├── admin.middleware.ts     # Admin role check
│   │   ├── validate.middleware.ts  # Input validation
│   │   ├── error.middleware.ts     # Error handler
│   │   └── rateLimiter.middleware.ts # Rate limiting
│   │
│   ├── utils/               # Helper functions
│   │   ├── logger.ts        # Winston logger
│   │   ├── token.ts         # JWT utilities
│   │   └── validators.ts    # Zod schemas
│   │
│   ├── config/              # Configuration
│   │   ├── database.ts      # MongoDB connection
│   │   └── iyzico.ts        # Payment config
│   │
│   └── index.ts             # Entry point
│
├── uploads/                 # Uploaded files
│   └── .gitkeep
│
├── .env                     # Environment variables (NOT in git)
├── .env.example             # Environment template
├── package.json
├── tsconfig.json
└── README.md                # This file
```

## 🚀 Kurulum

### 1. Dependencies Yükle
```bash
npm install
```

### 2. Environment Variables
```bash
cp .env.example .env
# .env dosyasını düzenle
```

### 3. MongoDB Başlat
```bash
# Local MongoDB
mongod

# Veya MongoDB Atlas kullan
```

### 4. Development Server
```bash
npm run dev
```

API: http://localhost:4000

## 📦 Scripts

```bash
npm run dev          # Development mode (nodemon + ts-node)
npm run build        # TypeScript build
npm start            # Production mode
npm test             # Run tests
npm run lint         # ESLint
npm run format       # Prettier
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Giriş yap
- `POST /api/auth/refresh` - Token yenile
- `GET /api/auth/me` - Profil bilgisi

### Categories
- `GET /api/categories` - Tüm kategoriler
- `GET /api/categories/:slug` - Kategori detay
- `POST /api/categories` - Yeni kategori (Admin)
- `PUT /api/categories/:id` - Kategori güncelle (Admin)
- `DELETE /api/categories/:id` - Kategori sil (Admin)

### Products
- `GET /api/products` - Ürün listesi (filter, sort, pagination)
- `GET /api/products/:slug` - Ürün detay
- `POST /api/products` - Yeni ürün (Admin)
- `PUT /api/products/:id` - Ürün güncelle (Admin)
- `DELETE /api/products/:id` - Ürün sil (Admin)

### Orders
- `GET /api/orders` - Kullanıcının siparişleri
- `GET /api/orders/:id` - Sipariş detay
- `POST /api/orders` - Yeni sipariş
- `PUT /api/orders/:id/status` - Sipariş durumu güncelle (Admin)

### Upload
- `POST /api/upload` - Dosya yükle (Admin)

### Payment
- `POST /api/payments/init` - Ödeme başlat
- `POST /api/payments/callback` - Ödeme callback

## 🔒 Güvenlik

- ✅ Helmet.js - Security headers
- ✅ Rate limiting - Brute force protection
- ✅ CORS - Origin whitelist
- ✅ JWT - Stateless authentication
- ✅ bcrypt - Password hashing (10 rounds)
- ✅ mongo-sanitize - NoSQL injection protection
- ✅ express-validator - Input validation
- ✅ hpp - HTTP parameter pollution

## 🧪 Testing

```bash
# Unit tests
npm test

# Coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📝 Environment Variables

```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/formermobilya

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Iyzico
IYZICO_API_KEY=sandbox-xxx
IYZICO_SECRET_KEY=sandbox-xxx
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,webp

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 🚀 Deployment

### PM2 ile Production
```bash
npm run build
pm2 start dist/index.js --name backend-api
pm2 save
pm2 startup
```

### Logs
```bash
pm2 logs backend-api
```

## 📚 Tech Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Language:** TypeScript
- **Auth:** JWT
- **Validation:** Zod + Express-validator
- **Logging:** Winston
- **Payment:** Iyzico

---

Last Updated: 2025-11-23
