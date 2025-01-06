import express, { Express } from 'express';
import userRouter from './routes/userRoutes';
import stepRouter from './routes/stepRoutes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { mysqlDB } from './db/database';

const app: Express = express();
const port = process.env.PORT || 3300;

app.use(express.json());
app.use(cookieParser());

app.use('/v1/users', userRouter);
app.use('/v1/steps', stepRouter);

async function initializeDB() {
  console.log('Connected!');

  // await mysqlDB.query('DROP TABLE IF EXISTS users');
  await mysqlDB.query('DROP DATABASE IF EXISTS full_stack_test');

  await mysqlDB.query('CREATE DATABASE IF NOT EXISTS full_stack_test');
  await mysqlDB.query('USE full_stack_test');
  await mysqlDB.query(
    'CREATE TABLE IF NOT EXISTS users (id INT  PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL,total_steps INT DEFAULT 0, refresh_token VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP )'
  );

  await mysqlDB.query(
    'CREATE TABLE IF NOT EXISTS steps (id INT  PRIMARY KEY AUTO_INCREMENT,  user_id INT NOT NULL,steps INT DEFAULT 0  ,step_date DATE DEFAULT (CURRENT_DATE),  FOREIGN KEY (user_id) REFERENCES users(id), UNIQUE (user_id, step_date) )'
  );
  await mysqlDB.query(`
    CREATE INDEX idx_steps_user_date 
    ON steps(user_id, step_date)
  `);
}

// async function cleanup() {
//   try {
//     const connection = await mysqlDB.getConnection();
//     await connection.query('DROP TABLE IF EXISTS users');
//     await connection.query('DROP DATABASE IF EXISTS full_stack_test');
//     await connection.release();
//     console.log('SQL cleaned');
//     process.exit(0);
//   } catch (err) {
//     console.error('Cleanup failed:', err);
//     process.exit(1);
//   }
// }
// process.on('SIGINT', cleanup);

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}sssddd`);

  await initializeDB();
});
