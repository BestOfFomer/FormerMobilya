# FormerMobilya E-Ticaret - Teknoloji Stack Dokümanı

## 📋 Proje Özeti

**Proje Adı:** FormerMobilya E-Ticaret MVP  
**Proje Tipi:** Full-Stack E-Ticaret Platformu (Mobilya)  
**Mimari:** Monorepo (Backend + Frontend ayrı servisler)  
**Deployment:** Hostinger Cloud Professional  

---

## 🎯 Teknoloji Kararları ve Gerekçeleri

### Frontend

#### **Framework: Next.js 15 (App Router)**
- **Neden?**
  - Server-Side Rendering (SSR) → SEO optimizasyonu için kritik
  - Static Generation → Kategori sayfaları için performans
  - Image Optimization → Mobilya görselleri için önemli
  - API Routes → BFF (Backend for Frontend) pattern
  - File-based routing → Kolay sayfa yönetimi
  - Built-in TypeScript support

#### **UI Framework: Shadcn/UI**
- **Neden?**
  - Radix UI tabanlı → Accessibility out of the box
  - Headless components → Tam kontrol
  - Copy-paste approach → Vendor lock-in yok
  - Tailwind CSS ile mükemmel entegrasyon
  - Modern, premium görünüm

#### **Styling: Tailwind CSS**
- **Neden?**
  - Utility-first → Hızlı development
  - Shadcn/UI ile native entegrasyon
  - Purge → Minimal bundle size
  - Responsive design → Mobile-first approach
  - Dark mode desteği

#### **State Management: Zustand**
- **Neden?**
  - Minimal boilerplate (Redux'a göre)
  - TypeScript desteği excellent
  - Performans → Re-render optimization
  - Persist middleware → localStorage integration
  - Next.js App Router uyumlu

#### **Language: TypeScript**
- **Neden?**
  - Type safety → Runtime hataları önler
  - IDE autocomplete → Developer experience
  - Refactoring güvenliği
  - Team scalability → Kod okunabilirliği
  - Industry standard

---

### Backend

#### **Runtime: Node.js (v18+)**
- **Neden?**
  - JavaScript/TypeScript → Frontend ile aynı dil
  - npm ecosystem → Zengin paket desteği
  - Async I/O → E-ticaret için yeterli performans
  - Hosting desteği → Hostinger compatible

#### **Framework: Express.js**
- **Neden?**
  - Minimal, unopinionated → Esneklik
  - Mature ecosystem → Middleware zenginliği
  - Kolay öğrenme eğrisi
  - Production-ready
  - Lightweight → Resource-efficient

#### **Database: MongoDB + Mongoose**
- **Neden?**
  - Schema flexibility → Ürün varyasyonları için ideal
  - JSON-like documents → JavaScript objelerine yakın
  - Horizontal scaling → İleride gerekirse
  - Mongoose → Schema validation, population
  - Atlas → Cloud backup options

#### **Authentication: JWT (JSON Web Tokens)**
- **Neden?**
  - Stateless → Horizontal scaling için uygun
  - Access + Refresh token pattern → Güvenlik
  - Self-contained → Database query gerekmez
  - Industry standard
  - Mobile app ile uyumlu (ileride)

---

### Ödeme Entegrasyonu

#### **Payment Gateway: PayTR veya Iyzico**
- **PayTR:**
  - ✅ Türkiye'de yaygın
  - ✅ Kolay entegrasyon
  - ✅ Düşük komisyon
  - ❌ Dokümantasyon orta seviye

- **Iyzico:**
  - ✅ Excellent dokümantasyon
  - ✅ PCI DSS Level 1 certified
  - ✅ 3D Secure support
  - ✅ Test environment robust
  - ❌ Daha yüksek komisyon

**Karar:** MVP için **Iyzico** (güvenlik ve dokümantasyon önceliği)

---

### Deployment & Infrastructure

#### **Hosting: Hostinger Cloud Professional**
- **Specs:**
  - 4 vCPU
  - 6 GB RAM
  - SSD Storage
  - **Yeterli mi?** ✅ MVP için yeterli (1000+ günlük ziyaretçi)

#### **Process Manager: PM2**
- **Neden?**
  - Auto-restart → Crash recovery
  - Load balancing → Multi-core utilization
  - Monitoring → Real-time metrics
  - Log management → Centralized logging
  - Zero-downtime deployment

#### **Reverse Proxy: Nginx**
- **Neden?**
  - High performance → Static asset serving
  - Load balancing → Backend instances
  - SSL/TLS termination
  - Gzip compression
  - Routing: `/api/*` → Express, `/` → Next.js

#### **SSL Certificate: Let's Encrypt**
- **Neden?**
  - Free
  - Auto-renewal (certbot)
  - Trusted CA
  - Wildcard support

---

## 📦 Dependencies (Ana Paketler)

### Backend Dependencies
```json
{
  "express": "^4.19.0",
  "mongoose": "^8.0.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.4.0",
  "multer": "^1.4.5-lts.1",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.0",
  "express-mongo-sanitize": "^2.2.0",
  "express-validator": "^7.0.0",
  "hpp": "^0.2.3",
  "winston": "^3.11.0",
  "morgan": "^1.10.0",
  "sharp": "^0.33.0"
}
```

### Frontend Dependencies
```json
{
  "next": "^15.0.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "zustand": "^4.4.0",
  "zod": "^3.22.0",
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-*": "latest",
  "lucide-react": "^0.300.0",
  "react-hook-form": "^7.49.0",
  "axios": "^1.6.0"
}
```

---

## 🏗️ Mimari Kararlar

### Servis Ayrımı
```
┌─────────────────────────────────────┐
│          CLIENT (Browser)           │
└──────────────┬──────────────────────┘
               │ HTTPS (443)
               ▼
┌──────────────────────────────────────┐
│           NGINX (Reverse Proxy)       │
│  - SSL Termination                    │
│  - Routing                            │
│  - Static Assets                      │
└───┬──────────────────────┬───────────┘
    │                      │
    │ /api/*               │ /*
    ▼                      ▼
┌──────────┐      ┌─────────────────┐
│ Express  │      │    Next.js      │
│   API    │      │  (Port 3000)    │
│(Port 4000)│     │  - Customer     │
│          │      │  - Admin(/admin)│
└────┬─────┘      └─────────────────┘
     │
     ▼
┌──────────┐
│ MongoDB  │
│(Port 27017)│
└──────────┘
```

### Authentication Flow
```
1. User login → POST /api/auth/login
2. Backend validates → bcrypt compare
3. Generate tokens:
   - Access Token (15min, localStorage)
   - Refresh Token (7d, httpOnly cookie)
4. Frontend stores access token
5. API requests → Authorization: Bearer <token>
6. Token expired? → Refresh endpoint
```

### File Upload Flow
```
1. Admin upload → Multer middleware
2. File validation (type, size)
3. Sharp → Resize/Compress
4. Save to /uploads
5. Return URL → Store in MongoDB
6. Nginx serves → /uploads/* → Static files
```

---

## 🔒 Güvenlik Kararları

### Authentication
- ✅ bcrypt (10 rounds)
- ✅ JWT with short expiry
- ✅ Refresh token rotation
- ✅ Password complexity validation

### API Security
- ✅ Helmet.js → Security headers
- ✅ Rate limiting → Brute force protection
- ✅ CORS → Whitelist only
- ✅ Input validation → Zod/Express-validator
- ✅ NoSQL injection → mongo-sanitize

### Data Security
- ✅ HTTPS/TLS → Encryption in transit
- ✅ Environment variables → No hardcoded secrets
- ✅ MongoDB authentication
- ✅ Backup strategy

### Payment Security
- ✅ PCI DSS compliant gateway (Iyzico)
- ✅ No credit card storage
- ✅ Webhook signature validation
- ✅ HTTPS mandatory

---

## 📊 Performans Hedefleri

### Frontend
- **Lighthouse Score:** > 90 (Performance, SEO, Accessibility)
- **First Contentful Paint (FCP):** < 1.5s
- **Time to Interactive (TTI):** < 3s
- **Core Web Vitals:**
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

### Backend
- **API Response Time:** < 200ms (avg)
- **Database Query Time:** < 50ms (avg)
- **Concurrent Users:** 100+ (MVP yeterli)
- **Uptime:** > 99.5%

---

## 🎨 UI/UX Kararları

### Design System
- **Renk Paleti:** Modern, vibrant colors (dark mode first)
- **Typography:** Inter/Outfit (Google Fonts)
- **Components:** Shadcn/UI → Consistent
- **Icons:** Lucide React → Modern, clean
- **Spacing:** Tailwind scale (4px base)

### Responsive Breakpoints (Tailwind)
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px
- **Wide:** > 1280px

### Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast > 4.5:1

---

## 🧪 Testing Strategy

### Backend
- **Unit Tests:** Jest (controller, model logic)
- **Integration Tests:** Supertest (API endpoints)
- **Security Tests:** OWASP ZAP (automated scanning)

### Frontend
- **Component Tests:** Jest + React Testing Library
- **E2E Tests:** Playwright (critical flows)
- **Visual Tests:** Chromatic (optional)

### Manual Testing
- Cross-browser (Chrome, Safari, Firefox)
- Mobile responsiveness
- Payment flow (test mode)

---

## 📈 Scalability Plan (Post-MVP)

### Horizontal Scaling
- Load balancer (Nginx/HAProxy)
- Multiple Express instances (PM2 cluster mode)
- MongoDB replica set
- CDN (Cloudflare) → Static assets

### Caching
- Redis → Session, frequent queries
- Next.js ISR → Kategori/ürün sayfaları
- API response caching → 5-15 dakika

### Monitoring
- PM2 monitoring
- Application logs (Winston)
- Uptime monitoring (UptimeRobot)
- Error tracking (Sentry - optional)

---

## 📝 Developer Workflow

### Version Control
- **Git:** GitHub/GitLab
- **Branch Strategy:** 
  - `main` → Production
  - `develop` → Staging
  - `feature/*` → Feature branches
- **Commit Convention:** Conventional Commits

### CI/CD (İleride)
- GitHub Actions / GitLab CI
- Automated tests on PR
- Auto-deploy to staging

### Code Quality
- ESLint + Prettier
- Husky → Pre-commit hooks
- TypeScript strict mode

---

## 🎯 MVP Kapsamı (5 Hafta)

### ✅ İçinde Olanlar
- Kategori & Ürün yönetimi (CRUD)
- Admin panel (Shadcn/UI)
- Müşteri arayüzü (Katalog odaklı)
- Sepet & Checkout
- Ödeme entegrasyonu (Iyzico)
- Sipariş yönetimi
- Responsive design
- SEO optimization
- Güvenlik (OWASP compliance)
- SSL/HTTPS

### ❌ İçinde Olmayanlar (Post-MVP)
- Kullanıcı yorumları & puanlama
- Wishlist/Favoriler
- Email/SMS bildirimleri
- Kargo entegrasyonu
- Blog/İçerik yönetimi
- Multi-language support
- Kampanya/Kupon sistemi
- Advanced analytics

---

## 📞 İletişim & Destek

**Proje Sahibi:** FormerMobilya  
**Development Stack Owner:** [Your Name]  
**Dokümantasyon Tarihi:** 2025-11-23  
**Versiyon:** 1.0.0  

---

> **Not:** Bu dokümantasyon MVP sürecinde güncellenecektir. Tüm major kararlar bu dokümanda loglanmalıdır.
