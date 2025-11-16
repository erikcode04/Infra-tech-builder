// Simple test script to check database connection
// Run with: node -r ts-node/register test-db-connection.ts

import { testConnection } from './utils/db';

async function runTest() {
    console.log('🔍 Testing MongoDB connection...');

    const result = await testConnection();

    if (result.success) {
        console.log('✅ Database connection test passed!');
        console.log(`📝 ${result.message}`);
    } else {
        console.log('❌ Database connection test failed!');
        console.log(`📝 ${result.message}`);
    }

    process.exit(result.success ? 0 : 1);
}

runTest();