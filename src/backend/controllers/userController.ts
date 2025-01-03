import { userService, User } from '../service/userService';
import { Response, Request } from 'express';
import jwt, {
  JwtPayload,
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface UserPayload {
  name: string;
  iat?: number;
  exp?: number;
}

export async function register(req: Request, res: Response) {
  try {
    const user: User = req.body;

    if (!(await userService.checkUsername(user.name))) {
      res.status(500).json({ error: 'username is already used' });
      return;
    }

    await userService.createUser(user);

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'failed to register user' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const user = await userService.getUser(req.body.name);

    if (typeof user == 'boolean') {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user!.password != req.body.password) {
      res.status(404).json({ error: 'invalid password' });
      return;
    }

    const refreshToken = generateRefreshToken(user.name);
    const accessToken = generateAccessToken(user.name);

    userService.updateUserRefreshToken(user.name, refreshToken);

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
    const user = await userService.getUser(req.body.name);

    if (typeof user == 'boolean') {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    userService.updateUserRefreshToken(user.name, '');
    res.json({
      message: 'you are logged out',
    });
  } catch (error) {
    res.status(500).json({ error: 'failed to logout user' });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'failed to fetch users' });
  }
}
export async function getUserById(req: Request, res: Response) {
  try {
    const user = await userService.getUserById(Number(req.params.id));

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}
export async function createUser(req: Request, res: Response) {
  try {
    const userData: User = req.body;

    const user: User = await userService.createUser(userData);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
}
async function deleteUser(req: Request, res: Response) {}
async function updateUser(req: Request, res: Response) {}

function isUserPayload(payload: unknown): payload is UserPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'name' in payload &&
    typeof (payload as UserPayload).name === 'string'
  );
}

export async function getToken(req: Request, res: Response) {
  try {
    if (req.cookies.refreshToken == null) {
      res.status(401).json({ error: 'no refresh token' });
      return;
    }

    //compare refresh token with user
    const user = await userService.getUser(req.body.name);

    if (typeof user == 'boolean') {
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
    );

    if (!isUserPayload(decoded)) {
      res.status(403).json({ error: 'Invalid token payload' });
      return;
    }

    // Generate new access token
    const accessToken = generateAccessToken(decoded.name);

    res.status(200).json({ accessToken: accessToken });
  } catch (error) {
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
