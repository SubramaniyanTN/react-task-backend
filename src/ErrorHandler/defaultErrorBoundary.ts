import CustomError from "./customError";
import { Request, Response, NextFunction } from "express";

const defaultErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("ERROR >>>>>>>", err);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res.status(500).json({ msg: err.message });
};

export default defaultErrorHandler;
