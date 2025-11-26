import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRouter from './routes/tasks';

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use('/api/tasks', taskRouter);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});