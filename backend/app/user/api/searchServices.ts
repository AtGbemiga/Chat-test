import { RowDataPacket } from "mysql2";
import pool from "../../../db/dal";

export const searchServices = {
  /**
   * Searches for users with the given searchWord in either their name or phone number.
   * @param searchWord The word to search for.
   * @returns A promise that resolves to an array of user objects, or rejects with an error if the operation fails.
   */
  async search(searchWord: string): Promise<RowDataPacket[]> {
    return new Promise<RowDataPacket[]>((resolve, reject) => {
      pool.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE user_name LIKE ? OR phone_number LIKE ?",
        [`%${searchWord}%`, `%${searchWord}%`],
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
