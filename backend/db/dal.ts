import mysql from "mysql2";

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
});

// Function to create database and tables
export const initializeDatabase = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return;
    }

    const dbName = process.env.DB_NAME;

    // Create database if it doesn't exist
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
      if (err) throw err;
      console.log(`Database ${dbName} created or already exists.`);

      // Use the created database
      connection.query(`USE ${dbName}`, (err) => {
        if (err) throw err;

        // Create users table if it doesn't exist
        const createUsersTableQuery = `
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            phone_number VARCHAR(20) NOT NULL UNIQUE
          )
        `;

        connection.query(createUsersTableQuery, (err) => {
          if (err) throw err;
          console.log("Table 'users' created or already exists.");

          // Create chats table if it doesn't exist
          const createMessagesTableQuery = `
            CREATE TABLE IF NOT EXISTS chat (
              id INT NOT NULL AUTO_INCREMENT,
              message mediumtext NOT NULL,
              fk_sender_id INT NOT NULL,
              recipient_id INT NOT NULL,
              PRIMARY KEY (id),
              KEY fk_sender_id (fk_sender_id),
              KEY recipient_id (recipient_id),
              CONSTRAINT chat_ibfk_1 FOREIGN KEY (fk_sender_id) REFERENCES users (id) ON DELETE CASCADE ON            UPDATE CASCADE,
              CONSTRAINT chat_ibfk_2 FOREIGN KEY (recipient_id) REFERENCES users (id) ON DELETE CASCADE ON            UPDATE CASCADE
            )
          `;

          connection.query(createMessagesTableQuery, (err) => {
            if (err) throw err;
            console.log("Table 'chats' created or already exists.");
            connection.release();
          });
        });
      });
    });
  });
};

export default pool;
