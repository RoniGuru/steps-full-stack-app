import mysql, { ResultSetHeader } from 'mysql2/promise';
import { format } from 'date-fns';

import dotenv from 'dotenv';

dotenv.config();
export const mysqlDB = mysql.createPool({
  host: 'localhost',
  user: process.env.LOCAL_USERNAME,
  password: process.env.LOCAL_PASSWORD,
  waitForConnections: true,
});

export interface User {
  id: number;
  name: string;
  password: string;
  total_steps: number;
  refresh_token?: string;
  created_at?: Date;
}

export interface Step {
  id: number;
  steps: number;
  step_date: Date;
  user_id: number;
}

export async function createUserDB(
  username: string,
  password: string
): Promise<User | null> {
  try {
    const [results] = await mysqlDB.query<ResultSetHeader>(
      'Insert into users (name, password) values (?,?)',
      [username, password]
    );

    if ((results.affectedRows = 0)) return null;

    const [rows] = await mysqlDB.query<mysql.RowDataPacket[]>(
      'SELECT * FROM users WHERE name = ?',
      [username]
    );

    return rows[0] as User;
  } catch (error) {
    console.log('error creating user in db');
    console.log(error);
    return null;
  }
}

export async function checkUserNameDB(name: string): Promise<boolean> {
  try {
    const [rows] = await mysqlDB.query<mysql.RowDataPacket[]>(
      'Select * FROM users WHERE id = ?',
      [name]
    );

    if (rows.length === 0) return true;

    return false;
  } catch (error) {
    console.log('error getting user in db');
    return false;
  }
}

export async function getUserByIdDB(id: number): Promise<User | null> {
  try {
    const [rows] = await mysqlDB.query<mysql.RowDataPacket[]>(
      'Select * FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) return null;

    return rows[0] as User;
  } catch (error) {
    console.log('error getting user in db');
    return null;
  }
}

export async function getUserByNameDB(name: string): Promise<User | null> {
  try {
    const [rows] = await mysqlDB.query<mysql.RowDataPacket[]>(
      'Select * FROM users WHERE name = ?',
      [name]
    );

    if (rows.length === 0) return null;

    return rows[0] as User;
  } catch (error) {
    console.log('error getting user in db');
    return null;
  }
}

export async function deleteUserDB(id: number): Promise<boolean> {
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

export async function updateUserNameDB(
  id: number,
  name: string
): Promise<boolean> {
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

export async function updateUserPasswordDB(
  id: number,
  password: string
): Promise<boolean> {
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
): Promise<boolean> {
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

export async function addStepDB(
  user_id: number,
  steps: number
): Promise<boolean> {
  try {
    const connection = await mysqlDB.getConnection();
    await connection.beginTransaction();
    await connection.query('USE full_stack_test');

    const [stepResults] = await connection.query<ResultSetHeader>(
      'Insert into steps (user_id, steps) values (?,?)',
      [user_id, steps]
    );

    const [userResults] = await connection.query<ResultSetHeader>(
      'UPDATE users SET total_steps = total_steps + ? WHERE id = ?',
      [steps, user_id]
    );

    if (stepResults.affectedRows === 0 || userResults.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    await connection.commit();
    connection.release();
    return true;
  } catch (error) {
    console.log('error adding step in db');
    console.log(error);
    return false;
  }
}

export async function updateStepDB(
  date: Date,
  newSteps: number,
  user_id: number
) {
  try {
    const connection = await mysqlDB.getConnection();
    await connection.beginTransaction();

    await connection.query('USE full_stack_test');

    const [currentSteps] = await connection.query<mysql.RowDataPacket[]>(
      'SELECT steps FROM steps WHERE step_date = ? AND user_id = ?',
      [date, user_id]
    );

    const stepDifference = newSteps - (currentSteps[0]?.steps || 0);

    const [stepResults] = await connection.query<ResultSetHeader>(
      'UPDATE steps SET steps = ? WHERE step_date = ? AND user_id = ?',
      [newSteps, date, user_id]
    );

    const [userResults] = await connection.query<ResultSetHeader>(
      'UPDATE users SET total_steps = total_steps + ? WHERE id = ?',
      [stepDifference, user_id]
    );

    if (stepResults.affectedRows === 0 || userResults.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    await connection.commit();
    connection.release();
    return true;
  } catch (error) {
    console.log('error updating step in db');
    console.log(error);
    return false;
  }
}

export async function deleteStepDB() {}

export async function getStepByMonthDB(
  user_id: number,
  month: number,
  year: number
): Promise<Step[] | null> {
  try {
    const [rows] = await mysqlDB.query<mysql.RowDataPacket[]>(
      'SELECT * FROM steps WHERE user_id = ? AND MONTH(step_date) = ?  AND YEAR(step_date) = ?',
      [user_id, month, year]
    );

    return rows as Step[];
  } catch (error) {
    console.log('error getting step by month in db');
    console.log(error);
    return null;
  }
}

export async function getStepByYearDB(
  user_id: number,
  year: number
): Promise<Step[] | null> {
  try {
    const [rows] = await mysqlDB.query<mysql.RowDataPacket[]>(
      'SELECT * FROM steps WHERE user_id = ? AND YEAR(step_date) = ?',
      [user_id, year]
    );

    return rows as Step[];
  } catch (error) {
    console.log('error getting by year step in db');
    console.log(error);
    return null;
  }
}
