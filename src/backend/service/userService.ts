export interface User {
  id: number;
  name: string;
  password: string;
  refreshToken?: string;
}

const users: User[] = [];

class UserService {
  async getUsers(): Promise<User[]> {
    return users;
  }

  async getUserById(id: number): Promise<User | null> {
    let user: User = users.filter((user) => user.id === id)[0];
    let { refreshToken, ...userWithoutToken } = user;
    return userWithoutToken;
  }

  async checkUsername(name: string) {
    const user: User = users.filter((user) => user.name === name)[0];
    if (user) {
      return false;
    } else {
      return true;
    }
  }

  async createUser(newUser: User): Promise<User> {
    users.push(newUser);
    return newUser;
  }

  async getUser(name: string): Promise<User | boolean> {
    const user: User = users.filter((user) => user.name === name)[0];
    if (user) {
      return user;
    } else {
      return false;
    }
  }

  async updateUserRefreshToken(name: string, refreshToken: string) {
    users.filter((user) => user.name === name)[0].refreshToken = refreshToken;
  }
}

export const userService = new UserService();
