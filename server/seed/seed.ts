import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../db/database.sqlite');
const schemaPath = path.join(__dirname, '../db/schema.sql');

// Reset DB by deleting if exists
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);

// Execute schema
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

// Prepare insert statement
const insertTask = db.prepare(`
    INSERT INTO tasks (title, description, status, priority, due_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const now = new Date().toISOString();

// Seed data: at least 10 tasks with varied status, priority, some due_date
const tasks = [
    { title: 'Complete project setup', description: 'Set up the monorepo structure', status: 'completed', priority: 'high', due_date: '2025-11-01' },
    { title: 'Design database schema', description: 'Create SQLite schema for tasks', status: 'completed', priority: 'high', due_date: '2025-11-02' },
    { title: 'Implement seed script', description: 'Write script to populate database', status: 'in-progress', priority: 'medium', due_date: '2025-11-05' },
    { title: 'Set up server endpoints', description: 'Create API routes for tasks', status: 'pending', priority: 'high', due_date: '2025-11-10' },
    { title: 'Build client UI', description: 'Develop React components', status: 'pending', priority: 'medium', due_date: '2025-11-15' },
    { title: 'Add authentication', description: 'Implement user login', status: 'pending', priority: 'low', due_date: null },
    { title: 'Write tests', description: 'Create unit and integration tests', status: 'pending', priority: 'medium', due_date: '2025-11-20' },
    { title: 'Deploy application', description: 'Set up production deployment', status: 'pending', priority: 'low', due_date: null },
    { title: 'Optimize performance', description: 'Improve app speed', status: 'pending', priority: 'low', due_date: null },
    { title: 'Document API', description: 'Write API documentation', status: 'pending', priority: 'low', due_date: '2025-11-25' }
];

// Insert tasks
for (const task of tasks) {
    insertTask.run(task.title, task.description, task.status, task.priority, task.due_date, now, now);
}

db.close();
console.log('Database seeded successfully.');