import Ajv from "ajv";
import express, { NextFunction, Request, Response } from "express";
import { AppError } from "../../../utils/error";
import { jwtGenerateToken } from "../../../utils/jwt";
import { emailSignUpService } from "./emailSignUpService";

interface BodyProps {
  name: string;
  email: string;
  phone: string;
}

// add nodemailer usage
export const createUser: express.RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, phone }: BodyProps = req.body;

  // Input validation with ajv
  const ajv = new Ajv();
  const validate = ajv.compile({
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      phone: { type: "string" },
    },
    required: ["name", "email", "phone"],
    additionalProperties: false,
  });

  if (!validate(req.body)) {
    const errors = validate.errors;
    return next(
      new AppError("Invalid input data", 400, JSON.stringify(errors), true)
    );
  }

  try {
    const userExists = await emailSignUpService.checkIfUserExists(email, phone);

    if (userExists) {
      return next(
        new AppError("Duplicate user", 400, "User already exists", true)
      );
    }

    const result = await emailSignUpService.registerUser(email, name, phone);

    if (!result) {
      return next(
        new AppError(
          "User registration error",
          500,
          "An error occurred while registering the user",
          true
        )
      );
    }

    const id = result.insertId;

    const token = jwtGenerateToken(id);

    res.status(200).json({
      status: "success",
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.log(error);
  }
};
