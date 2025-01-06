import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  getUserByIdDB,
  createUserDB,
  deleteUserDB,
  updateUserNameDB,
  updateUserPasswordDB,
  updateUserRefreshTokenDB,
  checkUserNameDB,
  getUserByNameDB,
  User,
} from '../db/database';
import dotenv from 'dotenv';

dotenv.config();

interface UserPayload {
  name: string;
  iat?: number;
  exp?: number;
}

export async function register(req: Request, res: Response) {
  try {
    const { name, password } = req.body;

    const result = await checkUserNameDB(name);

    if (!result) {
      res.status(400).json({ error: 'user name already taken' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUserDB(name, hashedPassword);

    if (!user) {
      res.status(500).json({ error: 'failed to register user' });
      return;
    }

    res.status(200).json({ message: 'user registered' });
  } catch (error) {
    res.status(500).json({ error: 'failed to register user' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { name, password } = req.body;
    const user = await getUserByNameDB(name);

    if (!user) {
      res.status(404).json({ error: 'details invalid' });
      return;
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      res.status(404).send('password incorrect');
      return;
    }

    const refreshToken = generateRefreshToken(user.name);
    const accessToken = generateAccessToken(user.name);

    const update = await updateUserRefreshTokenDB(user.id, refreshToken);

    if (!update) {
      res.status(404).json({ error: 'cant update refresh token' });
      return;
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    res.json({
      accessToken,
      user: { id: user.id, name: user.name },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to login user' });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const user = await getUserByIdDB(Number(req.params.id));

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const update = updateUserRefreshTokenDB(user.id, '');

    if (!update) {
      res.status(404).json({ error: 'logout failed' });
      return;
    }

    res.json({
      message: 'you are logged out',
    });
  } catch (error) {
    res.status(500).json({ error: 'failed to logout user' });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const user = await getUserByIdDB(Number(req.params.id));

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { refresh_token, created_at, password, ...userWithoutToken } = user;

    res.status(200).json(userWithoutToken);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

async function deleteUser(req: Request, res: Response) {}

export async function updateUser(req: Request, res: Response) {
  try {
    const user = await getUserByIdDB(Number(req.params.id));
    const { newName, password, newPassword } = req.body;

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    let result = false;

    if (password) {
      const compare = await bcrypt.compare(password, user.password);
      console.log(compare);
      if (compare) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        result = await updateUserPasswordDB(
          Number(req.params.id),
          hashedPassword
        );
      } else {
        res.status(400).json({ error: 'invalid password ' });
        return;
      }
    } else if (newName) {
      result = await updateUserNameDB(Number(req.params.id), newName);
    }

    if (result) {
      res.status(200).json({ message: 'user updated' });
    } else {
      res.status(400).json({ error: 'user update failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

export async function getToken(req: Request, res: Response) {
  try {
    if (req.cookies.refreshToken == null) {
      res.status(401).json({ error: 'no refresh token' });
      return;
    }

    //compare refresh token with user
    const user = await getUserByIdDB(Number(req.params.id));

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (req.cookies.refreshToken != user.refresh_token) {
      res.status(401).json({ error: 'refresh token  not similar' });
      return;
    }

    const decoded = jwt.verify(
      req.cookies.refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as UserPayload;

    // Generate new access token
    const accessToken = generateAccessToken(decoded.name);

    res.status(200).json({ accessToken: accessToken });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Invalid signature
      console.error('Invalid token');
    } else if (error instanceof jwt.TokenExpiredError) {
      // Token has expired
      console.error('Token expired');
    }

    res
      .status(500)
      .json({ error: 'Failed to get token or refresh token expired' });
  }
}

export function generateAccessToken(name: string) {
  return jwt.sign({ name: name }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '1hr',
  });
}

export function generateRefreshToken(name: string) {
  return jwt.sign({ name: name }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '30 days',
  });
}
