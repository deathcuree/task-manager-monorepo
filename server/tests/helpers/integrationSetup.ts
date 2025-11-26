import { createTestDb, seedTestDb } from './testDb';
import { runQuery, getQuery, allQuery } from '../../src/db/db';

/**
 * Sets up integration test environment with real database
 * Configures the mocked db functions to use in-memory SQLite
 */
export function setupIntegrationTest() {
  let testDb: ReturnType<typeof createTestDb>;

  beforeEach(() => {
    // Create fresh in-memory database for each test
    testDb = createTestDb();
    seedTestDb(testDb);

    // Configure the mocked functions to use our test database
    (runQuery as jest.MockedFunction<typeof runQuery>).mockImplementation(testDb.runQuery);
    (getQuery as jest.MockedFunction<typeof getQuery>).mockImplementation(testDb.getQuery);
    (allQuery as jest.MockedFunction<typeof allQuery>).mockImplementation(testDb.allQuery);
  });

  afterEach(() => {
    // Close database connection after each test
    if (testDb) {
      testDb.close();
    }
    // Clear all mocks
    jest.clearAllMocks();
  });

  return {
    getTestDb: () => testDb
  };
}

/**
 * Alternative setup that doesn't mock but uses real services
 * Useful for testing service layer with real DB
 */
export function setupServiceIntegrationTest() {
  let testDb: ReturnType<typeof createTestDb>;

  beforeEach(() => {
    testDb = createTestDb();
    seedTestDb(testDb);
  });

  afterEach(() => {
    if (testDb) {
      testDb.close();
    }
  });

  return {
    getTestDb: () => testDb,
    get runQuery() { return testDb?.runQuery; },
    get getQuery() { return testDb?.getQuery; },
    get allQuery() { return testDb?.allQuery; }
  };
}