/**
 * Test register endpoint directly (bypass HTTP)
 */
import dotenv from 'dotenv';
import { connectDatabase } from '../config/database';
import { register } from '../controllers/auth.controller';
import { Request, Response } from 'express';

dotenv.config();

const testRegister = async () => {
  try {
    await connectDatabase();

    const mockReq = {
      body: {
        name: 'Direct Test User',
        email: 'direct@test.com',
        password: 'Test123!',
      },
    } as Request;

    let statusCode = 0;

    const mockRes = {
      status: (code: number) => {
        statusCode = code;
        return mockRes;
      },
      json: (data: any) => {
        console.log('\n📤 Response Status:', statusCode);
        console.log('📤 Response Data:', JSON.stringify(data, null, 2));
      },
    } as unknown as Response;

    console.log('🧪 Testing register controller directly...\n');
    await register(mockReq, mockRes);

    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

testRegister();
