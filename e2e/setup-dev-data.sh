#!/bin/bash

# Development script to set up test data without cleanup
# Run with: ./e2e/setup-dev-data.sh

echo "Setting up development test data..."

# Setup test data using the test endpoint
response=$(curl -s -X POST http://localhost:3000/api/test/setup -H "x-test-secret: ${TEST_ENDPOINT_SECRET:-dev-secret-key}")

if [ $? -eq 0 ]; then
    echo "✅ Test data setup successfully!"
    echo ""
    echo "🔑 Login credentials:"
    echo "  Email: test@test.com"
    echo "  Password: testPassword123!"
    echo ""
    echo "💡 To prevent cleanup during tests, run:"
    echo "   npm run e2e:dev"
else
    echo "❌ Failed to setup test data"
    exit 1
fi
