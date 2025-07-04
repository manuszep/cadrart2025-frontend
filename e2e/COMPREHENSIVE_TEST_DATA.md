# Comprehensive Test Data for E2E Tests

## Overview

This document describes the comprehensive test data setup that has been implemented for the cadrart2025 E2E tests, based on the actual database structure from the `atelier-cadrart.sql` dump.

## What Was Implemented

### 1. Backend Test Endpoints

The backend test controller (`/api/test/setup` and `/api/test/cleanup`) now creates comprehensive test data including:

#### Test User
- **Email**: `test@test.com`
- **Password**: `testPassword123!`
- **Name**: Test User
- **Image**: default

#### Formulas (6 total)
- Surcout initial: `0:+15;3:*2`
- Cout initial: `0:+20`
- decoupe verre SP: `0:+12`
- Decoupe PP: `0:+7`
- PP: `0:+0`
- Fond: `0:+3;1:*1.2`

#### Providers (5 total)
- **Cami**: orders@cami-nv.com (Belgium)
- **Eurolijsten**: luk.soetaert@eurolijsten.be (Belgium)
- **Wybenga**: info@glashandelwybenga.nl (Netherlands)
- **Molgra**: info@molgra.com (Spain)
- **Montxo**: ventas@montxooiarbide.com (Spain)

#### Tags (5 total)
- Gallerie
- Particulier
- Société
- Artiste
- Ambassade

#### Locations (12 total)
- R1, R2, R3, R4, R5, R6, R7
- Rouleau / ici
- 68
- ici
- couloir
- sous la table d'Éric

#### Articles (12 total)
Realistic articles from the actual database:

1. **157 - pl 20 x 20 noir** - €48.45 (Wood, Cami)
2. **919 - decoupe PP bis** - €1 (Pass, No provider)
3. **sp70 - verre antireflets / anti UV 70%** - €183 (Glass, Cami)
4. **9 - verre 2mm** - €40 (Glass, Wybenga)
5. **3b - peindre couleur** - €110 (Assembly, No provider)
6. **31 - biseau couleur** - €15 (Assembly, No provider)
7. **carton a biseau** - €10 (Cardboard, No provider)
8. **19 - PP coupe droite** - €12 (Assembly, No provider)
9. **l blanc** - €34 (Assembly, Molgra)
10. **Chassis mdf 18** - €5 (Assembly, Cami)
11. **CA110** - €32.03 (Cardboard, Eurolijsten)
12. **ch 10 x 20 chêne** - €0 (Wood, Molgra)

#### Clients (5 total)
- **Cadr'Art** (Stanislas Drzemala) - Artiste tag
- **Le salon d'art** (Jean Marchetti) - Gallerie tag
- **dix sprl** (Lionel Esteve) - Artiste tag
- **Galerie Almine Rech** (Almine Rech) - No tag
- **Test Company** (Test Client) - Particulier tag

### 2. Frontend E2E Test Updates

#### API Helpers
- Updated `setupTestEnvironment()` to return comprehensive data structure
- Changed from `testClient` (singular) to `testClients` (array)
- Enhanced data types with additional properties (family, sellPrice, provider, etc.)

#### Test Specifications
- Updated `complete-workflow.spec.ts` to use new data structure
- Tests now verify all created entities exist in the frontend

### 3. Test Scripts

#### Verification Script
Created `test-comprehensive-setup.ts` to verify the setup works correctly:
```bash
npx ts-node e2e/test-comprehensive-setup.ts
```

## Usage

### Running E2E Tests
```bash
# Start backend (if not running)
cd cadrart2025-backend && npm run start:dev

# Start frontend (if not running)
cd cadrart2025-frontend && npm start

# Run E2E tests
cd cadrart2025-frontend && npm run e2e
```

### Manual Testing
```bash
# Setup test data
curl -X POST http://localhost:3000/api/test/setup \
  -H "x-test-secret: dev-secret-key" \
  -H "Content-Type: application/json"

# Cleanup test data
curl -X DELETE http://localhost:3000/api/test/cleanup \
  -H "x-test-secret: dev-secret-key" \
  -H "Content-Type: application/json"
```

### Environment Variables
- `TEST_ENDPOINT_SECRET`: Secret for test endpoints (defaults to 'dev-secret-key')
- `E2E_SKIP_CLEANUP`: Set to 'true' to skip cleanup during tests

## Benefits

1. **Realistic Data**: Test data now matches real-world usage patterns
2. **Comprehensive Coverage**: All entity types are represented
3. **Consistent State**: Tests start with a known, complete dataset
4. **Fast Setup**: Single API call creates all necessary data
5. **Secure**: Test endpoints are protected and disabled in production

## Data Relationships

The test data includes proper relationships:
- Articles are linked to providers and formulas
- Clients are linked to tags
- All entities have realistic names, prices, and metadata
- Foreign key constraints are respected

## Maintenance

When the database schema changes:
1. Update the test controller in the backend
2. Update the API helpers in the frontend
3. Update this documentation
4. Run the verification script to ensure everything works

## Security Notes

- Test endpoints are protected by `TestEndpointGuard`
- Endpoints require `x-test-secret` header
- Endpoints are completely disabled in production
- No sensitive data is committed to the repository 
