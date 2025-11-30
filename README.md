# FormerMobilya E-Ticaret Platform

Modern, güvenli ve performanslı mobilya e-ticaret platformu.

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 6.0

### Kurulum ve Çalıştırma

**1. Backend**
```bash
cd backend
npm install
cp .env.example .env  # .env dosyasını düzenleyin
npm run dev
```

**2. Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local  # .env.local dosyasını düzenleyin
npm run dev
```

**3. Tarayıcıda Açın**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Admin Panel: http://localhost:3000/admin

---

## 🔐 Varsayılan Admin Bilgileri

```
Email: admin@formermobilya.com
Şifre: Admin123!
```

> ⚠️ **ÖNEMLİ:** Production'da mutlaka değiştirin!

---

## ✨ Yeni Özellikler

### 3D Model Desteği
- Ürünlere 3D model eklenebilir (.glb/.gltf)
- Admin panelde "3D Model (Opsiyonel)" bölümünden yükleme
- Customer sayfasında interaktif 3D görüntüleyici
- AR mode desteği (mobil cihazlar)
- Manuel boyut gösterimi (width, height, depth)

---

## 📁 Proje Yapısı

```
FormerMobilya/
├── backend/                    # Express.js API Server
│   ├── src/
│   │   ├── models/            # Mongoose models (Category, Product, User, Order)
│   │   ├── routes/            # API routes (/api/auth, /api/products, etc.)
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── utils/             # Helper functions
│   │   └── config/            # Configuration files
│   ├── uploads/               # User uploaded files (product images)
│   ├── .env                   # Environment variables (NOT in git)
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                   # Next.js Application
│   ├── app/                   # Next.js App Router
│   │   ├── (customer)/        # Customer-facing pages
│   │   │   ├── page.tsx       # Ana sayfa
│   │   │   ├── kategoriler/   # Kategori sayfaları
│   │   │   ├── urun/          # Ürün detay sayfaları
│   │   │   ├── sepet/         # Sepet
│   │   │   └── odeme/         # Checkout
│   │   └── admin/             # Admin panel
│   │       ├── layout.tsx     # Admin layout
│   │       ├── page.tsx       # Dashboard
│   │       ├── products/      # Ürün yönetimi
│   │       ├── categories/    # Kategori yönetimi
│   │       └── orders/        # Sipariş yönetimi
│   ├── components/            # Reusable React components
│   │   ├── ui/                # Shadcn/UI components
│   │   ├── layout/            # Header, Footer, Navbar
│   │   └── shared/            # Shared components
│   ├── lib/                   # Utilities & helpers
│   ├── store/                 # Zustand stores
│   ├── public/                # Static assets
│   ├── .env.local             # Environment variables (NOT in git)
│   ├── .env.example           # Environment variables template
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
│
├── docs/                       # Documentation
│   └── api/                   # API documentation
│
├── .gitignore
├── TECH_STACK.md              # Technology stack documentation
└── README.md                  # This file
```

## 🚀 Teknoloji Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (Access + Refresh tokens)
- **Language:** TypeScript

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** Shadcn/UI + Radix UI
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Language:** TypeScript

### Infrastructure
- **Hosting:** Hostinger Cloud Professional
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx
- **SSL:** Let's Encrypt
- **Payment:** Iyzico

Detaylı teknoloji dokümantasyonu için: [TECH_STACK.md](./TECH_STACK.md)

## 📋 Gereksinimler

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 6.0

## 🛠️ Kurulum

### 1. Repository'yi klonla
```bash
git clone <repo-url>
cd FormerMobilya
```

### 2. Backend kurulumu
```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenle
npm run dev
```

### 3. Frontend kurulumu
```bash
cd frontend
npm install
cp .env.example .env.local
# .env.local dosyasını düzenle
npm run dev
```

## 🔧 Development

### Backend (Express API)
```bash
cd backend
npm run dev        # Development mode (nodemon)
npm run build      # TypeScript build
npm start          # Production mode
```

**API:** http://localhost:4000

### Frontend (Next.js)
```bash
cd frontend
npm run dev        # Development mode
npm run build      # Production build
npm start          # Production mode
```

**Web:** http://localhost:3000

## 🌐 Environment Variables

### Backend (.env)
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

# Iyzico Payment
IYZICO_API_KEY=your-api-key
IYZICO_SECRET_KEY=your-secret-key
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,webp
```

### Frontend (.env.local)
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:4000

# Other public vars
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📦 Deployment

### Hostinger Deployment
```bash
# 1. Backend deployment
cd backend
npm install
npm run build
pm2 start dist/index.js --name backend-api

# 2. Frontend deployment
cd frontend
npm install
npm run build
pm2 start npm --name next-client -- start

# 3. Nginx configuration
sudo nano /etc/nginx/sites-available/formermobilya.com
sudo ln -s /etc/nginx/sites-available/formermobilya.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 4. SSL Certificate
sudo certbot --nginx -d formermobilya.com -d www.formermobilya.com
```

Detaylı deployment guide için: `docs/deployment.md` (ileride eklenecek)

## 🔒 Güvenlik

- ✅ OWASP Top 10 compliance
- ✅ PCI DSS payment security
- ✅ KVKK data privacy
- ✅ HTTPS/TLS encryption
- ✅ Rate limiting
- ✅ Input validation & sanitization
- ✅ JWT authentication
- ✅ bcrypt password hashing

Detaylı güvenlik checklist: Task listesinde

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 📝 Git Workflow

### Branch Strategy
- `main` - Production
- `develop` - Development/Staging
- `feature/*` - Feature branches
- `bugfix/*` - Bug fixes
- `hotfix/*` - Production hotfixes

### Commit Convention
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code formatting
refactor: Code refactoring
test: Add tests
chore: Maintenance
```

## 👥 Team

- **Proje Sahibi:** FormerMobilya
- **Development:** [Your Name]

## 📄 License

Proprietary - FormerMobilya © 2025

## 🔗 Links

- **Production:** https://formermobilya.com (yakında)
- **Staging:** https://staging.formermobilya.com (yakında)
- **API Docs:** http://localhost:4000/api/docs (yakında)

---

**Proje Durumu:** ✅ MVP Tamamlandı - Production Ready

Last Updated: 2025-11-30
