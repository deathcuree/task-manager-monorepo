# Task Manager Server Tests

This directory contains comprehensive test suites for the Task Manager server, implementing a layered testing strategy with both unit and integration tests.

## 🏗️ Testing Strategy

Production applications use multiple layers of testing for different purposes:

### Testing Pyramid
```
End-to-End Tests (Slow, few)
    ↕️
Integration Tests (Medium speed, more)
    ↕️
Unit Tests (Fast, many)
```

### Test Types

#### **Unit Tests** (Fast, Isolated)
- Test individual functions/components in isolation
- Mock external dependencies (database, HTTP calls)
- Run on every commit for quick feedback
- Focus on business logic and edge cases

#### **Integration Tests** (Realistic, Comprehensive)
- Test real interactions between components
- Use actual database connections
- Validate end-to-end data flow
- Catch integration issues unit tests miss

## 📁 Test File Organization

### Unit Tests (Mock Database)
```
tests/
├── controllers/taskController.test.ts     # Controller logic with mocked services
├── routes/tasks.test.ts                   # Route handlers with mocked services
├── services/taskService.test.ts           # Service functions with mocked DB
└── validators/taskValidator.test.ts       # Input validation logic
```

### Integration Tests (Real Database)
```
tests/
├── integration/
│   ├── db/migration.test.ts               # Database schema and migration tests
│   └── services/taskService.integration.test.ts  # Service functions with real SQLite
└── helpers/
    ├── testDb.ts                          # In-memory SQLite setup utilities
    └── integrationSetup.ts                # Integration test configuration
```

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Run Unit Tests Only (Fast)
```bash
npm run test:unit
```
Tests: controllers, services, validators (with mocks)

### Run Integration Tests Only (Real DB)
```bash
npm run test:integration
```
Tests: database migrations, services with real SQLite

### Run with Coverage
```bash
npm run test:coverage
```

### Run in Watch Mode
```bash
npm run test:watch
```

## 🗄️ Database Testing

### Unit Tests
- Mock all database operations
- Focus on business logic without DB concerns
- Fast execution (~100ms per test)

### Integration Tests
- Use in-memory SQLite databases
- Test real SQL queries and schema
- Validate data persistence and constraints
- Fresh database for each test (~5-10s per test)

## 🔧 Test Configuration

### ESM Compatibility
- Jest configured for ES modules
- TypeScript uses Node16 module resolution
- Mocks work around Jest's CommonJS limitations

### Database Setup
- **Unit tests**: Mock `runQuery`, `getQuery`, `allQuery`
- **Integration tests**: Real SQLite functions with in-memory DB
- Schema automatically created from `schema.sql`
- Test data seeded for consistent testing

## 📊 Test Coverage

Current test coverage includes:
- ✅ Task CRUD operations
- ✅ Input validation
- ✅ Database schema integrity
- ✅ Error handling
- ✅ Filtering and pagination
- ✅ Search functionality

### Running Single Test Files
```bash
npx jest tests/services/taskService.test.ts
npx jest tests/integration/services/taskService.integration.test.ts
```