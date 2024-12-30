import { userService, User } from '../service/userService';
import { Response, Request } from 'express';

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
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}
export async function createUser(req: Request, res: Response) {
  try {
    const userData: User = req.body;
    console.log(req.body);
    const user = await userService.createUser(userData);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
}
async function deleteUser(req: Request, res: Response) {}
