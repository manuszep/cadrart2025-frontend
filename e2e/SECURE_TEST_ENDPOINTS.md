# Secure Test Endpoints

The test endpoints (`/api/test/cleanup` and `/api/test/setup`) are now secured with multiple layers of protection:

## Security Features

### 1. Environment Protection
- **Completely disabled in production**: The endpoints return "Endpoint not found" (404) in production environments
- **Environment check**: Only available in development and test environments

### 2. Secret Token Authentication
- **Required header**: `x-test-secret` must be provided with the correct secret token
- **Configuration**: Set via `TEST_ENDPOINT_SECRET` environment variable
- **Default fallback**: Uses `dev-secret-key` if not configured (development only)

### 3. Guard Implementation
- **TestEndpointGuard**: Custom NestJS guard that validates both environment and secret token
- **Generic error messages**: Returns "Endpoint not found" instead of revealing endpoint existence

## Configuration

### Environment Variables
```bash
# Required for test endpoints to work
TEST_ENDPOINT_SECRET=your-secret-token-here

# Optional: Skip cleanup during tests
E2E_SKIP_CLEANUP=true
```

### Development Setup
```bash
# Set the secret token (use a strong, unique value)
export TEST_ENDPOINT_SECRET="your-development-secret-key"

# Setup test data
npm run setup:dev-data

# Run tests without cleanup
npm run e2e:dev
```

### Production Safety
- Test endpoints are completely disabled in production
- No secret token configuration needed in production
- Endpoints return generic "not found" errors

## Usage Examples

### Manual API Calls
```bash
# Setup test data
curl -X POST http://localhost:3000/api/test/setup \
  -H "x-test-secret: your-secret-token"

# Cleanup database
curl -X DELETE http://localhost:3000/api/test/cleanup \
  -H "x-test-secret: your-secret-token"
```

### Frontend Integration
The E2E test utilities automatically include the secret token:
- `ApiHelpers` class includes the token in all requests
- Setup script uses the environment variable
- Tests work seamlessly with proper configuration

## Security Benefits

1. **No information disclosure**: Endpoints appear non-existent to unauthorized users
2. **Environment isolation**: Production deployments are completely safe
3. **Secret-based access**: Only authorized tools/scripts can access test endpoints
4. **Audit trail**: All access requires the secret token
5. **Fail-safe**: Multiple layers of protection prevent accidental exposure

## Migration from Old System

The old environment-only check has been replaced with this more secure system. If you were using the test endpoints before:

1. Set the `TEST_ENDPOINT_SECRET` environment variable
2. Update any scripts to include the `x-test-secret` header
3. The endpoints will work exactly as before, but with enhanced security 
