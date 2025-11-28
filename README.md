# Task Manager Monorepo

A full-stack task management application with React frontend and Node.js/Express backend using SQLite.

## 🚀 Live Demo

**Frontend**: https://task-manager-monorepo-nine.vercel.app/

**Backend**: Hosted on Render (free tier - may need to be woken up after idle time)

> **Note**: The backend uses Render's free tier which has idle timeouts. If the API seems slow on first load, it's rebuilding after inactivity. This is normal for free hosting services.

## Tech Stack Choices and Reasoning

- **React and Express**: Easy to use and my main stack for rapid development
- **TypeScript**: Provides type safety, easier debugging, and compiles to JavaScript for deployment
- **SQLite with better-sqlite3**: Simple file-based database, no server setup required
- **Vite**: Fast development server and optimized builds
- **Docker**: Enables consistent deployment across environments
- **Deployment**: Vercel for frontend and Render for backend (both offer generous free tiers and easy deployment)

## Setup Instructions

### Prerequisites
- Node.js 20 (required for better-sqlite3)
- npm or yarn

### Installation
```bash
# Clone repository
git clone git@github.com:deathcuree/task-manager-monorepo.git
cd task-manager-monorepo

# Install dependencies
npm run install:all

# Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# Seed database
cd server && npm run seed && cd ..

# Start development
npm run dev:all
```

### Docker Setup
```bash
# Development
docker-compose up --build

# Production
docker build -t task-manager .
docker run -p 4000:4000 task-manager
```

## API Endpoint Documentation

Base URL: `http://localhost:4000/api/tasks`

### Tasks Endpoints

| Method | Endpoint | Description | Body/Query |
|--------|----------|-------------|------------|
| GET | `/api/tasks` | List tasks with pagination | Query: `page`, `limit`, `status`, `priority`, `search` |
| GET | `/api/tasks/search` | Search tasks | Query: `q` |
| GET | `/api/tasks/:id` | Get single task | - |
| POST | `/api/tasks` | Create task | Body: `title`, `description`, `status`, `priority`, `due_date` |
| PUT | `/api/tasks/:id` | Full update task | Body: `title`, `description`, `status`, `priority`, `due_date` |
| PATCH | `/api/tasks/:id` | Partial update task | Body: partial fields |
| DELETE | `/api/tasks/:id` | Delete task | - |

### Response Format
```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "status": "pending|in-progress|completed",
  "priority": "low|medium|high",
  "due_date": "2024-12-31",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## Schema Documentation

### Tasks Table
```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    due_date TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT
);
```

### Indexes
- `idx_tasks_title` on `title`
- `idx_tasks_due_date` on `due_date`

## Development Notes

**Focus on Core Requirements**: I prioritized implementing all core functionalities correctly rather than rushing through bonus features. This included extensive debugging of database connectivity issues and ensuring robust error handling. I used SQLite and seed for data persistence when deployed so the seed data is automatically in the website and the data will persist.

**Personal Note**: There are bonus features I wasn't able to finish because I needed to submit the task. I focused on the core functionalities and took me quite more time because of the bugs I have found. This is the link for the deployed application: https://task-manager-monorepo-nine.vercel.app/

**Bonus Features Not Implemented** (due to time constraints):
- User authentication system
- Real-time updates with WebSockets
- Bulk operations (delete/update multiple tasks)
- Export functionality (CSV/JSON)
- Dark mode toggle

## Known Limitations and Trade-offs

- **SQLite scalability**: Single-writer limitation, not suitable for high-traffic applications
- **File-based database**: Requires persistent volume mounting in Docker
- **No authentication**: Basic CRUD operations only
- **CORS configuration**: Must be updated for production domains
- **Node.js version dependency**: Requires Node 20 for better-sqlite3 compatibility
- **Free tier limitations**: Backend may have cold start delays on Render

## Time Spent

- **Planning and architecture**: 3 hours
- **Database setup and seeding**: 2 hours
- **Backend API development**: 4 hours
- **Frontend React components**: 2 hours
- **Frontend Integration**: 2 hours
- **Docker containerization**: 2 hours
- **Deployment**: 3 hours
- **Testing and debugging**: 3 hours
- **Documentation**: 1 hour

Total: ~22 hours
