import { Router, NextFunction, Request, Response } from 'express';
import {
  getUserById,
  getUsers,
  getToken,
  register,
  login,
} from '../controllers/userController';
import jwt from 'jsonwebtoken';

const router = Router();
router.post('/token', getToken);

router.get('/', getUsers);
router.get('/:id', authenticateToken, getUserById);

router.post('/register', register);
router.post('/login', login);

export default router;

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    res.status(401).json({ error: 'no access token' });
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    if (err) {
      res.sendStatus(401).json({ error: 'access token verification failed' });
      return;
    }
    console.log(user);
    req.body.user = user;
    next();
  });
}
