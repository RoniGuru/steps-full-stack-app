import {
  getUserByIdDB,
  createUserDB,
  deleteUserDB,
  updateUserNameDB,
  updateUserPasswordDB,
  updateUserRefreshTokenDB,
} from '../db/database';
export interface User {
  id: number;
  name: string;
  password: string;
  refresh_token?: string;
  created_at?: Date;
}

const users: User[] = [];

class UserService {
  async getUsers(): Promise<User[]> {
    return users;
  }

  async getUserById(id: number): Promise<User | null> {
    let user = await getUserByIdDB(id);
    if (!user) return null;
    let { refresh_token, created_at, ...userWithoutToken } = user;
    return userWithoutToken;
  }

  async createUser(name: string, password: string): Promise<User | null> {
    const result = await createUserDB(name, password);
    return result;
  }

  // async getUser(name: string): Promise<User | boolean> {
  //   const user: User = users.filter((user) => user.name === name)[0];
  //   if (user) {
  //     return user;
  //   } else {
  //     return false;
  //   }
  // }

  async updateUserRefreshToken(id: number, refreshToken: string) {
    const result = await updateUserRefreshTokenDB(id, refreshToken);
  }
}

export const userService = new UserService();
