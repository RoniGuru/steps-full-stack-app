import mysql, { ResultSetHeader } from 'mysql2/promise';
import { User } from '../service/userService';

export const mysqlDB = mysql.createPool({
  host: 'localhost',
  user: process.env.LOCAL_USERNAME,
  password: process.env.LOCAL_PASSWORD,
  waitForConnections: true,
});

export async function createUserDB(
  username: string,
  password: string
): Promise<false | User> {
  try {
    const [results] = await mysqlDB.query<ResultSetHeader>(
      'Insert into users (name, password) values (?,?)',
      [username, password]
    );

    if ((results.affectedRows = 0)) return false;

    const [rows] = await mysqlDB.query<mysql.RowDataPacket[]>(
      'SELECT * FROM users WHERE name = ?',
      [username]
    );

    return rows[0] as User;
  } catch (error) {
    console.log('error creating user in db');
    console.log(error);
    return false;
  }
}

export async function getUserDB(id: number) {
  try {
    const [rows] = await mysqlDB.query<mysql.RowDataPacket[]>(
      'Select * FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) return false;

    return rows[0] as User;
  } catch (error) {
    console.log('error getting user in db');
    return false;
  }
}

export async function deleteUserDB(id: number) {
  try {
    const [results] = await mysqlDB.query<ResultSetHeader>(
      'delete from  users  where id = ?',
      [id]
    );

    if (results.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log('error deleting user in db');
    return false;
  }
}

export async function updateUserNameDB(id: number, name: string) {
  try {
    const [results] = await mysqlDB.query<ResultSetHeader>(
      'UPDATE users SET name = ? WHERE id = ?',
      [name, id]
    );

    if (results.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log('error updating user name in db');
    return false;
  }
}

export async function updateUserPasswordDB(id: number, password: string) {
  try {
    const [results] = await mysqlDB.query<ResultSetHeader>(
      'UPDATE users SET password = ? WHERE id = ?',
      [password, id]
    );

    if (results.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log('error updating user password in db');
    return false;
  }
}

export async function updateUserRefreshTokenDB(
  id: number,
  refresh_token: string
) {
  try {
    const [results] = await mysqlDB.query<ResultSetHeader>(
      'UPDATE users SET refresh_token = ? WHERE id = ?',
      [refresh_token, id]
    );

    if (results.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log('error updating user refresh token in db');
    return false;
  }
}
