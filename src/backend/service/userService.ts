export interface User {
  id: number;
  name: string;
  password: string;
}

const users: User[] = [
  { id: 1, name: 'Rob', password: 'deee' },
  { id: 2, name: 'jones', password: 'deewwse' },
  { id: 3, name: 'comb', password: 'deeedde' },
  { id: 4, name: 'leff', password: 'deeewes' },
];

class UserService {
  async getUsers(): Promise<User[]> {
    return users;
  }

  async getUserById(id: number): Promise<User> {
    const user: User = users.filter((user) => user.id === id)[0];
    return user;
  }

  async createUser(newUser: User) {
    users.push(newUser);
  }
}

export const userService = new UserService();
