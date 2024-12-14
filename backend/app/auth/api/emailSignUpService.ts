import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../../../db/dal";

export const emailSignUpService = {
  /**
   * Checks if a user already exists in the database, given an email address or phone number.
   * @param {string} email - The email address to check.
   * @param {string} phone - The phone number to check.
   * @returns {Promise<boolean>} A promise that resolves to true if the user already exists, false otherwise.
   */
  async checkIfUserExists(email: string, phone: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      pool.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ? OR phone_number = ?",
        [email, phone],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results.constructor === Array && results.length > 0);
          }
        }
      );
    });
  },

  /**
   * Registers a new user with the given email address, name, and phone number.
   * @param {string} email - The email address of the user to register.
   * @param {string} name - The name of the user to register.
   * @param {string} phone - The phone number of the user to register.
   * @returns {Promise<ResultSetHeader>} A promise that resolves to the result set header of the insert operation, or rejects with an error if the operation fails.
   */
  async registerUser(
    email: string,
    name: string,
    phone: string
  ): Promise<ResultSetHeader> {
    return new Promise<ResultSetHeader>((resolve, reject) => {
      pool.execute<ResultSetHeader>(
        "INSERT INTO users (email, user_name, phone_number) VALUES (?, ?, ?)",
        [email, name, phone],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  },
};
