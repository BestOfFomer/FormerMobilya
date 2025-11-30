# FormerMobilya API - Test Suite Documentation

## Test Environment Setup

### Prerequisites
- MongoDB running on localhost:27017
- Backend server running on localhost:4000
- Postman or curl for API testing

### Test Data
- Admin Email: `admin@formermobilya.com`
- Admin Password: `Admin123!`
- Test Category: Koltuk Takımları
- Test Product: Modern Köşe Koltuk

---

## 1. Authentication Tests

### ✅ Test 1.1: Register Customer
**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "Test Customer",
  "email": "customer@test.com",
  "password": "TestPass123!"
}
```

**Expected:**
- Status: 201 Created
- Response contains: user object, accessToken, refreshToken
- User role should be "customer"

**Actual Result:** ✅ PASS

---

### ✅ Test 1.2: Register Admin
**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "Admin User",
  "email": "admin@formermobilya.com",
  "password": "Admin123!",
  "role": "admin"
}
```

**Expected:**
- Status: 201 Created
- User role should be "admin"

**Actual Result:** ✅ PASS

---

### ✅ Test 1.3: Login
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "admin@formermobilya.com",
  "password": "Admin123!"
}
```

**Expected:**
- Status: 200 OK
- Response contains: user, accessToken, refreshToken

**Actual Result:** ✅ PASS

---

### ✅ Test 1.4: Get Profile
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Expected:**
- Status: 200 OK
- Response contains user profile with addresses

**Actual Result:** ✅ PASS

---

## 2. Category CRUD Tests

### ✅ Test 2.1: Create Category (Admin)
**Endpoint:** `POST /api/categories`

**Headers:**
```
Authorization: Bearer {adminAccessToken}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Koltuk Takımları",
  "slug": "koltuk-takimlari",
  "description": "Modern ve klasik koltuk takımları"
}
```

**Expected:**
- Status: 201 Created
- Response contains category with auto-generated _id

**Actual Result:** ✅ PASS

---

### ✅ Test 2.2: Get All Categories
**Endpoint:** `GET /api/categories`

**Expected:**
- Status: 200 OK
- Response contains array of categories

**Actual Result:** ✅ PASS

---

### ✅ Test 2.3: Get Category by Slug
**Endpoint:** `GET /api/categories/koltuk-takimlari`

**Expected:**
- Status: 200 OK
- Response contains category details

**Actual Result:** ✅ PASS

---

## 3. Product CRUD Tests

### ✅ Test 3.1: Create Product (Admin)
**Endpoint:** `POST /api/products`

**Headers:**
```
Authorization: Bearer {adminAccessToken}
```

**Request:**
```json
{
  "name": "Modern Köşe Koltuk",
  "slug": "modern-kose-koltuk",
  "sku": "PRD-001",
  "description": "Şık ve konforlu modern köşe koltuk takımı",
  "category": "{categoryId}",
  "basePrice": 15000,
  "discountedPrice": 12000,
  "images": ["/uploads/product-1.jpg"],
  "dimensions": {
    "width": 250,
    "height": 85,
    "depth": 180,
    "seatHeight": 45
  },
  "materials": ["Kumaş", "Ahşap", "Sünger"],
  "variants": [
    {
      "name": "Gri",
      "options": [{"name": "Renk", "values": ["Gri"]}],
      "stock": 10
    }
  ]
}
```

**Expected:**
- Status: 201 Created
- Product with virtuals (effectivePrice, discountPercentage)

**Actual Result:** ✅ PASS

---

### ✅ Test 3.2: Get Products with Filters
**Endpoint:** `GET /api/products?category={id}&minPrice=10000&maxPrice=20000`

**Expected:**
- Status: 200 OK
- Filtered products array
- Pagination info (page, totalPages)

**Actual Result:** ✅ PASS

---

### ✅ Test 3.3: Search Products
**Endpoint:** `GET /api/products?search=koltuk`

**Expected:**
- Status: 200 OK
- Products matching search term

**Actual Result:** ✅ PASS

---

## 4. Order Tests

### ✅ Test 4.1: Create Order
**Endpoint:** `POST /api/orders`

**Headers:**
```
Authorization: Bearer {customerAccessToken}
```

**Request:**
```json
{
  "items": [
    {
      "product": "{productId}",
      "productName": "Modern Köşe Koltuk",
      "productImage": "/uploads/product-1.jpg",
      "quantity": 1,
      "unitPrice": 12000,
      "totalPrice": 12000
    }
  ],
  "shippingAddress": {
    "fullName": "Test User",
    "phone": "5551234567",
    "city": "İstanbul",
    "district": "Kadıköy",
    "address": "Test Sokak No:1"
  },
  "subtotal": 12000,
  "shippingCost": 50
}
```

**Expected:**
- Status: 201 Created
- Order with auto-generated orderNumber
- totalAmount calculated (12050)

**Actual Result:** ✅ PASS

---

## 5. Security Tests

### ✅ Test 5.1: Invalid Email Validation
**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "Test",
  "email": "invalid-email",
  "password": "Test123!"
}
```

**Expected:**
- Status: 400 Bad Request
- Validation error: "Invalid email address"

**Actual Result:** ✅ PASS

---

### ✅ Test 5.2: Weak Password Validation
**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "Test",
  "email": "test@test.com",
  "password": "weak"
}
```

**Expected:**
- Status: 400 Bad Request
- Multiple validation errors (length, uppercase, number, special char)

**Actual Result:** ✅ PASS

---

### ✅ Test 5.3: Unauthorized Access
**Endpoint:** `POST /api/categories`

**No Authorization Header**

**Expected:**
- Status: 401 Unauthorized

**Actual Result:** ✅ PASS

---

### ✅ Test 5.4: Rate Limiting (Auth)
**Test:** Send 6 login requests within 1 minute

**Expected:**
- First 5: Status 200 or 401
- 6th request: Status 429 Too Many Requests

**Actual Result:** ⏳ TO TEST

---

### ✅ Test 5.5: NoSQL Injection Attempt
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": {"$gt": ""},
  "password": {"$gt": ""}
}
```

**Expected:**
- Status: 400 Bad Request (validation fails)
- OR Status: 401 Unauthorized (mongo-sanitize blocks)

**Actual Result:** ⏳ TO TEST

---

### ✅ Test 5.6: XSS Attempt
**Endpoint:** `POST /api/categories`

**Request:**
```json
{
  "name": "<script>alert('XSS')</script>",
  "slug": "xss-test"
}
```

**Expected:**
- Script should be sanitized/escaped
- Should NOT execute JavaScript

**Actual Result:** ⏳ TO TEST

---

## 6. File Upload Tests

### Test 6.1: Upload Single Image (Admin)
**Endpoint:** `POST /api/upload/image`

**Type:** multipart/form-data

**Expected:**
- Status: 200 OK
- Image optimized to WebP
- Max 1200px dimensions

**Actual Result:** ⏳ TO TEST

---

### Test 6.2: Upload Invalid File Type
**Endpoint:** `POST /api/upload/image`

**Upload:** .pdf file

**Expected:**
- Status: 400 Bad Request
- Error: "Invalid file type"

**Actual Result:** ⏳ TO TEST

---

### Test 6.3: Upload File Too Large
**Endpoint:** `POST /api/upload/image`

**Upload:** >5MB image

**Expected:**
- Status: 413 Payload Too Large

**Actual Result:** ⏳ TO TEST

---

## Test Checklist Status

✅ = Tested & Passed  
⏳ = Pending  
❌ = Failed

| Category | Test | Status |
|----------|------|--------|
| Auth | Register Customer | ✅ |
| Auth | Register Admin | ✅ |
| Auth | Login | ✅ |
| Auth | Get Profile | ✅ |
| Auth | Refresh Token | ⏳ |
| Category | Create | ✅ |
| Category | Get All | ✅ |
| Category | Get by Slug | ✅ |
| Category | Update | ⏳ |
| Category | Delete | ⏳ |
| Product | Create | ✅ |
| Product | Get All | ✅ |
| Product | Filter | ✅ |
| Product | Search | ✅ |
| Product | Update | ⏳ |
| Product | Delete | ⏳ |
| Order | Create | ✅ |
| Order | Get My Orders | ⏳ |
| Order | Get by ID | ⏳ |
| Order | Admin: Get All | ⏳ |
| Order | Admin: Update Status | ⏳ |
| Security | Invalid Email | ✅ |
| Security | Weak Password | ✅ |
| Security | Unauthorized | ✅ |
| Security | Rate Limiting | ⏳ |
| Security | NoSQL Injection | ⏳ |
| Security | XSS Attack | ⏳ |
| Upload | Single Image | ⏳ |
| Upload | Invalid Type | ⏳ |
| Upload | File Too Large | ⏳ |

---

## Summary

**Total Tests:** 30  
**Passed:** 15  
**Pending:** 15  
**Failed:** 0

**Pass Rate:** 50% (initial automated tests)

---

## Next Steps for Complete Testing

1. Complete manual security testing (rate limiting, injection attacks)
2. Test file upload functionality with actual files
3. Test all UPDATE and DELETE operations
4. Test edge cases and error scenarios
5. Performance testing with concurrent requests
6. Integration testing with frontend (Week 2)
