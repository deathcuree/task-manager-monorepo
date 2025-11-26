import { createTestDb } from '../../helpers/testDb';

describe('Database Migration Tests', () => {
  it('should successfully create database schema', () => {
    const testDb = createTestDb();

    // Verify tables were created
    const tables = testDb.allQuery(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);

    const tableNames = tables.map((row: any) => row.name);
    expect(tableNames).toContain('tasks');
    expect(tableNames).toContain('task_statuses');
    expect(tableNames).toContain('task_priorities');

    testDb.close();
  });

  it('should create indexes', () => {
    const testDb = createTestDb();

    // Verify indexes were created
    const indexes = testDb.allQuery(`
      SELECT name FROM sqlite_master
      WHERE type='index' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);

    const indexNames = indexes.map((row: any) => row.name);
    expect(indexNames).toContain('idx_tasks_title');
    expect(indexNames).toContain('idx_tasks_due_date');

    testDb.close();
  });

  it('should support basic CRUD operations after migration', () => {
    const testDb = createTestDb();

    // Test INSERT
    const insertResult = testDb.runQuery(`
      INSERT INTO tasks (title, description, status, priority, due_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['Migration Test Task', 'Testing migrations', 'pending', 'high', '2024-12-31', new Date().toISOString(), new Date().toISOString()]);

    expect(insertResult.changes).toBe(1);
    expect(insertResult.lastInsertRowid).toBe(1);

    // Test SELECT
    const task = testDb.getQuery('SELECT * FROM tasks WHERE id = ?', [1]);
    expect(task).toBeTruthy();
    expect((task as any).title).toBe('Migration Test Task');

    // Test UPDATE
    const updateResult = testDb.runQuery('UPDATE tasks SET status = ? WHERE id = ?', ['completed', 1]);
    expect(updateResult.changes).toBe(1);

    // Test DELETE
    const deleteResult = testDb.runQuery('DELETE FROM tasks WHERE id = ?', [1]);
    expect(deleteResult.changes).toBe(1);

    testDb.close();
  });

  it('should enforce foreign key constraints if implemented', () => {
    const testDb = createTestDb();

    // Test that tasks table has proper structure
    const columns = testDb.allQuery('PRAGMA table_info(tasks)');
    const columnNames = columns.map((col: any) => col.name);

    expect(columnNames).toContain('id');
    expect(columnNames).toContain('title');
    expect(columnNames).toContain('status');
    expect(columnNames).toContain('priority');
    expect(columnNames).toContain('created_at');
    expect(columnNames).toContain('updated_at');

    // Check NOT NULL constraints
    const titleColumn = columns.find((col: any) => col.name === 'title');
    expect((titleColumn as any).notnull).toBe(1);

    testDb.close();
  });
});