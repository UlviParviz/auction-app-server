import { CustomError } from "../middlewares/ErrorMiddleware";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: CustomError[]; 

  constructor(message: string, statusCode: number, errors?: CustomError[]) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors; 

    Error.captureStackTrace(this, this.constructor);
  }
}