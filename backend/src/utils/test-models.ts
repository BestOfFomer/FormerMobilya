/**
 * Test script to verify all Mongoose schemas are working
 * Run with: npx ts-node src/utils/test-models.ts
 */

import dotenv from 'dotenv';
import { connectDatabase } from '../config/database';
import { Category, User, Product, Order, UserRole, PaymentStatus, OrderStatus } from '../models';

dotenv.config();

const testModels = async () => {
  try {
    console.log('🧪 Testing Mongoose Models...\n');

    // Connect to database
    await connectDatabase();

    // Test 1: Category Model
    console.log('1️⃣  Testing Category Model...');
    const categoryData = {
      name: 'Test Koltuk Takımı',
      slug: 'test-koltuk-takimi', // Manually set (pre-save only runs on save())
      description: 'Test kategori açıklaması',
    };
    const category = new Category(categoryData);
    console.log(`   ✅ Category created with slug: "${category.slug}"`);

    // Test 2: User Model
    console.log('\n2️⃣  Testing User Model...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('TestPassword123!', 10);
    
    const userData = {
      name: 'Test User',
      email: 'test@formermobilya.com',
      passwordHash: hashedPassword,
      role: UserRole.CUSTOMER,
      phone: '5551234567',
      addresses: [
        {
          title: 'Ev',
          fullName: 'Test User',
          phone: '5551234567',
          city: 'İstanbul',
          district: 'Kadıköy',
          address: 'Test Sokak No:1',
          isDefault: true,
        },
      ],
    };
    const user = new User(userData);
    console.log(`   ✅ User created: ${user.email}`);
    console.log(`   ✅ Role: ${user.role}`);
    console.log(`   ✅ Addresses: ${user.addresses?.length}`);

    // Test 3: Product Model
    console.log('\n3️⃣  Testing Product Model...');
    const productData = {
      name: 'Modern Köşe Koltuk Takımı',
      slug: 'modern-kose-koltuk-takimi', // Manually set
      sku: 'PRD-TEST-001', // Manually set
      description: 'Şık ve konforlu modern köşe koltuk takımı',
      category: category._id,
      basePrice: 15000,
      discountedPrice: 12000,
      images: ['/uploads/test-image.jpg'],
      dimensions: {
        width: 250,
        height: 85,
        depth: 180,
        seatHeight: 45,
        unit: 'cm',
      },
      materials: ['Kumaş', 'Ahşap', 'Sünger'],
      variants: [
        {
          name: 'Gri Renk',
          options: [
            {
              name: 'Renk',
              values: ['Gri', 'Krem'],
            },
          ],
          stock: 10,
        },
      ],
      // slug and sku will be auto-generated
    };
    const product = new Product(productData);
    console.log(`   ✅ Product created: ${product.name}`);
    console.log(`   ✅ Slug: ${product.slug}`);
    console.log(`   ✅ SKU: ${product.sku}`);
    console.log(`   ✅ Effective Price: ${product.effectivePrice} TL`);
    console.log(`   ✅ Discount: ${product.discountPercentage}%`);
    console.log(`   ✅ Total Stock: ${product.totalStock}`);

    // Test 4: Order Model
    console.log('\n4️⃣  Testing Order Model...');
    const orderData = {
      orderNumber: 'FM1732396800123', // Manually set
      user: user._id,
      items: [
        {
          product: product._id,
          productName: product.name,
          productImage: product.images[0],
          quantity: 2,
          unitPrice: product.effectivePrice,
          totalPrice: product.effectivePrice * 2,
        },
      ],
      shippingAddress: {
        fullName: 'Test User',
        phone: '5551234567',
        city: 'İstanbul',
        district: 'Kadıköy',
        address: 'Test Sokak No:1',
      },
      subtotal: product.effectivePrice * 2,
      shippingCost: 50,
      totalAmount: product.effectivePrice * 2 + 50, // Manually calculated
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: 'credit_card',
      orderStatus: OrderStatus.PENDING,
    };
    const order = new Order(orderData);
    console.log(`   ✅ Order created: ${order.orderNumber}`);
    console.log(`   ✅ Total Amount: ${order.totalAmount} TL`);
    console.log(`   ✅ Payment Status: ${order.paymentStatus}`);
    console.log(`   ✅ Order Status: ${order.orderStatus}`);

    // Validation test
    console.log('\n5️⃣  Running Validation Tests...');
    await category.validate();
    console.log('   ✅ Category validation passed');
    
    await user.validate();
    console.log('   ✅ User validation passed');
    
    await product.validate();
    console.log('   ✅ Product validation passed');
    
    await order.validate();
    console.log('   ✅ Order validation passed');

    console.log('\n✅ All model tests passed successfully!\n');
    
    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.error('\n❌ Test failed:', error.message);
      if ('errors' in error) {
        console.error('Validation errors:', error);
      }
    }
    process.exit(1);
  }
};

testModels();
