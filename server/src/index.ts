import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});