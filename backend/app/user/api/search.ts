import Ajv from "ajv";
import express, { NextFunction, Request, Response } from "express";
import { AppError } from "../../../utils/error";
import { searchServices } from "./searchServices";

interface BodyProps {
  searchWord: string;
}

/**
 * @description Handles the search request for users. The request body should have a field
 * called `searchWord` which is a string. The function will return a JSON response with an
 * array of users that match the search word, or an error if the input is invalid or if no
 * users are found.
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object to send the JSON response.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
export const searchUser: express.RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { searchWord }: BodyProps = req.body;

  /**
   * Input validation with ajv
   * The request body should have a field `searchWord` of type string.
   * If the input is invalid, the function will return an error with a 400 status code.
   */
  const ajv = new Ajv();
  const validate = ajv.compile({
    type: "object",
    properties: {
      searchWord: { type: "string" },
    },
    required: ["searchWord"],
    additionalProperties: false,
  });

  if (!validate(req.body)) {
    const errors = validate.errors;
    return next(
      new AppError("Invalid input data", 400, JSON.stringify(errors), true)
    );
  }

  /**
   * The function will return a JSON response with an array of users that match the search word.
   * If no users are found, the function will return an error with a 404 status code.
   */
  try {
    const searchRes = await searchServices.search(searchWord);

    if (searchRes.length === 0) {
      return next(new AppError("No resource", 404, "No user found", true));
    }

    res.status(200).json({
      status: "success",
      message: "User search successful",
      searchRes,
    });
  } catch (error) {
    console.log(error);
  }
};
