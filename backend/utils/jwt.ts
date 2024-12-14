import jwt from "jsonwebtoken";

/**
 * Generates a JSON Web Token (JWT) for a given user id.
 * The token is signed using the secret key specified in the
 * `JWT_SECRET` environment variable and has an expiration
 * time defined by the `JWT_EXPIRES_IN` environment variable.
 *
 * @param {number} id - The user id to include in the token payload.
 * @returns {string} The generated JWT as a string.
 */
export const jwtGenerateToken = (id: number): string => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};
