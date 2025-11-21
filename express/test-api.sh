#!/bin/bash

echo "=== Testing Infra Express Server Controller/Services Architecture ==="
echo ""

BASE_URL="http://localhost:3001"

echo "1. Testing server status:"
curl -s "$BASE_URL/" | head -c 200
echo -e "\n\n"

echo "2. Testing user creation (Public endpoint):"
curl -s -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}' | head -c 200
echo -e "\n\n"

echo "3. Testing admin endpoint WITHOUT authorization (should fail):"
curl -s "$BASE_URL/api/users" | head -c 200
echo -e "\n\n"

echo "4. Testing admin endpoint WITH authorization:"
curl -s "$BASE_URL/api/users" \
  -H "Authorization: Bearer admin-token" \
  -H "x-user-role: admin" | head -c 200
echo -e "\n\n"

echo "5. Testing OpenAPI documentation:"
curl -s "$BASE_URL/openapi" | head -c 200
echo -e "\n\n"

echo "=== Tests Complete ==="