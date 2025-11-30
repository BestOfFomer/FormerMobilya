/**
 * Quick test script to verify JWT and models are working
 * Run with: npx ts-node src/utils/test-auth.ts
 */

import dotenv from 'dotenv';
import { connectDatabase } from '../config/database';
import { User, UserRole } from '../models';
import { generateAccessToken, generateRefreshToken } from './jwt';
import bcrypt from 'bcryptjs';

dotenv.config();

const testAuth = async () => {
  try {
    console.log('🧪 Testing Auth System...\n');

    // Test 1: Database connection
    console.log('1️⃣  Testing MongoDB connection...');
    await connectDatabase();
    console.log('   ✅ MongoDB connected\n');

    // Test 2: JWT generation
    console.log('2️⃣  Testing JWT generation...');
    const testPayload = {
      userId: '507f1f77bcf86cd799439011',
      email: 'test@test.com',
      role: 'customer',
    };
    
    try {
      const accessToken = generateAccessToken(testPayload);
      const refreshToken = generateRefreshToken(testPayload);
      console.log('   ✅ Access token generated:', accessToken.substring(0, 50) + '...');
      console.log('   ✅ Refresh token generated:', refreshToken.substring(0, 50) + '...\n');
    } catch (error) {
      console.error('   ❌ JWT generation failed:', error);
      process.exit(1);
    }

    // Test 3: Password hashing
    console.log('3️⃣  Testing password hashing...');
    const password = 'Test123!';
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('   ✅ Password hashed:', passwordHash.substring(0, 30) + '...');
    const isValid = await bcrypt.compare(password, passwordHash);
    console.log('   ✅ Password comparison:', isValid ? 'PASS' : 'FAIL', '\n');

    // Test 4: User creation
    console.log('4️⃣  Testing User model...');
    const testEmail = `test-${Date.now()}@test.com`;
    
    try {
      const user = await User.create({
        name: 'Test User',
        email: testEmail,
        passwordHash,
        role: UserRole.CUSTOMER,
      });
      console.log('   ✅ User created:', user.email);
      console.log('   ✅ User ID:', user._id);
      console.log('   ✅ User role:', user.role);
      
      // Clean up
      await User.findByIdAndDelete(user._id);
      console.log('   ✅ User deleted (cleanup)\n');
    } catch (error) {
      console.error('   ❌ User creation failed:', error);
      process.exit(1);
    }

    console.log('✅ All auth tests passed!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
};

testAuth();
