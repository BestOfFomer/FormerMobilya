#!/bin/bash

# FormerMobilya API - Automated Test Script
# This script runs basic API tests using curl

BASE_URL="http://localhost:4000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 FormerMobilya API Automated Tests"
echo "======================================"
echo ""

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_endpoint() {
    local test_name=$1
    local expected_status=$2
    local response=$3
    
    TESTS_RUN=$((TESTS_RUN + 1))
    
    # Extract status code
    status=$(echo "$response" | tail -n1)
    
    if [ "$status" == "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $test_name (Status: $status)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC}: $test_name (Expected: $expected_status, Got: $status)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# 1. Health Check
echo "1. Testing Health Check..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
test_endpoint "Health Check" "200" "$response"
echo ""

# 2. API Info
echo "2. Testing API Info..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api")
test_endpoint "API Info" "200" "$response"
echo ""

# 3. Register Admin
echo "3. Testing Admin Registration..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Admin",
    "email": "testadmin@test.com",
    "password": "Admin123!",
    "role": "admin"
  }')

# Extract tokens from response body (before status code)
body=$(echo "$response" | sed '$d')
ACCESS_TOKEN=$(echo "$body" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

test_endpoint "Register Admin" "201" "$response"
echo ""

# 4. Login
echo "4. Testing Login..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testadmin@test.com",
    "password": "Admin123!"
  }')

body=$(echo "$response" | sed '$d')
ACCESS_TOKEN=$(echo "$body" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

test_endpoint "Login" "200" "$response"
echo ""

# 5. Get Profile (Protected)
echo "5. Testing Get Profile (Protected)..."
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
test_endpoint "Get Profile" "200" "$response"
echo ""

# 6. Create Category (Admin)
echo "6. Testing Create Category (Admin)..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/categories" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Kategori",
    "slug": "test-kategori",
    "description": "Test açıklama"
  }')

body=$(echo "$response" | sed '$d')
CATEGORY_ID=$(echo "$body" | grep -o '"_id":"[^"]*' | cut -d'"' -f4 | head -1)

test_endpoint "Create Category" "201" "$response"
echo ""

# 7. Get All Categories
echo "7. Testing Get All Categories..."
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/categories")
test_endpoint "Get All Categories" "200" "$response"
echo ""

# 8. Validation Test - Invalid Email
echo "8. Testing Validation - Invalid Email..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "password": "Test123!"
  }')
test_endpoint "Invalid Email Validation" "400" "$response"
echo ""

# 9. Validation Test - Weak Password
echo "9. Testing Validation - Weak Password..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@test.com",
    "password": "weak"
  }')
test_endpoint "Weak Password Validation" "400" "$response"
echo ""

# 10. Unauthorized Access Test
echo "10. Testing Unauthorized Access..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test"
  }')
test_endpoint "Unauthorized Access" "401" "$response"
echo ""

# Print Summary
echo ""
echo "======================================"
echo "📊 Test Summary"
echo "======================================"
echo -e "Total Tests: ${YELLOW}$TESTS_RUN${NC}"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed!${NC}"
    exit 1
fi
