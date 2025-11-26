import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'db/schema.sql');

/**
 * Creates an in-memory SQLite database for testing
 * Initializes schema and returns query helper functions
 */
export function createTestDb() {
  const db = new Database(':memory:');

  // Execute schema
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);

  // Helper functions for queries (same as production)
  const runQuery = (query: string, params: any[] = []) => {
    return db.prepare(query).run(params);
  };

  const getQuery = (query: string, params: any[] = []) => {
    return db.prepare(query).get(params);
  };

  const allQuery = (query: string, params: any[] = []) => {
    return db.prepare(query).all(params);
  };

  return {
    db,
    runQuery,
    getQuery,
    allQuery,
    close: () => db.close()
  };
}

/**
 * Seeds the test database with sample data
 */
export function seedTestDb(testDb: ReturnType<typeof createTestDb>) {
  const { runQuery } = testDb;

  const now = new Date().toISOString();

  // Sample test data
  const tasks = [
    {
      title: 'Test Task 1',
      description: 'Description for test task 1',
      status: 'pending',
      priority: 'high',
      due_date: '2024-12-31',
      created_at: now,
      updated_at: now
    },
    {
      title: 'Test Task 2',
      description: 'Description for test task 2',
      status: 'in-progress',
      priority: 'medium',
      due_date: '2024-12-25',
      created_at: now,
      updated_at: now
    },
    {
      title: 'Test Task 3',
      description: 'Description for test task 3',
      status: 'completed',
      priority: 'low',
      due_date: null,
      created_at: now,
      updated_at: now
    }
  ];

  const insertTask = testDb.db.prepare(`
    INSERT INTO tasks (title, description, status, priority, due_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const task of tasks) {
    insertTask.run(
      task.title,
      task.description,
      task.status,
      task.priority,
      task.due_date,
      task.created_at,
      task.updated_at
    );
  }

  return tasks;
}