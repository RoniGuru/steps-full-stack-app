export interface User {
  id: number;
  name: string;
  password: string;
  refreshToken: string;
}

const users: User[] = [];

class UserService {
  async getUsers(): Promise<User[]> {
    return users;
  }

  async getUserById(id: number): Promise<User | null> {
    const user: User = users.filter((user) => user.id === id)[0];
    return user;
  }

  async checkUsername(name: string) {
    const user: User = users.filter((user) => user.name === name)[0];
    if (user) {
      return false;
    } else {
      return true;
    }
  }

  async createUser(newUser: User) {
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
}

export const userService = new UserService();
