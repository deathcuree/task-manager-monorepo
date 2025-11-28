import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import taskRouter from './routes/tasks.js';

dotenv.config();

const port = process.env.PORT;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/tasks', taskRouter);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});