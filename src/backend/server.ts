import express, { Express, Request, Response } from 'express';
import userRouter from './routes/userRoutes';
import cors from 'cors';

const app: Express = express();
const port = process.env.PORT || 3300;

app.use(express.json());

app.use('/users', userRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}sssddd`);
});
