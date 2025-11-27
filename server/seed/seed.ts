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

// Seed data: 30 tasks with varied status, priority, due_dates for filtering/sorting
const tasks = [
    // Work tasks
    { title: 'Complete project setup', description: 'Set up the monorepo structure', status: 'completed', priority: 'high', due_date: '2024-10-01' },
    { title: 'Design database schema', description: 'Create SQLite schema for tasks', status: 'completed', priority: 'high', due_date: '2024-10-05' },
    { title: 'Implement seed script', description: 'Write script to populate database', status: 'in-progress', priority: 'medium', due_date: '2025-11-30' },
    { title: 'Set up server endpoints', description: 'Create API routes for tasks', status: 'pending', priority: 'high', due_date: '2025-12-01' },
    { title: 'Build client UI', description: 'Develop React components', status: 'pending', priority: 'medium', due_date: '2025-12-05' },
    { title: 'Add authentication', description: 'Implement user login', status: 'pending', priority: 'low', due_date: null },
    { title: 'Write tests', description: 'Create unit and integration tests', status: 'pending', priority: 'medium', due_date: '2025-12-10' },
    { title: 'Deploy application', description: 'Set up production deployment', status: 'pending', priority: 'low', due_date: null },
    { title: 'Optimize performance', description: 'Improve app speed', status: 'pending', priority: 'low', due_date: '2025-12-15' },
    { title: 'Document API', description: 'Write API documentation', status: 'pending', priority: 'low', due_date: '2025-12-20' },
    { title: 'Review code', description: 'Conduct code review for pull requests', status: 'completed', priority: 'medium', due_date: '2024-11-15' },
    { title: 'Update dependencies', description: 'Upgrade npm packages to latest versions', status: 'in-progress', priority: 'high', due_date: '2025-12-25' },
    { title: 'Fix bugs', description: 'Resolve reported issues in the application', status: 'pending', priority: 'high', due_date: '2026-01-01' },
    { title: 'Plan sprint', description: 'Organize tasks for the next development sprint', status: 'completed', priority: 'medium', due_date: '2024-12-01' },
    { title: 'Attend meeting', description: 'Join team standup meeting', status: 'completed', priority: 'low', due_date: '2024-12-05' },

    // Chores
    { title: 'Grocery shopping', description: 'Buy weekly groceries for the house', status: 'pending', priority: 'medium', due_date: '2025-11-28' },
    { title: 'Clean kitchen', description: 'Wash dishes and wipe counters', status: 'completed', priority: 'low', due_date: '2024-11-20' },
    { title: 'Laundry', description: 'Wash and fold clothes', status: 'in-progress', priority: 'low', due_date: '2025-11-29' },
    { title: 'Vacuum house', description: 'Clean floors throughout the house', status: 'pending', priority: 'low', due_date: '2025-12-02' },
    { title: 'Take out trash', description: 'Empty bins and take to curb', status: 'completed', priority: 'low', due_date: '2024-11-25' },
    { title: 'Mow lawn', description: 'Cut grass in the backyard', status: 'pending', priority: 'medium', due_date: '2025-12-03' },
    { title: 'Wash car', description: 'Clean exterior and interior of vehicle', status: 'pending', priority: 'low', due_date: null },
    { title: 'Pay bills', description: 'Settle monthly utility and credit card payments', status: 'in-progress', priority: 'high', due_date: '2025-12-01' },
    { title: 'Organize closet', description: 'Sort and arrange clothes and items', status: 'pending', priority: 'low', due_date: '2025-12-10' },
    { title: 'Cook dinner', description: 'Prepare meal for the family', status: 'completed', priority: 'medium', due_date: '2024-11-26' },

    // Personal tasks
    { title: 'Exercise', description: 'Go for a 30-minute run', status: 'pending', priority: 'medium', due_date: '2025-11-30' },
    { title: 'Read book', description: 'Finish reading current novel', status: 'in-progress', priority: 'low', due_date: null },
    { title: 'Call family', description: 'Check in with parents and siblings', status: 'completed', priority: 'high', due_date: '2024-11-22' },
    { title: 'Learn guitar', description: 'Practice chords for 20 minutes', status: 'pending', priority: 'low', due_date: '2025-12-05' },
    { title: 'Plan vacation', description: 'Research and book trip destinations', status: 'pending', priority: 'medium', due_date: '2026-01-15' },
    { title: 'Dentist appointment', description: 'Schedule and attend dental checkup', status: 'pending', priority: 'high', due_date: '2025-12-20' },
    { title: 'Update resume', description: 'Revise CV with recent achievements', status: 'in-progress', priority: 'medium', due_date: '2025-12-15' },
    { title: 'Volunteer', description: 'Help at local community center', status: 'pending', priority: 'low', due_date: null },
    { title: 'Meditate', description: 'Daily mindfulness practice', status: 'completed', priority: 'low', due_date: '2024-11-27' },
    { title: 'Bake cookies', description: 'Make chocolate chip cookies from scratch', status: 'pending', priority: 'low', due_date: '2025-12-25' }
];

// Insert tasks
for (const task of tasks) {
    insertTask.run(task.title, task.description, task.status, task.priority, task.due_date, now, now);
}

db.close();
console.log('Database seeded successfully.');