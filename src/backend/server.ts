import express, { Express } from 'express';
import userRouter from './routes/userRoutes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { mysqlDB } from './db/database';

const app: Express = express();
const port = process.env.PORT || 3300;

app.use(express.json());
app.use(cookieParser());

app.use('/v1/users', userRouter);

async function initializeDB() {
  console.log('Connected!');
  await mysqlDB.query('CREATE DATABASE IF NOT EXISTS full_stack_test');
  await mysqlDB.query('USE full_stack_test');
  await mysqlDB.query(
    'CREATE TABLE IF NOT EXISTS users (id INT  PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, refresh_token VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP )'
  );
}

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}sssddd`);
  await initializeDB();
});

async function cleanup() {
  try {
    const connection = await mysqlDB.getConnection();
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP DATABASE IF EXISTS full_stack_test');
    await connection.release();
    console.log('SQL cleaned');
    process.exit(0);
  } catch (err) {
    console.error('Cleanup failed:', err);
    process.exit(1);
  }
}

process.on('SIGINT', cleanup);
