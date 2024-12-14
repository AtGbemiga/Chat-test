import { NextFunction, Request, Response } from "express";
import getUserEmailAndToken from "../../../utils/getUserEmailFromToken";
import { AppError } from "../../../utils/error";

/**
 * Middleware to retrieve the user email from the request token and send it in the response.
 * If the email is not found, it passes an error to the next middleware.
 *
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object to send the JSON response.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
export const getUserId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id: user_id } = getUserEmailAndToken(req);

  if (!user_id) {
    return next(
      new AppError("Resource not found", 404, "User not found", true)
    );
  } else {
    res.status(200).json({ status: "success", user_id });
  }
};
