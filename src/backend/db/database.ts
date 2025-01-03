import mysql from 'mysql2/promise';

export const mysqlDB = mysql.createPool({
  host: 'localhost',
  user: process.env.LOCAL_USERNAME,
  password: process.env.LOCAL_PASSWORD,
  waitForConnections: true,
});
